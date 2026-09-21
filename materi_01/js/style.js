document.addEventListener('DOMContentLoaded', function() {
  const box = document.getElementById('style-box');
  const success = document.getElementById('style-success');
  const hint = document.getElementById('style-hint');
  const resetBtn = document.getElementById('style-reset');
  let done = false;

  if (!box || !success || !resetBtn) return;

  // Baca warna kotak
  function currentBg() {
    return window.getComputedStyle(box).backgroundColor;
  }
  // Cek warna hijau target
  function isGreen(rgb) {
    return /(?:^|[^\d])22\s*,\s*163\s*,\s*74(?:[^\d]|$)/.test(rgb);
  }

  setInterval(function() {
    const bg = currentBg();
    if (!done && isGreen(bg)) {
      done = true;
      success.style.display = 'block';
      box.textContent = 'Kotak hijau! Berhasil.';
      if (hint) hint.textContent = 'Warna saat ini terdeteksi: hijau #16a34a. Tepat!';
    } else if (!done && hint) {
      hint.textContent = 'Warna saat ini terdeteksi: ' + bg + '. Target: rgb(22, 163, 74).';
    }
  }, 400);

  resetBtn.addEventListener('click', function() {
    box.style.backgroundColor = '#3b82f6';
    box.textContent = 'Kotak biru, ubah saya jadi hijau';
    success.style.display = 'none';
    done = false;
  });
});
