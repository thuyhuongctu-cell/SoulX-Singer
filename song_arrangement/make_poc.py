#!/usr/bin/env python3
"""POC: tách giọng (đã có) + chèn nền mới tiết tấu khác, giữ nguyên vocal.
Theo skill chen-nhac-nen-da-dang: tạo backing đúng tempo/key -> mix dưới vocal."""
import os, math, subprocess
from mido import MidiFile, MidiTrack, Message, MetaMessage
from pydub import AudioSegment
from pydub.effects import normalize

TPB = 480
SF2 = "/usr/share/sounds/sf2/FluidR3_GM.sf2"
TEMPO = 99            # BPM phát hiện từ clip
DUR_S = 30.0
VOCAL = "sep30/clip30_(Vocals)_model_bs_roformer_ep_317_sdr_12.mp3"

# Vòng hợp âm an toàn cho Sol trưởng: G - Em - C - D (I - vi - IV - V)
PROG = [
    ('G',  [55, 59, 62], 43),
    ('Em', [52, 55, 59], 40),
    ('C',  [48, 52, 55], 36),
    ('D',  [50, 54, 57], 38),
]
CHORD_BEATS = 2  # mỗi hợp âm 2 phách

def make_track(events, program=None, channel=0):
    tr = MidiTrack()
    if program is not None:
        tr.append(Message('program_change', program=program, channel=channel, time=0))
    seq = []
    for st, du, p, v in events:
        seq.append((int(st * TPB), 1, p, v)); seq.append((int((st + du) * TPB), 0, p, v))
    seq.sort(key=lambda x: (x[0], x[1]))
    last = 0
    for tick, on, p, v in seq:
        dt = tick - last; last = tick
        tr.append(Message('note_on' if on else 'note_off', note=p,
                          velocity=v if on else 0, channel=channel, time=dt))
    return tr

def drums(kind, total_beats):
    ev = []
    for b in range(int(math.ceil(total_beats))):
        if kind == 'pop':
            if b % 2 == 0: ev.append((b, .2, 36, 100))
            if b % 2 == 1: ev.append((b, .2, 38, 95))
            ev.append((b, .1, 42, 65)); ev.append((b + .5, .1, 42, 55))
        elif kind == 'ballad':
            if b % 4 == 0: ev.append((b, .3, 36, 80))
            if b % 4 == 2: ev.append((b, .25, 38, 70))
            ev.append((b, .1, 42, 40))
    return ev

def build_backing(style, midi_path):
    total_beats = DUR_S * TEMPO / 60.0
    mf = MidiFile(ticks_per_beat=TPB)
    tt = MidiTrack(); mf.tracks.append(tt)
    tt.append(MetaMessage('set_tempo', tempo=int(60_000_000 / TEMPO), time=0))
    ch_ev, bass_ev = [], []
    b = 0.0; i = 0
    while b < total_beats:
        name, triad, broot = PROG[i % len(PROG)]
        for p in triad:
            ch_ev.append((b, CHORD_BEATS * .98, p, style['ch_vel']))
        bass_ev.append((b, CHORD_BEATS * .9, broot, 85))
        if CHORD_BEATS >= 2:
            bass_ev.append((b + CHORD_BEATS/2, CHORD_BEATS/2*.9, broot, 70))
        b += CHORD_BEATS; i += 1
    mf.tracks.append(make_track(ch_ev, program=style['ch'], channel=1))
    mf.tracks.append(make_track(bass_ev, program=style['bass'], channel=2))
    mf.tracks.append(make_track(drums(style['drums'], total_beats), program=None, channel=9))
    mf.save(midi_path)

STYLES = {
    'pop':    dict(ch=4,  bass=33, ch_vel=62, drums='pop'),     # E.piano + finger bass
    'ballad': dict(ch=48, bass=32, ch_vel=58, drums='ballad'),  # strings + ac.bass
}

vocal = AudioSegment.from_file(VOCAL).set_frame_rate(44100)
print("Vocal dài:", round(len(vocal)/1000, 1), "s")
os.makedirs("poc", exist_ok=True)
for name, st in STYLES.items():
    midi = f"poc/backing_{name}.mid"; bwav = f"poc/backing_{name}.wav"
    build_backing(st, midi)
    subprocess.run(['fluidsynth', '-ni', '-g', '0.9', '-F', bwav, '-r', '44100', SF2, midi],
                   check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    backing = AudioSegment.from_wav(bwav).set_frame_rate(44100)
    backing = backing[:len(vocal)]
    # Mix: vocal nổi, nền nhỏ hơn ~7 dB (theo skill)
    mixed = vocal.overlay(backing - 7)
    mixed = normalize(mixed)
    out = f"poc/POC_{name}.mp3"
    mixed.export(out, format='mp3', bitrate='192k')
    os.remove(midi); os.remove(bwav)
    print("OK ->", out)
print("Done")
