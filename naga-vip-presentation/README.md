# NAGA VIP — Naga Exchange sahibine ürün sunumu

**Beta Studio** tarafından Naga Exchange (İskele) işletme sahibine sunulmak üzere hazırlandı.

> **Ana mesaj:** Müşteri döviz işlemini telefondan önceden oluşturur; Naga, müşteri şubeye gelmeden işlemi hazırlar.
> **Müşteri gelmeden işlem hazır.**

---

## Teslimatlar

| # | Ne | Dosya |
| --- | --- | --- |
| 1 | Sunum (12 slayt, tarayıcıda açılır) | [`presentation/index.html`](presentation/index.html) |
| 2 | PDF export (12 sayfa, 16:9) | [`exports/NAGA-VIP-Sunum.pdf`](exports/NAGA-VIP-Sunum.pdf) |
| 3 | NAGA VIP ürün demosu — 18 sn, 1920×1080, 30 fps | [`demo-video/naga-vip-demo.mp4`](demo-video/naga-vip-demo.mp4) |
| 3b | Admin paneli döngüsü — 9 sn (6. slayt) | [`demo-video/naga-admin-panel-loop.mp4`](demo-video/naga-admin-panel-loop.mp4) |
| 4 | Telefon mockup'ları (ana ekran, rezervasyon, onay, kur alarmı) | [`mockups/01…04-phone-*.png`](mockups/) |
| 5 | Admin dashboard mockup'ı (liste + #1042 detay) | [`mockups/05-admin-dashboard.png`](mockups/05-admin-dashboard.png), [`06-admin-reservation-1042.png`](mockups/06-admin-reservation-1042.png) |
| 6 | Kullanıcı akışı, önce/sonra, sistem mimarisi | [`mockups/08-customer-journey.png`](mockups/08-customer-journey.png), [`07-before-after.png`](mockups/07-before-after.png), [`09-system-architecture.png`](mockups/09-system-architecture.png) |
| — | Slaytların tek tek PNG halleri (WhatsApp / e-posta için) | [`exports/slides/`](exports/slides/) |

Videoların WebM (VP9) kopyaları ve poster kareleri de `demo-video/` içinde; sunum, tarayıcı H.264 oynatamıyorsa WebM'e geçer.

## Sunumu açmak ve sunmak

`presentation/index.html` dosyasını Chrome, Edge veya Safari ile açın (klasör yapısı bozulmadan; görseller ve videolar göreli yollarla yüklenir).

| Tuş | İşlev |
| --- | --- |
| → / Boşluk / Enter | Sonraki slayt |
| ← | Önceki slayt |
| F | Tam ekran |
| N | Konuşmacı notları (alt panel) |
| Home / End | İlk / son slayt |

Ekranın sağ yarısına tıklamak ileri, sol yarısına tıklamak geri götürür; dokunmatik ekranda kaydırma çalışır. Videolar, slaytları açıldığında sessiz ve döngüsel oynar.

İsterseniz yerel sunucuyla: `npm run present` → `http://localhost:4173/presentation/`.

### Slayt akışı

Problem → Fikir → Ürün → Nasıl çalışıyor → Naga'ya faydası → İlk versiyon → Gelecek → Beta Studio → Başlayalım

1. **NAGA VIP**: Döviz işlemini müşteriniz gelmeden hazırlayın.
2. **Bugün**: Müşteri gelir, bekler, işlem ancak o zaman hazırlanır ("10.000 GBP bozduracağım.")
3. **Fikir**: Müşteri işlemini gelmeden önce oluştursun + müşteri yolculuğu
4. **NAGA VIP**: Ana ekran, rezervasyon ve onay ekranları
5. **30 saniyede rezervasyon**: 5 adım + ürün demosu videosu
6. **Naga tarafında**: Admin paneli (PREPARE / CONTACT CUSTOMER / MARK AS READY)
7. **Müşteri deneyimi**: Ahmet'in önce / sonra hikâyesi
8. **Naga'ya ne kazandırır?**: 5 işletme faydası
9. **İlk versiyon (MVP)**: Yalnızca gereken özellikler
10. **Sonraki aşama**: Phase 2 (kur alarmı, VIP seviyeleri, CRM…), kur kilitleme konsepti, Phase 3
11. **Beta Studio**: Sadece bir uygulama değil, Naga'nın dijital müşteri sistemi
12. **Birlikte başlayalım**: Naga'nın müşterisi şubeye geldiğinde işlem hazır olsun.

## Gerçekçilik kuralları (önemli)

- **Tüm kurlar ve tutarlar örnektir (DEMO).** 64,95 GBP/TRY, 55,20 EUR/TRY, 49,35 USD/TRY ve ₺649.500 gerçek Naga fiyatı değildir; ekranlarda ve slaytlarda "DEMO" olarak işaretlidir.
- Naga'nın gerçek işlem limiti, çalışma saati, VIP politikası, şube politikası ve komisyonu **bilinmediği için kullanılmadı**.
- Kur bilgisi her yerde "bilgilendirme amaçlıdır; işlem koşulları Naga tarafından onaylanır" notuyla gösterilir.
- **Kur kilitleme** ilk sürüm özelliği olarak sunulmadı; 10. slaytta yalnızca *konsept* olarak ve şu notla yer alıyor: "Kurun kesin olarak kilitlenmesi, işlem onayı ve geçerlilik süresi Naga'nın operasyonel ve yasal kurallarına göre belirlenecektir."
- Admin paneli ekranları, brief'teki İngilizce etiketlerle (Today's Reservations, PREPARE, MARK AS READY…) hazırlandı; slaytlarda Türkçe açıklamaları var.

