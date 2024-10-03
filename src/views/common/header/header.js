import { API_HOST } from '../../common/api.js';
import { waitFor } from '../../common/utils.js';

// 카테고리 데이터 불러오기
async function fetchCategory() {
  try {
    const response = await fetch(`${API_HOST}/api/categories`);
    const res = await response.json();
    return res.data;
  } catch (error) {
    console.error('카테고리를 렌더링하는 중 오류가 발생했습니다:', error);
  }
}

// 유저 정보 불러오기
async function fetchUser() {
  const signOutBtn = document.querySelector('.button-signout');
  const userBtn = document.querySelector('.button-user a');
  const adminBtn = document.querySelector('.button-admin');

  try {
    const response = await fetch(`${API_HOST}/api/users/mypage`);
    const res = await response.json();
    if (!response.ok) throw new Error();

    signOutBtn.classList.remove('hidden');
    userBtn.href = '/mypage';

    res.user.is_admin
      ? adminBtn.classList.remove('hidden')
      : adminBtn.classList.add('hidden');

    return res;
  } catch (error) {
    signOutBtn.classList.add('hidden');
    userBtn.href = '/login';
    adminBtn.classList.add('hidden');
  }
}

// 카테고리 데이터를 가져와서 메뉴를 렌더링하는 함수
async function renderCategory() {
  try {
    const category = await fetchCategory();
    const categoryListElement = document.getElementById('categoryList');

    category.forEach((category) => {
      const categoryItem = document.createElement('li');
      categoryItem.classList.add('menu');
      categoryItem.innerHTML = `
            <a href="/category?category=${category._id}">${category.name}</a>
            `;

      categoryListElement.appendChild(categoryItem);
    });
  } catch (error) {
    console.error('카테고리를 렌더링하는 중 오류가 발생했습니다:', error);
  }
}

// 페이지가 로드되면 상품 리스트 렌더링
document.addEventListener('DOMContentLoaded', async () => {
  await waitFor(() => {
    return !!document.getElementById('categoryList');
  });

  // 로그아웃 버튼 클릭 시
  const signOutBtn = document.querySelector('.button-signout');
  signOutBtn.addEventListener('click', async () => {
    try {
      const response = await fetch(`${API_HOST}/api/users/logout`);
      const res = await response.json();

      if (!response.ok) throw new Error(res.msg);
      location.href = '/';
    } catch (error) {
      console.error('로그아웃 중 오류가 발생했습니다:', error);
    }
  });

  // 유저 정보 불러오기
  const user = await fetchUser();

  // 로그인된 상태에서만 UI 업데이트
  if (user && user.user) {
    const userBtn = document.querySelector('.button-user a');
    userBtn.href = '/mypage';

    if (user.user.is_admin) {
      const adminBtn = document.querySelector('.button-admin');
      adminBtn.classList.remove('hidden');
    }
  }

  const btnScrollTop = document.getElementById('scrollToTopButton');

  function showTopButton(button) {
    button.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
  }

  // 최상단 이동 버튼 이벤트 리스너 설정
  if (btnScrollTop) showTopButton(btnScrollTop);

  // 장바구니 아이템 수 초기화
  updateCartItemCount();
  // 카테고리 렌더링
  renderCategory();
});

// 장바구니 아이템 수 업데이트 함수
function updateCartItemCount() {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

  const cartItemCountElement = document.querySelector('.num');
  if (cartItemCountElement) {
    cartItemCountElement.textContent = cartItems.length;
  }
}
