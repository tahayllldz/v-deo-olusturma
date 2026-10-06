# Bileşen kütüphanesi

Tüm Reels'ler ve template'ler aynı üç dosyayı kullanır:

| Dosya | İçerik |
|---|---|
| `beta.css` | Renk token'ları, 3 tema (`bs-theme-paper / ink / signal`), tipografi, 14 UI bileşeninin stilleri |
| `beta.js` | `window.BS` — animasyon ve metin yardımcıları (seek-safe GSAP, deterministik) |
| `fonts.css` + `../fonts/` | Bricolage Grotesque, Instrument Serif, JetBrains Mono (OFL, Türkçe karakterli) |
| `blocks/bs-endcard.html` | Ortak end card alt kompozisyonu (`cta`, `theme` değişkenleri) |
| `gallery/` | Bileşenlerin canlı vitrini (HyperFrames projesi — `npx hyperframes preview` ile açın) |

**Kaynak burasıdır.** Projeler bu dosyaların kopyasını `system/` altında kullanır (HyperFrames proje dışına `../` ile erişmez). Burayı düzenledikten sonra `npm run sync` çalıştırın; `system/` klasörleri git'e girmez.

## Brief'teki 14 bileşen

| Bileşen | Sınıf (beta.css) | Yardımcı (beta.js) | Nerede görülür |
|---|---|---|---|
| **HookText** | `.bs-hook` (`--xl`, `--md`) | `BS.rich` + `BS.reveal(tl, el, at, "rise"\|"slam"\|"drop"\|"blur"\|"tilt"\|"pop")`, `BS.pick(v, "hook")` (A/B) | Tüm Reels, tüm template'ler |
| **KineticText** | `.bs-headline`, `.bs-support`, `.bs-serif`, `.bs-split` | `BS.split`, `BS.splitChars`, `BS.reveal`, `BS.exit`, `BS.marks` (kırmızı kalem altı çizgi) | reel-05, template A |
| **BrowserMockup** | `.bs-browser`, `__bar`, `__dots`, `__url`, `__close`, `__view` | `BS.wipe`, `BS.camera` | reel-01, reel-04, template B, C |
| **PhoneMockup** | `.bs-device`, `__screen`, `__island`, `__status`, `__bars` | `BS.slide`, `BS.camera` | reel-02, reel-03 |
| **DeviceFrame** | `.bs-device` (telefon), `.bs-browser` (masaüstü) — aynı gölge ve yarıçap sistemi | — | reel-03 |
| **Dashboard** | `.bs-dash`, `__head`, `__row`, `.bs-avatar`, `.bs-pill(--ok/--pen)` | `BS.count`, `BS.sequence` | reel-03 (CRM) |
| **ChatBubble** | `.bs-chat`, `.bs-bubble--in/--out/--ai`, `__meta`, `.bs-typing(--out)` | `BS.bubble`, `BS.type`, `BS.blink` | reel-03 |
| **Notification** | `.bs-notif`, `__icon`, `__head`, `__title`, `__body` | `BS.drop` | reel-01, reel-03, template B |
| **CTA** | `.bs-cta`, `__arrow`; end card: `.bs-endcard__cta` | `BS.endcardInto`, `blocks/bs-endcard.html` | Her videonun sonu |
| **Logo** | `.bs-lockup` (tipografik), `.bs-brand-logo` (resmî dosya), `.bs-caret` | `BS.endcardInto` (logo varsa onu kullanır) | End card |
| **ProgressBar** | `.bs-progress > i`, `.bs-ticks` / `.bs-tick` (bölüm göstergesi) | `BS.chrome` | Tüm videolar, template D |
| **MetricCard** | `.bs-metric`, `__label`, `__value`, `.bs-num` | `BS.count`, `BS.fmt` (tr-TR sayı biçimi) | reel-02, template D |
| **BeforeAfter** | `.bs-ba`, `__layer`, `__divider`, `__knob`, `__tag` | `BS.wipe` | reel-04, template C |
| **Cursor** | `.bs-cursor`, `__label(--left/--accent)`, `.bs-ripple` | `BS.cursorSVG`, `BS.cursorPath`, `BS.click` | reel-01, reel-04, template B |

Ek parçalar: `.bs-chip`, `.bs-check`, `.bs-tag` (seri etiketi), `.bs-handle`, `.bs-ghost` (dev arka plan rakamı), `.bs-dots` (nokta ızgara), `.bs-mark` / `.bs-pen` (kalem işaretleri).

## Metin işaretleme (`BS.rich`)

Tüm içerik metinleri aynı işaretlemeyi kullanır — kod değiştirmeden vurgu yapılır:

| Yazım | Sonuç | Kullanım |
|---|---|---|
| `*kelime*` | Instrument Serif italik | İnsan sesi — karede tek vurgu |
| `_kelime_` | Vurgu rengi (kobalt) | Cevap / çözüm |
| `~kelime~` | Kırmızı kalemle elle çizilmiş alt çizgi | Sorun |
| `^kelime^` | Kırmızı metin | Sorun (çizgisiz) |
| `a\|b` | Satır kır | Hook ve başlıklar |

## Kalem işaretleri (`BS.pen`)

`BS.pen(container, kind, {x, y, w, h}, {fix, thin, seed})` → SVG path, `BS.draw(tl, path, at, dur)` ile çizilir.
Şekiller: `circle`, `underline`, `strike`, `slash`, `cross`, `scribble`, `check`, `bracket`, `box`, `arrowDown`.
Kural: **kırmızı = sorun** (`fix: false`), **kobalt = çözüm** (`fix: true`). Asla yer değiştirmez.

## Animasyon sözleşmesi

- Her yardımcı, duraklatılmış HyperFrames zaman çizelgesine **mutlak zamanda** tween ekler; geriye/ileriye sarma güvenlidir (`fromTo`, açık başlangıç durumları).
- Rastgelelik yok: `BS.rand(seed)` (mulberry32) — aynı içerik her render'da aynı kareyi üretir.
- Zamana bağlı metin (`BS.type`, `BS.count`, `BS.sequence`, `BS.blink`) tek bir `BS.clock(tl, süre)` sürücüsünden hesaplanır.
- `.clip` elemanları tween edilmez; letter-spacing tween edilmez (glif dağılımı `x` ile yapılır).
- Alt kompozisyon içinde değişkenler `BS.vars(window.__hyperframes)` ile okunur (her örnek kendi değerini alır).

## Renkler

Logodan türetildi (resmî hex kodları verilmediği için — varsa `beta.css` başındaki `:root` değerlerini değiştirin, tüm videolar güncellenir):

| Token | Hex | Rol |
|---|---|---|
| `--bs-ink` | `#0A0C16` | Logonun lacivert-siyah sahnesi; hot take, gece, payoff, end card |
| `--bs-paper` | `#F2F0EB` | Eğitim içeriklerinin sıcak zemini |
| `--bs-signal` | `#4045E6` | "Cevap" rengi (B işaretinin mavi-moru) |
| `--bs-redpen` | `#C9331D` | "Sorun" rengi |
| `--bs-iris` | `#4C6BFF → #8B5CF6 → #E05FC4 → #FF8A4C` | B işaretinin gradyanı — **sadece küçük şekiller** (caret, etiket noktası, bölüm çizgileri, end card ışığı), asla metin |
