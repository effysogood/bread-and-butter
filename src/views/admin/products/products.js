let products = {};
let currentPage = 1;
let totalPage = 1;

// ID로 현재 가지고 있는 제품들 중에서 찾기
function findProductById(id) {
  return products[id];
}
// 카테고리 리스트
// 카테고리 리스트를 불러오고 각 카테고리에 대한 요청을 보내는 함수
async function getCategory() {
  try {
    const response = await fetch(`${API_HOST}/api/categories`);
    const result = await response.json();
    return result.data
    
  } catch (error) {
    console.error('카테고리 정보를 불러오는 중 오류 발생:', error);
  }
}

// 페이지가 로드될 때
document.addEventListener('DOMContentLoaded', function () {
  // 페이지가 로드되면 상품 리스트 렌더링
  renderProductList();
  
  // 모달 열기 버튼과 모달 가져오기
  const addBtn = document.getElementById("add-btn");
  const modal1 = document.getElementById("myModal1");
  const modal2 = document.getElementById("myModal2");
  
  // 페이지네이션 버튼 가져오기
  const prevPageBtn = document.querySelector(".previous-page a");
  const nextPageBtn = document.querySelector(".next-page a");
  
  // 이전 페이지로 이동
  prevPageBtn.addEventListener("click", function (e) {
    e.preventDefault();
    if (currentPage > 1) {
      currentPage--;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      renderProductList();
    }
  });
  
  // 다음 페이지로 이동
  nextPageBtn.addEventListener("click", function (e) {
    e.preventDefault();
    if (currentPage < totalPage) {
      currentPage++;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      renderProductList();
    }
  });
  
  // 상품 추가 버튼에 이벤트 리스너 추가
  addBtn.addEventListener("click", function () {
    var pargraph = modal1.querySelector("p");
    if (pargraph) {
      pargraph.innerText = "상품 추가";
    }
    modal1.style.display = "flex";
    initializeForm();   // 폼 초기화
    
    // 저장 버튼에 이벤트 리스너 추가
    const saveBtn1 = document.getElementById("save-Btn1");
    saveBtn1.onclick = createProduct;
    
    // 카테고리 목록 가져와서 셀렉트 박스 업데이트
    getCategory().then(categories => {
      const categorySelect = document.getElementById('categorySelect');
      
      // 기존의 내용을 지우고 새로운 카테고리 목록으로 업데이트
      categorySelect.innerHTML = '';
      
      // 새로운 옵션(카테고리)을 추가
      const placeholderOption = document.createElement('option');
      placeholderOption.value = '';
      placeholderOption.text = '카테고리 선택';
      categorySelect.appendChild(placeholderOption);
      
      categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category._id;
        option.text = category.name;
        categorySelect.appendChild(option);
      });
    });
  });
  
  // 모달 닫기 함수
  modal1.addEventListener("mousedown", function (e) {
    if (e.target !== modal1) return;
    modal1.style.display = "none";
  });
});

// Modal에서 입력된 상품 데이터 가져오기
function getProductDataFromModal() {
  // 모달 내 입력 필드 값 가져오기
  const bestSellerInput = document.getElementById("BestsellerInput");
  const titleInput = document.querySelector("#myModal1 input[placeholder='상품명']");
  const contentInput = document.querySelector("#myModal1 input[placeholder='상품 설명']");
  const categoryInput = document.getElementById("categorySelect");
  const priceInput = document.querySelector("#myModal1 input[placeholder='가격']");
  const imageInput = document.querySelector("#myModal1 input[placeholder='이미지']");
  const quantityInput = document.querySelector("#myModal1 input[placeholder='수량']");
  const rateInput = document.querySelector("#myModal1 input[placeholder='별점']");
  
  // 새로운 제품 정보를 객체로 만들기
  const newProduct = {
    isBestSeller: bestSellerInput.checked,
    title: titleInput.value,
    category_id: categoryInput.value,
    content: contentInput.value,
    price: priceInput.value,
    img_url: imageInput.value,
    quantity: quantityInput.value,
    rate: rateInput.value,
  };
  
  return newProduct;
}
// //이미지 업로드!!!!!!!!!!!!!!

document.addEventListener('DOMContentLoaded', function () {
  const uploadBtn = document.getElementById('upload-btn');
  const fileInput = document.getElementById('file-input');
  const categorySelect = document.getElementById('categorySelect');
  // '업로드' 버튼 클릭 시 파일 선택 다이얼로그를 엽니다.
  uploadBtn.addEventListener('click', function() {
    fileInput.click();
  });
  
  // 파일 선택 시 파일 이름을 텍스트 필드에 표시합니다.
  fileInput.addEventListener('change', function() {
    const selectedFile = this.files[0];
    if (selectedFile) {
      document.querySelector('input[placeholder="이미지"]').value = selectedFile.name;
    } else {
      document.querySelector('input[placeholder="이미지"]').value = '';
    }
  });
});


