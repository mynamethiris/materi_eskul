document.addEventListener('DOMContentLoaded', function() {
  const widthEl = document.getElementById('device-width');
  const orientEl = document.getElementById('device-orient');
  const sizeEl = document.getElementById('device-size');
  const msgD = document.getElementById('msg-desktop');
  const msgT = document.getElementById('msg-tablet');
  const msgM = document.getElementById('msg-mobile');
  const success = document.getElementById('device-success');
  const hint = document.getElementById('device-hint');
  const cD = document.getElementById('check-desktop');
  const cT = document.getElementById('check-tablet');
  const cM = document.getElementById('check-mobile');
  const resetBtn = document.getElementById('device-reset');
  const visited = { desktop: false, tablet: false, mobile: false };

  if (!widthEl || !orientEl || !sizeEl || !msgD || !msgT || !msgM || !success || !resetBtn || !cD || !cT || !cM) return;

  // Golongkan lebar layar
  function breakpoint(w) {
    if (w >= 1024) return 'desktop';
    if (w >= 640) return 'tablet';
    return 'mobile';
  }
  // Baca orientasi layar
  function orientation() {
    if (window.matchMedia('(orientation: landscape)').matches) return 'landscape';
    return 'portrait';
  }
  // Perbarui status layar
  function update() {
    const w = window.innerWidth;
    const bp = breakpoint(w);
    const ori = orientation();
    visited[bp] = true;

    widthEl.textContent = w + 'px (' + bp + ')';
    orientEl.textContent = ori;
    sizeEl.textContent = bp + ' / ' + ori;

    msgD.style.display = bp === 'desktop' ? 'flex' : 'none';
    msgT.style.display = bp === 'tablet' ? 'flex' : 'none';
    msgM.style.display = bp === 'mobile' ? 'flex' : 'none';

    cD.textContent = 'Desktop: ' + (visited.desktop ? 'sudah ✓' : 'belum');
    cT.textContent = 'Tablet: ' + (visited.tablet ? 'sudah ✓' : 'belum');
    cM.textContent = 'Mobile: ' + (visited.mobile ? 'sudah ✓' : 'belum');

    if (visited.desktop && visited.tablet && visited.mobile) {
      success.style.display = 'block';
      if (hint) hint.textContent = 'Semua tampilan dikunjungi. Orientasi terakhir: ' + ori + '.';
    } else if (hint) {
      const missing = [];
      if (!visited.desktop) missing.push('Desktop');
      if (!visited.tablet) missing.push('Tablet');
      if (!visited.mobile) missing.push('Mobile');
      hint.textContent = 'Kurang: ' + missing.join(', ') + '. Orientasi saat ini: ' + ori + '.';
    }
  }

  window.addEventListener('resize', update);
  window.addEventListener('orientationchange', function() { setTimeout(update, 100); });
  resetBtn.addEventListener('click', function() {
    visited.desktop = false; visited.tablet = false; visited.mobile = false;
    success.style.display = 'none';
    update();
  });
  update();
});
