document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('login-form');
  const success = document.getElementById('login-success');
  const error = document.getElementById('login-error');
  const source = document.getElementById('account-data');

  if (!form || !success || !error || !source) return;

  const correctUser = source.getAttribute('data-username');
  const correctPass = source.getAttribute('data-password');

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value;
    const hint = document.getElementById('form-hint');

    if (!user || !pass) {
      success.style.display = 'none';
      error.style.display = 'none';
      if (hint) hint.textContent = 'Isi username dan password dulu sebelum diperiksa.';
      return;
    }
    if (hint) hint.textContent = 'Memeriksa jawaban...';

    if (user === correctUser && pass === correctPass) {
      error.style.display = 'none';
      success.style.display = 'block';
      if (hint) hint.textContent = 'Jawaban cocok dengan data tersembunyi.';
    } else {
      success.style.display = 'none';
      error.style.display = 'block';
      if (hint) hint.textContent = 'Belum cocok. Periksa lagi data-username dan data-password.';
    }
  });
});
