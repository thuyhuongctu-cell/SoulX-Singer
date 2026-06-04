#!/usr/bin/env python3
"""Dựng nhiều bản phối (nhạc nền) khác phong cách từ melody gốc của
'Khúc ca Trường Kinh tế', giữ nguyên giai điệu (Sol trưởng).
Xuất MIDI -> render WAV bằng fluidsynth -> MP3 bằng ffmpeg.
"""
import os, math, subprocess
from music21 import converter
from mido import MidiFile, MidiTrack, Message, MetaMessage

TPB = 480  # ticks per beat
SF2 = "/usr/share/sounds/sf2/FluidR3_GM.sf2"

# ---- 1. Lấy melody sạch (bỏ offset lỗi của OMR, xếp nốt tuần tự) ----
s = converter.parse("score.musicxml")
raw = [(n.pitch.midi, float(n.quarterLength)) for n in s.flatten().notes if n.isNote]
melody = []          # (start_beat, dur_beat, midi)
t = 0.0
for midi, dur in raw:
    d = dur if dur and dur > 0 else 0.5
    melody.append((t, d, midi))
    t += d
TOTAL = t            # tổng số beat

# ---- 2. Tự hoà âm: mỗi 2 beat chọn 1 hợp âm diatonic Sol trưởng ----
TRIADS = {           # tên: pitch classes
    'G':  {7, 11, 2}, 'Am': {9, 0, 4}, 'Bm': {11, 2, 6},
    'C':  {0, 4, 7},  'D':  {2, 6, 9}, 'Em': {4, 7, 11},
}
ROOT_PC = {'G': 7, 'Am': 9, 'Bm': 11, 'C': 0, 'D': 2, 'Em': 4}
PREF = ['G', 'D', 'C', 'Em', 'Am', 'Bm']  # ưu tiên khi hoà

def best_chord(seg_notes):
    best, score = 'G', -1.0
    for name in PREF:
        pcs = TRIADS[name]
        sc = sum(dur for _, dur, m in seg_notes if (m % 12) in pcs)
        if sc > score:
            score, best = sc, name
    return best

WIN = 2.0  # độ dài 1 hợp âm (beat)
chords = []  # (start_beat, dur_beat, chord_name)
w = 0.0
while w < TOTAL:
    seg = [(st, du, m) for (st, du, m) in melody if st < w + WIN and st + du > w]
    chords.append((w, min(WIN, TOTAL - w), best_chord(seg) if seg else 'G'))
    w += WIN

def chord_pitches(name, base=48):
    """Voicing root+3rd+5th quanh octave 3 (MIDI ~48-60)."""
    root = ROOT_PC[name]
    pcs = sorted(TRIADS[name], key=lambda p: (p - root) % 12)
    return [base + ((p - (base % 12)) % 12) for p in pcs]

def bass_pitch(name, base=36):
    root = ROOT_PC[name]
    return base + ((root - (base % 12)) % 12)

# ---- 3. Helper ghi track từ sự kiện tuyệt đối ----
def beats_to_ticks(b):
    return int(round(b * TPB))

def make_track(events, program=None, channel=0):
    """events: list (start_beat, dur_beat, pitch, velocity)."""
    tr = MidiTrack()
    if program is not None:
        tr.append(Message('program_change', program=program, channel=channel, time=0))
    seq = []
    for st, du, p, v in events:
        seq.append((beats_to_ticks(st), 1, p, v))
        seq.append((beats_to_ticks(st + du), 0, p, v))
    seq.sort(key=lambda x: (x[0], x[1]))
    last = 0
    for tick, on, p, v in seq:
        dt = tick - last
        last = tick
        if on:
            tr.append(Message('note_on', note=p, velocity=v, channel=channel, time=dt))
        else:
            tr.append(Message('note_off', note=p, velocity=0, channel=channel, time=dt))
    return tr

