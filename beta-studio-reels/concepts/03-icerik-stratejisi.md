# Beta Studio — Instagram Reels İçerik Stratejisi

## 1. Konumlandırma

Hesap bir "hizmet vitrini" değil, **KKTC'nin dijital büyüme medyası**.

- İzleyicinin düşüncesi: ~~"Bunlar web sitesi yapan adamlar."~~ → **"Bunlar işletmelerin dijital olarak nasıl büyüyeceğini bilen insanlar."**
- Akış: **ATTENTION → VALUE → TRUST → FOLLOW → INQUIRY → CLIENT**
- Ses tonu: samimi + sıcak + zeki + yaratıcı + profesyonel. "Siz" hitabı, ama resmî değil; kahve içerken anlatan akıllı bir dost.

### Ses tonu kuralları

| Yap | Yapma |
|---|---|
| Somut sahne kur: "Cuma 20:30, telefon susmuyor." | "Dijital dönüşüm yolculuğunuzda yanınızdayız." |
| Tek fikir, tek video | Beş hizmeti tek videoya sığdırmak |
| Problemi izleyicinin diliyle söyle | Jargon: "conversion funnel optimizasyonu" |
| Kendinle dalga geçebil: "Evet, bunu bir yazılım şirketi söylüyor." | "Sektörün lideri", "en iyi ajans" |
| Rakam yoksa rakam uydurma; genel doğruyu söyle | Kaynaksız istatistik |
| Soft CTA (kaydet, yorumla, takip et) | Her videoda "hemen bizi arayın" |

## 2. İçerik karışımı (başlangıç)

| Tür | Oran | Haftada (3 Reels) | Amaç |
|---|---|---|---|
| Education (+ Business Psychology) | %50 | 1–2 | Kaydetme, otorite |
| Hot Take / Entertainment | %20 | ~1 / 2 hafta | Erişim, yorum, paylaşım |
| Behind the Scenes | %15 | ~2 / ay | İnsanileştirme, güven |
| Case Study / Before-After | %10 | ~1 / ay | Kanıt, tekrar izleme |
| Direct Offer | %5 | ~1 / ay | DM başlatma |

Performans verisi geldikçe (en az 12 Reels sonra) oranlar yeniden ayarlanır — bkz. §6.

## 3. Seriler

| Seri | Format | Ritim | Template |
|---|---|---|---|
| **KKTC İşletme Doktoru** | Her bölüm bir sektörün tek bir dijital problemi | 2 haftada 1 | B / E |
| **30 Saniyede Dijital** | Bir kavram, 30 saniyede | Haftada 1 | A / B |
| **Bunu Yapma** | İşletmelerin yaptığı dijital hatalar | 2 haftada 1 | B / D |
| **Beta Breakdown** | Örnek bir site/profil analizi (izinli veya sentetik) | Ayda 2 | B / C |
| **Dijital Gerçekler** | Yanlış bilinenler, hot take'ler | 2 haftada 1 | A / D |
| **AI ile 30 Saniye** | İşletmenin AI ile yapabileceği tek şey | 2 haftada 1 | B |
| **Önce / Sonra** | Dönüşüm (izinli müşteri işi veya sentetik) | Ayda 1 | C |

Seri etiketi her videonun sol üstünde (`.bs-tag`) görünür: izleyici seriyi tanır, profilde "devamı var" beklentisi oluşur.

## 4. Format rotasyonu (AI sesiyle doldurmamak için)

1. **Kinetic typography** (sessiz anlatım, müzik + SFX) — Template A
2. **UI-only** (ekran hikâyesi, metin destekli) — Template B / C / D
3. **Voiceover** — ekipten gerçek bir sesle kaydedilmesi önerilir; template'lerde `vo` ses kanalı hazır
4. **Talking-head** — Template E'de kamera alanı hazır; ekipten biri telefonla dikey çeker
5. **Hybrid** — talking-head + UI overlay

Kural: art arda iki video aynı formatta yayınlanmaz.

## 5. Video anatomisi

| Zaman | Bölüm | Kural |
|---|---|---|
| 0–2 sn | HOOK | Hareket 0.1 sn'de başlar. Ekranın %60–80'ini kaplayan tipografi. Soru ya da iddia. |
| 2–6 sn | PROBLEM | İzleyicinin kendini görmesi. Somut sahne. |
| 6–12 sn | INSIGHT / ÇÖZÜM | Tek fikir. Görsel kanıt. |
| 12–16 sn | PAYOFF | Akılda kalan cümle (Instrument Serif italik vurgu). |
| Son 1.5–2 sn | Soft CTA + mini end card | "Kaydedin", "Yorumlara yazın", "Takipte kalın". |

