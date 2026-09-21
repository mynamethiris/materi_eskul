document.addEventListener('DOMContentLoaded', function() {
  const modal = document.getElementById('locked-modal');
  const success = document.getElementById('modal-success');
  const explain = document.getElementById('explain-modal');
  const closeBtn = document.getElementById('modal-close');
  const resetBtn = document.getElementById('modal-reset');

  if (!modal || !success) return;

  // Cek modal terbuka
  function isOpen() {
    const s = window.getComputedStyle(modal);
    return s.display !== 'none';
  }

  setInterval(function() {
    if (isOpen()) {
      success.style.display = 'block';
      if (explain) explain.style.display = 'flex';
    }
  }, 400);

  // Sembunyikan modal
  function hide() {
    modal.style.display = 'none';
  }
  if (closeBtn) closeBtn.addEventListener('click', hide);
  if (resetBtn) resetBtn.addEventListener('click', function() {
    hide();
    success.style.display = 'none';
    if (explain) explain.style.display = 'none';
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && isOpen()) hide();
  });
});
