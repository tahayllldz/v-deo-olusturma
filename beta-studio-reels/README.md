# Beta Studio — Instagram Reels İçerik Motoru

Beta Studio (KKTC · Digital Growth & Technology Studio · [@betastudio.cy](https://www.instagram.com/betastudio.cy/)) için [HyperFrames](https://github.com/heygen-com/hyperframes) ile kurulmuş, tekrar kullanılabilir bir Reels üretim sistemi.

Tek seferlik 5 video değil: ortak bir tasarım sistemi (`frame.md`), 14 bileşenli bir kütüphane, 5 template, A/B hook altyapısı, KPI metadata'sı ve tek komutla render/kalite kontrol araçları. İlk 5 Reels bu sistemle üretildi.

> **Dürüstlük notu.** Videolardaki tüm işletme adları (Liman Meze Evi, Ada Zeytin, Mavi Kapı Kuaför, Sahil Meyhanesi), arayüzler, mesajlar ve sayılar **sentetik ve temsilîdir**; gerçek müşteri verisi, sonucu, fiyatı veya istatistiği değildir. Üçüncü taraf logo veya ekran görüntüsü kullanılmadı. Tüm arayüzler HTML/CSS ile sıfırdan çizildi.

---

## Teslimatlar

| | Nerede |
|---|---|
| 20 içerik fikri | [`concepts/01-20-reels-konsepti.md`](concepts/01-20-reels-konsepti.md) |
| Seçilen 5 konsept (puanlama + yayın sırası) | [`concepts/02-secilen-5-konsept.md`](concepts/02-secilen-5-konsept.md) |
| İçerik stratejisi (ton, karışım, seriler, KPI, A/B) | [`concepts/03-icerik-stratejisi.md`](concepts/03-icerik-stratejisi.md) |
| Hook kütüphanesi + test kaydı | [`concepts/hook-kutuphanesi.md`](concepts/hook-kutuphanesi.md) |
| 5 senaryo (zamanlama, ekran metni, SFX, caption, hashtag) | [`scripts/`](scripts/) |
| 5 Reels (kaynak) | [`compositions/reel-01-website` … `reel-05-hot-take`](compositions/) |
| 5 Reels (MP4, 1080×1920, H.264 + AAC) | [`renders/`](renders/) |
| A/B hook varyantları (MP4) | [`renders/ab/`](renders/ab/) |
| 5 kapak (thumbnail) | [`thumbnails/`](thumbnails/) |
| Video başına KPI metadata | `compositions/reel-0N-*/metadata.json` |
| Bileşen kütüphanesi | [`components/`](components/) → [katalog](components/README.md) |
| 5 template + örnek içerikler | [`templates/`](templates/) → [kullanım](templates/README.md) |
| Template demo render'ları | [`renders/templates/`](renders/templates/) |
| Tasarım sistemi | [`frame.md`](frame.md) |
| Önizleme kontak sayfaları | [`previews/`](previews/) |

### İlk 5 Reels

| # | Video | Seri | Kategori | Template | Süre | Birincil KPI |
|---|---|---|---|---|---|---|
| 01 | Web siteniz müşterileri kaçırıyor olabilir | Bunu Yapma | Eğitim | B — UI demo | 18.0 sn | Kaydetme |
| 02 | Takipçiniz çok olabilir. Ama müşteriniz? | Dijital Gerçekler | İşletme psikolojisi | D — Veri | 18.3 sn | Paylaşım |
| 03 | İşletmeniz için AI kullanmanın en basit yolu | AI ile 30 Saniye | Eğitim | B — UI demo (telefon + CRM) | 19.6 sn | Yorum |
| 04 | Aynı işletme, biri daha fazla güven veriyor | Önce / Sonra | Önce/Sonra | C — Önce/Sonra | 18.0 sn | Tekrar izleme |
| 05 | Her işletmenin mobil uygulamaya ihtiyacı yok | Dijital Gerçekler | Hot take | A — Kinetic | 17.6 sn | Paylaşım |

Önerilen yayın sırası: 01 → 05 → 04 → 02 → 03 (gerekçesi `concepts/02`).

---

## Klasör yapısı

```
beta-studio-reels/
├── README.md               ← bu dosya
├── frame.md                ← tasarım sistemi (renkler, tipografi, güvenli alan, kurallar)
├── package.json            ← npm komutları
├── concepts/               ← 20 fikir, seçim, strateji, hook kütüphanesi
├── scripts/                ← 5 üretim senaryosu
├── compositions/           ← 5 Reels (her biri bir HyperFrames projesi)
│   └── reel-01-website/
│       ├── index.html      ← ana zaman çizelgesi, A/B hook, chrome, ses
│       ├── compositions/   ← sahneler (s1-…, s2-…) + ortak end card
│       ├── metadata.json   ← KPI metadata + sonuç alanları
│       └── variants/ab.json
├── templates/              ← 5 template (A–E) + content/*.json
├── components/             ← beta.css, beta.js, fonts.css, blocks/, gallery/  (KAYNAK)
├── assets/                 ← logo + paylaşılan görseller (demo/ altında sentetik örnekler)
├── fonts/                  ← OFL fontlar (Türkçe karakter destekli)
├── music/                  ← üretilmiş müzik yatakları + video başına kesimler (cuts/)
├── sound-effects/          ← UI SFX (Pixabay lisansı)
├── thumbnails/             ← kapak PNG'leri + covers/ (kapak kaynağı)
├── previews/               ← kontak sayfaları
├── renders/                ← MP4 çıktılar (ab/, templates/)
└── tools/                  ← sync, check, render, template, kapak, müzik araçları
```

`components/`, `fonts/`, `sound-effects/`, `music/` ve `assets/` **tek kaynaktır**. HyperFrames bir projenin dışındaki dosyalara (`../`) erişmediği için `npm run sync` bunları her projenin `system/` klasörüne kopyalar. `system/` git'e girmez — klonladıktan sonra ilk iş `npm run sync`.

---

## Kurulum

Gerekenler: **Node.js ≥ 22**, **FFmpeg** (ffprobe dahil), internet (ilk `npx` indirmesi ve headless Chrome için). Python 3 yalnızca müziği yeniden üretmek için gerekir.

```bash
cd beta-studio-reels
npm run sync                      # paylaşılan dosyaları tüm projelere kopyalar
npx --yes hyperframes@0.8.137 browser ensure   # render için headless Chrome (bir kez)
npm run check                     # 12 projeyi lint + check eder
```

Tüm projeler HyperFrames **0.8.137**'ye sabitlenmiştir (aynı kaynak, aylar sonra aynı videoyu üretir). Yükseltmek için: `npx hyperframes@latest upgrade --project compositions/reel-01-website --check`.

### Logo

Resmî logo dosyası bu repoya eklenmedi (sohbette paylaşılan görsel dosya olarak erişilebilir değildi). Eklemek için:

1. `assets/logo.svg` (tercihen) veya şeffaf `assets/logo.png` (≥ 1600 px).
2. `npm run sync && npm run render:all`

Logo yokken end card'da tipografik "BETA / STUDIO" geçici yazısı görünür; B işareti hiçbir yerde yeniden çizilmez. Ayrıntı: [`assets/README.md`](assets/README.md).

Renkler logodan türetildi (resmî hex kodları verilmedi). Resmî kodlar varsa `components/beta.css` başındaki `:root` değerlerini ve `frame.md`'yi güncelleyin → `npm run sync` → render.

---

## Komutlar

| Komut | Ne yapar |
|---|---|
| `npm run sync` | `components/`, fontlar, SFX, müzik, assets → her projenin `system/` klasörü; logo varsa `brand.js` |
| `npm run check` | Tüm projeler: lint + runtime + yerleşim + kontrast + Instagram alt bölgesi. `npm run check -- reel-03` tek proje |
| `npm run render:all` | 5 Reels'i teslim kalitesinde render eder → `renders/` + `render-report.json` (süre, LUFS, tepe) |
| `npm run render:draft` | Hızlı taslak render → `renders/draft/` |
| `npm run ab` | Ana render + A ve B hook varyantları → `renders/ab/`. Tek video: `npm run ab -- reel-01-website` |
| `npm run template -- <a-e> <içerik.json>` | Template'ten video → `renders/templates/`. `--variant B`, `--quality draft` |
| `npm run covers` | Kapakları PNG olarak dışa aktarır → `thumbnails/` |
| `npm run previews` | Render'lardan 8 karelik kontak sayfaları → `previews/` |
| `npm run music` / `npm run music:cuts` | Müzik yataklarını / video başına kesimleri yeniden üretir |

Tek bir projeyi canlı izlemek için: `cd compositions/reel-03-ai && npx hyperframes preview` (Studio açılır; zaman çizelgesi, değişkenler, A/B seçimi).

---

## Yeni video oluşturmak

### Yol 1 — Template ile (önerilen, 10–20 dakika)

```bash
cp templates/template-b-ui-demo/content/example.json templates/template-b-ui-demo/content/yeni-video.json
# yeni-video.json içindeki hook, adım ve payoff metinlerini yazın
npm run template -- b content/yeni-video.json --quality draft   # kontrol
npm run template -- b content/yeni-video.json                   # teslim
npm run template -- b content/yeni-video.json --variant B        # B hook'u
```

Hangi template ne için: [`templates/README.md`](templates/README.md).

### Yol 2 — Özel Reels (yeni görsel fikir)

1. En yakın Reels'i kopyalayın: `cp -r compositions/reel-03-ai compositions/reel-06-yeni-konu` (ve `system/`, `renders/`, `snapshots/` klasörlerini silin).
2. `hyperframes.json` / `meta.json` içindeki adı, `index.html`'deki hook değişkenlerini, seri etiketini değiştirin.
3. Sahneleri `compositions/` altında düzenleyin; her sahne kendi zaman çizelgesine sahip bir alt kompozisyondur. Bileşenler: [`components/README.md`](components/README.md).
4. `metadata.json`'ı güncelleyin (başlık, hook, kategori, hedef kitle, hedef, hipotez).
5. `music/cuts.json`'a satır ekleyin → `npm run music:cuts` → `npm run sync` → `npm run check -- reel-06` → `npm run render:all -- reel-06`.
6. Senaryoyu `scripts/` altına yazın.

## Yeni hook eklemek

Her video iki hook taşır; görsel gövde aynıdır:

- **Reels:** `compositions/reel-0N-*/index.html` → `<html data-composition-variables>` içindeki `hookA` (problem önce) ve `hookB` (tartışmalı) varsayılanları. Metin işaretleme: `*serif*`, `~kırmızı kalem~`, `|` satır.
- **Template'ler:** içerik dosyasındaki `hookA` / `hookB`.
- Render: `npm run ab -- reel-01-website` → `renders/ab/reel-01-website-A.mp4`, `-B.mp4`. Tek varyant: `npx hyperframes render --variables '{"hookVariant":"B"}'` (proje klasöründe).
- Sonuçları `concepts/hook-kutuphanesi.md` → test kaydına ve `metadata.json` → `results`'a yazın.

Üçüncü bir varyant gerekiyorsa `hookVariant` enum'una `C` seçeneği ve `hookC` değişkeni eklemek yeterli — `BS.pick(v, "hook")` otomatik okur.

## Süreyi değiştirmek

**Reels:** `index.html` → `#root` `data-duration`; sahne host'larının `data-start` / `data-duration` değerleri; sahne içindeki zaman sabitleri; SFX `<audio>` `data-start`'ları; müzik kesimi (`music/cuts.json` → `duration`, `fadeOutStart` → `npm run music:cuts`). Müzik vuruşa göre kesildiği için süreyi ölçü katlarıyla değiştirmek en temizidir (100 BPM → 2.4 sn, 108 BPM → 2.22 sn, 92 BPM → 2.61 sn).

**Template'ler:** her template'in başındaki yorum blokunda zaman tablosu ve `const T = { … }` sabitleri vardır → [`templates/README.md#süreyi-değiştirmek`](templates/README.md).

---

## Kalite kontrol

Her render öncesi `npm run check` çalışır ve şunları denetler: HyperFrames sözleşmesi (lint), çalışma zamanı hataları, metin taşması/üst üste binmesi, WCAG kontrastı, seek güvenliği ve Instagram'ın alt %21'lik caption/ses bölgesi. Son durumda **12/12 proje geçiyor.**

Elle kontrol listesi (her video):

- [ ] İlk kare boş değil; hook 0–2 sn içinde okunuyor
- [ ] Ana metin `x 72–930, y 250–1500` güvenli alanında
- [ ] Hook ≥ 120 px, destek metni ≥ 52 px, etiket ≥ 28 px
- [ ] Karede tek vurgu; kırmızı = sorun, kobalt = çözüm
- [ ] Uydurma istatistik / gerçek müşteri verisi yok; örnek sayılar "örnek" diye etiketli
- [ ] Müzik sesi bastırmıyor (−16 ± 2 LUFS, tepe ≤ −1 dBFS — `render-report.json`)
- [ ] End card ≤ 2 sn, logo sade
- [ ] Kapak 3:4 kırpmada (y 240–1680) okunuyor

## KPI ve metadata

Her videonun `metadata.json` dosyası: `title`, `hook`, `category`, `duration`, `cta`, `targetAudience`, `goal`, `hypothesis` + seri, template, A/B hook'lar, birincil KPI ve boş bir `results` bloğu. Yayından 72 saat sonra Insights değerlerini (`hold3s`, `avgWatchTime`, `completionRate`, `saves`, `shares`, `profileVisits`, `follows`, `dmStarts`…) buraya yazın; `hypothesisConfirmed` alanı bir sonraki içerik kararını besler. Değerlendirme çerçevesi: `concepts/03-icerik-stratejisi.md` §6.

---

## Ses

- **Müzik:** `tools/make-music.py` ile üretilmiş özgün yataklar (`bed-warm-100`, `bed-pulse-108`, `bed-night-92`) — telif riski yok. Video başına kesimler fade-out'u içinde taşır (HyperFrames 0.8.137'de ses otomasyon şeridi doğrusal ölçülmediği için sabit `data-volume` + pişmiş fade kullanıldı).
- **SFX:** Pixabay Content License (ticari kullanım serbest) — [`sound-effects/CREDITS.md`](sound-effects/CREDITS.md).
- Videolarda yapay zekâ seslendirmesi yok; konuşan içerik için Template E (kendi sesiniz) kullanılır.

## Lisanslar

| Varlık | Lisans |
|---|---|
| Bricolage Grotesque, Instrument Serif, JetBrains Mono | SIL Open Font License 1.1 (`fonts/*-OFL.txt`) |
| GSAP 3.14 | GreenSock Standard "No Charge" License (ticari kullanım dahil ücretsiz) |
| SFX | Pixabay Content License |
| Müzik, arayüzler, demo görseller ve placeholder video | Bu proje için üretildi |
| HyperFrames | Apache-2.0 (CLI, npx ile çalışır; repoya dahil değil) |