**Instagram güvenli alanı (1080×1920):** üstte ~220 px (Reels başlığı), altta ~420 px (açıklama, kullanıcı adı, ses), sağda ~150 px (beğeni/yorum/paylaş). Ana mesaj daima `y: 250–1500`, `x: 72–930` arasında. `check` komutunda alt bant `--caption-zone` ile otomatik denetlenir.

## 6. KPI sistemi

Ana KPI görüntülenme **değil**. Her video için `metadata.json` içinde hipotez yazılır ve 7 gün sonra şu metrikler girilir:

| Metrik | Ne söyler? | Hedef (ilk 30 gün, başlangıç tahmini) |
|---|---|---|
| 3-saniye tutma (3-second hold) | Hook çalışıyor mu? | Hesap ortalamasının üstü |
| Ortalama izlenme süresi | Tempo doğru mu? | Video süresinin ≥ %60'ı |
| Tamamlanma oranı | Hikâye yapısı | ≥ %35 (15–20 sn videolar) |
| Tekrar izleme | Yoğunluk / before-after etkisi | Before/After ve test formatlarında yüksek olmalı |
| Kaydetme | Değer | Education videolarının ana KPI'ı |
| Paylaşım | Konuşulabilirlik | Hot take ve psychology videolarının ana KPI'ı |
| Yorum | Topluluk | CTA'sı soru olan videolarda |
| Profil ziyareti | Merak | Her videoda |
| Takip | Vaat | Profil ziyaretine oranı |
| DM başlatma | Talep | Offer ve AI videolarında |

> Hedef sayılar başlangıç tahminidir, gerçek veriyle ilk ayın sonunda güncellenmelidir.

**Haftalık rutin (30 dk):** Insights → `metadata.json` içindeki `results` alanını doldur → `hypothesis` doğrulandı mı? → bir sonraki haftanın 3 videosunun hook'larını buna göre seç.

## 7. A/B hook testi

Her reel kompozisyonu hook metnini **değişken** olarak alır (`hookVariant` + `hookA_*` / `hookB_*`). Aynı görsel sistemle iki versiyon tek komutla üretilir:

```bash
npm run ab -- reel-01-website
# → renders/ab/reel-01-website-A.mp4 ve -B.mp4
```

- **A — Problem-first:** "Web siteniz neden müşteri getirmiyor?"
- **B — Controversial:** "Web siteniz güzel olabilir. Ama işe yaramıyor olabilir."

Test yöntemi: A'yı yayınla; 2–3 hafta sonra B'yi farklı kapakla yeniden yayınla ya da Instagram'ın deneme (trial) Reels özelliğiyle takipçi olmayanlara göster. Karşılaştırma metriği: **3-saniye tutma** ve **ortalama izlenme süresi**. Kazanan hook kalıbı `concepts/hook-kutuphanesi.md` dosyasına işlenir.

## 8. Hook kütüphanesi (kalıplar)

| Kalıp | Örnek |
|---|---|
| Kayıp korkusu | "Bu 3 hata varsa web siteniz size müşteri kaybettiriyor." |
| Gizli bilgi | "Kimse size bunu web sitesi yaptırırken söylemiyor." |
| Ters köşe | "Her işletmenin mobil uygulamaya ihtiyacı yok." |
| Ama sorusu | "Instagram hesabınız güzel. Ama neden satış yapmıyor?" |
| Rakip | "Rakibiniz sizden daha iyi değil." |
| Test | "5 saniyede web sitenizi test edelim." |
| Yeniden çerçeveleme | "Şirketinizin WhatsApp'ı aslında bir CRM olabilir." |
| Sahne | "Cuma 20:30. Telefon susmuyor." |
| Sayı | "Bir müşterinin size ulaşmadan önce yaptığı 3 şey var." |
| Sebep | "Bu yüzden insanlar web sitenize girip çıkıyor." |

## 9. Yayın ve topluluk

- Haftada 3 Reels (Salı / Perşembe / Cumartesi), 19:30–21:00 arası test edilerek başlanır.
- Yorumlara ilk 60 dakikada cevap. Sorulan her iyi soru = bir sonraki video fikri ("Yorumdan gelen soru" serisi).
- Kapak: profil ızgarasında 3:4 kırpılır → başlık her zaman merkez 1080×1440 alanında (`thumbnails/`).
- Açıklama metni: 1 cümle değer + 1 soru + 3–5 hashtag (#kktc #lefkoşa #girne #dijitalpazarlama #işletme). Hashtag yığını yok.
- Ayda 1 kez gerçek ekip yüzü (talking-head) zorunlu.
