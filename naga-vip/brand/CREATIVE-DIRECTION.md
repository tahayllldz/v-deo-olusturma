# NAGA VIP — Creative Direction

**Ürün:** NAGA VIP · **Müşteri:** Naga Exchange (İskele / KKTC) · **Hazırlayan:** Beta Studio

## 1. Konumlandırma

> "Bir mobil uygulama yaptık" **değil**:
> **Naga'nın VIP müşterilerinin döviz işlemlerini şubeye gelmeden önce planlayabildiği yeni bir müşteri deneyimi.**

Ürün tipi: **Customer Experience + Reservation System**. Her çıktıda önce işletme değeri, sonra özellikler.

- Ana slogan: **Döviz işlemini müşteriniz gelmeden hazırlayın.**
- Kapanış / ana mesaj: **Müşteriniz gelsin. İşlemi hazır olsun.**
- Hikâye omurgası: **Ahmet**, İskele'de yaşıyor, **10,000 GBP** bozduracak → uygulamadan İskele şubesi + 16:30 seçer → Naga işlemi önceden hazırlar → Ahmet geldiğinde işlem hazır.

## 2. Marka araştırması — bulgular

| Konu | Bulgu | Kullanım |
|---|---|---|
| Logo | Müşteri sohbette gösterdi: siyah zemin, **altın geometrik "N" monogram**, beyaz kalın **NAGA**, aralıklı **EXCHANGE LTD**. Dosya bu ortama ulaşmadı; Instagram (@naga_exchange_) ağ politikası nedeniyle açılamadı. | Logo **yeniden çizilmedi**. Tüm çıktılarda tipografik **NAGA / EXCHANGE** wordmark kullanıldı. Orijinal dosya `promo-video/public/brand/` içine konup `src/brand.ts` → `OFFICIAL_LOGO` ile tek satırda devreye alınır. |
| Renkler | Logodan: siyah + metalik altın + beyaz. | Palet aşağıda. |
| Tipografi | Logo wordmark'ı kalın, geometrik sans. | Montserrat (display) + Inter (UI). İkisi de OFL lisanslı, projeye gömülü. |
| İşletme | Web aramasında Naga Exchange Ltd, KKTC'de İskele/Yeni İskele ve Gazimağusa bölgelerinde döviz bürosu olarak listeleniyor (kaynak sayfa bu ortamdan açılamadı). | Sadece İskele kullanıldı. Çok şube = Faz 4. |
| Karıştırılmaması gereken | **NAGA Group / naga.com** (Almanya merkezli trading/kripto şirketi) ve **nagaexchange.co.id** (Endonezya kripto) **farklı şirketler**. | Hiçbir görsel/bilgi bunlardan alınmadı. |

Gerçek kur, işlem limiti, VIP seviyesi, çalışma saati, komisyon, rezervasyon politikası ve şube adresi **bilinmiyor** → tüm ekranlarda **DEMO** veri ve etiketi.

## 3. Görsel dil

**Fintech, ama banka kadar soğuk değil.** Hissiyat: güven + hız + VIP.

| Token | Hex | Rol |
|---|---|---|
| Ink | `#08080A` | Ana zemin (logodaki siyah) |
| Surface | `#16161A` / `#1E1E23` | Kartlar |
| Gold | `#CDA652` | Vurgu, CTA, marka |
| Gold light | `#EED597` | Altın metin, rakamlar |
| Gold deep | `#8C6A27` | Altın gradyan sonu |
| Ivory | `#F7F2E8` | Sıcak beyaz başlıklar |
| Muted | `#A3A1AA` | İkincil metin |
| Green | `#3FCB8E` | READY / hazır |
| Blue | `#78A2FF` | PREPARING |

- Altın, düz renk yerine **yumuşak metalik gradyan** (`#F3DDA2 → #D7B062 → #B98D3C → #8C6A27`).
- Zemin: siyah üstünde **sıcak altın ışık havuzları** + çok hafif grid + vinyet. Neon, glitch, cyberpunk **yok**.
- Tek görsel motif: **altın çerçeveli koyu kart** + altın ikon dairesi.
- Telefon mockup'ları büyük ve gerçekçi (iPhone + Android benzeri çerçeve), admin panel tarayıcı penceresinde.

