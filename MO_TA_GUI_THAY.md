# 🎵 Khúc ca Trường Kinh tế — Nhạc nền & Video AI (Mô tả gửi thầy)

Bài hát gốc (**nhạc đỏ**) được **giữ nguyên giai điệu**, và tạo được **nhiều loại nhạc nền
khác nhau** từ cùng một bài — đúng yêu cầu *"thay đổi được các loại nhạc nền khác nhau"*.

## 🔗 Liên kết nhanh
- **Pull Request (tổng hợp):** https://github.com/thuyhuongctu-cell/SoulX-Singer/pull/1
- **Thư mục sản phẩm:** [`song_arrangement/`](song_arrangement/) → các file nhạc trong [`song_arrangement/demos/`](song_arrangement/demos/)
- **Giao diện web (xem trên điện thoại):**
  https://raw.githack.com/thuyhuongctu-cell/SoulX-Singer/47b70b7bc89035396483f27d2a75d04e4024f684/webapp/dist/index.html

## 🎼 8 phong cách nhạc nền (cùng một giai điệu gốc)

| # | Phong cách | Tempo | Sắc thái | Nên dùng cho |
|---|---|---|---|---|
| 1 | **Hành khúc** | 108 | Hùng tráng, trang nghiêm | Lễ kỷ niệm, chào cờ, khai giảng |
| 2 | **Ballad** | 76 | Nhẹ nhàng, cảm xúc | Tri ân, video tâm tình |
| 3 | **Orchestra (Giao hưởng)** | 90 | Hoành tráng, trang trọng | Video giới thiệu trường, sự kiện lớn |
| 4 | **Pop hiện đại** | 102 | Trẻ trung, tươi sáng | Truyền thông, sự kiện sinh viên |
| 5 | **Acoustic** | 96 | Mộc mạc, gần gũi | Văn nghệ lớp, clip đời thường |
| 6 | **Lo-fi** | 74 | Êm dịu, thư giãn | Nhạc nền video recap / học tập |
| 7 | **EDM** | 128 | Sôi động, năng lượng | Reel/TikTok, clip tuyển sinh |
| 8 | **Dân gian Mekong** | 94 | Sáo trúc + đàn tranh, đậm chất miền Tây | Chương trình mang bản sắc địa phương |

> Mỗi phong cách có **2 phiên bản**: *chỉ nhạc nền* và *có bè hát theo giai điệu*
> (file `..._giong.mp3`). Ngoài ra có **4 bản dài ~2–3 phút** (file `..._DAI.mp3`).

## 📂 Thành phần khác trong kho
- 🎼 **Melody gốc** tách từ bản nhạc PDF → `song_arrangement/score.mid` & `score.musicxml`
- 📝 **Lời bài hát** → `song_arrangement/lyrics.md`
- 🧩 **Bộ prompt** cho từng phong cách → `song_arrangement/style_prompts.md`
- 🤖 **Notebook AI** tạo nhạc/video (Google Colab) → `song_arrangement/Colab_*.ipynb`
- 🖥️ **Web app** chọn phong cách + sinh "prompt pack" cho Suno/Udio/Veo → `webapp/`

## ▶️ Hướng tiếp theo
Phần **hát rõ lời tiếng Việt** sẽ dùng **giọng hát thật** hoặc **AI (Suno)** sau khi
thầy chọn phong cách phù hợp. Các bản nhạc nền hiện tại đã sẵn sàng để hát theo / làm video.

---
*Toàn bộ giữ nguyên giai điệu gốc của "Khúc ca Trường Kinh tế" (Nhạc & lời: Hữu Nhân – Tú Phan), Trường Kinh tế – Đại học Cần Thơ.*
