import { API_HOST } from '../common/api.js';

async function getProductInfo(productId) {
  try {
    const response = await fetch(`${API_HOST}/api/books/${productId}`);
    const res = await response.json();
    return res.data;
  } catch (error) {
    console.error('상품 리스트를 렌더링하는 중 오류가 발생했습니다:', error);
  }
}
// 로컬스토리지 cartItems [] 키값 밸류 생성 및 키값에 데이터저장
function saveProductToLocalStorage(productInfo) {
  // 로컬 스토리지에서 기존 카트 아이템을 가져오기
  let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

  // 제품이 이미 카트에 존재하는지 확인
  const existingProductIndex = cartItems.findIndex(item => item.name === productInfo.name);

  if (existingProductIndex === -1) {
    // 카트에 존재하지 않는 경우, 새로운 아이템으로 추가
    cartItems.push(productInfo);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    alert('상품이 장바구니에 추가되었습니다!');
  } else {
    // 카트에 이미 존재하는 경우, 수량 업데이트
    cartItems[existingProductIndex].quantity += productInfo.quantity;
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    alert('장바구니에 있는 상품의 수량이 업데이트되었습니다!');
  }
}

async function updateProductInfo() {
  const productInfoElement = document.querySelector(
    '.mainBox .inner .topBox > div'
  );
  if (!productInfoElement) {
    alert('상품을 표시할 수 없습니다.');
    return;
  }

  const productId = getProductIdFromUrl();
  const product = await getProductInfo(productId);

  productInfoElement.innerHTML = `    
  <div class="bookImg">
  <p class="img"><img src="${product.img_url}" alt="책 표지"></p>
</div>

<div class="bookInfo">
  <h2 class="bookName">${product.title}</h2>

  <div class="option">
      <p class="category">${product.category_id.name}</p>
      <p class="stars">
          <ion-icon name="star"></ion-icon>
          <span class="num">${product.rate}</span>
      </p>
  </div>

  <h3 class="price">￦ <span class="price">${product.price.toLocaleString()}</span></h3>
  <div class="priceButton">
      <div class="quantityButton">
          <button id="decreaseQuantity"><ion-icon name="remove-outline"></ion-icon></button>
          <span class="quantityInput"> 1 </span>
          <button id="increaseQuantity"><ion-icon name="add-outline"></button>
      </div>
      <!-- <p>￦<span class="price">17,000</span></p> -->
      <button type="button"  class="cartBtn">ADD TO CART</button>
  </div>
  <div class="bookText">
  ${product.content}
</div>
  `;

  const productPrice = document.querySelector('.topBox .price');
  const btnCart = document.querySelector('.topBox .priceButton .cartBtn');
  // 상품 재고가 0일 경우, sold-out 태그
  if (product.quantity === 0) {
    productPrice.classList.add('sold-out');
    btnCart.classList.add('inactive');
  } else {
    productPrice.classList.remove('sold-out');
    btnCart.classList.remove('inactive');
  }

  // 수량 감소 버튼 클릭 시 이벤트 핸들러
  document
    .getElementById('decreaseQuantity')
    .addEventListener('click', function () {
      const quantityInput = document.querySelector('.quantityInput');
      let quantity = parseInt(quantityInput.textContent);
      if (quantity > 1) {
        quantityInput.textContent = --quantity;
      }
    });

  // 수량 증가 버튼 클릭 시 이벤트 핸들러
  document
    .getElementById('increaseQuantity')
    .addEventListener('click', function () {
      const quantityInput = document.querySelector('.quantityInput');
      let quantity = parseInt(quantityInput.textContent);
      quantityInput.textContent = ++quantity;
    });

  // ADD TO CART 버튼에 이벤트 리스너 등록
document.querySelector('.cartBtn').addEventListener('click', function () {
  const productInfo = {
    name: product.title,
    price: product.price,
    quantity: parseInt(document.querySelector('.quantityInput').textContent),
    img: product.img_url,
  };
  saveProductToLocalStorage(productInfo);

  window.location.reload();
  });
}

function getProductIdFromUrl() {
  const url = new URL(window.location.href);
  return url.searchParams.get('id');
}




window.addEventListener('load', updateProductInfo);

async function renderRecommendsList() {
  // TODO: API를 호출해서 상품 목록을 가져와서 반환합니다.

  try {
    // API에서 상품 데이터 가져오기
    const response = await fetch(`${API_HOST}/api/books/all`);
    if (!response.ok) {
      throw new Error('상품 데이터를 가져올 수 없습니다.');
    } else {
      console.log('성공이다!!');
    }

    const data = await response.json();
    let products = data.data.books;

    const productListElement = document.getElementById('recommendsList');

    // 랜덤으로 4개만 선택
    let selected = [];
    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * products.length);
      selected.push(products[randomIndex]);
      products.splice(randomIndex, 1);
    }
    products = selected;

    // 상품 데이터를 기반으로 상품 리스트 생성
    products.forEach((product) => {
      // 상품 요소 생성
      const productItem = document.createElement('li');
      productItem.classList.add('Recommends-item');
      productItem.innerHTML = `
        <a href="/detail?id=${product._id}">
        <div class="img-container"><img src="${
          product.img_url
        }" alt="제품 이미지"></div>
        <h2 class="Recommends-name">${product.title}</h2>
        <span class="Recommends-price">${product.price.toLocaleString()}</span>
            </a>
        `;

      productListElement.appendChild(productItem);
    });
  } catch (error) {
    console.error('상품 리스트를 렌더링하는 중 오류가 발생했습니다:', error);
  }
}

window.addEventListener('load', () => {
  // 페이지가 로드되면 베스트셀러 이름을 업데이트한다
  renderRecommendsList();
});
