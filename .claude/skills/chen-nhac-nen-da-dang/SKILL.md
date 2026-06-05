---
name: chen-nhac-nen-da-dang
description: >
  Chèn và trộn nhiều lớp nhạc nền với các tiết tấu khác nhau vào file MP3 có sẵn lời hát. Sử dụng khi bạn cần thêm nhạc nền, tạo remix, mashup, layering âm thanh, trộn beat với vocal tracks, điều chỉnh tempo, beat matching, tách stems từ bài hát có lời, overlay nhiều tracks, tạo background music cho vocal, hoặc bất kỳ tác vụ nào liên quan đến audio mixing, music production, stem separation, hoặc layering audio trong Python code với pydub, spleeter, demucs, librosa, aubio.
---

# Chèn Nhạc Nền Đa Dạng

## Tổng quan

Skill này giúp bạn xây dựng các công cụ Python để trộn và chèn nhiều lớp nhạc nền với các tiết tấu (rhythm/beat) khác nhau vào file MP3 có sẵn lời hát. Bao gồm tách stems (vocal/instrumental), phát hiện và đồng bộ beat, overlay nhiều tracks, và xuất kết quả.

## Quy trình cơ bản

### 1. Tách Vocal và Instrumental

Trước khi chèn nhạc nền mới, tách vocal ra khỏi bản gốc:

**Công cụ chính:**
- **Spleeter** (nhanh, dễ dùng): Tách 2-5 stems (vocals, drums, bass, other)
- **Demucs** (chất lượng cao hơn): Tách chi tiết hơn, hỗ trợ GPU
- **audio-separator** (wrapper hiện đại): Tích hợp nhiều models

**Lý do tách stems:** Khi bạn có vocal riêng và instrumental riêng, bạn có thể thay thế hoặc thêm nhạc nền mới mà không làm ảnh hưởng đến giọng hát. Nếu không tách, nhạc nền mới sẽ va chạm với instrumental cũ.

```python
from spleeter.separator import Separator
from pydub import AudioSegment

# Tách vocal và instrumental
separator = Separator('spleeter:2stems')
separator.separate_to_file('bai_hat_goc.mp3', 'output/')

# Load các stems đã tách
vocals = AudioSegment.from_wav('output/bai_hat_goc/vocals.wav')
instrumental = AudioSegment.from_wav('output/bai_hat_goc/accompaniment.wav')
```

### 2. Phát hiện Beat và Tempo

Để đồng bộ nhạc nền mới với vocal:

**Librosa** cho tempo/beat detection:
```python
import librosa

# Load audio và phát hiện tempo
y, sr = librosa.load('vocals.wav')
tempo, beats = librosa.beat.beat_track(y=y, sr=sr)
beat_times = librosa.frames_to_time(beats, sr=sr)
```

**Aubio** cho real-time beat detection (nếu cần xử lý streaming).

**Lý do quan trọng:** Nếu vocal có tempo 120 BPM nhưng nhạc nền mới có 140 BPM, chúng sẽ không khớp. Phát hiện tempo giúp bạn time-stretch hoặc chọn nhạc nền phù hợp.

### 3. Điều chỉnh Tempo (Time Stretching)

Khi nhạc nền có tempo khác với vocal:

```python
import librosa
import soundfile as sf

# Load nhạc nền mới
background, sr = librosa.load('nhac_nen_moi.mp3')

# Time stretch để khớp tempo
target_tempo = 120  # tempo của vocal
current_tempo = 140  # tempo của nhạc nền
stretch_rate = current_tempo / target_tempo

background_stretched = librosa.effects.time_stretch(background, rate=stretch_rate)
sf.write('nhac_nen_adjusted.wav', background_stretched, sr)
```

**Nguyên tắc:** Time stretching thay đổi tốc độ mà không đổi pitch. Tỷ lệ > 1 làm nhanh hơn, < 1 làm chậm hơn.

### 4. Đồng bộ Beat (Beat Matching)

Để các beat trùng khớp:

