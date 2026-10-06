/* ==========================================================================
   Beta Studio — Reels motion library (window.BS)
   Source of truth: beta-studio-reels/components/beta.js → synced as system/beta.js

   Every helper ADDS tweens to a paused HyperFrames timeline at absolute
   positions. Contract (hyperframes-core / hyperframes-animation):
     - seek-safe both directions: fromTo with explicit states, no relative +=,
       per-frame state computed from time by one clock driver;
     - deterministic: no Math.random / Date.now — seeded PRNG only;
     - transforms + paint properties only; never tweens a .clip element;
     - no DOM measurement at tween time (pen path lengths are computed from
       the generated points, not getTotalLength()).
   ========================================================================== */
(function (global) {
  "use strict";
  var BS = { version: "1.0.0" };

  /* ------------------------------------------------------------------ utils */
  BS.$ = function (sel, root) {
    return (root || document).querySelector(sel);
  };
  BS.$$ = function (sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  };
  BS.clamp = function (v, a, b) {
    return Math.max(a, Math.min(b, v));
  };
  /* seeded PRNG (mulberry32) — the only randomness allowed */
  BS.rand = function (seed) {
    var a = (seed >>> 0) || 1;
    return function () {
      a = (a + 0x6d2b79f5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };
  BS.fmt = function (n, opts) {
    opts = opts || {};
    var v = Math.round(n * Math.pow(10, opts.decimals || 0)) / Math.pow(10, opts.decimals || 0);
    var s = v.toLocaleString("tr-TR", {
      minimumFractionDigits: opts.decimals || 0,
      maximumFractionDigits: opts.decimals || 0,
    });
    return (opts.prefix || "") + s + (opts.suffix || "");
  };

  /* -------------------------------------------------------------- variables */
  /* Inside a sub-composition HyperFrames wraps the script and shadows
     window/__hyperframes with a per-instance scoped variant. Pass it in:
       BS.vars(window.__hyperframes)   // from a sub-composition script
       BS.vars()                       // from the root composition          */
  BS.vars = function (scopedHf) {
    try {
      var hf = scopedHf || global.__hyperframes;
      return (hf && hf.getVariables && hf.getVariables()) || {};
    } catch (e) {
      return {};
    }
  };
  /* A/B hook: returns vars[prefix + "A"|"B"] according to vars.hookVariant */
  BS.pick = function (vars, prefix, fallback) {
    var variant = String(vars.hookVariant || "A").toUpperCase() === "B" ? "B" : "A";
    var v = vars[prefix + variant];
    return typeof v === "string" && v.trim() ? v : fallback;
  };

  /* ------------------------------------------------------------- rich text
     Mini-markup for hooks and titles (keeps copy editable in one string):
       *word*   → human voice (Instrument Serif italic)
       _word_   → accent color
       ~word~   → red-pen underline mark (draw it with BS.marks + BS.draw)
       ^word^   → red-pen color
       |        → deliberate display line break (block line, not <br>)        */
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  BS.rich = function (el, src) {
    if (!el || src == null) return el;
    var lines = String(src).split("|");
    el.innerHTML = lines
      .map(function (line) {
        var h = esc(line.trim())
          .replace(/\*([^*]+)\*/g, '<span class="bs-serif">$1</span>')
          .replace(/_([^_]+)_/g, '<span class="bs-accent">$1</span>')
          .replace(/~([^~]+)~/g, '<span class="bs-mark">$1</span>')
          .replace(/\^([^^]+)\^/g, '<span class="bs-pen-text">$1</span>');
        return lines.length > 1 ? '<span class="bs-line" style="display:block">' + h + "</span>" : h;
      })
      .join("");
    return el;
  };

  /* ------------------------------------------------------------------ split
     Wraps every word in <span class="w"><span class="wi">…</span></span>,
     recursing into inline wrappers (serif/accent spans) so styling survives.
     Returns { words: [.w], inners: [.wi] } in reading order.               */
  BS.split = function (el) {
    if (!el) return { words: [], inners: [] };
    if (!el.__bsSplit) {
      el.classList.add("bs-split");
      (function walk(node) {
        Array.prototype.slice.call(node.childNodes).forEach(function (child) {
          if (child.nodeType === 3) {
            var parts = child.textContent.split(/(\s+)/);
            var frag = document.createDocumentFragment();
            parts.forEach(function (p) {
              if (!p) return;
              if (/^\s+$/.test(p)) {
                frag.appendChild(document.createTextNode(" "));
              } else {
                var w = document.createElement("span");
                w.className = "w";
                var wi = document.createElement("span");
                wi.className = "wi";
                // display type is set with tight leading (lines' glyph boxes touch) and
                // masked reveals park words outside their mask: both are intentional.
                wi.setAttribute("data-layout-allow-overlap", "");
                wi.setAttribute("data-layout-allow-overflow", "");
                wi.textContent = p;
                w.appendChild(wi);
                frag.appendChild(w);
              }
            });
            node.replaceChild(frag, child);
          } else if (child.nodeType === 1 && !child.classList.contains("w")) {
            walk(child);
          }
        });
      })(el);
      el.__bsSplit = true;
    }
    return { words: BS.$$(".w", el), inners: BS.$$(".wi", el) };
  };
  /* character split for short strings (wordmarks, numbers) */
  BS.splitChars = function (el) {
    if (!el.__bsChars) {
      var text = el.textContent;
      el.textContent = "";
      Array.from(text).forEach(function (c) {
        var s = document.createElement("span");
        s.className = "ch";
        s.textContent = c === " " ? " " : c;
        el.appendChild(s);
      });
      el.__bsChars = true;
    }
    return BS.$$(".ch", el);
  };

  /* --------------------------------------------------------------- reveals
     style: rise | slam | drop | blur | tilt | pop                              */
  BS.reveal = function (tl, el, at, style, opts) {
    opts = opts || {};
    var parts = BS.split(el);
    var n = parts.words.length || 1;
    var stagger = opts.stagger != null ? opts.stagger : Math.min(0.085, 0.5 / n);
    style = style || "rise";
    if (style === "rise") {
      tl.fromTo(
        parts.inners,
        { yPercent: 118 },
        { yPercent: 0, duration: opts.dur || 0.62, ease: opts.ease || "expo.out", stagger: stagger },
        at,
      );
    } else if (style === "slam") {
      tl.fromTo(
        parts.words,
        { scale: opts.from || 1.55, opacity: 0 },
        { scale: 1, opacity: 1, duration: opts.dur || 0.34, ease: opts.ease || "power4.out", stagger: stagger },
        at,
      );
    } else if (style === "drop") {
      tl.fromTo(
        parts.inners,
        { yPercent: -120 },
        { yPercent: 0, duration: opts.dur || 0.5, ease: opts.ease || "back.out(1.6)", stagger: stagger },
        at,
      );
    } else if (style === "blur") {
      tl.fromTo(
        parts.words,
        { opacity: 0, filter: "blur(18px)", y: 24 },
        { opacity: 1, filter: "blur(0px)", y: 0, duration: opts.dur || 0.55, ease: opts.ease || "power3.out", stagger: stagger },
        at,
      );
    } else if (style === "tilt") {
      tl.fromTo(
        parts.inners,
        { yPercent: 110, rotation: 7 },
        { yPercent: 0, rotation: 0, duration: opts.dur || 0.7, ease: opts.ease || "power4.out", stagger: stagger, transformOrigin: "0% 100%" },
        at,
      );
    } else if (style === "pop") {
      tl.fromTo(
        parts.words,
        { scale: 0.4, opacity: 0 },
        { scale: 1, opacity: 1, duration: opts.dur || 0.42, ease: opts.ease || "back.out(2.2)", stagger: stagger },
        at,
      );
    }
    return at + (opts.dur || 0.6) + stagger * (n - 1);
  };
  /* exit: lift | fall | fade | shrink — optional hard kill after */
  BS.exit = function (tl, targets, at, style, opts) {
    opts = opts || {};
    var dur = opts.dur || 0.28;
    var to = { opacity: 0, duration: dur, ease: opts.ease || "power2.in" };
    if (style === "lift") to.y = -60;
    else if (style === "fall") to.y = 80;
    else if (style === "shrink") to.scale = 0.85;
    else if (style === "left") to.x = -140;
    tl.to(targets, to, at);
    if (opts.kill !== false) tl.set(targets, { visibility: "hidden" }, at + dur);
    return at + dur;
  };

  /* ---------------------------------------------------------------- motion */
  BS.pop = function (tl, el, at, opts) {
    opts = opts || {};
    tl.fromTo(
      el,
      { scale: opts.from != null ? opts.from : 0.5, opacity: 0 },
      { scale: 1, opacity: 1, duration: opts.dur || 0.42, ease: opts.ease || "back.out(2)", stagger: opts.stagger || 0 },
      at,
    );
    return at + (opts.dur || 0.42);
  };
  BS.fade = function (tl, el, at, opts) {
    opts = opts || {};
    tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: opts.dur || 0.4, ease: opts.ease || "power1.out", stagger: opts.stagger || 0 }, at);
    return at + (opts.dur || 0.4);
  };
  /* slide in from a side: dir = left | right | up | down */
  BS.slide = function (tl, el, at, opts) {
    opts = opts || {};
    var d = opts.dist || 160;
    var from = { opacity: opts.fade === false ? 1 : 0 };
    var to = { opacity: 1, x: 0, y: 0, duration: opts.dur || 0.55, ease: opts.ease || "power3.out", stagger: opts.stagger || 0 };
    var dir = opts.dir || "up";
    if (dir === "left") from.x = -d;
    if (dir === "right") from.x = d;
    if (dir === "up") from.y = d;
    if (dir === "down") from.y = -d;
    from.x = from.x || 0;
    from.y = from.y || 0;
    tl.fromTo(el, from, to, at);
    return at + to.duration;
  };
  /* chat bubble: grows from its sender's corner (scale .75, ~.16s) */
  BS.bubble = function (tl, el, at, opts) {
    opts = opts || {};
    tl.fromTo(el, { scale: 0.75, opacity: 0 }, { scale: 1, opacity: 1, duration: opts.dur || 0.18, ease: "power3.out" }, at);
    return at + 0.18;
  };
  /* notification banner drops from above */
  BS.drop = function (tl, el, at, opts) {
    opts = opts || {};
    tl.fromTo(
      el,
      { y: opts.from || -150, opacity: 0, scale: 0.96 },
      { y: 0, opacity: 1, scale: 1, duration: opts.dur || 0.5, ease: opts.ease || "back.out(1.4)" },
      at,
    );
    return at + (opts.dur || 0.5);
  };
  /* wipe reveal with clip-path: dir = right (L→R) | left | down | up */
  BS.wipe = function (tl, el, at, opts) {
    opts = opts || {};
    var dir = opts.dir || "right";
    var from = {
      right: "inset(0% 100% 0% 0%)",
      left: "inset(0% 0% 0% 100%)",
      down: "inset(0% 0% 100% 0%)",
      up: "inset(100% 0% 0% 0%)",
    }[dir];
    tl.fromTo(el, { clipPath: from }, { clipPath: "inset(0% 0% 0% 0%)", duration: opts.dur || 0.6, ease: opts.ease || "power3.inOut" }, at);
    return at + (opts.dur || 0.6);
  };
  /* slow ambient drift for background decoratives (finite, seek-safe) */
  BS.drift = function (tl, el, at, dur, to) {
    var from = {};
    Object.keys(to).forEach(function (k) {
      from[k] = k === "scale" ? 1 : 0;
    });
    to = Object.assign({ duration: dur, ease: "sine.inOut" }, to);
    tl.fromTo(el, from, to, at);
  };
  /* camera: sequential poses on a world wrapper. keys: [{t, x, y, scale, dur, ease}] */
  BS.camera = function (tl, world, keys) {
    var prev = { x: 0, y: 0, scale: 1 };
    keys.forEach(function (k, i) {
      var next = { x: k.x != null ? k.x : prev.x, y: k.y != null ? k.y : prev.y, scale: k.scale != null ? k.scale : prev.scale };
      if (i === 0 && !k.dur) {
        tl.set(world, next, k.t);
      } else {
        tl.fromTo(world, prev, Object.assign({}, next, { duration: k.dur || 0.8, ease: k.ease || "power3.inOut", immediateRender: false }), k.t);
      }
      prev = next;
    });
  };

  /* ---------------------------------------------------------------- clock
     One linear driver per composition. Listeners receive composition time and
     must compute state purely from it → correct under any seek order.      */
  BS.clock = function (tl, duration) {
    var listeners = [];
    var d = { t: 0 };
    var run = function () {
      for (var i = 0; i < listeners.length; i++) listeners[i](d.t);
    };
    tl.fromTo(d, { t: 0 }, { t: duration, duration: duration, ease: "none", onUpdate: run }, 0);
    return {
      on: function (fn) {
        listeners.push(fn);
        fn(0);
        return this;
      },
    };
  };
  /* typewriter (per character) with optional trailing caret element */
  BS.type = function (clock, el, text, start, cps, opts) {
    opts = opts || {};
    var chars = Array.from(text);
    var last = -1;
    clock.on(function (t) {
      var n = BS.clamp(Math.floor((t - start) * cps + 1e-6), 0, chars.length);
      if (t < start) n = opts.before != null ? opts.before : 0;
      if (n !== last) {
        el.textContent = chars.slice(0, n).join("");
        last = n;
      }
    });
    return start + chars.length / cps;
  };
  /* discrete states [{t, text}] — typos, backspaces, bulk paste */
  BS.sequence = function (clock, el, states) {
    var last = null;
    clock.on(function (t) {
      var s = "";
      for (var i = states.length - 1; i >= 0; i--) {
        if (t >= states[i].t) {
          s = states[i].text;
          break;
        }
      }
      if (s !== last) {
        el.textContent = s;
        last = s;
      }
    });
  };
  /* count-up with tr-TR formatting (48.900). ease name is any GSAP ease */
  BS.count = function (clock, el, o) {
    var ease = global.gsap.parseEase(o.ease || "power2.out");
    var last = null;
    clock.on(function (t) {
      var p = BS.clamp((t - o.start) / o.dur, 0, 1);
      var v = o.from + (o.to - o.from) * ease(p);
      var s = o.format ? o.format(v) : BS.fmt(v, o);
      if (s !== last) {
        el.textContent = s;
        last = s;
      }
    });
    return o.start + o.dur;
  };
  /* caret blink (square wave). Outside [start,end] opacity = rest */
  BS.blink = function (clock, el, start, end, opts) {
    opts = opts || {};
    var period = opts.period || 0.56;
    clock.on(function (t) {
      var o;
      if (t < start) o = opts.before != null ? opts.before : 0;
      else if (t > end) o = opts.after != null ? opts.after : 1;
      else o = (t - start) % period < period * 0.55 ? 1 : 0;
      el.style.opacity = String(o);
    });
  };

  /* ---------------------------------------------------------------- cursor
     points: [{t, x, y, dur?, ease?}] — first point is a set (or an entry
     glide from off-frame if it has dur). Coordinates are authored constants. */
  BS.cursorPath = function (tl, el, points) {
    var prev = null;
    points.forEach(function (p) {
      if (!prev) {
        tl.set(el, { x: p.x, y: p.y }, p.t);
      } else {
        tl.fromTo(
          el,
          { x: prev.x, y: prev.y },
          { x: p.x, y: p.y, duration: p.dur || 0.6, ease: p.ease || "power2.inOut", immediateRender: false },
          p.t,
        );
      }
      prev = p;
    });
  };
  /* click: cursor glyph dips with the target; ripple expands from the tip */
  BS.click = function (tl, cursorEl, at, opts) {
    opts = opts || {};
    var glyph = cursorEl.querySelector("svg") || cursorEl;
    tl.fromTo(glyph, { scale: 1 }, { scale: 0.82, duration: 0.08, ease: "power2.in", transformOrigin: "14% 8%", immediateRender: false }, at);
    tl.fromTo(glyph, { scale: 0.82 }, { scale: 1, duration: 0.26, ease: "back.out(3)", transformOrigin: "14% 8%", immediateRender: false }, at + 0.08);
    var ripple = cursorEl.querySelector(".bs-ripple");
    if (ripple) {
      tl.fromTo(ripple, { scale: 0.2, opacity: 0.9 }, { scale: 1.9, opacity: 0, duration: 0.55, ease: "power2.out" }, at + 0.04);
    }
    if (opts.target) {
      tl.fromTo(opts.target, { scale: 1 }, { scale: 0.94, duration: 0.08, ease: "power2.in", immediateRender: false }, at);
      tl.fromTo(opts.target, { scale: 0.94 }, { scale: 1, duration: 0.3, ease: "back.out(2.5)", immediateRender: false }, at + 0.08);
    }
  };
  BS.cursorSVG =
    '<svg viewBox="0 0 72 72" aria-hidden="true"><path d="M12 6 L12 58 L25.5 45.5 L35 66 L44.5 61.5 L35 41.5 L53 41.5 Z" fill="#16130F" stroke="#F3EEE5" stroke-width="4.5" stroke-linejoin="round"/></svg>';

  /* ---------------------------------------------------------- pen marks
     Hand-drawn paths generated from seeded points. Each returns
     { d, length } so drawing never measures the DOM.                       */
  function polyD(pts) {
    var d = "M" + pts[0][0].toFixed(1) + " " + pts[0][1].toFixed(1);
    for (var i = 1; i < pts.length; i++) d += " L" + pts[i][0].toFixed(1) + " " + pts[i][1].toFixed(1);
    return d;
  }
  function polyLen(pts) {
    var L = 0;
    for (var i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    return L;
  }
  var SHAPES = {
    /* loose ellipse that overshoots its start, like a real pen loop */
    circle: function (w, h, r) {
      var pts = [];
      var cx = w / 2,
        cy = h / 2,
        rx = w / 2 - 8,
        ry = h / 2 - 8;
      var a0 = -2.4 + r() * 0.4;
      var span = Math.PI * 2 + 0.55;
      var wob = 0.04 + r() * 0.03;
      for (var i = 0; i <= 64; i++) {
        var p = i / 64;
        var a = a0 + span * p;
        var k = 1 + wob * Math.sin(p * 9 + r() * 0.2) - 0.05 * p;
        pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k * (1 + 0.04 * p)]);
      }
      return pts;
    },
    underline: function (w, h, r) {
      var pts = [];
      for (var i = 0; i <= 40; i++) {
        var p = i / 40;
        pts.push([6 + (w - 12) * p, h * 0.55 + Math.sin(p * 5.5 + r()) * h * 0.12 - p * h * 0.18]);
      }
      return pts;
    },
    strike: function (w, h, r) {
      return [
        [4, h * (0.62 + r() * 0.05)],
        [w * 0.5, h * (0.48 + r() * 0.04)],
        [w - 4, h * (0.36 + r() * 0.05)],
      ];
    },
    /* steep diagonal stroke (the slash of ≠, a "no" mark) */
    slash: function (w, h, r) {
      return [
        [w * (0.82 + r() * 0.04), 4],
        [w * 0.5, h * 0.5],
        [w * (0.18 - r() * 0.04), h - 4],
      ];
    },
    cross: function (w, h) {
      return [
        [6, 6],
        [w - 6, h - 6],
        [w - 6, h - 6],
        [w * 0.5, h * 0.5],
        [w - 6, 6],
        [6, h - 6],
      ];
    },
    scribble: function (w, h, r) {
      var pts = [];
      for (var i = 0; i <= 18; i++) {
        pts.push([6 + (w - 12) * (i / 18), i % 2 ? h * (0.15 + r() * 0.1) : h * (0.85 - r() * 0.1)]);
      }
      return pts;
    },
    check: function (w, h) {
      return [
        [w * 0.08, h * 0.55],
        [w * 0.38, h * 0.86],
        [w * 0.92, h * 0.12],
      ];
    },
    bracket: function (w, h) {
      return [
        [w, 4],
        [6, 4],
        [6, h - 4],
        [w, h - 4],
      ];
    },
    arrowDown: function (w, h) {
      return [
        [w / 2, 4],
        [w / 2, h - 6],
        [w / 2 - w * 0.3, h - h * 0.3],
        [w / 2, h - 6],
        [w / 2 + w * 0.3, h - h * 0.3],
      ];
    },
  };
  BS.penShape = function (kind, w, h, seed) {
    var pts = SHAPES[kind](w, h, BS.rand(seed || 7));
    return { d: polyD(pts), length: polyLen(pts) };
  };
  /* create an SVG pen mark inside container at {x,y,w,h}; returns the path */
  BS.pen = function (container, kind, box, opts) {
    opts = opts || {};
    var ns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(ns, "svg");
    svg.setAttribute("class", "bs-pen" + (opts.fix ? " bs-pen--fix" : "") + (opts.thin ? " bs-pen--thin" : ""));
    svg.setAttribute("viewBox", "0 0 " + box.w + " " + box.h);
    svg.setAttribute("data-layout-ignore", "");
    svg.style.left = box.x + "px";
    svg.style.top = box.y + "px";
    svg.style.width = box.w + "px";
    svg.style.height = box.h + "px";
    if (opts.id) svg.id = opts.id;
    var shape = BS.penShape(kind, box.w, box.h, opts.seed);
    var path = document.createElementNS(ns, "path");
    path.setAttribute("d", shape.d);
    path.__bsLen = shape.length + 2;
    svg.appendChild(path);
    container.appendChild(svg);
    return path;
  };
  /* hand-drawn underline under every .bs-mark inside el (call AFTER BS.split).
     The SVG stretches to the word box (preserveAspectRatio none), so nothing
     is measured. Returns the paths in reading order for BS.draw.           */
  BS.marks = function (el, opts) {
    opts = opts || {};
    var ns = "http://www.w3.org/2000/svg";
    return BS.$$(".bs-mark", el).map(function (mark, i) {
      var W = Math.max(120, mark.textContent.length * 60);
      var svg = document.createElementNS(ns, "svg");
      svg.setAttribute("class", "bs-mark__svg");
      svg.setAttribute("viewBox", "0 0 " + W + " 40");
      svg.setAttribute("preserveAspectRatio", "none");
      svg.setAttribute("data-layout-ignore", "");
      var shape = BS.penShape(opts.kind || "underline", W, 40, (opts.seed || 5) + i);
      var path = document.createElementNS(ns, "path");
      path.setAttribute("d", shape.d);
      path.__bsLen = shape.length + 2;
      svg.appendChild(path);
      mark.appendChild(svg);
      return path;
    });
  };

  /* draw a pen path on (stroke-dashoffset). Works for BS.pen paths. */
  BS.draw = function (tl, path, at, dur, ease) {
    var L = path.__bsLen || 1000;
    // gap longer than the path + offset past it: no round-cap dot before the draw starts
    path.style.strokeDasharray = L + " " + (L + 40);
    tl.fromTo(path, { strokeDashoffset: L + 20 }, { strokeDashoffset: 0, duration: dur || 0.5, ease: ease || "power2.inOut" }, at);
    return at + (dur || 0.5);
  };

  /* ---------------------------------------------------------- brand chrome
     chrome = { tag, handle, ticks: [i-fill elements], chapters: [[s,e],…] }  */
  BS.chrome = function (tl, c) {
    if (c.tag) tl.fromTo(c.tag, { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.55, ease: "expo.out" }, c.at || 0.12);
    if (c.handle) tl.fromTo(c.handle, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power1.out" }, (c.at || 0.12) + 0.15);
    if (c.ticks) {
      c.ticks.forEach(function (fill, i) {
        var ch = c.chapters[i];
        tl.fromTo(fill, { scaleX: 0 }, { scaleX: 1, duration: ch[1] - ch[0], ease: "none" }, ch[0]);
      });
    }
  };

  /* theme switch on a hard cut (chrome follows the scene so contrast holds).
     GSAP records the previous class, so seeking backwards restores it.     */
  BS.theme = function (tl, el, at, theme, base) {
    var node = typeof el === "string" ? document.querySelector(el) : el;
    var keep = base != null ? base : (node.getAttribute("class") || "").replace(/\s*bs-theme-\w+/g, "").trim();
    tl.set(node, { attr: { class: (keep ? keep + " " : "") + "bs-theme-" + theme } }, at);
  };

  global.BS = BS;
})(window);
