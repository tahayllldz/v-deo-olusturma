---
message: "Müşteri gelmeden işlem hazır."
audience: "Naga Exchange işletme sahibi"
mode: autonomous
duration: 18
canvas: 1920x1080
---

# NAGA VIP — 18 sn ürün demosu

Blueprint: `device-surface-showcase` → **stepwise-flow** varyantı (Product_Intro).
Telefon kahraman yüzey olarak sağda sabit durur; ekranlar gerçek akışla ilerler; solda adım başlığı
değişir (`discrete-text-sequence`); buton basışları `press-release-spring`; onay anında kısa kamera
itişi (`multi-phase-camera`); onay halkası `svg-path-draw`; kapanışta yüzey çıkar, başlık kartı gelir.

## Frame 1 — Açılış başlığı
status: built · src: index.html#title-card · 0.0–2.6s
NAGA monogramı + "NAGA VIP" + "Döviz işlemini müşteriniz gelmeden hazırlayın." Kart solar, telefon gelir.

## Frame 2 — Ana ekran
status: built · src: index.html#stage · 2.2–4.6s
Telefon aşağıdan büyük gelir ve oturur (stepwise-flow surface arrive). Güncel kurlar (DEMO).
"İşlem Oluştur" butonuna dokunma (tap ripple + press dip) → ekran yana kayar.

## Frame 3 — Para birimi
status: built · 4.6–6.6s · Bozdur + GBP → TRY vurgusu. Başlık: "01 Para birimini seçer."

## Frame 4 — Miktar ve tahmini tutar
status: built · 6.6–9.0s · Rakamlar tek tek yazılır: 10.000 GBP. Tahmini tutar sayarak ₺649.500'e çıkar.
Not: "Gösterilen kur bilgilendirme amaçlıdır."

## Frame 5 — Şube ve saat
status: built · 9.0–11.2s · Naga Exchange — İskele seçilir, 16:30 çipi seçilir, onay işaretleri belirir.

## Frame 6 — Rezervasyon oluştur
status: built · 11.2–12.7s · Buton basılır, "Oluşturuluyor" spinner, kısa kamera itişi.

## Frame 7 — Onay
status: built · 12.7–15.4s · Onay halkası çizilir, "Rezervasyonunuz oluşturuldu.", NGR-1042, bilet satırları.
Solda mini Naga paneli kartı: #1042 NEW → PREPARING ("Naga hazırlamaya başlar").

## Frame 8 — Kapanış
status: built · src: index.html#outro · 15.3–18.0s
Telefon çıkar. NAGA VIP · "Müşteri gelmeden işlem hazır." · Beta Studio · DEMO notu.
