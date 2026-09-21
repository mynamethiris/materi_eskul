document.addEventListener('DOMContentLoaded', function() {
  const targetTitle = document.getElementById('target-title');
  const targetDesc = document.getElementById('target-desc');
  const successMessage = document.getElementById('success-message');
  const resetBtn = document.getElementById('reset-btn');

  if (!targetTitle || !targetDesc || !successMessage || !resetBtn) return;

  const originalTitle = targetTitle.textContent;
  const originalDesc = targetDesc.textContent;
  let alreadyShown = false;

  // Cek jawaban benar
  function isDone() {
    return targetTitle.textContent.trim() === 'Saya Berhasil!' &&
      targetDesc.textContent.trim() === 'Saya paham Inspect Element!';
  }

  // Tampilkan pesan sukses
  function check() {
    if (isDone()) {
      successMessage.style.display = 'block';
      targetTitle.style.color = 'hsl(var(--success))';
      targetDesc.style.color = 'hsl(var(--success))';
    }
  }

  setInterval(function() {
    if (!alreadyShown && isDone()) {
      alreadyShown = true;
      check();
    }
  }, 400);

  resetBtn.addEventListener('click', function() {
    targetTitle.textContent = originalTitle;
    targetDesc.textContent = originalDesc;
    targetTitle.style.color = '';
    targetDesc.style.color = '';
    successMessage.style.display = 'none';
    alreadyShown = false;
  });
});