## 4. Tipografi

- **Montserrat 800** — başlıklar, büyük rakamlar, wordmark.
- **Inter 400–800** — uygulama UI'ı, panel, gövde metni.
- Video: başlık 96–132 px (yatay), 84–118 px (dikey). Sunum: başlık 76–132 px, gövde 26–38 px.

## 5. Hareket (motion)

- Smooth, premium, hızlı: `Easing.bezier(0.16, 1, 0.3, 1)` girişler, `(0.65, 0, 0.35, 1)` kamera.
- Kelime kelime metin girişi (fade + rise + blur→net).
- Telefon tek, kesintisiz plan (S1–S6): uygulama içi gezinme iOS "push" geçişi ile; kamera önemli alanlara yumuşak zoom yapar.
- Bölüm geçişleri: **altın metalik swoosh** (promo-video-skill metallic swoosh, altına uyarlanmış; clipPath yok).
- Yasak: sarsıntı, sahne döndürme, 3D geçişler.

## 6. Video anlatısı — Demo First + Transformation

| # | Süre | Sahne | Ekranda | Ses |
|---|---|---|---|---|
| S1 | 0–2.8 s | Hook | "Müşteriniz gelmeden..." + NAGA VIP açılış ekranı | VO, whoosh |
| S2 | 2.8–6.0 | Söz | "...işlemi hazır olsun." Uygulama açılır | VO, shimmer |
| S3 | 6.0–9.7 | Döviz + miktar | GBP, tuş takımıyla 10,000 | VO, tuş sesleri |
| S4 | 9.7–12.6 | Alacağı tutar | TRY, ₺649,500 sayaç + DEMO RATE | VO, shimmer |
| S5 | 12.6–16.4 | Şube + saat | Naga Exchange — İskele, 16:30 | VO, click |
| S6 | 16.4–21.0 | Rezervasyon | Özet → tek dokunuş → CONFIRMED #NGR-1042 | VO, onay sesi |
| S7 | 20.6–25.6 | Naga paneli | £10,000 NEW → PREPARING → READY | VO, bildirim, click |
| S8 | 25.2–29.2 | Müşteri gelir | "Rezervasyonunuz hazır ✓ / Your reservation is ready" | VO, bildirim |
| S9 | 28.8–32.4 | Mesaj | Daha hızlı. Daha kolay. Daha VIP. (iPhone + Android) | VO |
| S10 | 32.0–37.0 | CTA | NAGA VIP — Müşteriniz gelsin. İşlemi hazır olsun. — Beta Studio | VO, shimmer |

Toplam **37 s** (30–45 s aralığı), sahneler 2.8–4.6 s.

## 7. Ses

- **Voiceover:** sıcak + kendinden emin, reklamcı olmayan doğal Türkçe. Hedef: ElevenLabs **Matilda** (`eleven_multilingual_v2`), duygu presetleri: hook/kapanış *warm*, adımlar *confident*.
- **Müzik:** "Inspired Ambient" (promo-video-skill ile gelen, Pixabay lisanslı) — konuşma yokken ~0.22, konuşma altında ~0.08'e iner (ducking).
- **SFX:** yumuşak whoosh, click, tuş, bildirim, onay chime'ı, shimmer — `scripts/make-sfx.py` ile sentezlendi (üçüncü taraf örnek yok).
- **Mastering:** −14 LUFS (Instagram / Reels / WhatsApp hedefi).

## 8. Dürüstlük kuralları

- Kurlar **DEMO RATE** etiketli; Naga'nın gerçek fiyatı gibi sunulmaz.
- "Kur kilitleme" vaat edilmez: ilk sürümde **Rate Reservation** (tahmini kur gösterimi). Kurun kesin kilitlenmesi (Rate Lock) ve geçerlilik süresi Naga'nın operasyonel ve yasal kurallarına göre belirlenir.
- VIP+ özellikleri (kur alarmı, VIP seviyeleri, CRM, WhatsApp, analytics, loyalty) ilk sürümün parçası olarak gösterilmez.
- Rakamsal başarı iddiası (ör. "%40 daha hızlı") yok.
