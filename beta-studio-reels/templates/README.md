# Video template'leri

Beş template, beş farklı format. Her biri tek bir HyperFrames projesidir; **yeni video = yeni içerik dosyası (JSON)**. HTML'e dokunmanız gerekmez.

| | Template | Süre | Ne için | Referans Reel |
|---|---|---|---|---|
| **A** | `template-a-kinetic` — Kinetic typography | 15 sn | Hot take, işletme psikolojisi, "Dijital Gerçekler" | reel-05-hot-take |
| **B** | `template-b-ui-demo` — Tarayıcıda anlatımlı demo | 18 sn | "30 Saniyede Dijital", site/randevu/huni ipuçları | reel-01-website |
| **C** | `template-c-before-after` — Önce/Sonra | 16 sn | Redesign, profil/menü/logo dönüşümü | reel-04-redesign |
| **D** | `template-d-data` — Veri hikâyesi | 17 sn | Huni, dönüşüm, KPI açıklamaları | reel-02-social |
| **E** | `template-e-story` — Konuşan kafa + altyazı | 20 sn | Kurucu bakışı, "KKTC İşletme Doktoru", kamera arkası | — (insan yüzü için) |

## Yeni video üretmek

```bash
cd beta-studio-reels
cp templates/template-a-kinetic/content/example.json templates/template-a-kinetic/content/benim-videom.json
# benim-videom.json içindeki metinleri düzenleyin
npm run template -- a content/benim-videom.json                 # → renders/templates/template-a-kinetic--benim-videom.mp4
npm run template -- a content/benim-videom.json --variant B     # B hook'u ile
npm run template -- a content/benim-videom.json --quality draft # hızlı önizleme render'ı
```

Canlı önizleme (Studio'da değişkenleri panelden değiştirerek):

```bash
cd templates/template-a-kinetic
npx hyperframes preview          # tarayıcıda Studio açılır
```

## İçerik dosyası kuralları

- Alan adları her template'in `index.html` dosyasının başındaki `data-composition-variables` listesinde tanımlıdır (Studio'da etiketleriyle görünür). Tanımsız alan render'ı durdurur (`--strict-variables`).
- Metin işaretleme: `*serif vurgu*`, `_kobalt_`, `~kırmızı kalem~`, `^kırmızı metin^`, `|` satır kır.
- Etiketli satırlar: `"ETİKET::Başlık"` (A'daki beat'ler, B'deki adımlar, D'deki kartlar ve çözüm).
- Listeler: `"a||b||c"`.
- Zamanlı satırlar (E): `"2.8|Altyazı||5.0|Sonraki altyazı"`.
- Rakamlar: ya kaynağı belli gerçek veri ya da ekranda "örnek" yazan örnek hesap. Uydurma istatistik yok.

### Template B — hedefler

`step1Target` … `step3Target`: `nav`, `headline`, `cta`, `float`, `cards`.
`stepNMark`: `problem` (kırmızı kalem dairesi) veya `fix` (kobalt kutu + tıklama).
`siteHeadlineFix` doluysa, başlığı hedefleyen ilk "problem" adımının sonunda başlık yeniden yazılır.
Tarayıcıdaki site **kurgusaldır** ve `site*` alanlarından üretilir — gerçek bir işletmenin ekran görüntüsü değildir.

### Template C — görseller

1. Görselleri `beta-studio-reels/assets/` altına koyun (örn. `assets/musteri-once.png`).
2. `npm run sync` (assets → her projede `system/assets/`).
3. İçerik dosyasında: `"beforeSrc": "system/assets/musteri-once.png"`, `"afterSrc": "system/assets/musteri-sonra.png"`.
4. Gerçek müşteri işi yalnızca **müşterinin izniyle**. `note` alanı ekranda karşılaştırma etiketi olarak görünür (örn. "Müşteri izniyle paylaşılmıştır" ya da "Temsili örnek").
5. `imageFit`: `cover` (dikey ekran görüntüleri için, yavaş kaydırır) veya `contain` (logo, tek kare).

### Template E — video

1. 9:16 dikey video, ≤ 20 sn → `assets/` → `npm run sync`.
2. `"videoSrc": "system/assets/benim-cekimim.mp4"`, `"placeholderNote": ""` (yer tutucu notunu kapatır).
3. Altyazıları videonun kendi zamanlamasına göre yazın. Videonun sesi kullanılır; müzik sesin altında düşük kalır.

## Süreyi değiştirmek

Her template'in başındaki yorum blokunda zaman çizelgesi yazar. Süre değişikliği üç yerde yapılır:

1. `index.html` → `#root` üzerindeki `data-duration="15"` ve müzik `<audio>`'nun `data-duration`'ı,
2. script içindeki `const T = { … }` sabitleri (bölümlerin başlangıç saniyeleri) ve `BS.clock(tl, 15)`,
3. müzik kesimi: `music/cuts.json` içindeki ilgili satırın `duration` / `fadeOutStart` (/ `offset`) değerleri → `npm run music:cuts` → `npm run sync`.

SFX `<audio>` satırlarının `data-start` değerleri de yeni zamanlara kaydırılmalıdır.

## Kalite kontrol

```bash
npm run check -- template-c      # lint + runtime + layout + kontrast + Instagram alt bölge kontrolü
```

`check` her template için varsayılan içerikle çalışır. Yeni içerik çok uzun metin içeriyorsa (taşma, üst üste binme) önce `--quality draft` render alıp kontrol edin; başlıkları 2 satırda, hook'u ≤ 4 satırda tutun.
