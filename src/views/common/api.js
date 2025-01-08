export const API_HOST = (() => {
  const hostname = window.location.hostname;

  if (hostname === 'localhost') {
    return 'http://localhost:3000';
  }

  // Vercel 배포 URL
  return 'https://bread-and-butter-silk.vercel.app';
})();
