#!/usr/bin/env python3
"""Cách A - cả bài: giữ nguyên bài gốc, chèn tiết tấu khóa theo nhịp thật.
Nhiều phong cách. Xử lý bằng numpy cho nhanh (bài 3:50)."""
import os, subprocess
import numpy as np, librosa
from pydub import AudioSegment
from mido import MidiFile, MidiTrack, Message

SRC = "teacher_src/original.mp3"
SF2 = "/usr/share/sounds/sf2/FluidR3_GM.sf2"
SR = 44100
os.makedirs("full", exist_ok=True)

def seg_to_np(seg):
    seg = seg.set_frame_rate(SR).set_channels(2).set_sample_width(2)
    a = np.array(seg.get_array_of_samples(), dtype=np.float32).reshape(-1, 2) / 32768.0
    return a

# bài gốc -> numpy
song = seg_to_np(AudioSegment.from_file(SRC))
N = len(song)
print("Bài dài: %.1f s" % (N / SR))

# nhịp thật toàn bài
y, sr = librosa.load(SRC, sr=22050, mono=True)
_, beats = librosa.beat.beat_track(y=y, sr=sr, start_bpm=160)
bt = librosa.frames_to_time(beats, sr=sr)
print("Số nhịp toàn bài:", len(bt))

# one-shot percussion -> numpy
def oneshot(note, ms=260):
    mf = MidiFile(ticks_per_beat=480); tr = MidiTrack(); mf.tracks.append(tr)
    tr.append(Message('note_on', note=note, velocity=112, channel=9, time=0))
    tr.append(Message('note_off', note=note, velocity=0, channel=9, time=240))
    mid = f"full/_o.mid"; wav = f"full/_o.wav"; mf.save(mid)
    subprocess.run(['fluidsynth','-ni','-g','1.0','-F',wav,'-r',str(SR),SF2,mid],
                   check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    s = seg_to_np(AudioSegment.from_wav(wav)[:ms].fade_out(40)); os.remove(mid); os.remove(wav)
    return s
S = {n: oneshot(note) for n, note in dict(
    kick=36, snare=38, hat=42, ohat=46, clap=39,
    conga_hi=63, conga_lo=64, clave=75, shaker=70, side=37).items()}

def add(buf, name, t, gdb):
    g = 10 ** (gdb / 20.0); s = S[name]
    a = int(t * SR); b = min(a + len(s), N)
    if 0 <= a < N: buf[a:b] += s[:b - a] * g

# định nghĩa 5 phong cách tiết tấu
def build(style):
    buf = np.zeros((N, 2), dtype=np.float32)
    for i, t in enumerate(bt):
        mid = (t + bt[i + 1]) / 2 if i + 1 < len(bt) else None
        if style == 'pop':
            add(buf, 'kick' if i % 2 == 0 else 'snare', t, 0)
            add(buf, 'hat', t, -10)
            if mid: add(buf, 'hat', mid, -14)
        elif style == 'edm':
            add(buf, 'kick', t, 0)
            if i % 2 == 1: add(buf, 'clap', t, -1)
            if mid: add(buf, 'ohat', mid, -9)
        elif style == 'nhe':
            if i % 4 == 0: add(buf, 'kick', t, -2)
            if i % 4 == 2: add(buf, 'side', t, -4)
            add(buf, 'shaker', t, -8)
            if mid: add(buf, 'shaker', mid, -12)
        elif style == 'latin':
            add(buf, 'conga_hi', t, -6)
            if mid: add(buf, 'conga_lo', mid, -8)
            if i % 2 == 0: add(buf, 'clave', t, -5)
        elif style == 'march':
            add(buf, 'kick' if i % 2 == 0 else 'snare', t, -1)
            add(buf, 'snare', t, -9)  # nền trống lưng
    return buf

GAIN = {'pop': -4, 'edm': -3, 'nhe': -5, 'latin': -5, 'march': -3}
for style in ['pop', 'edm', 'nhe', 'latin', 'march']:
    perc = build(style)
    mix = song + perc * (10 ** (GAIN[style] / 20.0))
    peak = np.max(np.abs(mix))
    if peak > 0.97: mix = mix * (0.97 / peak)        # limiter chống vỡ
    out_i16 = (mix * 32767).astype(np.int16)
    seg = AudioSegment(out_i16.tobytes(), frame_rate=SR, sample_width=2, channels=2)
    out = f"full/KhucCa_{style}.mp3"
    seg.export(out, format='mp3', bitrate='256k')
    print("OK", out, "(%.0fs)" % (N / SR))
print("done")
