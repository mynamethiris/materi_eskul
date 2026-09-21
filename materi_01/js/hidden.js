document.addEventListener('DOMContentLoaded', function() {
  const box = document.getElementById('secret-box');
  const success = document.getElementById('hidden-success');
  const hint = document.getElementById('hidden-hint');
  const hideBtn = document.getElementById('hide-again');
  let done = false;

  if (!box || !success) return;

  // Cek kotak terlihat
  function isVisible() {
    if (!box) return false;
    const style = window.getComputedStyle(box);
    return style.display !== 'none' &&
      style.visibility !== 'hidden' &&
      parseFloat(style.opacity) > 0 &&
      box.offsetParent !== null;
  }

  setInterval(function() {
    if (!done && isVisible()) {
      done = true;
      success.style.display = 'block';
      if (hint) hint.textContent = 'Status: kotak terlihat. Kerja bagus.';
    } else if (!done && hint) {
      hint.textContent = 'Status: kotak masih tersembunyi.';
    }
  }, 400);

  if (hideBtn) hideBtn.addEventListener('click', function() {
    box.style.display = 'none';
    success.style.display = 'none';
    done = false;
  });
});
