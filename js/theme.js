(function () {
  var STORAGE_KEY = "mi-theme";
  var root = document.documentElement;
  var toggle = document.getElementById("theme-toggle");

  // Baca tema dari cookie
  function readCookie() {
    try {
      var m = document.cookie.match(/(?:^|; )mi-theme=(dark|light)/);
      return m ? m[1] : null;
    } catch (e) { return null; }
  }
  // Baca tema tersimpan
  function readStored() {
    var t = null;
    try { t = localStorage.getItem(STORAGE_KEY); } catch (e) {}
    if (t !== "dark" && t !== "light") t = readCookie();
    return (t === "dark" || t === "light") ? t : null;
  }
  // Tentukan tema aktif
  function readTheme() {
    var m = null;
    try { m = location.search.match(/[?&]theme=(dark|light)/); } catch (e) {}
    if (m) return m[1];
    var s = readStored();
    if (s) return s;
    try {
      if (matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
    } catch (e) {}
    return "light";
  }
  // Simpan pilihan tema
  function saveTheme(next) {
    try { localStorage.setItem(STORAGE_KEY, next); } catch (e) {}
    try { document.cookie = STORAGE_KEY + "=" + next + "; max-age=31536000; path=/"; } catch (e) {}
  }
  // Sisipkan tema ke tautan
  function withTheme(href, theme) {
    if (!href || href.charAt(0) === "#" || /^(?:[a-z]+:)?\/\//i.test(href)) return href;
    var hash = "";
    var qi = href.indexOf("#");
    if (qi >= 0) { hash = href.slice(qi); href = href.slice(0, qi); }
    if (/[?&]theme=(dark|light)/.test(href)) {
      href = href.replace(/([?&])theme=(dark|light)/, "$1theme=" + theme);
    } else if (href.indexOf("?") >= 0) {
      href = href + "&theme=" + theme;
    } else {
      href = href + "?theme=" + theme;
    }
    return href + hash;
  }
  // Tandai tautan internal
  function isInternalPage(href) {
    if (!href) return false;
    if (href.charAt(0) === "#" || /^(?:[a-z]+:)?\/\//i.test(href)) return false;
    return /(?:^|\/)materi_\d+(?:\/|$)/i.test(href) || /^[^:]*\.html([?#]|$)/.test(href);
  }
  // Tera semua tautan internal
  function stampLinks(theme) {
    try {
      var links = document.querySelectorAll("a[href]");
      for (var i = 0; i < links.length; i++) {
        var h = links[i].getAttribute("href");
        if (isInternalPage(h)) {
          var clean = h.replace(/([?&])theme=(dark|light)(&|$)/, function (m, p1, p2, p3) {
            return p3 === "&" ? p1 : "";
          }).replace(/[?&]$/, "");
          links[i].setAttribute("href", withTheme(clean, theme));
        }
      }
    } catch (e) {}
  }
  // Baca tema berjalan
  function currentTheme() {
    return root.classList.contains("dark") ? "dark" : "light";
  }
  // Gambar ikon tombol tema
  function renderIcon(next) {
    if (toggle) toggle.textContent = next === "dark" ? "☀" : "◐";
  }
  // Terapkan tema baru
  function applyTheme(next) {
    root.classList.toggle("dark", next === "dark");
    saveTheme(next);
    renderIcon(next);
    stampLinks(next);
  }

  var initial = readTheme();
  root.classList.toggle("dark", initial === "dark");
  saveTheme(initial);
  renderIcon(initial);
  stampLinks(initial);

  try { window.__stampThemeLinks = stampLinks; } catch (e) {}
  try { window.__currentTheme = currentTheme; } catch (e) {}

  try {
    window.addEventListener("storage", function (e) {
      if (e.key === STORAGE_KEY && (e.newValue === "dark" || e.newValue === "light")) {
        root.classList.toggle("dark", e.newValue === "dark");
        renderIcon(e.newValue);
        stampLinks(e.newValue);
      }
    });
  } catch (e) {}

  if (toggle) {
    toggle.addEventListener("click", function () {
      applyTheme(currentTheme() === "dark" ? "light" : "dark");
    });
  }
})();