// 새로운 제품(책) 추가
function createProduct() {
  const newProduct = getProductDataFromModal();
  const modal1 = document.getElementById("myModal1");
  const fileInput = document.getElementById('file-input');
  const selectedFile = fileInput.files[0];
  
  // 이미지 파일이 선택된 경우
  if (selectedFile) {
    const formData = new FormData();
    formData.append('file', selectedFile);
    
    // 이미지 업로드
    fetch(`${API_HOST}/api/uploads`, { // 이미지 업로드 API 경로
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      if (data.message === 'File uploaded successfully' && data.url) {
        // 반환된 URL을 newProduct 객체에 추가
        newProduct.img_url = data.url;
        
        // API를 통해 새로운 제품 추가
        return fetch(`${API_HOST}/api/books/admin`, {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newProduct),
        });
      } else {
        throw new Error('File upload failed');
      }
    })
    .then(response => {
      if (response.ok) {
        alert("새로운 상품이 추가되었습니다.");
        modal1.style.display = "none";
        window.location.reload()
        renderProductList();
      } else {
        throw new Error('Product addition failed');
      }
    })
    .catch(error => {
      console.error('An error occurred while adding a product:', error);
      alert('Product addition failed');
    });
  }
}



function updateModalContent(product) {
  const bestSellerInput = document.getElementById("BestsellerInput");
  const titleInput = document.querySelector("#myModal1 input[placeholder='상품명']");
  const categoryInput = document.getElementById("categorySelect");
  const contentInput = document.querySelector("#myModal1 input[placeholder='상품 설명']");
  const priceInput = document.querySelector("#myModal1 input[placeholder='가격']");
  const imageInput = document.querySelector("#myModal1 input[placeholder='이미지']");
  const quantityInput = document.querySelector("#myModal1 input[placeholder='수량']");
  const rateInput = document.querySelector("#myModal1 input[placeholder='별점']");
  
  bestSellerInput.checked = product.isBestSeller;
  titleInput.value = product.title;
  categoryInput.value = product.category_id.name;
  console.log(product.category_id.name);
  contentInput.value = product.content;
  priceInput.value = product.price;
  imageInput.value = product.img_url;
  quantityInput.value = product.quantity;
  rateInput.value = product.rate;
}

function connectModalEvent() {
  // 모달 열기 버튼과 모달 가져오기
  const modalEditBtns = document.querySelectorAll(".modal-edit-btn");
  const modalDeleteBtns = document.querySelectorAll(".modal-delete-btn");
  const modal1 = document.getElementById("myModal1");
  
  // 수정버튼
  modalEditBtns.forEach(function (modalEditBtn) {
    modalEditBtn.addEventListener("click", function () {
      var pargraph = modal1.querySelector("p");
      if (pargraph) {
        pargraph.innerText = "상품 수정";
      }
      modal1.style.display = "flex";
      
      const productId = modalEditBtn.dataset.productId;
      if (!productId) return;
      const product = findProductById(productId);
      updateModalContent(product)
      
      getCategory().then(categories => {
        const categorySelect = document.getElementById('categorySelect');
  
        categorySelect.innerHTML = '';

        // 새로운 옵션(카테고리)을 추가
        const placeholderOption = document.createElement('option');
        placeholderOption.value = '';
        placeholderOption.text = '카테고리 선택';
        categorySelect.appendChild(placeholderOption);
        
        categories.forEach(category => {
          const option = document.createElement('option');
          option.value = category._id;
          option.text = category.name;
          categorySelect.appendChild(option);
        });

        categorySelect.value = product.category_id._id;
      });
      
      // 저장 버튼에 이벤트 리스너 추가
      const saveBtn1 = document.getElementById("save-Btn1");
      saveBtn1.onclick = () => editProduct(productId);
    });
  });
  
  // 삭제버튼
  modalDeleteBtns.forEach(function (modalDeleteBtn) {
    modalDeleteBtn.addEventListener("click", function () {
      const productId = modalDeleteBtn.dataset.productId;
      if (!productId) return;
      deleteProduct(productId)
    });
  });
}