# ---- 4. Định nghĩa các phong cách ----
# GM programs: 0 piano,24 nylon guitar,25 steel guitar,32 ac bass,33 finger bass,
# 40 violin,48 strings,56 trumpet,57 trombone,58 tuba,61 brass,73 flute,80 square,81 saw
STYLES = {
    'hanh_khuc': dict(name='Hành khúc', tempo=108, mel=56, ch=61, bass=58,
                      drums='march', mel_vel=110, ch_vel=62, arp=False),
    'ballad':    dict(name='Ballad',     tempo=76,  mel=73, ch=0,  bass=32,
                      drums='soft',  mel_vel=100, ch_vel=55, arp=True),
    'pop':       dict(name='Pop',        tempo=102, mel=80, ch=25, bass=33,
                      drums='pop',   mel_vel=108, ch_vel=60, arp=False),
    'orchestra': dict(name='Orchestra',  tempo=90,  mel=40, ch=48, bass=42,
                      drums='soft',  mel_vel=104, ch_vel=58, arp=False),
    'acoustic':  dict(name='Acoustic',   tempo=96,  mel=24, ch=24, bass=32,
                      drums='pop',   mel_vel=104, ch_vel=58, arp=True),
}

def drum_events(kind):
    ev = []  # (start,dur,pitch,vel) channel 9
    nbeat = int(math.ceil(TOTAL))
    for b in range(nbeat):
        if kind == 'march':
            ev.append((b, 0.2, 36, 100))                      # kick mỗi phách
            if b % 2 == 1: ev.append((b, 0.2, 38, 95))        # snare phách chẵn
        elif kind == 'pop':
            if b % 2 == 0: ev.append((b, 0.2, 36, 100))       # kick 1,3
            if b % 2 == 1: ev.append((b, 0.2, 38, 95))        # snare 2,4
            ev.append((b, 0.1, 42, 70)); ev.append((b+0.5, 0.1, 42, 60))  # hihat 8th
        elif kind == 'soft':
            if b % 4 == 0: ev.append((b, 0.3, 36, 80))
            ev.append((b, 0.1, 42, 45))
    return ev

def build(style_key, cfg):
    mf = MidiFile(ticks_per_beat=TPB)
    tempo_tr = MidiTrack(); mf.tracks.append(tempo_tr)
    tempo_tr.append(MetaMessage('set_tempo', tempo=int(60_000_000 / cfg['tempo']), time=0))

    # melody
    mel_ev = [(st, du * 0.95, m, cfg['mel_vel']) for st, du, m in melody]
    mf.tracks.append(make_track(mel_ev, program=cfg['mel'], channel=0))

    # chords (block hoặc arpeggio)
    ch_ev = []
    for st, du, name in chords:
        ps = chord_pitches(name)
        if cfg['arp']:
            step = du / max(1, len(ps))
            for i, p in enumerate(ps):
                ch_ev.append((st + i * step, du - i * step, p, cfg['ch_vel']))
        else:
            for p in ps:
                ch_ev.append((st, du * 0.98, p, cfg['ch_vel']))
    mf.tracks.append(make_track(ch_ev, program=cfg['ch'], channel=1))

    # bass
    bass_ev = []
    for st, du, name in chords:
        bp = bass_pitch(name)
        bass_ev.append((st, du * 0.9, bp, 80))
        if du >= 2:  # thêm nốt phách 2 cho chắc nhịp
            bass_ev.append((st + du / 2, du / 2 * 0.9, bp, 70))
    mf.tracks.append(make_track(bass_ev, program=cfg['bass'], channel=2))

    # drums (channel 9)
    mf.tracks.append(make_track(drum_events(cfg['drums']), program=None, channel=9))

    midi_path = f"demo_{style_key}.mid"
    mf.save(midi_path)
    return midi_path

os.makedirs("demos", exist_ok=True)
results = []
for key, cfg in STYLES.items():
    midi = build(key, cfg)
    wav = f"demos/{key}.wav"; mp3 = f"demos/KhucCaTruongKinhTe_{key}.mp3"
    subprocess.run(['fluidsynth', '-ni', '-g', '1.0', '-F', wav, '-r', '44100', SF2, midi],
                   check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    subprocess.run(['ffmpeg', '-y', '-i', wav, '-codec:a', 'libmp3lame', '-q:a', '4', mp3],
                   check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    os.remove(wav); os.remove(midi)
    sz = os.path.getsize(mp3) // 1024
    results.append((cfg['name'], mp3, sz))
    print(f"OK {cfg['name']:12} -> {mp3} ({sz} KB)")

print("\nDuration ~", round(TOTAL * 60 / 100, 1), "s mỗi bản (tuỳ tempo)")
