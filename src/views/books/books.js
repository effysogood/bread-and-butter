import { API_HOST } from '../common/api.js';
let currentPage = 1;
let totalPage = 1;

// 페이지가 로드되면 상품 리스트 렌더링
document.addEventListener('DOMContentLoaded', function () {
  // 페이지네이션 버튼 가져오기
  const prevPageBtn = document.querySelector('.previous-page a');
  const nextPageBtn = document.querySelector('.next-page a');
  const productFilter = document.querySelector('.product-filter');

  // 이전 페이지로 이동
  prevPageBtn.addEventListener('click', function (e) {
    e.preventDefault();
    if (currentPage > 1) {
      currentPage--;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      getAllBooks();
    }
  });

  // 다음 페이지로 이동
  nextPageBtn.addEventListener('click', function (e) {
    e.preventDefault();
    if (currentPage < totalPage) {
      currentPage++;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      getAllBooks();
    }
  });

  // 정렬 옵션 변경 시 이벤트 핸들러 추가
  productFilter.addEventListener('change', function () {
    getAllBooks();
  });
});

/* 모든 책 가져오기 */
async function getAllBooks() {
  try {
    const productFilter = document.querySelector('.product-filter');
    const selectedOption = productFilter.value;

    // 서버에서 모든 책 목록을 가져오는 API 호출
    const response = await fetch(
      `${API_HOST}/api/books/sort?page=${currentPage}&option=${selectedOption}`
    );

    // API 응답 데이터를 JSON 형태로 변환
    const allBooks = await response.json();
    const books = allBooks.data.books;

    totalPage = allBooks.data.totalPage;

    // 여기서 책 목록을 활용하여 원하는 작업을 수행할 수 있습니다.
    const productListElement = document.getElementById('productList');

    // totalNum
    // 리스트에 뿌려지는 아이템 갯수
    const totalText = document.getElementById('totalCount');
    totalText.innerText = `${allBooks.data.productCount} products`;

    productListElement.innerHTML = '';

    books.slice(0, 24).forEach((book) => {
      // 상품 요소 생성
      const productItem = document.createElement('li');
      productItem.classList.add('product-item');
      productItem.innerHTML = `
            <a href="/detail?id=${book._id}">
                <div class="img-container"><img src="${
                  book.img_url
                }" alt="제품 이미지"></div>
                <h2>${book.title}</h2>
                <span class="price">${book.price.toLocaleString()} 원</span>
            </a>
        `;

      // 상품 리스트에 상품 추가
      productListElement.appendChild(productItem);
    });
  } catch (error) {
    console.error('모든 책 목록을 조회하는 중 오류가 발생했습니다:', error);
  }
  updatePagination();
}

// 페이지가 로드되면 상품 리스트 렌더링
window.addEventListener('load', () => {
  getAllBooks();
});

function updatePagination() {
  const currentPageInfo = document.getElementById('currentPageInfo');
  currentPageInfo.textContent = `Page ${currentPage} of ${totalPage}`;
}
