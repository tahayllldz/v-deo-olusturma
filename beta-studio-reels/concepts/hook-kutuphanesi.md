# Hook kütüphanesi

İlk 2 saniye videonun kaderini belirler. Bu dosya, Beta Studio Reels'lerinde kullanılan hook kalıplarını, her videonun A/B çiftini ve test sonuçlarının işleneceği kaydı tutar. Kazanan kalıplar buraya yazılır; bir sonraki video buradan başlar.

## Hook yazma kuralları

1. **≤ 7 kelime, en fazla 4 satır.** Satırı `|` ile böl; her satır bir vuruş.
2. **Okuyan kişi kendini görmeli.** "Siteniz", "müşteriniz", "takipçiniz" — genel "işletmeler" değil.
3. **Somut ol.** "Cuma 20:30", "23:47'de gelen mesaj" → soyut "dijital dönüşüm"den güçlü.
4. **Rakam yalnızca gerçekse.** Uydurma istatistik yok. Örnek hesap kullanılıyorsa ekranda "örnek" yazmalı.
5. **Vurgu tek kelime.** `*serif*` (insan sesi) veya `~kırmızı kalem~` (sorun) — ikisi birden değil.
6. **Clickbait yok.** Hook'un vaat ettiğini video 15 saniyede ödemeli.
7. **Görsel de hook'tur.** Metin + ilk karedeki görüntü (bozuk site, sessiz telefon, kırmızı daire) birlikte çalışır.

## A/B sistemi

Her video iki hook ile üretilir; görsel sistem ve video gövdesi aynı kalır, sadece ilk 2–3 saniye değişir.

| Varyant | Yaklaşım | Ne zaman kazanır |
|---|---|---|
| **A — problem önce** | İzleyicinin yaşadığı sorunu adlandırır. "Web siteniz müşterileri kaçırıyor olabilir." | Hedef kitle sorunu zaten hissediyorsa; kaydetme odaklı eğitim içerikleri. |
| **B — tartışmalı** | Yaygın bir inancı ters çevirir. "Takipçi sayınız geliriniz değil." | Paylaşım ve yorum hedeflenen içerikler; takipçi olmayanlara erişim. |

Render: `npm run ab -- reel-01-website` → `renders/ab/reel-01-website-A.mp4` ve `-B.mp4`.
Template'lerde: `npm run template -- a content/example.json --variant B`.

Yeni hook eklemek için kompozisyonun `<html data-composition-variables>` listesindeki `hookA` / `hookB` varsayılanını değiştirin (ya da template'te içerik dosyasındaki `hookA` / `hookB` alanını). Kod değişmez.

## Kalıplar

| Kalıp | A — problem önce | B — tartışmalı |
|---|---|---|
| Kayıp korkusu | Bu 3 hata varsa siteniz müşteri kaybettiriyor. | Siteniz size para kaybettiriyor olabilir. |
| Gizli bilgi | Site yaptırırken kimse bunu söylemiyor. | Ajansınız bunu size söylemeyecek. |
| Ters köşe | Her işletmenin uygulamaya ihtiyacı yok. | Uygulama yaptırmayın. Henüz. |
| "Ama" sorusu | Instagram'ınız güzel. Ama neden satmıyor? | Beğeni satış değildir. |
| Rakip | Rakibiniz sizden daha iyi değil. | Rakibiniz sadece daha kolay bulunuyor. |
| Test | 5 saniyede sitenizi test edelim. | Bu testi geçemiyorsanız siteniz çalışmıyor. |
| Yeniden çerçeveleme | WhatsApp'ınız aslında bir CRM olabilir. | Mesaj kutunuz bir satış hunisidir. |
| Sahne | Cuma 20:30. Telefon susmuyor. | 23:47. Bir müşteri yazdı. Cevap yok. |
| Örnek hesap | 100 kişi sitenize girdi. Kaçı yazdı? | Trafik sorununuz yok. Kayıp var. |
| Sebep | İnsanlar bu yüzden sitenize girip çıkıyor. | Ziyaretçiniz sizi değil, sekmeyi kapatıyor. |
| Önce/Sonra | Aynı ürün. Biri daha çok güven veriyor. | Ürününüz iyi. Siteniz güven vermiyor. |
| Soru | "Bize de uygulama lazım mı?" | Uygulama yaptırmadan önce bunu dinleyin. |

## Yayındaki videoların hook çiftleri

| Video | Seri | A — problem önce | B — tartışmalı | Birincil KPI |
|---|---|---|---|---|
| reel-01-website | Bunu Yapma · 01 | Web siteniz müşterileri kaçırıyor olabilir. | Siteniz güzel olabilir. Ama işe yaramıyor olabilir. | Kaydetme |
| reel-02-social | Dijital Gerçekler · 02 | Takipçiniz çok olabilir. Ama müşteriniz? | Takipçi sayınız geliriniz değil. | Paylaşım |
| reel-03-ai | AI ile 30 Saniye · 03 | İşletmeniz için AI kullanmanın en basit yolu bu. | Geç verilen cevap, aslında cevapsızlıktır. | Yorum |
| reel-04-redesign | Önce / Sonra · 04 | Aynı işletme. Aynı ürün. Ama biri daha çok güven veriyor. | Ürününüz iyi. Ama siteniz güven vermiyor. | Tekrar izleme |
| reel-05-hot-take | Dijital Gerçekler · 05 | Her işletmenin mobil uygulamaya ihtiyacı yok. | Uygulama yaptırmayın. (Henüz.) | Paylaşım |

## Test kaydı

Her yayından 72 saat sonra Instagram Insights'tan doldurun (aynı veriyi videonun `metadata.json` → `results` alanına da yazın).

| Tarih | Video | Varyant | Kapak | 3 sn tutma | Ort. izlenme | Tamamlanma | Kaydetme | Paylaşım | Kazanan | Not |
|---|---|---|---|---|---|---|---|---|---|---|
| | | | | | | | | | | |

**Karar kuralı:** 3 sn tutma farkı ≥ 5 puan ve ortalama izlenme süresi aynı yönde ise kazanan kalıp bir sonraki 3 videoda varsayılan olur. Fark daha küçükse sonuç "eşit" sayılır ve iki kalıp dönüşümlü kullanılır.
