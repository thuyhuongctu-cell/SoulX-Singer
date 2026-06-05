#!/usr/bin/env python3
"""POC v2: làm sạch giọng (giảm rè) + trộn nền có headroom + limiter."""
import os, math, subprocess
from mido import MidiFile, MidiTrack, Message, MetaMessage

TPB=480; SF2="/usr/share/sounds/sf2/FluidR3_GM.sf2"; TEMPO=99; DUR_S=30.0
VOC="sep30/clip30_(Vocals)_model_bs_roformer_ep_317_sdr_12.mp3"
PROG=[('G',[55,59,62],43),('Em',[52,55,59],40),('C',[48,52,55],36),('D',[50,54,57],38)]
CB=2

def mk(events, program=None, channel=0):
    tr=MidiTrack()
    if program is not None: tr.append(Message('program_change',program=program,channel=channel,time=0))
    seq=[]
    for st,du,p,v in events:
        seq.append((int(st*TPB),1,p,v)); seq.append((int((st+du)*TPB),0,p,v))
    seq.sort(key=lambda x:(x[0],x[1])); last=0
    for tick,on,p,v in seq:
        dt=tick-last; last=tick
        tr.append(Message('note_on' if on else 'note_off',note=p,velocity=v if on else 0,channel=channel,time=dt))
    return tr

def drums(kind,tb):
    ev=[]
    for b in range(int(math.ceil(tb))):
        if kind=='pop':
            if b%2==0: ev.append((b,.2,36,100))
            if b%2==1: ev.append((b,.2,38,95))
            ev.append((b,.1,42,65)); ev.append((b+.5,.1,42,55))
        elif kind=='ballad':
            if b%4==0: ev.append((b,.3,36,80))
            if b%4==2: ev.append((b,.25,38,70))
            ev.append((b,.1,42,40))
    return ev

def backing(style,midi):
    tb=DUR_S*TEMPO/60.0
    mf=MidiFile(ticks_per_beat=TPB); tt=MidiTrack(); mf.tracks.append(tt)
    tt.append(MetaMessage('set_tempo',tempo=int(60_000_000/TEMPO),time=0))
    ch,ba=[],[]; b=0.0; i=0
    while b<tb:
        nm,tri,br=PROG[i%4]
        for p in tri: ch.append((b,CB*.98,p,style['cv']))
        ba.append((b,CB*.9,br,85)); ba.append((b+CB/2,CB/2*.9,br,70)); b+=CB; i+=1
    mf.tracks.append(mk(ch,style['ch'],1)); mf.tracks.append(mk(ba,style['bass'],2))
    mf.tracks.append(mk(drums(style['dr'],tb),None,9)); mf.save(midi)

STYLES={'pop':dict(ch=4,bass=33,cv=58,dr='pop'),
        'ballad':dict(ch=48,bass=32,cv=54,dr='ballad')}

os.makedirs("poc",exist_ok=True)
# 1) Làm sạch giọng: bỏ ầm trầm + khử tạp (afftdn) + dịu dải cao gây rè
VCLEAN="poc/vocal_clean.wav"
subprocess.run(['ffmpeg','-y','-i',VOC,'-af',
    "highpass=f=75,afftdn=nf=-26,equalizer=f=7500:width_type=o:width=2:g=-5,"
    "lowpass=f=14000,dynaudnorm=f=200:g=5",
    '-ar','44100',VCLEAN],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)

for name,st in STYLES.items():
    midi=f"poc/b_{name}.mid"; bwav=f"poc/b_{name}.wav"
    backing(st,midi)
    subprocess.run(['fluidsynth','-ni','-g','0.85','-F',bwav,'-r','44100',SF2,midi],
                   check=True,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
    out=f"poc/POC2_{name}.mp3"
    # 2) Trộn: giọng nguyên, nền -9dB; amix giữ mức (normalize=0); limiter chống vỡ; loudnorm
    subprocess.run(['ffmpeg','-y','-i',VCLEAN,'-i',bwav,'-filter_complex',
        "[1:a]volume=-9dB[b];[0:a][b]amix=inputs=2:duration=first:normalize=0[m];"
        "[m]alimiter=limit=0.95,loudnorm=I=-15:TP=-1.5",
        '-ar','44100','-b:a','256k',out],
        check=True,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
    os.remove(midi); os.remove(bwav)
    mx=subprocess.run(['ffmpeg','-i',out,'-af','volumedetect','-f','null','-'],
                      capture_output=True,text=True).stderr
    peak=[l for l in mx.splitlines() if 'max_volume' in l]
    print("OK",out,"|",peak[0].split(']')[-1].strip() if peak else "")
# giọng sạch riêng để nghe
subprocess.run(['ffmpeg','-y','-i',VCLEAN,'-b:a','256k','poc/ACAPELLA2_clean.mp3'],
               check=True,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
print("done")
