# Advanced Audio Mixing Techniques

## Key Detection và Harmonic Mixing

Khi trộn nhiều tracks, việc đảm bảo chúng cùng key (hoặc các key tương thích) giúp kết quả hài hòa hơn.

### Phát hiện Key
```python
import librosa
import numpy as np

def detect_key(audio_path):
    y, sr = librosa.load(audio_path)
    
    # Chromagram (12 nốt)
    chroma = librosa.feature.chroma_cqt(y=y, sr=sr)
    
    # Tính key chính (nốt có năng lượng cao nhất)
    key_index = np.argmax(np.sum(chroma, axis=1))
    keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
    
    return keys[key_index]

vocal_key = detect_key('vocals.wav')
background_key = detect_key('background.wav')

print(f"Vocal key: {vocal_key}, Background key: {background_key}")
```

### Pitch Shifting
Nếu keys không khớp, chuyển pitch của background:
```python
import librosa
import soundfile as sf

def shift_to_key(audio_path, semitones):
    y, sr = librosa.load(audio_path)
    
    # Shift pitch (không đổi tempo)
    y_shifted = librosa.effects.pitch_shift(y, sr=sr, n_steps=semitones)
    
    sf.write('shifted_audio.wav', y_shifted, sr)
    return y_shifted

# Ví dụ: shift từ D lên E (2 semitones)
shifted = shift_to_key('background.wav', 2)
```

**Camelot Wheel:** Các key tương thích trong mixing:
- Cùng key
- Key cách nhau 1 vị trí trên Camelot Wheel (ví dụ: C major và G major)
- Relative minor/major (ví dụ: C major và A minor)

## Spectral Processing và EQ

Để các layers không va chạm về tần số:

### EQ với librosa
```python
import librosa
import numpy as np
import soundfile as sf
from scipy import signal

def apply_eq(audio_path, low_gain=1.0, mid_gain=1.0, high_gain=1.0):
    """
    low: < 250 Hz, mid: 250-4000 Hz, high: > 4000 Hz
    gain: 1.0 = không đổi, > 1.0 = tăng, < 1.0 = giảm
    """
    y, sr = librosa.load(audio_path)
    
    # STFT
    D = librosa.stft(y)
    
    # Tần số của mỗi bin
    freqs = librosa.fft_frequencies(sr=sr)
    
    # Tạo EQ curve
    eq_curve = np.ones_like(freqs)
    eq_curve[freqs < 250] *= low_gain
    eq_curve[(freqs >= 250) & (freqs < 4000)] *= mid_gain
    eq_curve[freqs >= 4000] *= high_gain
    
    # Apply EQ
    D_eq = D * eq_curve[:, np.newaxis]
    
    # ISTFT
    y_eq = librosa.istft(D_eq)
    
    return y_eq, sr

# Ví dụ: Giảm bass của background để vocal rõ hơn
bg_audio, sr = apply_eq('background.wav', low_gain=0.5, mid_gain=1.0, high_gain=1.2)
sf.write('background_eq.wav', bg_audio, sr)
```

### Frequency Masking Strategy
Để vocal nổi bật:
- **Vocal:** Giữ nguyên mid-range (1-4 kHz)
- **Bass/Drums:** Giảm mid-range, giữ low-end (< 250 Hz)
- **Synth/Pads:** Giảm mid-range, tăng high-end (> 4 kHz)

```python
# EQ cho từng layer
vocals_eq, _ = apply_eq('vocals.wav', 1.0, 1.2, 1.0)  # Tăng mid
bass_eq, _ = apply_eq('bass.wav', 1.5, 0.6, 0.5)     # Tăng low, giảm mid/high
synth_eq, _ = apply_eq('synth.wav', 0.5, 0.7, 1.3)   # Giảm low/mid, tăng high
```

## Dynamic Range Compression

Compression giúp cân bằng âm lượng và tạo sự cohesive:

```python
from pydub import AudioSegment
from pydub.effects import compress_dynamic_range

def compress_audio(audio_segment, threshold=-20, ratio=4.0, attack=5, release=50):
    """
    threshold: dB - âm lượng bắt đầu compress
    ratio: tỷ lệ nén (4.0 = 4:1)
    attack/release: ms
    """
    return compress_dynamic_range(
        audio_segment,
        threshold=threshold,
        ratio=ratio,
        attack=attack,
        release=release
    )

# Compress vocal để đều hơn
vocals = AudioSegment.from_file('vocals.wav')
vocals_compressed = compress_audio(vocals, threshold=-18, ratio=3.0)

# Compress toàn bộ mix (mastering)
final_mix = AudioSegment.from_file('mixed.wav')
mastered = compress_audio(final_mix, threshold=-14, ratio=2.0, attack=10, release=100)
```

**Lý do compress:** Vocal thường có dynamics lớn (từ thì thầm đến hét). Compression giảm khoảng cách giữa phần nhỏ nhất và lớn nhất, giúp vocal rõ ràng hơn trong mix.

## Stem Separation Models

### So sánh các models

**Spleeter** (nhanh nhất):
- 2stems: vocals + accompaniment
- 4stems: vocals + drums + bass + other
- 5stems: vocals + drums + bass + piano + other
```bash
spleeter separate -p spleeter:4stems -o output/ input.mp3
```

**Demucs** (chất lượng cao):
- Tách tốt hơn Spleeter, đặc biệt với vocals
- Hỗ trợ GPU (nhanh hơn nhiều)
```bash
demucs --two-stems=vocals input.mp3  # Chỉ tách vocals
demucs input.mp3  # Tách 4 stems: drums, bass, other, vocals
```

