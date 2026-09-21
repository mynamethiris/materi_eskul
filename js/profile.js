(function () {
  var overlay = document.getElementById("profile-popup");
  var openBtn = document.getElementById("profile-btn");
  var closeBtn = document.getElementById("profile-close");
  var lastFocus = null;

  // Buka popup profil
  function openProfile() {
    if (!overlay) return;
    lastFocus = document.activeElement;
    overlay.hidden = false;
    document.body.style.overflow = "hidden";
    if (closeBtn) closeBtn.focus();
  }

  // Tutup popup profil
  function closeProfile() {
    if (!overlay || overlay.hidden) return;
    overlay.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  if (!overlay || !openBtn) return;

  openBtn.addEventListener("click", openProfile);
  if (closeBtn) closeBtn.addEventListener("click", closeProfile);
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) closeProfile();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeProfile();
  });
})();
