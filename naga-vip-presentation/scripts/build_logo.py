"""Builds the Naga Exchange logo SVGs used across the presentation, mockups and video.

The official logo file was not reachable from the build environment, so this is a
faithful vector redraw of the logo shown on Naga Exchange's Instagram profile
(@naga_exchange_): a gold geometric "N" monogram over a white "NAGA" wordmark and an
"EXCHANGE LTD" line, on black. Replace with the official vector when available:
drop it at assets/brand/naga-logo-official.svg (or .png) and point brand.css at it.

Run:  python3 -I scripts/build_logo.py   (from naga-vip-presentation/)
"""

from pathlib import Path

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parent.parent
FONTS = ROOT / "assets" / "fonts"
OUT = ROOT / "assets" / "brand"

GOLD_STOPS = [("0", "#F1DA9C"), ("0.45", "#CFA752"), ("1", "#9C772C")]


def text_path(text, font_file, size, tracking_em=0.0):
    """Return (svg_path_d, advance_width) for text set at `size` px, baseline at y=0."""
    font = TTFont(FONTS / font_file)
    glyph_set = font.getGlyphSet()
    cmap = font.getBestCmap()
    upm = font["head"].unitsPerEm
    scale = size / upm
    pen = SVGPathPen(glyph_set)
    x = 0.0
    for i, ch in enumerate(text):
        name = cmap[ord(ch)]
        glyph = glyph_set[name]
        tpen = TransformPen(pen, (scale, 0, 0, -scale, x, 0))
        glyph.draw(tpen)
        x += glyph.width * scale
        if i < len(text) - 1:
            x += tracking_em * size
    return pen.getCommands(), x


def gold_defs(gid):
    stops = "".join(f'<stop offset="{o}" stop-color="{c}"/>' for o, c in GOLD_STOPS)
    return (
        f'<linearGradient id="{gid}" x1="0" y1="0" x2="1" y2="1">{stops}</linearGradient>'
        + monogram_mask(f"{gid}Cut")
    )


# The monogram: a geometric N whose strokes carry a fine inline, like the original.
# Drawn on a 120 x 140 grid.
MONOGRAM_OUTER = "M8 132 V8 H38 L82 90 V8 H112 V132 H82 L38 50 V132 Z"
MONOGRAM_INLINE = "M23 140 V23 L97 117 V0"


def monogram_mask(mid):
    # The inline is cut out of the gold (transparent), so the mark sits on any background.
    return (
        f'<mask id="{mid}" maskUnits="userSpaceOnUse" x="0" y="0" width="120" height="140">'
        f'<rect width="120" height="140" fill="#fff"/>'
        f'<path d="{MONOGRAM_INLINE}" fill="none" stroke="#000" stroke-width="3.2"/>'
        f"</mask>"
    )


def monogram_group(gid, _cut_color=None, x=0, y=0, s=1.0):
    return (
        f'<g transform="translate({x} {y}) scale({s})">'
        f'<path d="{MONOGRAM_OUTER}" fill="url(#{gid})" mask="url(#{gid}Cut)"/>'
        f"</g>"
    )


def svg(width, height, body, defs, title):
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width:.1f} {height:.1f}" '
        f'width="{width:.0f}" height="{height:.0f}" role="img" aria-label="{title}">'
        f"<title>{title}</title><defs>{defs}</defs>{body}</svg>\n"
    )


def build_stacked(word_color, cut_color, bg=None, name="naga-logo-stacked"):
    gid = "nagaGold"
    naga_d, naga_w = text_path("NAGA", "manrope-latin-800-normal.woff2", 92, 0.06)
    ex_d, ex_w = text_path("EXCHANGE LTD", "manrope-latin-600-normal.woff2", 22, 0.42)
    width = max(naga_w, ex_w) + 40
    mono_s = 0.9
    mono_w = 120 * mono_s
    body = ""
    if bg:
        body += f'<rect width="100%" height="100%" fill="{bg}"/>'
    body += monogram_group(gid, cut_color, (width - mono_w) / 2, 10, mono_s)
    body += f'<path d="{naga_d}" fill="{word_color}" transform="translate({(width - naga_w) / 2:.2f} 236)"/>'
    body += f'<path d="{ex_d}" fill="{word_color}" transform="translate({(width - ex_w) / 2:.2f} 278)"/>'
    (OUT / f"{name}.svg").write_text(svg(width, 296, body, gold_defs(gid), "Naga Exchange Ltd"))


def build_horizontal(word_color, cut_color, name):
    gid = "nagaGoldH"
    naga_d, naga_w = text_path("NAGA", "manrope-latin-800-normal.woff2", 64, 0.06)
    ex_d, ex_w = text_path("EXCHANGE LTD", "manrope-latin-600-normal.woff2", 15.5, 0.42)
    mono_s = 0.62
    text_x = 120 * mono_s + 22
    width = text_x + max(naga_w, ex_w) + 4
    body = monogram_group(gid, cut_color, 0, 0, mono_s)
    body += f'<path d="{naga_d}" fill="{word_color}" transform="translate({text_x:.2f} 56)"/>'
    body += f'<path d="{ex_d}" fill="{word_color}" transform="translate({text_x + 2:.2f} 84)"/>'
    (OUT / f"{name}.svg").write_text(svg(width, 88, body, gold_defs(gid), "Naga Exchange Ltd"))


def build_monogram(cut_color, name):
    gid = "nagaGoldM"
    body = monogram_group(gid, cut_color, 0, 0, 1)
    (OUT / f"{name}.svg").write_text(svg(120, 140, body, gold_defs(gid), "Naga Exchange"))


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    # On dark (brand default: black background)
    build_stacked("#FFFFFF", "#0B0B0D", name="naga-logo-stacked")
    build_stacked("#FFFFFF", "#0B0B0D", bg="#0B0B0D", name="naga-logo-stacked-on-black")
    build_horizontal("#FFFFFF", "#0B0B0D", "naga-logo-horizontal")
    build_monogram("#0B0B0D", "naga-monogram")
    # On light backgrounds
    build_stacked("#121216", "#FBF8F1", name="naga-logo-stacked-dark-text")
    build_horizontal("#121216", "#FBF8F1", "naga-logo-horizontal-dark-text")
    build_monogram("#FBF8F1", "naga-monogram-on-light")
    print("logo SVGs written to", OUT)
