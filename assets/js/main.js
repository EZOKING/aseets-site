(function () {
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  const contactForm = document.querySelector('.contact-form');
  const statusElement = document.querySelector('.form-status');

  if (!contactForm) {
    return;
  }

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (statusElement) {
      statusElement.textContent = 'Envoi en cours...';
      statusElement.className = 'form-status pending';
    }

    const formData = new FormData(contactForm);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erreur inconnue');
      }

      if (statusElement) {
        statusElement.textContent = result.message || 'Message bien reçu !';
        statusElement.className = 'form-status success';
      }

      contactForm.reset();
    } catch (error) {
      if (statusElement) {
        statusElement.textContent = error.message || "Une erreur s'est produite.";
        statusElement.className = 'form-status error';
      }
    }
  });
})();