```python
from pydub import AudioSegment
import numpy as np

# Align nhạc nền theo beat của vocal
def align_to_beats(background_audio, beat_positions, measure_length):
    """Cắt và sắp xếp nhạc nền theo vị trí beat"""
    result = AudioSegment.silent(duration=0)
    
    for i, beat_time in enumerate(beat_positions):
        # Lấy segment từ nhạc nền
        segment_start = (i * measure_length) % len(background_audio)
        segment = background_audio[segment_start:segment_start + measure_length]
        
        # Đặt vào đúng vị trí beat
        result += segment
    
    return result
```

### 5. Layering và Mixing

Trộn vocal với các lớp nhạc nền:

```python
from pydub import AudioSegment

# Load các tracks
vocals = AudioSegment.from_wav('vocals.wav')
background_1 = AudioSegment.from_wav('drums.wav')
background_2 = AudioSegment.from_wav('bass.wav')
background_3 = AudioSegment.from_wav('synth.wav')

# Điều chỉnh âm lượng (dB)
vocals = vocals + 2  # Tăng vocal lên 2dB
background_1 = background_1 - 3  # Giảm drums xuống 3dB
background_2 = background_2 - 5
background_3 = background_3 - 8

# Overlay các layers (tất cả cùng độ dài)
mixed = vocals.overlay(background_1)
mixed = mixed.overlay(background_2)
mixed = mixed.overlay(background_3)

# Xuất kết quả
mixed.export('ket_qua_final.mp3', format='mp3', bitrate='320k')
```

**Nguyên tắc mixing:**
- Vocal thường là layer quan trọng nhất → giữ âm lượng cao nhất hoặc ngang bằng
- Drums/bass: -3 đến -6 dB so với vocal
- Synth/pads/effects: -6 đến -10 dB
- Test và điều chỉnh theo tai: nếu vocal bị chìm, giảm background hoặc tăng vocal

### 6. Crossfading và Transitions

Tạo chuyển đổi mượt giữa các sections:

```python
# Crossfade giữa hai đoạn nhạc nền
background_part1 = background_1[:30000]  # 30 giây đầu
background_part2 = background_2[:30000]

# Crossfade 5 giây
crossfaded = background_part1.append(background_part2, crossfade=5000)

# Fade in/out
with_fade = mixed.fade_in(2000).fade_out(3000)  # 2s fade in, 3s fade out
```

## Workflow hoàn chỉnh

```python
from spleeter.separator import Separator
from pydub import AudioSegment
import librosa
import soundfile as sf
import numpy as np

def mix_with_backgrounds(vocal_track_path, background_paths, output_path):
    """
    Trộn vocal với nhiều lớp nhạc nền
    
    Args:
        vocal_track_path: Đường dẫn file MP3 có vocal
        background_paths: List các đường dẫn nhạc nền
        output_path: Đường dẫn xuất file kết quả
    """
    
    # 1. Tách vocal (nếu file gốc chưa tách)
    separator = Separator('spleeter:2stems')
    separator.separate_to_file(vocal_track_path, 'temp_output/')
    
    # 2. Load vocal
    vocals = AudioSegment.from_wav('temp_output/.../vocals.wav')
    
    # 3. Phát hiện tempo của vocal
    y, sr = librosa.load('temp_output/.../vocals.wav')
    vocal_tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
    
    # 4. Xử lý từng background
    processed_backgrounds = []
    
    for bg_path in background_paths:
        # Load background
        bg_audio, bg_sr = librosa.load(bg_path)
        
        # Phát hiện tempo
        bg_tempo, _ = librosa.beat.beat_track(y=bg_audio, sr=bg_sr)
        
        # Time stretch để khớp tempo
        stretch_rate = bg_tempo / vocal_tempo
        bg_stretched = librosa.effects.time_stretch(bg_audio, rate=stretch_rate)
        
        # Lưu tạm
        temp_path = f'temp_bg_{len(processed_backgrounds)}.wav'
        sf.write(temp_path, bg_stretched, bg_sr)
        
        # Load vào pydub
        bg_segment = AudioSegment.from_wav(temp_path)
        
        # Điều chỉnh độ dài bằng vocal
        if len(bg_segment) < len(vocals):
            # Loop nếu ngắn hơn
            bg_segment = bg_segment * (len(vocals) // len(bg_segment) + 1)
        bg_segment = bg_segment[:len(vocals)]
        
        processed_backgrounds.append(bg_segment)
    
    # 5. Mix tất cả layers
    result = vocals + 2  # Tăng vocal
    
    for i, bg in enumerate(processed_backgrounds):
        # Giảm volume backgrounds
        bg_adjusted = bg - (4 + i * 2)  # Mỗi layer giảm dần
        result = result.overlay(bg_adjusted)
    
    # 6. Fade in/out
    result = result.fade_in(1500).fade_out(2000)
    
    # 7. Xuất kết quả
    result.export(output_path, format='mp3', bitrate='320k',
                  tags={'artist': 'Mixed', 'album': 'Remix'})
    
    return result
```

