# 🎛️ SoulX-Singer AI Studio (web app)

Giao diện web prototype cho bài **"Khúc ca Trường Kinh tế"**: chọn nhiều màu nhạc nền
(giữ melody gốc), cấu hình giọng hát / chủ đề video, nghe demo hòa âm bằng Web Audio,
và **xuất "prompt pack"** để dán sang Suno / Udio / Veo…

> Đây là **giao diện + tạo prompt**. Việc render nhạc/giọng/video thật vẫn thực hiện
> ở các công cụ AI (xem `../song_arrangement/`).

## Công nghệ
- Vite + React 18 + TypeScript
- Tailwind CSS
- lucide-react (icon)

## Chạy ở máy (cần Node 18+)
```bash
cd webapp
npm install
npm run dev        # mở http://localhost:5173
```

## Build tĩnh (để deploy)
```bash
npm run build      # xuất ra webapp/dist
npm run preview    # xem thử bản build
```
Thư mục `dist/` là HTML/CSS/JS tĩnh — deploy được lên **Vercel, Netlify, GitHub Pages**
(đã đặt `base: './'` nên chạy được ở subpath).

## Tính năng chính
- **Chọn màu nhạc nền:** cinematic, acoustic, pop, EDM, lo-fi, dân gian Mekong.
- **Nghe demo 8 ô nhịp** mô phỏng hòa âm từng style (Web Audio API).
- **Prompt pack:** gom lời + style + tempo + chủ đề video → tải file `.txt` hoặc copy.
- Tùy chỉnh **giọng hát** và **chủ đề video**.
