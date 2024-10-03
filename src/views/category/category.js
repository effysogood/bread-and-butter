import { API_HOST } from '../common/api.js';

let currentPage = 1;
let totalPage = 1;

// 페이지가 로드되면 상품 리스트 렌더링
document.addEventListener('DOMContentLoaded', function () {
  const prevPageBtn = document.querySelector('.previous-page a');
  const nextPageBtn = document.querySelector('.next-page a');
  const productFilter = document.querySelector('.product-filter');

  // 이전 페이지로 이동
  prevPageBtn.addEventListener('click', function (e) {
    e.preventDefault();
    if (currentPage > 1) {
      currentPage--;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      getCategoryBooks();
    }
  });

  // 다음 페이지로 이동
  nextPageBtn.addEventListener('click', function (e) {
    e.preventDefault();
    if (currentPage < totalPage) {
      currentPage++;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      getCategoryBooks();
    }
  });

  productFilter.addEventListener('change', function () {
    // 선택한 옵션에 따라 상품 정렬 함수 호출
    sortProductsByOption(productFilter.value);
  });

  window.addEventListener('load', () => {
    sortProductsByOption(productFilter.value);
  });
});

function updatePagination() {
  const currentPageInfo = document.getElementById('currentPageInfo');
  currentPageInfo.textContent = `Page ${currentPage} of ${totalPage}`;
}

function sortProductsByOption(option) {
  function getCategoryIdFromUrl() {
    const url = new URL(window.location.href);
    return url.searchParams.get('category');
  }

  const categoryId = getCategoryIdFromUrl();
  fetch(`${API_HOST}/api/categories/books/${categoryId}?page=${currentPage}`)
    .then((response) => response.json())
    .then((categoryBooks) => {
      const books = categoryBooks.data.books.books;

      totalPage = categoryBooks.data.books.totalPage;

      const categoryName = document.getElementById('categoryName');
      categoryName.innerText = `${categoryBooks.data.books.category}`;

      const totalText = document.getElementById('totalCount');
      totalText.innerText = `${categoryBooks.data.books.productCount} products`;

      switch (option) {
        case '최신상품':
          books.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        case '인기상품':
          books.sort((a, b) => b.rate - a.rate);
          break;
        case '낮은 가격순':
          books.sort((a, b) => a.price - b.price);
          break;
        case '높은 가격순':
          books.sort((a, b) => b.price - a.price);
          break;
        default:
          break;
      }

      renderSortedProducts(books);
      updatePagination();
    })
    .catch((error) => {
      console.error('상품을 정렬하는 중 오류가 발생했습니다:', error);
    });
}

function renderSortedProducts(sortedBooks) {
  const productListElement = document.getElementById('productList');
  productListElement.innerHTML = '';

  sortedBooks.slice(0, 24).forEach((book) => {
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

    // 상품 재고가 0일 경우, sold-out 태그
    if (book.quantity === 0) {
      productItem.classList.add('sold-out');
    } else {
      productItem.classList.remove('sold-out');
    }

    productListElement.appendChild(productItem);
  });
}
