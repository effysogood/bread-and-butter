import { API_HOST } from '../common/api.js';

/* 상품 데이터를 가져와서 상품 리스트를 렌더링하는 함수 */
async function renderProductList() {

  try {
      // API에서 상품 데이터 가져오기
      const response = await fetch(`${API_HOST}/api/books`);
      if (!response.ok) {
          throw new Error('상품 데이터를 가져올 수 없습니다.');
      } else {
        console.log("성공이다!!")
      }

      const data = await response.json();
      console.log(data)
      const products = data.data.books
      const totalNum = data.data.productCount
      const category = data.data.books

      const productListElement = document.getElementById('productList');
      const totalText = document.getElementById("totalCount")
      // const categoryName = document.getElementById("categoryName")

      
      // 상품 데이터를 기반으로 상품 리스트 생성
      products.forEach(product => {
          // 상품 요소 생성
          const productItem = document.createElement('li');
          productItem.classList.add('product-item');
          productItem.innerHTML = `
              <a href="/src/views/detail/detail.html?id=${product._id}">
                  <p class="img"><img src="${product.img_url}" alt="제품 이미지"></p>
                  <h2>${product.title}</h2>
                  <span class="price">${product.price}</span>
              </a>
          `;

          // 상품 리스트에 상품 추가
          productListElement.appendChild(productItem);
      });


      // 리스트에 뿌려지는 아이템 갯수
      totalText.innerText = `${totalNum} products`

  } catch (error) {
      console.error('상품 리스트를 렌더링하는 중 오류가 발생했습니다:', error);
  }
}

// 페이지가 로드되면 상품 리스트 렌더링
window.addEventListener('load', () => {
  renderProductList();
}); 
