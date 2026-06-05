import React, { useMemo, useRef, useState } from 'react';
import {
  ArrowDownToLine,
  AudioLines,
  BadgeCheck,
  Bot,
  Clapperboard,
  FileMusic,
  FileText,
  Gauge,
  Guitar,
  Headphones,
  ImagePlus,
  Music2,
  Pause,
  Play,
  Radio,
  RefreshCcw,
  SlidersHorizontal,
  Sparkles,
  Upload,
  Wand2,
  Waves,
} from 'lucide-react';

type StyleKey = 'cinematic' | 'acoustic' | 'pop' | 'edm' | 'lofi' | 'traditional';

type ArrangementStyle = {
  id: StyleKey;
  name: string;
  vietnameseName: string;
  bpm: number;
  key: string;
  description: string;
  palette: string;
  instruments: string[];
  prompt: string;
};

type TimelineStep = {
  time: string;
  label: string;
  detail: string;
};

const LYRICS = `Bước trên con đường lòng hân hoan,
ngàn ước mơ xanh dưới mái trường.
Những gian truân nhọc nhằn hôm qua để lại,
cùng đắp xây tương lai bừng sáng.

Non sông đang đổi thay từng ngày,
có chúng tôi chung bàn tay,
cùng mang yên vui đến cho mọi người,
ấm áp trên mỗi nụ cười.

Cùng dựng xây đất nước phồn vinh muôn đời,
những doanh nghiệp vươn ra thế giới.
Cùng điểm tô quê hương đẹp tươi muôn màu,
và làm nên tổ quốc mạnh giàu.

Trường Kinh tế giữ sứ mệnh ươm nhân tài,
tri thức luyện rèn cho tương lai,
vì cộng đồng sẻ chia giá trị,
và chung tay vun đắp cuộc đời.

Hát lên bạn ơi, khúc ca Trường Kinh tế,
chữ tín ta dựng xây bằng "Chất lượng - Thân thiện".
Ôi tự hào Trường Kinh tế,
Đại học Cần Thơ.`;

const STYLES: ArrangementStyle[] = [
  {
    id: 'cinematic',
    name: 'Cinematic Anthem',
    vietnameseName: 'Hùng ca điện ảnh',
    bpm: 86,
    key: 'G major',
    description: 'Trang trọng, rộng mở, phù hợp video giới thiệu trường và lễ kỷ niệm.',
    palette: 'from-sky-500 via-indigo-500 to-violet-600',
    instruments: ['Piano sáng', 'String ensemble', 'Trống orchestral', 'Choir pad'],
    prompt: 'uplifting cinematic university anthem, G major, 86 BPM, warm piano, orchestral strings, subtle choir pad, proud and friendly mood, Vietnamese institutional song',
  },
  {
    id: 'acoustic',
    name: 'Acoustic Campus',
    vietnameseName: 'Mộc sân trường',
    bpm: 92,
    key: 'G major',
    description: 'Guitar, cajon và piano nhẹ để giữ lời hát rõ, thân thiện với sinh viên.',
    palette: 'from-amber-400 via-orange-500 to-rose-500',
    instruments: ['Acoustic guitar', 'Cajon', 'Soft piano', 'Bass ấm'],
    prompt: 'bright acoustic campus pop, G major, 92 BPM, acoustic guitar strumming, cajon, soft piano, warm bass, youthful proud Vietnamese school song',
  },
  {
    id: 'pop',
    name: 'Modern Pop',
    vietnameseName: 'Pop hiện đại',
    bpm: 104,
    key: 'A major',
    description: 'Beat hiện đại, hook dễ nhớ, vẫn giữ sắc thái vui tươi - tự hào.',
    palette: 'from-fuchsia-500 via-pink-500 to-red-500',
    instruments: ['Pop drums', 'Pluck synth', 'Piano layer', 'Electric bass'],
    prompt: 'modern inspirational Vietnamese pop, A major, 104 BPM, crisp pop drums, pluck synth, piano layers, memorable chorus, clean lead vocal space',
  },
  {
    id: 'edm',
    name: 'Future EDM',
    vietnameseName: 'EDM tương lai',
    bpm: 124,
    key: 'A major',
    description: 'Năng lượng trẻ, dùng cho clip truyền thông, reel hoặc video tuyển sinh.',
    palette: 'from-cyan-400 via-blue-500 to-purple-600',
    instruments: ['Sidechain pad', 'Future bass chords', 'Electronic kick', 'Riser FX'],
    prompt: 'future bass EDM arrangement for Vietnamese university anthem, A major, 124 BPM, bright supersaw chords, sidechain pads, energetic drop, positive academic brand video',
  },
  {
    id: 'lofi',
    name: 'Lo-fi Study',
    vietnameseName: 'Lo-fi học tập',
    bpm: 78,
    key: 'F major',
    description: 'Êm, chậm, phù hợp làm nhạc nền video recap hoặc phiên bản karaoke nhẹ.',
    palette: 'from-emerald-400 via-teal-500 to-cyan-500',
    instruments: ['Rhodes', 'Lo-fi drums', 'Sub bass', 'Vinyl texture'],
    prompt: 'lo-fi study version of a Vietnamese school song, F major, 78 BPM, mellow Rhodes, vinyl texture, soft drums, calm proud mood, clear room for vocals',
  },
  {
    id: 'traditional',
    name: 'Mekong Folk Pop',
    vietnameseName: 'Dân gian Mekong',
    bpm: 96,
    key: 'G major',
    description: 'Pha màu dân gian miền Tây để tránh cảm giác nhạc đỏ nhưng vẫn trang trọng.',
    palette: 'from-lime-500 via-green-500 to-emerald-700',
    instruments: ['Đàn tranh pad', 'Sáo trúc', 'Percussion nhẹ', 'Piano'],
    prompt: 'Mekong folk pop arrangement, Vietnamese university song, G major, 96 BPM, dan tranh textures, bamboo flute countermelody, modern soft drums, proud and warm',
  },
];