## Marka ve logo

- Naga Exchange'in resmi web sitesi veya logo dosyası bulunamadı. Logo, işletmenin Instagram profilindeki görselden (**@naga_exchange_**) **vektör olarak yeniden çizildi**: altın geometrik "N" monogramı, beyaz "NAGA", "EXCHANGE LTD". Kaynak: [`scripts/build_logo.py`](scripts/build_logo.py) → `assets/brand/*.svg`.
- **Sunumdan önce resmi logo dosyasını Naga'dan isteyin.** Gelince `assets/brand/` içindeki SVG'lerle değiştirin; `npm run mockups && npm run pdf` ile görseller ve PDF yenilenir (videolar için `npm run video`).
- Renkler logodan alındı: siyah `#0B0B0D`, altın `#CFA752` (gradyan `#F1DA9C → #9C772C`), beyaz/fildişi. Kesin kurumsal renk kodları Naga'dan teyit edilmeli. Tüm değerler [`assets/css/tokens.css`](assets/css/tokens.css) içinde.
- Yazı tipleri: **Fraunces** (başlıklar) + **Manrope** (arayüz, rakamlar). İkisi de SIL Open Font License; Türkçe karakterleri ve ₺ işaretini içerir. Lisanslar `assets/fonts/` içinde.

## HyperFrames ile video üretimi

Kurulum, resmi Claude Code plugin yöntemiyle yapıldı:

```bash
claude plugin marketplace add heygen-com/hyperframes
claude plugin install hyperframes@hyperframes     # plugin 0.8.137, CLI 0.8.137 (latest)
```

Plugin kurallarına göre (`skills/hyperframes/references/plugin-installation.md`) skill'ler plugin paketinden okundu ve CLI, plugin başlatıcısıyla çalıştırıldı (`npx hyperframes skills update` plugin kurulumunda kullanılmıyor; güncelleme plugin yöneticisinden yapılır). Kurulumun yapıldığı oturumda skill menüsü yeniden yükleme gerektirdiği için `/hyperframes:hyperframes` doğrudan çağrılamadı; aynı skill dosyaları okunarak akış adım adım izlendi.

Akış: **PLAN → COMPOSE → ANIMATE → LINT → PREVIEW → ITERATE → RENDER**

| Proje | Rota / blueprint | Kontrol | Çıktı |
| --- | --- | --- | --- |
| [`hyperframes/naga-vip-demo`](hyperframes/naga-vip-demo) | `/general-video` · `device-surface-showcase` (stepwise-flow) | `hyperframes check` geçti — 0 hata, 78/78 metin WCAG AA | 18,0 sn · 540 kare · H.264 |
| [`hyperframes/naga-admin-loop`](hyperframes/naga-admin-loop) | `/general-video` · `cursor-ui-demo` | `hyperframes check` geçti — 0 hata, 324/324 metin WCAG AA | 9,0 sn · 270 kare · H.264 |

- Her projede `BRIEF.md` (otonom mod: `flow: automation`, `storyboard: no`) ve demo için `STORYBOARD.md` var.
- Kompozisyonlar sahnelere bölündü (`compositions/naga-bg|title|stage|outro.html`); tek duraklatılmış GSAP timeline, tüm metin durumları zamana bağlı (seek-safe); `Date.now()` / rastgelelik / ağ erişimi yok.
- GSAP ve fontlar projeye yerel olarak eklendi (`assets/vendor`, `assets/fonts`); render ağ bağlantısı gerektirmez.
- Snapshot ile kritik kareler incelendi; demo projesinde Studio önizlemesi (`hyperframes preview --background`) açılıp HTTP 200 ile doğrulandı; ardından render alındı ve MP4 ffprobe ile doğrulandı.

## Yeniden üretme

```bash
npm install                 # playwright (mockup ve PDF için)
npm run logo                # logo SVG'leri (python3 + fonttools)
npm run mockups             # mockups/src/*.html → mockups/*.png
npm run pdf                 # presentation → exports/NAGA-VIP-Sunum.pdf + exports/slides/*.png
npm run check:video         # iki HyperFrames projesinin kontrolü
npm run video               # demo-video/naga-vip-demo.mp4
npm run video:admin         # demo-video/naga-admin-panel-loop.mp4
```

Betikler Chromium'u `/opt/pw-browsers/chromium` yolundan çalıştırır; başka bir makinede bu yolu `scripts/*.mjs` içinde kendi Chrome/Chromium yolunuzla değiştirin.

## Klasör yapısı

```
naga-vip-presentation/
├── presentation/   sunum (index.html + deck.css)
├── mockups/        PNG mockup'lar · src/ altında HTML kaynakları
├── hyperframes/    naga-vip-demo (18 sn demo) · naga-admin-loop (9 sn döngü)
├── demo-video/     MP4 + WebM + poster kareleri
├── assets/         tasarım token'ları, CSS, fontlar, Naga logo SVG'leri
├── exports/        PDF + slayt PNG'leri
├── scripts/        logo, mockup ve PDF üretim betikleri
└── README.md
```

## Naga'dan teyit edilecekler

- Resmi logo dosyası (SVG/PDF) ve kurumsal renk kodları
- Şube çalışma saatleri ve rezervasyon için uygun saat aralıkları
- İşlem limitleri, VIP müşteri tanımı, kur ve onay kuralları
- Kur rezervasyonu / kilitleme yapılıp yapılmayacağı ve koşulları
