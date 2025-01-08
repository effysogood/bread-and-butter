document.addEventListener('DOMContentLoaded', function () {
  const elements = document.querySelectorAll('[data-load-html]');

  elements.forEach(async function (element) {
    try {
      const filePath = element.getAttribute('data-load-html');
      const response = await fetch(filePath);

      if (!response.ok) throw new Error(`Failed to load ${filePath}`);

      const html = await response.text();
      element.innerHTML = html;
    } catch (error) {
      console.error('Error loading HTML:', error);
    }
  });
});
