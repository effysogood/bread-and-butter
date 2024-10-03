import { API_HOST } from '../common/api.js';

async function getBestSellersList() {
  let products; // 'products' 변수를 선언

  try {
    const response = await fetch(`${API_HOST}/api/books/bestsellers`);
    if (!response.ok) {
      throw new Error('상품 데이터를 가져올 수 없습니다.');
    } else {
      console.log('데이터 가져오기 성공!!');
    }

    const data = await response.json();
    products = data.data; // 'products' 변수에 데이터 할당

    const maxProductsToShow = 8;
    let productsShown = 0;

    // 베스트셀러 리스트를 나타내는 엘리먼트를 찾음
    const bestSellersListElement = document.getElementById('bestSellersList');

    products.forEach((product) => {
      // 상품이 베스트셀러이고, 최대 표시 상품 개수에 도달하지 않았을 때만 처리
      if (product.isBestSeller === true && productsShown < maxProductsToShow) {
        const productItem = document.createElement('li');
        productItem.classList.add('Best-item');
        productItem.innerHTML = `
                    <a href="/detail?id=${product._id}">
                    <div class="img-container"><img src="${
                      product.img_url
                    }" alt="제품 이미지"></div>
                    <h2>${product.title}</h2>
                    <span class="price">${product.price.toLocaleString()} 원</span>
                    </a>
                `;

        // 상품 재고가 0일 경우, sold-out 태그
        if (product.quantity === 0) {
          productItem.classList.add('sold-out');
        } else {
          productItem.classList.remove('sold-out');
        }

        // 리스트에 상품 아이템 추가
        bestSellersListElement.appendChild(productItem);
        productsShown++; // 표시된 상품 개수 증가
      }
    });
  } catch (error) {
    console.error(
      '베스트셀러 상품 리스트를 가져오는 중 오류가 발생했습니다:',
      error
    );
  }
}

// 페이지가 로드되면 베스트셀러 상품 리스트 렌더링
window.addEventListener('load', () => {
  getBestSellersList();
});
