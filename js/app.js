(function () {
  "use strict";

  var MATERI_PATTERN = /^materi_(\d+)$/i;
  var SCAN_MIN = 1;
  var SCAN_MAX = 99;
  var MANIFEST_URL = "materi.json";

  var DEFAULT_MATERI = [
    {
      slug: "materi_01",
      href: "materi_01/index.html",
      title: "Belajar Inspect Element dengan cara praktik langsung",
      description: "8 tantangan Inspect Element urut dari mudah: ubah teks, elemen tersembunyi, disabled button, console, CSS, modal, device, login.",
      badge: "8 tantangan"
    }
  ];

  var grid = document.getElementById("materi-grid");
  var search = document.getElementById("search");
  var rescanBtn = document.getElementById("rescan");
  var countEl = document.getElementById("materi-count");
  var statusEl = document.getElementById("scan-status");
  var badgeEl = document.getElementById("hero-badge-text");
  var emptyEl = document.getElementById("empty-state");
  var ctaMulai = document.getElementById("cta-mulai");

  var items = [];

  // Nol di depan nomor
  function pad(n) {
    return (n < 10 ? "0" : "") + n;
  }

  // Label dari slug
  function labelFromSlug(slug) {
    var m = String(slug).match(MATERI_PATTERN);
    if (!m) return slug;
    return "Materi " + pad(parseInt(m[1], 10));
  }

  // Nomor dari slug
  function numberFromSlug(slug) {
    var m = String(slug).match(MATERI_PATTERN);
    return m ? parseInt(m[1], 10) : Number.MAX_SAFE_INTEGER;
  }

  // Slug kanonis
  function canonicalSlug(slug) {
    return "materi_" + pad(numberFromSlug(slug));
  }

  // Cek slug valid
  function isValidSlug(slug) {
    return MATERI_PATTERN.test(String(slug || "").trim());
  }

  // Amankan teks HTML
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  // Rapikan teks kartu
  function cleanText(s, max) {
    var t = String(s == null ? "" : s).replace(/\s+/g, " ").trim();
    if (t.length > max) t = t.slice(0, max - 1).trim() + "…";
    return t;
  }

  // Baca judul dari halaman materi
  function parseMateriDoc(slug, htmlText) {
    var title = "";
    var description = "";
    var h1 = "";
    var lead = "";
    try {
      var doc = new DOMParser().parseFromString(htmlText, "text/html");
      var t = doc.querySelector("title");
      if (t) title = t.textContent || "";
      var meta = doc.querySelector('meta[name="description"]');
      if (meta) description = meta.getAttribute("content") || "";
      var h1el = doc.querySelector("h1.page-title, h1");
      if (h1el) h1 = h1el.textContent || "";
      var leadEl = doc.querySelector("p.lead");
      if (leadEl) lead = leadEl.textContent || "";
    } catch (e) {}
    var displayTitle = cleanText(h1 || title, 90) || labelFromSlug(slug);
    var displayDesc = cleanText(description || lead, 160) ||
      "Buka " + labelFromSlug(slug) + " untuk melihat materi selengkapnya.";
    return { title: displayTitle, description: displayDesc };
  }

  // Cek halaman materi ada
  function existsViaFetch(slug) {
    var url = slug + "/index.html";
    return fetch(url, { method: "GET", cache: "no-store" }).then(function (res) {
      if (!res.ok) throw new Error("not-found");
      return res.text().then(function (text) {
        if (!text || !/<html/i.test(text)) throw new Error("not-html");
        return { slug: slug, html: text };
      });
    });
  }

  // Muat daftar manifest
  function loadManifest() {
    return fetch(MANIFEST_URL, { cache: "no-store" }).then(function (res) {
      if (!res.ok) throw new Error("no-manifest");
      return res.json();
    }).then(function (data) {
      var list = Array.isArray(data) ? data : data.materi;
      if (!Array.isArray(list)) return [];
      return list
        .map(function (e) {
          if (typeof e === "string") return { slug: e };
          return e || {};
        })
        .filter(function (e) { return isValidSlug(e.slug); })
        .map(function (e) {
          var slug = String(e.slug).trim();
          return {
            slug: slug,
            href: e.href || (slug + "/index.html"),
            title: e.title || labelFromSlug(slug),
            description: e.description || "",
            badge: e.badge || ""
          };
        });
    }).catch(function () { return []; });
  }

  // Pindai folder materi
  function scanCandidates() {
    var slugs = [];
    var n;
    for (n = SCAN_MIN; n <= SCAN_MAX; n++) slugs.push("materi_" + pad(n));
    for (n = SCAN_MIN; n < 10; n++) slugs.push("materi_" + n);
    var found = [];
    var seen = Object.create(null);
    var i = 0;
    // Minta satu batch pindaian
    function nextBatch() {
      var batch = slugs.slice(i, i + 12);
      i += 12;
      if (!batch.length) return Promise.resolve(found);
      return Promise.all(batch.map(function (slug) {
        return existsViaFetch(slug).then(
          function (r) {
            var key = canonicalSlug(r.slug);
            if (!seen[key]) {
              seen[key] = true;
              found.push(r);
            }
          },
          function () {}
        );
      })).then(nextBatch);
    }
    return nextBatch();
  }

  // Gabung hasil pindaian
  function mergeResults(manifest, scanned) {
    var map = Object.create(null);
    manifest.forEach(function (m) { map[canonicalSlug(m.slug)] = m; });
    scanned.forEach(function (s) {
      var key = canonicalSlug(s.slug);
      var parsed = parseMateriDoc(s.slug, s.html);
      var base = map[key] || { title: "", description: "", badge: "" };
      map[key] = {
        slug: canonicalSlug(s.slug),
        href: s.slug + "/index.html",
        title: parsed.title || base.title || labelFromSlug(s.slug),
        description: parsed.description || base.description || "",
        badge: base.badge || ""
      };
    });
    var list = Object.keys(map).map(function (k) { return map[k]; });
    list.sort(function (a, b) { return numberFromSlug(a.slug) - numberFromSlug(b.slug); });
    return list;
  }

  // Bangun kartu materi
  function cardHTML(item) {
    var num = pad(numberFromSlug(item.slug));
    var label = labelFromSlug(item.slug);
    var searchKey = (num + " " + label + " " + item.title + " " + item.description).toLowerCase();
    return (
      '<article class="card" data-search="' + esc(searchKey) + '">' +
        '<div class="card-top"><span class="badge badge-outline">' + esc(label) + '</span>' +
        (item.badge ? '<span class="meta-pill">' + esc(item.badge) + '</span>' : '<span class="meta-pill">praktik</span>') +
        '</div>' +
        '<h2>' + esc(item.title) + '</h2>' +
        '<p>' + esc(item.description) + '</p>' +
        '<div class="card-meta"><span class="meta-pill">belajar mandiri</span><span class="meta-pill">praktik langsung</span></div>' +
        '<div class="card-footer"><a class="card-link" href="' + esc(item.href) + '">Buka materi</a><kbd>' + esc(label) + '</kbd></div>' +
      '</article>'
    );
  }

  // Tampilkan daftar materi
  function render(list) {
    items = list;
    if (!list.length) {
      grid.innerHTML = "";
      emptyEl.classList.remove("hidden");
      emptyEl.querySelector("strong").textContent = "Daftar materi belum tersedia.";
      setCount(0);
      return;
    }
    grid.innerHTML = list.map(cardHTML).join("");
    applyFilter((search && search.value) || "");
    stampTheme();
  }

  // Teruskan tema ke kartu
  function stampTheme() {
    try {
      var theme = null;
      var m = location.search.match(/[?&]theme=(dark|light)/);
      if (m) theme = m[1];
      else {
        try { theme = localStorage.getItem("mi-theme"); } catch (e) {}
        if (theme !== "dark" && theme !== "light") theme = document.documentElement.classList.contains("dark") ? "dark" : "light";
      }
      if (typeof window.__stampThemeLinks === "function") window.__stampThemeLinks(theme);
    } catch (e) {}
  }

  // Perbarui penghitung materi
  function setCount(n) {
    if (countEl) countEl.textContent = n + " materi";
    if (badgeEl) badgeEl.textContent = n > 0 ? n + " materi tersedia" : "daftar materi eskul";
    if (ctaMulai && items.length) ctaMulai.setAttribute("href", items[0].href);
  }

  // Tulis status pemuatan
  function setStatus(msg) {
    if (statusEl) statusEl.textContent = msg;
  }

  // Saring kartu
  function applyFilter(q) {
    var query = String(q || "").toLowerCase().trim();
    var cards = grid.querySelectorAll(".card[data-search]");
    var visible = 0;
    for (var i = 0; i < cards.length; i++) {
      var hit = !query || cards[i].getAttribute("data-search").indexOf(query) >= 0;
      cards[i].style.display = hit ? "" : "none";
      if (hit) visible++;
    }
    if (emptyEl) {
      if (items.length && visible === 0) {
        emptyEl.classList.remove("hidden");
        emptyEl.querySelector("strong").textContent = "Tidak ada materi yang cocok.";
      } else if (!items.length) {
        emptyEl.classList.remove("hidden");
      } else {
        emptyEl.classList.add("hidden");
      }
    }
  }

  // Jalankan pemindaian
  function runScan() {
    grid.innerHTML =
      '<article class="card skeleton" aria-hidden="true"><div class="sk-line sk-w40"></div><div class="sk-line sk-w80"></div><div class="sk-line sk-w60"></div></article>' +
      '<article class="card skeleton" aria-hidden="true"><div class="sk-line sk-w40"></div><div class="sk-line sk-w80"></div><div class="sk-line sk-w60"></div></article>';
    if (emptyEl) emptyEl.classList.add("hidden");
    setStatus("Memuat daftar materi...");

    loadManifest().then(function (manifest) {
      return scanCandidates().then(function (scanned) {
        return { manifest: manifest, scanned: scanned };
      });
    }).then(function (r) {
      var merged = mergeResults(r.manifest, r.scanned);
      if (!merged.length) {
        merged = (r.manifest.length ? r.manifest : DEFAULT_MATERI).slice();
        setStatus("Menampilkan daftar materi yang tersedia.");
      } else {
        setStatus("Ditemukan " + merged.length + " materi. Pilih salah satu untuk mulai belajar.");
      }
      render(merged);
      setCount(merged.length);
      stampTheme();
    }).catch(function () {
      render(DEFAULT_MATERI.slice());
      setCount(DEFAULT_MATERI.length);
      setStatus("Menampilkan daftar materi yang tersedia.");
      stampTheme();
    });
  }

  if (search) {
    search.addEventListener("input", function () { applyFilter(search.value); });
  }
  if (rescanBtn) {
    rescanBtn.addEventListener("click", function () { runScan(); });
  }

  try {
    var q = location.search.match(/[?&]materi=([^&]+)/);
    if (q) {
      var forced = decodeURIComponent(q[1]).split(",").map(function (s) { return s.trim(); }).filter(isValidSlug);
      if (forced.length) {
        render(forced.map(function (slug) {
          return { slug: canonicalSlug(slug), href: slug + "/index.html", title: labelFromSlug(slug), description: "Buka halaman ini untuk mulai belajar.", badge: "" };
        }));
        setCount(forced.length);
        setStatus("Menampilkan daftar materi yang dipilih.");
        return;
      }
    }
  } catch (e) {}

  runScan();
})();
