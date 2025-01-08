export const API_HOST = (() => {
  const hostname = window.location.hostname;

  if (hostname === 'localhost') {
    return 'http://localhost:3000';
  }

  if (hostname === 'bread-and-butter-silk.vercel.app') {
    return 'https://bread-and-butter-silk.vercel.app';
  }

  // GitHub Pages 도메인
  if (hostname.includes('github.io')) {
    return 'https://bread-and-butter-silk.vercel.app';
  }

  // 기본값
  return 'https://bread-and-butter-silk.vercel.app';
})();
