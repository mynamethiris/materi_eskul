document.addEventListener('DOMContentLoaded', function() {
  const btn = document.getElementById('claim-btn');
  const success = document.getElementById('disabled-success');
  const explain = document.getElementById('explain-disabled');
  const hint = document.getElementById('disabled-hint');
  const lockBtn = document.getElementById('lock-again');

  if (!btn || !success) return;

  btn.addEventListener('click', function() {
    if (btn.disabled) return;
    success.style.display = 'block';
    if (explain) explain.style.display = 'flex';
    btn.textContent = 'Hadiah Diklaim!';
    if (hint) hint.textContent = 'Status: tombol diklik dalam keadaan aktif.';
  });

  setInterval(function() {
    if (success.style.display !== 'block' && !btn.disabled && hint) {
      hint.textContent = 'Status: tombol sudah aktif. Sekarang klik Klaim Hadiah.';
    }
  }, 500);

  if (lockBtn) lockBtn.addEventListener('click', function() {
    btn.disabled = true;
    btn.textContent = 'Klaim Hadiah (Terkunci)';
    success.style.display = 'none';
    if (explain) explain.style.display = 'none';
    if (hint) hint.textContent = 'Status: tombol masih terkunci (disabled).';
  });
});
