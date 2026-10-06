/* Reel 04 — builds the synthetic "Ada Zeytin" pages (fictional brand).
   AdaPages.build(container, "A" | "B") → returns the page element (960 × 1020).
   Deterministic markup only; animation is done by the scenes. */
(function (global) {
  "use strict";
  function bottle(x, y, glass, scale) {
    return (
      '<div class="ada-bottle" style="left:' + x + "px;top:" + y + "px;--glass:" + glass + ";transform:scale(" + (scale || 1) + ');transform-origin:50% 100%">' +
      '<div class="neck"></div><div class="cap"></div><div class="body"></div><div class="label"></div><div class="shine"></div></div>'
    );
  }
  var A =
    '<div class="top"><div class="brand">ADA ZEYTİN</div><div class="est">Est. 1998 · Kalite ve Güven</div>' +
    '<div class="nav"><span>Anasayfa</span><span>Hakkımızda</span><span>Ürünler</span><span>Toptan</span><span>Galeri</span><span>Haberler</span><span>Bayilik</span><span>İletişim</span></div></div>' +
    '<div class="hello">Hoşgeldiniz!</div>' +
    '<div class="shout">En kaliteli zeytinyağı ürünleri en uygun şartlarla sizlerle!!!</div>' +
    '<div class="scroll">Ürünlerimizi incelemek için aşağı kaydırınız</div>' +
    '<div class="img">urun_foto_son.jpg</div>' +
    '<div class="card" style="left:20px"><i></i><b>Sızma Zeytinyağı</b><span>Fiyat için arayınız</span><small>Stok durumu sorunuz</small></div>' +
    '<div class="card" style="left:330px"><i></i><b>Erken Hasat</b><span>Fiyat için arayınız</span><small>Stok durumu sorunuz</small></div>' +
    '<div class="card" style="left:640px"><i></i><b>Hediye Paketi</b><span>Fiyat için arayınız</span><small>Stok durumu sorunuz</small></div>' +
    '<div class="link">sipariş için tıklayınız</div>' +
    '<div class="foot">© 2009 Tüm hakları saklıdır · Ziyaretçi: 001284</div>';
  var B =
    '<div class="nav"><div class="logo">Ada Zeytin</div><div class="links">Ürünler · Hikâyemiz · İletişim</div></div>' +
    '<div class="eyebrow">KUZEY KIBRIS · SOĞUK SIKIM</div>' +
    '<h3 class="h1">Soğuk sıkım, ada usulü.</h3>' +
    '<p class="p">Kendi bahçemizden, hasat edildiği gün sıkılır.</p>' +
    '<div class="cta">Sipariş ver <span>→</span></div>' +
    '<div class="ghost-link">Ürünleri gör</div>' +
    '<div class="stage">' + bottle(132, 120, "#36531f", 1.15) + "</div>" +
    '<div class="trust"><span>✓ Kapıda ödeme</span><span>✓ Hızlı teslimat</span><span>✓ İade garantisi</span></div>' +
    '<div class="prod" style="left:60px">' + bottle(82, 22, "#36531f", 0.62) + "<b>Sızma</b><span>Detaylar →</span></div>" +
    '<div class="prod" style="left:350px">' + bottle(82, 22, "#7a8a2a", 0.62) + "<b>Erken hasat</b><span>Detaylar →</span></div>" +
    '<div class="prod" style="left:640px">' + bottle(82, 22, "#2b2db8", 0.62) + "<b>Hediye kutusu</b><span>Detaylar →</span></div>";

  /* mode: "layered" — full-size page stacked under/over its twin (wipe);
             "crop"    — page seen through a panning/zooming window or as a
                         scaled thumbnail: excluded from layout/text audits
                         (its clipped/tiny text is a picture of a site). */
  global.AdaPages = {
    build: function (container, which, mode) {
      var page = document.createElement("div");
      page.className = "ada-page " + (which === "A" ? "ada-a" : "ada-b");
      page.innerHTML = which === "A" ? A : B;
      container.appendChild(page);
      var all = [page].concat(Array.prototype.slice.call(page.querySelectorAll("*")));
      all.forEach(function (el) {
        el.setAttribute("data-layout-allow-overlap", "");
        if (mode === "crop") el.setAttribute("data-layout-ignore", "");
      });
      return page;
    },
  };
})(window);