**audio-separator** (wrapper hiện đại, nhiều models):
```python
from audio_separator.separator import Separator

separator = Separator(
    model_file_dir='/tmp/audio-models/',
    output_format='WAV'
)

# Liệt kê models
separator.list_models()

# Tách với model cụ thể
separator.load_model('model_bs_roformer_ep_317_sdr_12.9755.yaml')
output_files = separator.separate('input.mp3')
```

### Chọn model phù hợp
- **Demo nhanh:** Spleeter 2stems
- **Chất lượng cao:** Demucs với GPU
- **Tách chi tiết (drums riêng, bass riêng):** Spleeter 4stems hoặc Demucs
- **Production:** audio-separator với roformer models (SDR cao nhất)

## Sidechaining (Ducking)

Tự động giảm volume của background khi vocal xuất hiện:

```python
import numpy as np
from pydub import AudioSegment
import librosa

def sidechain_compress(background, vocal, threshold_db=-30, ratio=0.3):
    """
    Giảm background khi vocal vượt threshold
    ratio: 0.0-1.0, càng nhỏ càng giảm mạnh
    """
    # Convert sang numpy
    bg_array = np.array(background.get_array_of_samples()).astype(np.float32)
    vocal_array = np.array(vocal.get_array_of_samples()).astype(np.float32)
    
    # Tính RMS envelope của vocal
    vocal_rms = librosa.feature.rms(y=vocal_array)[0]
    
    # Upsample envelope về sample rate gốc
    vocal_envelope = np.repeat(vocal_rms, len(vocal_array) // len(vocal_rms))
    vocal_envelope = vocal_envelope[:len(bg_array)]
    
    # Tạo gain reduction curve
    threshold_linear = 10 ** (threshold_db / 20)
    gain_reduction = np.where(
        vocal_envelope > threshold_linear,
        ratio,
        1.0
    )
    
    # Apply gain reduction
    bg_ducked = bg_array * gain_reduction
    
    # Convert về AudioSegment
    bg_ducked = bg_ducked.astype(np.int16)
    result = background._spawn(bg_ducked.tobytes())
    
    return result

# Sử dụng
vocals = AudioSegment.from_file('vocals.wav')
background = AudioSegment.from_file('background.wav')

# Background tự động giảm khi vocal hát
background_ducked = sidechain_compress(background, vocals, threshold_db=-25, ratio=0.4)

# Mix
result = vocals.overlay(background_ducked)
```

## Parallel Processing cho file lớn

Xử lý nhiều backgrounds cùng lúc:

```python
from multiprocessing import Pool
import librosa
import soundfile as sf

def process_background(args):
    bg_path, target_tempo, target_length = args
    
    # Load và xử lý
    y, sr = librosa.load(bg_path)
    
    # Detect tempo và time stretch
    bg_tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
    stretch_rate = bg_tempo / target_tempo
    y_stretched = librosa.effects.time_stretch(y, rate=stretch_rate)
    
    # Crop/loop về đúng độ dài
    if len(y_stretched) < target_length:
        repeats = target_length // len(y_stretched) + 1
        y_stretched = np.tile(y_stretched, repeats)
    y_stretched = y_stretched[:target_length]
    
    return y_stretched, sr

def parallel_mix(vocal_path, background_paths, output_path):
    # Load vocal
    vocal_y, vocal_sr = librosa.load(vocal_path)
    vocal_tempo, _ = librosa.beat.beat_track(y=vocal_y, sr=vocal_sr)
    
    # Chuẩn bị args cho parallel processing
    args_list = [(bg_path, vocal_tempo, len(vocal_y)) 
                 for bg_path in background_paths]
    
    # Process parallel
    with Pool() as pool:
        results = pool.map(process_background, args_list)
    
    # Mix tất cả
    from pydub import AudioSegment
    
    # Save vocal tạm
    sf.write('temp_vocal.wav', vocal_y, vocal_sr)
    mixed = AudioSegment.from_wav('temp_vocal.wav') + 2
    
    for i, (bg_audio, sr) in enumerate(results):
        sf.write(f'temp_bg_{i}.wav', bg_audio, sr)
        bg_segment = AudioSegment.from_wav(f'temp_bg_{i}.wav')
        bg_segment = bg_segment - (4 + i * 2)
        mixed = mixed.overlay(bg_segment)
    
    mixed.export(output_path, format='mp3', bitrate='320k')

# Sử dụng
parallel_mix(
    'vocals.mp3',
    ['drums.wav', 'bass.wav', 'synth.wav', 'pad.wav'],
    'final_mix.mp3'
)
```

## Automation và Batch Processing

```python
import os
from pathlib import Path

def batch_mix_folder(vocal_folder, backgrounds_folder, output_folder):
    """
    Mix tất cả vocals trong folder với tất cả backgrounds
    """
    vocal_files = list(Path(vocal_folder).glob('*.mp3'))
    background_files = list(Path(backgrounds_folder).glob('*.wav'))
    
    os.makedirs(output_folder, exist_ok=True)
    
    for vocal_file in vocal_files:
        output_name = f"{vocal_file.stem}_mixed.mp3"
        output_path = Path(output_folder) / output_name
        
        try:
            parallel_mix(
                str(vocal_file),
                [str(f) for f in background_files],
                str(output_path)
            )
            print(f"✓ Processed: {vocal_file.name}")
        except Exception as e:
            print(f"✗ Failed {vocal_file.name}: {e}")

# Sử dụng
batch_mix_folder(
    vocal_folder='vocals/',
    backgrounds_folder='backgrounds/',
    output_folder='output_mixes/'
)
```