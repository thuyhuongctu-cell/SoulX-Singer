# 🎯 Kế hoạch thực hiện (áp dụng skill `tao-nhac-nen-video-ai-viet`)

Bài: **Khúc ca Trường Kinh tế** — ĐH Cần Thơ · Nhạc & lời: Hữu Nhân – Tú Phan
Gốc: **sắc nhạc đỏ** (hùng tráng, truyền thống) · Sắc thái: *Vui tươi – Tự hào*

## Bước 1 — Yêu cầu (đã chốt)
- ✅ Lời: có sẵn (`lyrics.md`)
- ✅ Phong cách gốc: nhạc đỏ / hành khúc truyền thống
- ✅ Phong cách mục tiêu: **nhiều** (hành khúc, ballad, orchestra, pop, acoustic, lo-fi, EDM…)
- ✅ Sản phẩm: **nhạc nền nhiều phiên bản + video nhạc AI**; có **bản AI hát** và **1 bản không lời**

## Bước 2 — Công cụ (theo skill, ưu tiên MIỄN PHÍ)
| Mục đích | Công cụ chính (free) | Dự phòng (theo skill) |
|---|---|---|
| Nhạc nền + AI hát, đổi style | **Suno** (free 10 bài/ngày, có *Cover*) | Udio, Musicful |
| Nhạc nền bám đúng melody gốc | **MusicGen-Melody** (`Colab_doi_nen_nhac.ipynb`) | Soundraw |
| Bản không lời (instrumental) | MusicGen (`backing_*.wav`) / Suno *Instrumental* | Soundraw |
| Video nhạc có hình AI | **`Colab_video_nhac_AI.ipynb`** (free) | CrePal.ai, Neural Frames, Freebeat |
| Giữ đúng từng nốt (in/biểu diễn) | MuseScore từ `score.musicxml` | — |

## Bước 3 — PROMPT SẴN DÙNG cho bài này (paste thẳng)

> Cấu trúc skill: **[Genre] + [BPM] + [Mood] + [Nhạc cụ] + [Vocal]**. Luôn giữ mood *proud / uplifting / hopeful* để đúng tinh thần nhạc đỏ.

**Giữ chất hào hùng (gần gốc):**
- Hành khúc: `patriotic Vietnamese march, brass band, snare drum, choir, 110 BPM, proud, triumphant, uplifting`
- Giao hưởng: `epic cinematic orchestra, strings, brass, timpani, choir, 90 BPM, majestic, soaring, proud`

**Chuyển sắc nhạc đỏ → hiện đại:**
- Pop trẻ trung: `modern Vietnamese pop, bright synth, electric guitar, drums, 120 BPM, energetic, youthful, hopeful`
- Ballad cảm xúc: `emotional pop ballad, piano and strings, 75 BPM, warm, heartfelt, gentle`
- Acoustic mộc: `intimate indie folk, acoustic guitar, light percussion, 90 BPM, warm, organic`
- Lo-fi học tập: `nostalgic lo-fi hip-hop, mellow piano, vinyl crackle, 80 BPM, reflective, peaceful`
- EDM lễ hội: `uplifting progressive house, big synth leads, 128 BPM, energetic, anthemic`

**Vocal (khi dùng Suno/ACE-Step):** thêm `male lead vocal, clear Vietnamese pronunciation, with choir` (hoặc `female`).

## Bước 4 — Quy trình thực hiện
1. **Bản AI hát (nhiều style):** Suno → Custom → dán `lyrics.md` + 1 prompt trên → tạo 2–4 bản → chọn → (tùy chọn) *Cover* đổi style giữ melody.
2. **Bản giữ đúng melody gốc:** `Colab_doi_nen_nhac.ipynb` (Part A) với `score.mid` → `backing_*.wav` từng phong cách.
3. **Bản KHÔNG lời:** dùng chính `backing_*.wav`, hoặc Suno chế độ *Instrumental*.
4. **Video nhạc AI:** `Colab_video_nhac_AI.ipynb` → upload audio → sinh ảnh AI (chủ đề trường/quê hương/tự hào) → xuất MP4.
   - Có lời: `BURN_LYRICS=True` + `song_*.wav`
   - Không lời: `BURN_LYRICS=False` + `backing_*.wav`
   - Tỷ lệ: 16:9 (YouTube) hoặc 9:16 (TikTok/Reels).

## Bước 5 — Tối ưu (theo skill)
- **Melody lệch nhiều:** tăng *audio influence* / giảm *style influence* (Suno Cover); hoặc dùng nhánh MusicGen bám `score.mid`.
- **Phát âm tiếng Việt sai:** mô tả `clear Vietnamese pronunciation`; nếu vẫn lỗi → **thu giọng thật**, AI chỉ làm nền.
- **Lời chưa khớp nhịp video:** chỉnh `LYRICS_LINES` trong notebook, hoặc dùng tool word-level timing (Capify/Freebeat).
- **Chất lượng cao:** export WAV/stems → mix trong DaVinci/CapCut (free).

## Lưu ý bản quyền
- Free tier **thường không cho thương mại**. Bài này dùng **nội bộ trường/giáo dục** thì ổn; nếu phát hành chính thức → cân nhắc Suno Pro/Soundraw (bản quyền rõ ràng).

---
*Tạo bằng skill `tao-nhac-nen-video-ai-viet`, kết hợp bộ công cụ trong `song_arrangement/`.*