const DEFAULT_TIMELINE: TimelineStep[] = [
  { time: '0:00', label: 'Intro', detail: '4 ô nhịp mở đầu, logo trường và campus sunrise.' },
  { time: '0:08', label: 'Verse 1', detail: 'Giữ giai điệu chính rõ, nền nhẹ để người hát bám lời.' },
  { time: '0:36', label: 'Build', detail: 'Thêm bass, percussion và counter melody.' },
  { time: '1:02', label: 'Chorus', detail: 'Mở rộng hòa âm ở đoạn “Cùng dựng xây…” để tạo cao trào.' },
  { time: '1:34', label: 'Bridge', detail: 'Giảm nhạc cụ, nhấn thông điệp Chất lượng - Thân thiện.' },
  { time: '1:58', label: 'Finale', detail: 'Kết trang trọng với “Đại học Cần Thơ”.' },
];

const MELODY_NOTES = [392, 440, 494, 523, 494, 440, 392, 330, 392, 440, 494, 587, 523, 494, 440, 392];

const chordProgressions: Record<StyleKey, number[][]> = {
  cinematic: [[196, 247, 294], [262, 330, 392], [294, 370, 440], [247, 311, 370]],
  acoustic: [[196, 247, 294], [330, 392, 494], [262, 330, 392], [294, 370, 440]],
  pop: [[220, 277, 330], [349, 440, 523], [392, 494, 587], [330, 415, 494]],
  edm: [[110, 220, 277, 330], [175, 349, 440, 523], [196, 392, 494, 587], [165, 330, 415, 494]],
  lofi: [[174, 220, 262, 330], [147, 196, 247, 294], [196, 247, 294, 349], [131, 174, 220, 262]],
  traditional: [[196, 247, 294], [294, 392, 494], [330, 392, 523], [247, 330, 392]],
};

function createOscillator(
  context: AudioContext,
  destination: AudioNode,
  frequency: number,
  start: number,
  duration: number,
  type: OscillatorType,
  gainValue: number,
) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(gainValue, start + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(gain).connect(destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.05);
}

