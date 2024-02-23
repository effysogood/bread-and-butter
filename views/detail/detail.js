import { API_HOST } from '../common/api.js';

async function getProductInfo(id) {
  // TODO: API를 호출해서 상품 상세 정보를 가져와서 반환합니다.
  const apiUrl = `${API_HOST}/api/books/${id}`;

  // fetch를 사용하여 GET 요청 보내기
  const productDetail = fetch(apiUrl)
    .then(response => {
      // 응답을 JSON 형식으로 파싱
      return response.json();
    })
    .then(res => {
      // 성공적으로 데이터를 받았을 때 처리
      console.log(res.data);
      return res.data;
    })
    .catch(error => {
      // 오류 처리
      console.error('API 호출 중 오류 발생:', error);
    });


  return productDetail

  // 임시 Product 데이터
  // return { 
  //   _id: "1",
  //   title: 'Burger',
  //   category_id: {
  //     _id:"10",
  //     name:"test",
  //     sort: 10,
  //   },
  //   price: "10,000",
  //   content: "상품 설명",
  //   img_url: "https://picsum.photos/300/300",
  //   quantity: 3,
  //   rating: 4,
  //   __v: 0
  // }
}

/* 책 정보 */
async function updateProductInfo() {
  const productInfoElement = document.querySelector('.mainBox .inner .topBox > div');
  if (!productInfoElement) {
    alert('상품을 표시할 수 없습니다.')
    return
  }
  // URL에서 상품 ID 가져오기
  function getProductIdFromUrl() {
    const url = new URL(window.location.href);
    return url.searchParams.get('id');
  }
  //해당하는 url에서 상품 id를 가져온다
  const productId = getProductIdFromUrl();
  console.log('productId: ', productId);
  //상품 id를 통해 상품 정보를 가져온다
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
  <span class="num">${product.rating}</span>
  </p>
  </div>
  
  <div class="bookText">
  ${product.content}
  </div>
  
  <div class="priceButton">
  <p class="price">￦ ${product.price}</p>
  <button type="button">ADD TO CART</button>
  </div>
  </div>
  `;
}


window.addEventListener('load', () => {
  // 페이지가 로드되면 카테고리 이름을 업데이트한다
  updateProductInfo();
})

function getRecommendsList() {
  // TODO: API를 호출해서 상품 목록을 가져와서 반환합니다.
  
  // 임시 Recommends 데이터
  return [
    { id: 1, name: 'Recommends1', price: '10,000' },
    { id: 2, name: 'Team4 fighting', price: '50,000' },
    { id: 3, name: '정신나가정신나가', price: '30,000' },
    { id: 4, name: '정신들어와정신들어와', price: '70,000' },
  ];
}

function updateRecommendsList() {
  const RecommendsListElement = document.querySelector('ul.Recommends-list');
  if (!RecommendsListElement) {
    alert('상품 목록을 표시할 요소를 찾을 수 없습니다.');
    return;
  }
  
  const RecommendsList = getRecommendsList(); // API 호출해서 상품 목록 가져오기 => 서버를 호출하니까 느림
  
  RecommendsListElement.innerHTML = '';
  for (const Recommends of RecommendsList) {
    RecommendsListElement.innerHTML += `
    <li class="Recommends-item">
    <a href="#">
    <img src="https://picsum.photos/300/300" alt="제품 이미지">
    <h2>${Recommends.name}</h2>
    <span class="Recommends-price">${Recommends.price}</span>
    </a>
    </li>
    `;
  }
}

window.addEventListener('load', () => {
  // 페이지가 로드되면 베스트셀러 이름을 업데이트한다
  updateRecommendsList();
});
