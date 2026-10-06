# NAGA VIP — Product Concept, Owner Presentation & Promo Video

**Naga Exchange · İskele / KKTC** — hazırlayan **Beta Studio** (Digital Growth & Technology Studio)

> **Müşteriniz gelsin. İşlemi hazır olsun.**
> NAGA VIP, Naga'nın VIP müşterilerinin döviz işlemlerini şubeye gelmeden önce planlayabildiği
> yeni bir **müşteri deneyimi + rezervasyon sistemi**dir. Müşteri işlemini telefondan oluşturur,
> Naga ekibi müşteri gelmeden hazırlar, müşteri geldiğinde işlem hazırdır.

---

## Teslim edilenler (`exports/`)

| Dosya | Ne |
|---|---|
| `NAGA-VIP-Sunum.pdf` | 12 slaytlık Türkçe sahip sunumu (3840×2160 görüntü kalitesi) |
| `NAGA-VIP-Sunum.pptx` | Aynı sunum, PowerPoint — konuşmacı notları (Türkçe) ve alt metin dahil |
| `NAGA-VIP-Promo-1920x1080.mp4` | Promo video, yatay — 37 sn, H.264, AAC, −14 LUFS |
| `NAGA-VIP-Promo-1080x1920.mp4` | Promo video, dikey — Instagram / Reels / WhatsApp |
| `NAGA-VIP-Video-Script.md` | Voiceover metni, sahne sahne zamanlamalı |

Ürün mockup'ları (`mockups/`):

| Klasör | İçerik |
|---|---|
| `mockups/screens/` | Saf uygulama ekranları 1179×2556 (iPhone @3x) + admin panel 2880×1800 |
| `mockups/framed/` | Telefon çerçeveli, şeffaf PNG (iPhone + bir Android benzeri örnek) |
| `mockups/showcase/` | 1920×1080 sunum görselleri (başlık + açıklama + telefon / panel) |

Ekranlar: **01 Home · 02 Transaction · 03 Branch & Time · 04 Confirmation · 05 Success · 06 Reservation Status · 07 Admin Dashboard · 08 Admin (READY)**

## ⚠️ Önemli notlar

