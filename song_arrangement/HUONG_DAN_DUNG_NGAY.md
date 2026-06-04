# 🚀 Dùng ngay — Hướng dẫn từng bước

Bạn có 2 cách. **Cách 1 nhanh nhất** (không cài gì). **Cách 2 giữ đúng giai điệu gốc**.

---

## ⚡ CÁCH 1 — Suno (web, ~5 phút, không cài đặt)

Nhanh nhất để ra **bài hoàn chỉnh có giọng hát + nhạc**, đổi phong cách dễ.

1. Vào **https://suno.com** → đăng nhập bằng Google (gói **Free**).
2. Bấm **Create** → bật **Custom / Custom Mode**.
3. **Lyrics:** dán toàn bộ lời ở dưới (mục “Lời dán sẵn”).
4. **Style of Music:** dán 1 dòng phong cách bạn muốn (mục “Style dán sẵn”).
5. Đặt tên bài → **Create**. Chờ ~30–60 giây ra 2 bản.
6. **Đổi phong cách mà giữ melody:** mở bài vừa tạo → bấm **`...` → Cover** → đổi Style sang phong cách khác → Create. Lặp lại để có nhiều nền.

> Lưu ý: bản Free chỉ **Cover được bài do chính bạn tạo trên Suno**, có giới hạn số lần/ngày. Tiếng Việt hát được nhưng phát âm có thể chưa chuẩn — nghe thử.

### Lời dán sẵn (Lyrics)
```
[verse]
Bước trên con đường lòng hân hoan, ngàn ước mơ xanh dưới mái trường.
Những gian truân nhọc nhằn hôm qua để lại, cùng đắp xây tương lai bừng sáng.
Non sông đang đổi thay từng ngày, có chúng tôi chung bàn tay,
cùng mang yên vui đến cho mọi người, ấm áp trên môi nụ cười.
[chorus]
Cùng dựng xây đất nước phồn vinh muôn đời, những doanh nghiệp vươn ra thế giới.
Cùng điểm tô quê hương đẹp tươi muôn màu, và làm nên tổ quốc mạnh giàu.
Trường Kinh tế giữ sứ mệnh ươm nhân tài, tri thức luyện rèn cho tương lai,
vì cộng đồng sẽ chia giá trị, và chung tay vun đắp cuộc đời.
[outro]
Hát lên bạn ơi, khúc ca Trường Kinh tế,
chữ tín ta dựng xây bằng Chất lượng Thân thiện. Ôi tự hào Trường Kinh tế Đại học Cần Thơ.
```

### Style dán sẵn (chọn 1)
- Hành khúc: `patriotic march, brass band, choir, proud, uplifting, 110 bpm`
- Ballad: `emotional ballad, piano, strings, warm, slow, 70 bpm`
- Giao hưởng: `epic cinematic orchestra, strings, brass, timpani, majestic, 90 bpm`
- Pop: `vietnamese pop, upbeat, synth, electric guitar, drums, energetic, 120 bpm`
- Acoustic: `acoustic guitar, light percussion, intimate, organic, 95 bpm`

---

## 🎯 CÁCH 2 — Colab notebook (giữ ĐÚNG giai điệu gốc)

Dùng `score.mid` (giai điệu từ bản nhạc của bạn) để nhạc nền **bám đúng melody**.

1. **Tải 2 file** từ tab **Files** của Pull Request (hoặc từ thư mục `song_arrangement/`):
   - `score.mid`
   - `Colab_doi_nen_nhac.ipynb`
2. Vào **https://colab.research.google.com** → **File → Upload notebook** → chọn `Colab_doi_nen_nhac.ipynb`.
3. Bật GPU: **Runtime → Change runtime type → T4 GPU → Save**.
4. Chạy lần lượt từng ô (nút ▶). Khi tới ô “Tải file melody”, **chọn `score.mid`**.
5. **Phần A** sẽ ra 5 file nhạc nền `backing_*.wav` (nghe ngay trong notebook, có nút tải về).
6. **Phần B** (tuỳ chọn) ra cả bài có giọng hát `song_*.wav`.

> Nếu repo ở chế độ public, có thể mở thẳng notebook bằng link:
> `https://colab.research.google.com/github/thuyhuongctu-cell/SoulX-Singer/blob/claude/song-background-music-variations-oSNsq/song_arrangement/Colab_doi_nen_nhac.ipynb`

---

## 🎬 CÁCH 2B — Video nhạc bằng AI (theo yêu cầu của thầy)

Sau khi đã có file audio (`song_*.wav` có giọng, hoặc `backing_*.wav` không lời):

1. Mở **`Colab_video_nhac_AI.ipynb`** trên Colab → bật **T4 GPU**.
2. Chạy lần lượt: cài đặt → **upload file audio** → sinh ảnh AI → tạo lời chạy → ghép video.
3. Ra file **`music_video.mp4`** (xem ngay trong notebook + tải về).

**Làm 2 video theo ý thầy:**
- Bản **có giọng hát + lời chạy**: upload `song_*.wav`, để `BURN_LYRICS = True`.
- Bản **không lời (instrumental)**: upload `backing_*.wav`, đặt `BURN_LYRICS = False`.

> Ảnh sinh theo chủ đề trường học / quê hương / tự hào (hợp nhạc đỏ). Sửa danh sách
> `PROMPTS` trong notebook để đổi cảnh.

---

## 🎼 CÁCH 3 — MuseScore (chính xác 100%, để in/biểu diễn)

1. Tải **MuseScore 4** (miễn phí): https://musescore.org
2. Mở `score.musicxml` → **sửa nốt cho khớp bản gốc** (OMR có thể sai vài chỗ).
3. Thêm bè/đổi nhạc cụ (Instruments) để ra từng phong cách → **File → Export** (PDF/MIDI/MP3).

---

### Nên bắt đầu từ đâu?
- Cần **kết quả nhanh để khoe thầy** → **Cách 1 (Suno)**.
- Cần **đúng giai điệu nhạc đỏ gốc** → **Cách 2 (Colab)** hoặc **Cách 3 (MuseScore)**.
