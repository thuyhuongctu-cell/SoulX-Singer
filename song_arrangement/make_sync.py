#!/usr/bin/env python3
"""Chèn tiết tấu KHÓA theo nhịp thật của bài (beat-aligned), không tách giọng.
Đặt tiếng gõ đúng vào beat_times do librosa phát hiện -> khớp lời/nhạc."""
import subprocess, os
import numpy as np, librosa
from pydub import AudioSegment
from pydub.effects import normalize

SRC = "teacher_src/clip30.mp3"
SF2 = "/usr/share/sounds/sf2/FluidR3_GM.sf2"
os.makedirs("poc", exist_ok=True)

# 1) Nhịp thật của bài
y, sr = librosa.load(SRC, sr=22050, mono=True)
_, beats = librosa.beat.beat_track(y=y, sr=sr, start_bpm=160)
bt = librosa.frames_to_time(beats, sr=sr)          # giây
print("Số nhịp:", len(bt), "| cách nhau ~%.3fs" % np.median(np.diff(bt)))

# 2) Render tiếng gõ one-shot (GM percussion, channel 9)
from mido import MidiFile, MidiTrack, Message
def oneshot(note, name, ms=240):
    mf = MidiFile(ticks_per_beat=480); tr = MidiTrack(); mf.tracks.append(tr)
    tr.append(Message('note_on', note=note, velocity=110, channel=9, time=0))
    tr.append(Message('note_off', note=note, velocity=0, channel=9, time=240))
    mid = f"poc/_{name}.mid"; wav = f"poc/_{name}.wav"; mf.save(mid)
    subprocess.run(['fluidsynth','-ni','-g','1.0','-F',wav,'-r','44100',SF2,mid],
                   check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    seg = AudioSegment.from_wav(wav)[:ms].fade_out(40)
    os.remove(mid); os.remove(wav)
    return seg
kick=oneshot(36,'kick'); snare=oneshot(38,'snare'); hat=oneshot(42,'hat'); clap=oneshot(39,'clap')

song = AudioSegment.from_file(SRC).set_frame_rate(44100)
dur = len(song)

def place(track, sample, t_sec, gain):
    pos = int(t_sec*1000)
    if 0 <= pos < dur:
        return track.overlay(sample + gain, position=pos)
    return track

GROOVES = {
    'pop':   lambda i: [('kick',0)] if i%2==0 else [('snare',0)],   # + hat đều
    'manh':  lambda i: [('kick',2),('clap',-1)] if i%2==1 else [('kick',0)],
    'nhe':   lambda i: [('snare',-3)] if i%2==1 else [('kick',-2)],
}
SAMP={'kick':kick,'snare':snare,'hat':hat,'clap':clap}

for gname, fn in GROOVES.items():
    perc = AudioSegment.silent(duration=dur, frame_rate=44100)
    for i, t in enumerate(bt):
        for nm, g in fn(i):
            perc = place(perc, SAMP[nm], t, g)
        # hi-hat mỗi nhịp + nửa nhịp (tạo cảm giác nhanh, khớp lời)
        perc = place(perc, hat, t, -10)
        if i+1 < len(bt):
            perc = place(perc, hat, (t+bt[i+1])/2, -14)
    mixed = song.overlay(perc - 4)
    mixed = normalize(mixed)
    out=f"poc/SYNC_{gname}.mp3"
    mixed.export(out, format='mp3', bitrate='256k')
    print("OK", out)
print("done")