// 수정 모달의 저장 버튼을 눌렀을 때 실행되는 함수
function editProduct(id) {
  const newProduct = getProductDataFromModal();
  const modal1 = document.getElementById("myModal1");
  const fileInput = document.getElementById('file-input');
  const selectedFile = fileInput.files[0];
  
  // 이미지 파일이 선택된 경우
  if (selectedFile) {
    const formData = new FormData();
    formData.append('file', selectedFile);
    
    // 이미지 업로드
    fetch(`${API_HOST}/api/uploads`, { // 이미지 업로드 API 경로
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      if (data.message === 'File uploaded successfully' && data.url) {
        // 반환된 URL을 newProduct 객체에 추가
        newProduct.img_url = data.url;
        
        
        // 상품 정보 수정 API 호출
        return fetch(`${API_HOST}/api/books/admin/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newProduct),
        });
      } else {
        throw new Error('파일 업로드 실패');
      }
    })
    .then(response => {
      if (response.ok) {
        alert("상품 정보가 수정되었습니다.");
        modal1.style.display = "none";
        window.location.reload()
        renderProductList();
      } else {
        throw new Error('상품 수정 실패');
      }
    })
    .catch(error => {
      console.error('상품 수정 중 오류가 발생했습니다:', error);
      alert('상품 수정 실패');
    });
  }
  
  // 이미지 파일이 선택되지 않은 경우
  else {
    fetch(`${API_HOST}/api/books/admin/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProduct),
    })
    .then(response => {
      if (response.ok) {
        alert("상품 정보가 수정되었습니다.");
        modal1.style.display = "none";
        window.location.reload()
        renderProductList();
      } else {
        alert('상품 수정 실패');
      }
    })
    .catch(error => {
      console.error('상품 수정 중 오류가 발생했습니다:', error);
      alert('상품 수정 실패');
    });
  }
}


function deleteProduct(product) {
  // 삭제요청 API
  fetch(`${API_HOST}/api/books/admin/${product}`, {
    method: 'delete',
  })
  .then(response => {
    if (response.ok) {
      
      alert("상품이 삭제되었습니다.");
      window.location.reload()
      renderProductList();
    } else {
      alert('삭제 실패')
    }
  })
  .catch(error => {
    console.error('삭제 중 오류가 발생했습니다:', error);
    alert('삭제 실패');
  });
}
// moal1 초기화
function initializeForm() {
  const bestSellerInput = document.getElementById("BestsellerInput");
  const titleInput = document.querySelector("#myModal1 input[placeholder='상품명']");
  const categoryInput = document.getElementById("categorySelect");
  const contentInput = document.querySelector("#myModal1 input[placeholder='상품 설명']");
  const priceInput = document.querySelector("#myModal1 input[placeholder='가격']");
  const imageInput = document.querySelector("#myModal1 input[placeholder='이미지']");
  const quantityInput = document.querySelector("#myModal1 input[placeholder='수량']");
  const rateInput = document.querySelector("#myModal1 input[placeholder='별점']");
  
  // 폼 필드 초기화
  bestSellerInput.checked = "";
  titleInput.value = "";
  categoryInput.value = "";
  contentInput.value = "";
  priceInput.value = "";
  imageInput.value = "";
  quantityInput.value = "";
  rateInput.value = "";
}
// 제품 리스트 가져오기 //
import { API_HOST } from '../../common/api.js';

/* 상품 데이터를 가져와서 상품 리스트를 렌더링하는 함수 */
async function renderProductList() {
  try {
    // API에서 상품 데이터 가져오기
    const response = await fetch(`${API_HOST}/api/books/all?page=${currentPage}`);
    if (!response.ok) {
      throw new Error('상품 데이터를 가져올 수 없습니다.');
    }
    
    const data = await response.json();
    
    // 상품 데이터 설정
    products = {};
    data.data.books.forEach((book) => {
      products[book._id] = book;
    });
    
    // 페이지 정보 설정
    totalPage = data.data.totalPage;
    
    const productListElement = document.getElementById('tbody');
    
    tbody.innerHTML = '';
    
    // 상품 데이터를 기반으로 상품 리스트 생성
    for (const [id, product] of Object.entries(products)) {
      const row = document.createElement('tr');
      row.classList.add('products-list');
      row.innerHTML = `
      <td id="product-BestSeller">
      <input type="checkbox" ${product.isBestSeller ? 'checked' : ''} disabled>
      </td>
      <td id="product-title">${product.title}</td>
      <td id="product-category">${product.category_id.name}</td>
      <td class="content" id="product-content">${product.content}</td>
      <td id="product-price">${product.price.toLocaleString()}</td>
      <td class="img" id="product-img"><img src="${product.img_url}" alt="제품 이미지" width="80px" heigth="60px" ></td>
      <td id="product-quantity">${product.quantity}</td>
      <td id="product-rate">${product.rate}</td>
      <td>
      <button
      id="openModalbtn1"
      class="modal-edit-btn"
      data-product-id="${product._id}"
      >수정</button>
      <button 
      id="openModalbtn2"
      class="modal-delete-btn"
      data-product-id="${product._id}"
      >
      삭제
      </button>
      </td>`;
      
      productListElement.appendChild(row);
    };
    
    // 모달 이벤트 다시 연결
    connectModalEvent();
    updatePagination();
  } catch (error) {
    console.error('상품 리스트를 렌더링하는 중 오류가 발생했습니다:', error);
  }
}

function updatePagination() {
  const currentPageInfo = document.getElementById("currentPageInfo");
  currentPageInfo.textContent = `Page ${currentPage} of ${totalPage}`;
}