## Các trường hợp thực tế

### Thêm drums vào ballad
```python
vocals = AudioSegment.from_file('ballad_vocals.mp3')
drums = AudioSegment.from_file('drums_120bpm.wav')

# Giảm drums để không át vocal
drums = drums - 8

# Mix
result = vocals.overlay(drums[:len(vocals)])
result.export('ballad_with_drums.mp3', format='mp3')
```

### Tạo mashup với nhiều rhythms
```python
# Verse: chỉ có bass
verse = vocals[:60000].overlay(bass[:60000] - 6)

# Chorus: thêm drums và synth
chorus_vocals = vocals[60000:120000]
chorus = chorus_vocals.overlay(bass[60000:120000] - 6)
chorus = chorus.overlay(drums[60000:120000] - 4)
chorus = chorus.overlay(synth[60000:120000] - 8)

# Nối lại với crossfade
final = verse.append(chorus, crossfade=3000)
```

### Thay đổi rhythm theo sections
```python
def apply_rhythm_variations(vocals, backgrounds_dict, structure):
    """
    structure: {'verse': [0, 30000], 'chorus': [30000, 60000], ...}
    backgrounds_dict: {'verse': [bg1, bg2], 'chorus': [bg1, bg2, bg3]}
    """
    result = AudioSegment.silent(duration=0)
    
    for section, time_range in structure.items():
        start, end = time_range
        section_vocals = vocals[start:end]
        
        # Mix với backgrounds của section này
        section_mixed = section_vocals
        for bg in backgrounds_dict[section]:
            section_mixed = section_mixed.overlay(bg[start:end] - 5)
        
        result += section_mixed
    
    return result
```

## Lưu ý quan trọng

### Sample rate consistency
Tất cả audio phải cùng sample rate trước khi mix:
```python
# Resample nếu cần
audio = AudioSegment.from_file('input.mp3')
audio = audio.set_frame_rate(44100)  # Chuẩn hóa về 44.1kHz
```

### Tránh clipping
Khi overlay nhiều tracks, tổng âm lượng có thể vượt 0dB:
```python
# Normalize sau khi mix
from pydub.effects import normalize
result = normalize(mixed)  # Tự động điều chỉnh để tránh clipping
```

### Xử lý file lớn
Đối với file dài, xử lý theo chunks:
```python
def process_long_audio(audio_path, chunk_length_ms=60000):
    audio = AudioSegment.from_file(audio_path)
    chunks = [audio[i:i+chunk_length_ms] 
              for i in range(0, len(audio), chunk_length_ms)]
    
    processed_chunks = [process_chunk(chunk) for chunk in chunks]
    return sum(processed_chunks)  # Nối lại
```

### Dependencies
```bash
pip install pydub spleeter librosa soundfile
# FFmpeg cần được cài đặt riêng (https://ffmpeg.org/)

# Cho Demucs (chất lượng cao hơn):
pip install demucs

# Cho audio-separator (wrapper hiện đại):
pip install audio-separator
```

## Tham khảo thêm

Đọc `references/advanced-techniques.md` cho:
- Key detection và harmonic mixing
- Spectral processing và EQ
- Dynamic range compression
- Stem separation với models khác nhau