1. **Voiceover geçicidir.** Bu ortamın ağ politikası `api.elevenlabs.io`'yu engellediği ve `ELEVENLABS_API_KEY` tanımlı olmadığı için
   videolardaki ses, **yerel ve açık lisanslı** bir Türkçe TTS sesiyle (Piper `tr_TR-fahrettin-medium`, CC0 veri seti) üretildi.
   ElevenLabs boru hattı hazırdır: aynı metin, aynı zamanlama → [ElevenLabs voiceover](#elevenlabs-voiceover-windows) adımlarıyla tek seferde değişir.
2. **Logo.** Naga logosu sohbette gösterildi ama dosya olarak bu ortama ulaşmadı (Instagram da engelliydi). Resmi olmayan bir kopya çizmek yerine
   tüm işlerde tipografik **NAGA / EXCHANGE** wordmark kullanıldı. Orijinal logoyu eklemek için → [Logoyu değiştirmek](#resmi-logoyu-eklemek).
3. **Demo veri.** Kurlar (GBP 64.95, EUR 55.20, USD 49.35), saat aralıkları, rezervasyon no ve tutarlar **örnektir** ve ekranlarda
   **DEMO RATE / DEMO VERİ** etiketiyle gösterilir. Naga'nın gerçek kuru, limiti, komisyonu, VIP seviyesi, çalışma saati ve rezervasyon politikası kullanılmadı.
   Not: 18:00 demo rezervasyonu brief'ten geldi; kamuya açık bir listelemede Naga'nın hafta içi 09:00–17:00 açık olduğu görülüyor — gerçek saatler Naga ile teyit edilmeli.
4. **Kur.** İlk sürümde **Rate Reservation** (tahmini kur gösterimi) anlatılır. Kurun kesin kilitlenmesi (**Rate Lock**) ve geçerlilik süresi,
   Naga Exchange'in operasyonel ve yasal kurallarına göre belirlenmelidir; ileri versiyonda değerlendirilebilir.

## Proje yapısı

```
naga-vip/
├── presentation/          slaytların PNG render'ları + speaker-notes.json (konuşmacı notları)
├── promo-video/           Remotion projesi — video, mockup ve slaytların TEK kaynağı
│   ├── src/
│   │   ├── theme.ts, fonts.ts, brand.ts, data.ts (DEMO veri), timeline.ts (tüm zamanlama)
│   │   ├── LayoutContext.tsx   16:9 / 9:16 responsive mimari (promo-video-skill)
│   │   ├── components/         PhoneFrame (iPhone + Android), DesktopFrame, Wordmark, UI, SoundTrack, SFX
│   │   ├── screens/            Home, Transaction, BranchTime, Confirmation, Success, Status, AdminDashboard
│   │   ├── scenes/             CustomerFlow (S1–S6), AdminScene (S7), Arrival (S8), Message (S9), CTA (S10)
│   │   ├── slides/             12 sunum slaytı
│   │   ├── mockups/            mockup still'leri
│   │   └── transitions/        GoldSwoosh (skill'in metallic swoosh'u, altın)
│   ├── public/                 fontlar (OFL), müzik, sfx, voiceover.mp3 + voiceover-timing.json
│   ├── audio/                  voiceover-config.json (ElevenLabs), üretilen voiceover dosyaları
│   ├── assets/                 lisans notları
│   └── renders/                ara render'lar (git'e girmez)
├── mockups/               dışa aktarılmış ürün ekranları
├── brand/                 CREATIVE-DIRECTION.md, brand-tokens.json
├── scripts/               render, ses, sunum ve QC script'leri (+ promo-video-skill script'leri)
├── exports/               final PDF, PPTX, MP4, script
└── README.md
```

## Uygulama mimarisi (basit)

```
CUSTOMER APP        NAGA VIP — iOS + Android (kur, hesaplama, rezervasyon, bildirim)
      ↓
RESERVATION SYSTEM  rezervasyonlar, durumlar (NEW → PREPARING → READY), bildirimler
      ↓
ADMIN DASHBOARD     Naga web paneli — bugünün rezervasyonları, detay, durum butonları
      ↓
NAGA STAFF          şube ekibi işlemi müşteri gelmeden hazırlar
```

## Yol haritası

```
Faz 1 ── Rezervasyon            ← ilk sürüm (MVP)
Faz 2 ── VIP + Kur alarmı       (favori para birimleri, tekrar işlem, VIP seviyeleri)
Faz 3 ── CRM + Otomasyon        (WhatsApp, analytics, loyalty)
Faz 4 ── Çok şube / Kurumsal
```

---

## Kurulum (Windows)

Gerekenler: **Node.js 18+**, **Python 3.10+** (yalnızca ses script'leri için), Git. FFmpeg ayrıca gerekmez —
Remotion kendi ffmpeg'ini getirir (`npx remotion ffmpeg`).

```powershell
cd naga-vip\promo-video
npm install
npm run preflight          # promo-video-skill ortam kontrolü (Node, API key, ffmpeg, Whisper)
npm run studio             # canlı önizleme (tarayıcıda açılır)
```

Skill'ler (Claude Code ile çalışırken):

```powershell
npx skills add remotion-dev/skills
npx skills add AKCodez/promo-video-skill
```

> İlk render'da Remotion kendi headless Chrome'unu indirir. İnternet kısıtlıysa kurulu Chrome'u kullanın:
> `$env:REMOTION_CHROME = "C:\Program Files\Google\Chrome\Application\chrome.exe"`

## Düzenleme

| Değiştirmek istediğiniz | Dosya |
|---|---|
| Demo kurlar, tutarlar, müşteri adı, rezervasyon no | `promo-video/src/data.ts` |
| Renkler | `promo-video/src/theme.ts` |
| Slogan, şirket bilgisi, resmi logo | `promo-video/src/brand.ts` |
| Sahne süreleri, beat'ler (tap, typing, status) | `promo-video/src/timeline.ts` (+ `Root.tsx` → 1110 kare) |
| Video sahneleri | `promo-video/src/scenes/*.tsx` |
| Uygulama / panel ekranları | `promo-video/src/screens/*.tsx` |
| Sunum metinleri | `promo-video/src/slides/Slides.tsx`, notlar: `presentation/speaker-notes.json` |
| Voiceover metni ve zamanlaması | `promo-video/audio/voiceover-config.json` |

Sahne sürelerini değiştirdiyseniz: `npm run timing` (skill'in timing-calculator'ı) toplam kareyi ve sahne başlangıçlarını verir;
voiceover `startTime` değerlerini buna göre kaydırın.

## Yeniden render

```powershell
cd naga-vip\promo-video
npm run export             # mockup'lar + slaytlar + PDF/PPTX + iki MP4 (hepsi ../exports)
# veya tek tek:
npm run mockups            # ../mockups/
npm run slides; npm run deck   # ../presentation/slides → ../exports/NAGA-VIP-Sunum.pdf + .pptx
npm run render             # ../exports/NAGA-VIP-Promo-1920x1080.mp4 + 1080x1920.mp4
npm run render:portrait    # sadece dikey
```

`render` her format için: Remotion H.264 (CRF 16) → ses mastering (loudnorm −14 LUFS, AAC 256k, faststart).

### Script'ler (`scripts/`)

| Script | Görev |
|---|---|
| `render-video.mjs` | İki formatı render eder, sesi master'lar, `exports/`'a kopyalar |
| `render-stills.mjs` | Mockup'ları ve slaytları PNG olarak render eder |
| `build-deck.mjs` | Slayt PNG'lerinden PDF + PPTX (konuşmacı notlarıyla) üretir |
| `make-sfx.py` | UI ses efektlerini sentezler (`public/sfx/`) |
| `vo-local.py` | Geçici yerel Türkçe ses (ElevenLabs yokken) |
| `vo-finalize.py` | Voiceover zamanlama/çakışma kontrolü + Whisper transkripti + Remotion'a yayın |
| `qc-frames.mjs` | Seçilen karelerden QC görüntüleri (`node scripts/qc-frames.mjs out 30,240,700`) |
| `promo-video-skill/*` | Skill'in `generate-voiceover.ts`, `timing-calculator.ts`, `preflight.ts` dosyaları (değiştirilmeden) |

## ElevenLabs voiceover (Windows)

promo-video-skill'in voiceover hattı (`scripts/promo-video-skill/generate-voiceover.ts`) değiştirilmeden kullanılır:
her satır kendi duygu presetiyle üretilir, `startTime`'a yerleştirilir, birleştirilir ve normalize edilir.

```powershell
cd naga-vip\promo-video
$env:ELEVENLABS_API_KEY = "sk_..."          # ElevenLabs → Profile → API Keys
npm run voiceover                            # audio\voiceover.mp3 + voiceover-normalized.mp3
pip install numpy openai-whisper             # Whisper isteğe bağlı ama önerilir
npm run voiceover:check                      # zamanlama + çakışma kontrolü, Whisper transkripti, public\ klasörüne yayınlar
npm run render
```

- Ses: **Matilda** (`XrExE9yKIg1WjnnlVkGX`, sıcak + kendinden emin), model `eleven_multilingual_v2`. Değiştirmek için `voiceover-config.json` → `voiceId`
  (skill'in diğer hazır sesleri: Rachel, Daniel, Josh, Adam).
- `voiceover:check` bir satırın bir sonrakine ya da kendi sahnesinin sonuna taştığını görürse hata verir → metni kısaltın veya `startTime`'ı kaydırın, tekrar üretin.
- ElevenLabs sesi geçici sesten biraz farklı hızda olabilir; "Daha hızlı / kolay / VIP" yazılarının girişleri `src/timeline.ts` → `MESSAGE.lines` ile sese hizalanır.

Geçici yerel sesi yeniden üretmek (ElevenLabs olmadan):

```powershell
pip install sherpa-onnx numpy
# https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/vits-piper-tr_TR-fahrettin-medium.tar.bz2  (indirip açın)
python ..\scripts\vo-local.py --voice-dir C:\path\vits-piper-tr_TR-fahrettin-medium --speed 0.92
python ..\scripts\vo-finalize.py --source "local-piper (TEMP)"
```

## Resmi logoyu eklemek

1. Naga'nın orijinal logo dosyasını (PNG şeffaf ya da SVG) `promo-video/public/brand/naga-logo.png` olarak koyun.
2. `promo-video/src/brand.ts` → `export const OFFICIAL_LOGO = "brand/naga-logo.png";`
3. `npm run export`

## Kalite kontrol (QC) — sonuçlar

**Sunum**
- [x] 12 slayt, her slaytta tek fikir; uzun paragraf yok, büyük tipografi, büyük telefon mockup'ları
- [x] Teknik jargon yok; mimari sunumda değil, bu README'de
- [x] Ürün "uygulama" değil **müşteri deneyimi + rezervasyon sistemi** olarak konumlandı (slayt 4)
- [x] Admin panel: liste + detay + 3 buton (PREPARE / CONTACT CUSTOMER / MARK AS READY)
- [x] VIP+ özellikleri "ilk sürümün parçası değildir" etiketiyle ayrı (slayt 10)

**Video**
- [x] 37.0 sn (30–45 aralığı), ilk 3 sn: "Müşteriniz gelmeden..." + telefon
- [x] Sahne/beat süreleri 2.8–4.6 sn; geçişler 0.4 sn altın swoosh
- [x] Voiceover sahnelerle hizalı: 10 satırın hepsi kendi sahnesinde bitiyor, çakışma yok (silencedetect + Whisper ile doğrulandı)
- [x] Dikey versiyonda metinler üstte, telefon tam görünür; kamera zoom'ları yalnız odak alanına
- [x] Müzik, konuşma olmayan anlarda bile sesin ~12 dB altında; konuşma sırasında ayrıca ducking; −14 LUFS master, −1 dBFS tepe
- [ ] **ElevenLabs sesi** — ağ/anahtar engeli nedeniyle bekliyor (geçici ses kullanıldı)
- [ ] **Resmi logo** — dosya bekleniyor (tipografik wordmark kullanıldı)

**İşletme**
- [x] Fayda açık: hız, VIP deneyim, düzenli operasyon, sadakat, dijital marka — rakamsal iddia yok
- [x] Gerçek Naga kuru gibi davranılmıyor: tüm kurlarda DEMO etiketi
- [x] "Kur garantisi" yok: Rate Reservation + yasal/operasyonel not

## Lisanslar ve kaynaklar

- **Remotion** — şirketler için 3 kişiye kadar ücretsiz; daha büyük ekipler için Remotion şirket lisansı gerekir (remotion.pro/license).
- **promo-video-skill** (AKCodez, MIT) — workflow, narrative template'ler, multi-format mimari, voiceover hattı, timing calculator, metallic swoosh. Script'ler `scripts/promo-video-skill/` altında değiştirilmeden.
- **Müzik** — "Inspired Ambient" (promo-video-skill ile birlikte gelen Pixabay lisanslı parça).
- **SFX** — `scripts/make-sfx.py` ile sentezlendi.
- **Fontlar** — Montserrat ve Inter, SIL Open Font License (`promo-video/public/fonts/`).
- **Geçici ses** — Piper `tr_TR-fahrettin-medium` (veri seti CC0), sherpa-onnx (Apache-2.0) ile çalıştırıldı.
- **İkonlar** — Lucide (ISC).
