document.addEventListener('DOMContentLoaded', function() {
  console.log('%c[TANTANGAN 04] KODE RAHASIA: CONSOLE-2026', 'font-weight: bold; font-size: 14px;');
  console.log('Petunjuk: salin kode di atas ke form halaman ini.');
  console.warn('[TANTANGAN 04] Ini contoh console.warn, abaikan.');

  const form = document.getElementById('console-form');
  const success = document.getElementById('console-success');
  const explain = document.getElementById('explain-console');
  const error = document.getElementById('console-error');
  const hint = document.getElementById('console-hint');

  if (!form || !success || !error) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const val = document.getElementById('console-code').value.trim();
    if (!val) {
      success.style.display = 'none';
      error.style.display = 'none';
      if (explain) explain.style.display = 'none';
      if (hint) hint.textContent = 'Isi kodenya dulu sebelum diperiksa.';
      return;
    }
    if (val === 'CONSOLE-2026') {
      error.style.display = 'none';
      success.style.display = 'block';
      if (explain) explain.style.display = 'flex';
      if (hint) hint.textContent = 'Kode cocok dengan log Console.';
    } else {
      success.style.display = 'none';
      error.style.display = 'block';
      if (explain) explain.style.display = 'none';
      if (hint) hint.textContent = 'Belum cocok. Perhatikan huruf besar dan strip.';
    }
  });
});
