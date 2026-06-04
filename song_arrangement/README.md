# 🎵 Khúc ca Trường Kinh tế — Bộ công cụ đổi nền nhạc nhiều phong cách

Mục tiêu: giữ **giai điệu gốc** (nhạc đỏ) của bài *"Khúc ca Trường Kinh tế"* (ĐH Cần Thơ)
nhưng **đổi được nền nhạc / phối khí sang nhiều phong cách** (hành khúc, ballad, orchestra,
pop, acoustic...), và tạo được **bài hoàn chỉnh (giọng + nhạc)** bằng công cụ **miễn phí**.

## 📁 Nội dung thư mục

| File | Mô tả |
|------|------|
| `lyrics.md` | Lời bài hát đầy đủ (trích từ PDF), dùng cho mọi công cụ tạo giọng hát |
| `style_prompts.md` | Prompt mẫu cho 5 phong cách nền, dùng cho Suno/ACE-Step/MusicGen |
| `assets/sheet_p1_300dpi.png` | Ảnh bản nhạc render 300 DPI (đầu vào cho OMR) |
| `score.musicxml` / `score.mid` | Bản nhạc số hoá (MusicXML/MIDI) — *nền tảng melody* để phối lại |
| `lyrics_raw.txt` | Text thô trích từ PDF (tham khảo) |
| `Colab_doi_nen_nhac.ipynb` | **Notebook Google Colab** (GPU free): MusicGen-Melody tạo nhạc nền bám `score.mid` + ACE-Step tạo cả bài có giọng hát |

## 🔧 Pipeline khuyến nghị (miễn phí, không cần GPU riêng)

```
PDF bản nhạc ──(Audiveris/oemer OMR)──▶ MusicXML/MIDI  ──┐
                                                          ├─▶ phối nhiều phong cách
lyrics.md ───────────────────────────────────────────────┘
```

### Bước 1 — Lấy melody (ĐÃ LÀM trong thư mục này)
PDF → MIDI/MusicXML bằng OMR. Nếu cần độ chính xác cao, mở `score.musicxml` trong
**MuseScore (miễn phí)** và sửa lại nốt cho khớp bản gốc.

### Bước 2 — Tạo nhiều bản nền (chọn 1 trong 3)
- **Đơn giản nhất:** [Suno](https://suno.com) (free) → dán lời + style prompt → tạo bài;
  dùng **Cover** để đổi phong cách mà giữ melody.
- **Mã nguồn mở, Colab free:** [ACE-Step 1.5](https://github.com/ace-step/ACE-Step-1.5)
  → tạo cả giọng + nhạc, sửa lời giữ melody.
- **Chỉ nhạc nền bám melody:** [MusicGen-Melody](https://github.com/facebookresearch/audiocraft)
  trên Google Colab → upload melody + style prompt.

### Bước 3 — Ghép giọng + nhạc
Mix trong bất kỳ DAW miễn phí nào (Audacity, BandLab...).

## ⚠️ Lưu ý về tiếng Việt
- **SoulX-Singer** (model gốc bạn xem) **KHÔNG hỗ trợ tiếng Việt** (chỉ Quan thoại/Anh/Quảng Đông).
- **Suno / ACE-Step** hát được tiếng Việt nhưng **phát âm chưa chắc chuẩn** → nếu cần chuẩn,
  **thu giọng hát thật** và chỉ dùng AI cho phần nền nhạc.

Xem báo cáo so sánh công cụ đầy đủ trong lịch sử hội thoại / phần mô tả PR.