function makeDownload(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function SoulXSinger() {
  const [selectedStyle, setSelectedStyle] = useState<StyleKey>('cinematic');
  const [lyrics, setLyrics] = useState(LYRICS);
  const [uploadedFileName, setUploadedFileName] = useState('SHEET-KHUC CA TRUONG KINH TE.pdf');
  const [vocalMode, setVocalMode] = useState('Nam/Nữ song ca');
  const [videoTheme, setVideoTheme] = useState('Campus cinematic');
  const [generationProgress, setGenerationProgress] = useState(72);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const style = useMemo(
    () => STYLES.find((item) => item.id === selectedStyle) ?? STYLES[0],
    [selectedStyle],
  );

  const lyricStats = useMemo(() => {
    const lines = lyrics.split('\n').filter((line) => line.trim()).length;
    const words = lyrics.trim().split(/\s+/).filter(Boolean).length;
    return { lines, words, duration: Math.max(95, Math.round((words / 118) * 60)) };
  }, [lyrics]);

  const promptPack = useMemo(() => {
    return `SOULX-SINGER PROMPT PACK\n\nSong: Khúc ca Trường Kinh tế\nSource: ${uploadedFileName}\nStyle: ${style.vietnameseName} / ${style.name}\nTempo: ${style.bpm} BPM\nKey: ${style.key}\nVocal: ${vocalMode}\nVideo theme: ${videoTheme}\n\nMusic prompt:\n${style.prompt}. Preserve the provided Vietnamese lyrics and melody contour, avoid military/red-music feeling, produce a clean karaoke/instrumental bed plus full vocal guide.\n\nLyrics:\n${lyrics}\n\nVideo prompt:\nCreate a 16:9 music video with Can Tho University School of Economics spirit: bright campus, students collaborating, classroom, entrepreneurship, Mekong warmth, modern academic brand, uplifting finale, subtle typography synced to key lyrics.\n\nDeliverables:\n1. Instrumental WAV/MP3\n2. Vocal guide\n3. Karaoke minus-one\n4. 1080p lyric video storyboard\n5. Prompt history and style settings`;
  }, [lyrics, style, uploadedFileName, videoTheme, vocalMode]);

  const stopDemo = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    audioContextRef.current?.close();
    audioContextRef.current = null;
    setIsPlaying(false);
  };

  const playDemo = () => {
    stopDemo();
    const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const context = new AudioContextClass();
    const master = context.createGain();
    const filter = context.createBiquadFilter();
    filter.type = selectedStyle === 'lofi' ? 'lowpass' : 'highpass';
    filter.frequency.value = selectedStyle === 'lofi' ? 2200 : 80;
    master.gain.value = 0.18;
    filter.connect(master).connect(context.destination);
    audioContextRef.current = context;

    const beat = 60 / style.bpm;
    const startAt = context.currentTime + 0.12;
    const chords = chordProgressions[selectedStyle];
    const wave: OscillatorType = selectedStyle === 'edm' ? 'sawtooth' : selectedStyle === 'lofi' ? 'triangle' : 'sine';

    for (let bar = 0; bar < 8; bar += 1) {
      const chord = chords[bar % chords.length];
      chord.forEach((frequency, index) => {
        createOscillator(context, filter, frequency, startAt + bar * beat * 4, beat * 3.6, wave, index === 0 ? 0.08 : 0.045);
      });

      if (selectedStyle === 'edm' || selectedStyle === 'pop') {
        createOscillator(context, filter, 55, startAt + bar * beat * 4, 0.08, 'sine', 0.12);
        createOscillator(context, filter, 110, startAt + bar * beat * 4 + beat * 2, 0.08, 'sine', 0.1);
      }
    }

    MELODY_NOTES.forEach((frequency, index) => {
      createOscillator(context, filter, frequency, startAt + index * beat, beat * 0.82, selectedStyle === 'traditional' ? 'triangle' : 'sine', 0.07);
    });

    setIsPlaying(true);
    timeoutRef.current = window.setTimeout(stopDemo, beat * 16 * 1000 + 500);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      setGenerationProgress(38);
      window.setTimeout(() => setGenerationProgress(72), 500);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className={`absolute inset-0 bg-gradient-to-br ${style.palette} opacity-30 blur-3xl`} />
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-10 lg:grid-cols-[1.08fr_0.92fr] lg:px-8 lg:py-16">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-cyan-100 shadow-2xl shadow-cyan-950/40 backdrop-blur">
              <Sparkles className="h-4 w-4 text-cyan-200" /> SoulX-Singer AI Studio
            </div>
            <div>
              <h1 className="max-w-4xl text-4xl font-black tracking-tight sm:text-6xl lg:text-7xl">
                Tạo nhạc nền & video AI cho
                <span className="block bg-gradient-to-r from-cyan-200 via-white to-amber-200 bg-clip-text text-transparent">
                  “Khúc ca Trường Kinh tế”
                </span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
                Prototype chuyển sheet nhạc và lời có sẵn thành nhiều bản phối: giữ melody gốc,
                đổi màu hòa âm để bớt sắc thái “nhạc đỏ”, đồng thời tạo prompt video/lyric video đồng bộ.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <FileText className="mb-3 h-6 w-6 text-cyan-200" />
                <p className="text-2xl font-black">{lyricStats.lines}</p>
                <p className="text-sm text-slate-300">dòng lời đã nhận diện</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <Gauge className="mb-3 h-6 w-6 text-amber-200" />
                <p className="text-2xl font-black">{style.bpm} BPM</p>
                <p className="text-sm text-slate-300">tempo bản phối đang chọn</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <Clapperboard className="mb-3 h-6 w-6 text-pink-200" />
                <p className="text-2xl font-black">1080p</p>
                <p className="text-sm text-slate-300">storyboard lyric video</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/15 bg-slate-900/70 p-5 shadow-2xl shadow-black/40 backdrop-blur-xl">
            <div className="rounded-[1.5rem] border border-white/10 bg-black/30 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-cyan-200">Now arranging</p>
                  <h2 className="mt-2 text-2xl font-black">{style.vietnameseName}</h2>
                </div>
                <div className="rounded-2xl bg-white p-3 text-slate-950">
                  <Music2 className="h-7 w-7" />
                </div>
              </div>
              <div className="mt-6 h-28 overflow-hidden rounded-2xl border border-cyan-300/20 bg-slate-950 p-4">
                <div className="flex h-full items-end gap-1">
                  {Array.from({ length: 46 }).map((_, index) => (
                    <span
                      key={index}
                      className={`w-full rounded-full bg-gradient-to-t ${style.palette}`}
                      style={{ height: `${28 + ((index * 17) % 68)}%`, opacity: 0.45 + ((index % 5) * 0.1) }}
                    />
                  ))}
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3 text-sm text-slate-300">
                <div className="rounded-2xl bg-white/5 p-4"><span className="block text-slate-500">Key</span>{style.key}</div>
                <div className="rounded-2xl bg-white/5 p-4"><span className="block text-slate-500">Vocal</span>{vocalMode}</div>
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={isPlaying ? stopDemo : playDemo}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white px-5 py-4 font-bold text-slate-950 transition hover:scale-[1.01]"
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  {isPlaying ? 'Dừng demo' : 'Nghe demo 8 ô nhịp'}
                </button>
                <button
                  onClick={() => makeDownload('soulx-singer-prompt-pack.txt', promptPack)}
                  className="rounded-2xl border border-white/15 px-5 py-4 text-slate-200 transition hover:bg-white/10"
                  aria-label="Download prompt pack"
                >
                  <ArrowDownToLine className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/20">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="flex items-center gap-2 text-2xl font-black"><Upload className="h-6 w-6 text-cyan-300" /> Nguồn bài hát</h2>
                <p className="mt-2 text-sm text-slate-400">Nhận sheet PDF/ảnh, lời sẵn, sau đó giữ giai điệu để đổi nhạc nền.</p>
              </div>
              <BadgeCheck className="h-6 w-6 text-emerald-300" />
            </div>
            <label className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-cyan-300/30 bg-cyan-300/5 p-6 text-center transition hover:bg-cyan-300/10">
              <FileMusic className="mb-3 h-10 w-10 text-cyan-200" />
              <span className="font-bold">{uploadedFileName}</span>
              <span className="mt-1 text-xs text-slate-400">PDF, PNG, JPG hoặc MusicXML</span>
              <input type="file" className="hidden" accept=".pdf,.png,.jpg,.jpeg,.musicxml,.xml" onChange={handleFileUpload} />
            </label>
            <textarea
              value={lyrics}
              onChange={(event) => setLyrics(event.target.value)}
              className="mt-5 h-72 w-full resize-none rounded-3xl border border-white/10 bg-slate-950/80 p-5 text-sm leading-7 text-slate-100 outline-none ring-cyan-300/40 transition focus:ring-4"
              aria-label="Lyrics"
            />
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <h2 className="flex items-center gap-2 text-2xl font-black"><SlidersHorizontal className="h-6 w-6 text-amber-300" /> Điều khiển sáng tạo</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm font-semibold text-slate-300">
                Giọng hát
                <select value={vocalMode} onChange={(event) => setVocalMode(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-950 p-3 text-white outline-none">
                  <option>Nam/Nữ song ca</option>
                  <option>Nữ lead + bè choir</option>
                  <option>Nam lead trầm ấm</option>
                  <option>Karaoke không lời</option>
                </select>
              </label>
              <label className="space-y-2 text-sm font-semibold text-slate-300">
                Chủ đề video
                <select value={videoTheme} onChange={(event) => setVideoTheme(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-950 p-3 text-white outline-none">
                  <option>Campus cinematic</option>
                  <option>Lyric video hiện đại</option>
                  <option>Doanh nghiệp vươn ra thế giới</option>
                  <option>Mekong warm documentary</option>
                </select>
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <h2 className="flex items-center gap-2 text-2xl font-black"><Wand2 className="h-6 w-6 text-pink-300" /> Chọn màu nhạc nền</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {STYLES.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedStyle(item.id)}
                  className={`rounded-3xl border p-5 text-left transition hover:-translate-y-1 hover:bg-white/10 ${selectedStyle === item.id ? 'border-cyan-300 bg-cyan-300/10 shadow-2xl shadow-cyan-950/30' : 'border-white/10 bg-white/[0.03]'}`}
                >
                  <div className={`mb-4 inline-flex rounded-2xl bg-gradient-to-br ${item.palette} p-3`}>
                    {item.id === 'acoustic' ? <Guitar className="h-5 w-5" /> : item.id === 'edm' ? <Radio className="h-5 w-5" /> : <AudioLines className="h-5 w-5" />}
                  </div>
                  <h3 className="text-lg font-black">{item.vietnameseName}</h3>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">{item.name} · {item.bpm} BPM</p>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{item.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
              <h2 className="flex items-center gap-2 text-xl font-black"><Bot className="h-5 w-5 text-cyan-300" /> AI pipeline</h2>
              <div className="mt-5 space-y-4">
                {['OCR sheet & lời', 'Melody lock', 'Style transfer', 'Mix master', 'Video prompt'].map((item, index) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-300/10 text-sm font-black text-cyan-200">{index + 1}</div>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm"><span>{item}</span><span>{index < 3 ? 'done' : 'ready'}</span></div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-cyan-300" style={{ width: `${Math.min(100, generationProgress + index * 4)}%` }} /></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
              <h2 className="flex items-center gap-2 text-xl font-black"><Headphones className="h-5 w-5 text-amber-300" /> Nhạc cụ đề xuất</h2>
              <div className="mt-5 flex flex-wrap gap-2">
                {style.instruments.map((instrument) => (
                  <span key={instrument} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200">{instrument}</span>
                ))}
              </div>
              <button onClick={() => setSelectedStyle(STYLES[(STYLES.findIndex((item) => item.id === selectedStyle) + 1) % STYLES.length].id)} className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-amber-300 px-4 py-3 font-bold text-slate-950">
                <RefreshCcw className="h-4 w-4" /> Đổi nhanh bản phối
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 pb-12 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
          <h2 className="flex items-center gap-2 text-2xl font-black"><Clapperboard className="h-6 w-6 text-violet-300" /> Storyboard video</h2>
          <div className="mt-5 space-y-3">
            {DEFAULT_TIMELINE.map((step) => (
              <div key={step.time} className="rounded-3xl border border-white/10 bg-slate-950/70 p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-black">{step.label}</h3>
                  <span className="rounded-full bg-violet-300/10 px-3 py-1 text-xs font-bold text-violet-200">{step.time}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-400">{step.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
          <h2 className="flex items-center gap-2 text-2xl font-black"><ImagePlus className="h-6 w-6 text-emerald-300" /> Prompt xuất sang AI</h2>
          <pre className="mt-5 max-h-[32rem] overflow-auto whitespace-pre-wrap rounded-3xl border border-white/10 bg-slate-950/80 p-5 text-xs leading-6 text-slate-300">{promptPack}</pre>
          <div className="mt-5 flex flex-wrap gap-3">
            <button onClick={() => makeDownload('soulx-singer-prompt-pack.txt', promptPack)} className="inline-flex items-center gap-2 rounded-2xl bg-cyan-300 px-5 py-3 font-bold text-slate-950">
              <ArrowDownToLine className="h-4 w-4" /> Tải prompt pack
            </button>
            <button onClick={() => navigator.clipboard?.writeText(promptPack)} className="inline-flex items-center gap-2 rounded-2xl border border-white/15 px-5 py-3 font-bold text-white hover:bg-white/10">
              <Waves className="h-4 w-4" /> Copy cho Suno/Udio/Veo
            </button>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-6 text-center text-sm text-slate-500">
        SoulX-Singer prototype · Melody-preserving arrangement assistant for provided Vietnamese lyrics and sheet music.
      </footer>
    </main>
  );
}
