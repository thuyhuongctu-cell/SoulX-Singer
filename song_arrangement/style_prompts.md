# Bộ prompt mẫu — đổi nền nhạc theo nhiều phong cách

Bài gốc là **nhạc đỏ / ca khúc truyền thống**, sắc thái *vui tươi – tự hào*. Dưới đây là
prompt mẫu cho từng công cụ, theo 5 phong cách nền khác nhau **giữ nguyên giai điệu**.

> Cách dùng:
> - **Suno / ACE-Step (tạo cả bài, có lời):** dán lời ở `lyrics.md` vào ô Lyrics, dán "Style prompt" vào ô Style.
> - **MusicGen-Melody (chỉ nhạc nền):** upload file melody (xuất từ MIDI), dùng "Style prompt" làm text điều kiện. Không có lời.
> - Muốn **giữ đúng melody gốc**: với Suno dùng tính năng **Cover**; với MusicGen dùng **melody conditioning**; chắc chắn nhất là phối lại từ file MIDI trong DAW/MuseScore.

---

## 1. Hành khúc / Diễu hành (March) — trang nghiêm, hùng tráng
**Style prompt (EN):**
`patriotic Vietnamese march, brass band, snare drum, steady 4/4, triumphant, choir, proud and uplifting, orchestral`

## 2. Ballad / Trữ tình — nhẹ nhàng, cảm xúc
**Style prompt (EN):**
`emotional Vietnamese ballad, piano and strings, slow tempo, warm, heartfelt, gentle acoustic guitar, soft pad`

## 3. Orchestra / Giao hưởng — hoành tráng
**Style prompt (EN):**
`epic cinematic orchestra, full strings, brass, timpani, grand and majestic, film-score, choir, soaring`

## 4. Pop trẻ trung — hiện đại, sôi động
**Style prompt (EN):**
`modern Vietnamese pop, upbeat, bright synths, electric guitar, drums, energetic, youthful, catchy, danceable`

## 5. Acoustic / Mộc — gần gũi, sinh viên
**Style prompt (EN):**
`acoustic guitar, light percussion, warm campfire vibe, organic, intimate, simple arrangement, claps`

---

### Mẹo viết prompt
- Luôn nêu **tempo** (slow/mid/upbeat) và **nhạc cụ chính** để model bám đúng phong cách.
- Giữ **mood**: *proud, uplifting, joyful* để đúng tinh thần nhạc đỏ.
- Tránh nêu tên ca sĩ/ban nhạc thật (vi phạm bản quyền & có thể bị từ chối).
- Tiếng Việt: Suno/ACE-Step phát âm có thể chưa chuẩn — nếu cần phát âm chính xác,
  hãy **thu giọng hát thật** và chỉ dùng AI cho phần nhạc nền.
