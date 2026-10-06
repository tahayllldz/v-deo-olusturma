// Brand configuration.
//
// The official Naga Exchange logo was shown to us but no source file was
// available while building this project, so every deliverable uses a
// TYPOGRAPHIC wordmark ("NAGA / EXCHANGE") instead of an approximation of the
// real monogram.
//
// To use the official logo:
//   1. Put the original file at  promo-video/public/brand/naga-logo.png
//      (transparent PNG or SVG, gold N + white wordmark, as supplied by Naga)
//   2. Set OFFICIAL_LOGO below to "brand/naga-logo.png" (or .svg)
//   3. Re-run the exports (see naga-vip/README.md)
export const OFFICIAL_LOGO: string | null = null;

export const BRAND = {
  company: "Naga Exchange",
  location: "İskele / KKTC",
  product: "NAGA VIP",
  slogan: "Döviz işlemini müşteriniz gelmeden hazırlayın.",
  tagline: "Müşteriniz gelsin. İşlemi hazır olsun.",
  studio: "Beta Studio",
  studioLine: "Digital Growth & Technology Studio",
} as const;
