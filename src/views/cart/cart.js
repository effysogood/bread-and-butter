document.addEventListener('DOMContentLoaded', function () {
  loadCartItems(); // 페이지 로드 시 장바구니 아이템 로드
});

function loadCartItems() {
  const cartList = document.querySelector('.cartList table tbody');
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

  cartList.innerHTML = ''; // 기존 목록 초기화

  // 장바구니 비었을 경우, 안내 메시지
  const cartItemEmpty = document.querySelector('.cart-empty-message'); // 상품 없음 안내 메시지
  if (cartItems.length === 0) {
    cartItemEmpty.classList.add('active');
  } else {
    cartItemEmpty.classList.remove('active');
  }

  cartItems.forEach((item, index) => {
    const price = parseInt(item.price);
    let quantity = parseInt(item.quantity); // 수량을 정수로 변환
    const total_price = price * quantity; // 총 가격 계산

    const row = document.createElement('tr');
    row.innerHTML = `
          <td><input type="checkbox" class="checkbox ck"></td>
          <td class="left">
              <div class="book">
                  <p class="img"><img src="${item.img}" alt="상품 이미지"></p>
                  <h3>${item.name}</h3>
              </div>
          </td>
          <td class="price">${price.toLocaleString()}원</td>
          <td class="quantity">
              <input type="number" value="${quantity}" min="1" class="quantity-input" data-index="${index}">
          </td>
          <td class="total_price">${total_price.toLocaleString()}원</td>
      `;

    cartList.appendChild(row);

    // 수량 변경 이벤트 리스너
    const quantityInput = row.querySelector('.quantity input');
    const totalPriceCell = row.querySelector('.total_price');

    quantityInput.addEventListener('change', function () {
      const updatedQuantity = parseInt(this.value);
      const updatedTotalPrice = price * updatedQuantity; // 변경된 수량으로 총 가격 재계산

      // 총 가격 셀 업데이트
      totalPriceCell.textContent = `${updatedTotalPrice.toLocaleString()}원`;

      // 로컬 스토리지의 해당 아이템 수량 업데이트
      cartItems[index].quantity = updatedQuantity;
      localStorage.setItem('cartItems', JSON.stringify(cartItems));

      // 전체 총액과 배송비 업데이트
      updateTotalAndShipping();
    });

    // 체크박스 클릭 이벤트 리스너
    const checkbox = row.querySelector('.checkbox');
    checkbox.addEventListener('change', function () {
      updateTotalAndShipping(); // 총 가격과 배송비 업데이트
    });
  });
}

function updateTotalAndShipping() {
  const totalPriceElement = document.querySelector('.totalPrice .total .price');
  const shippingPriceElement = document.querySelector(
    '.totalPrice .shoping .price'
  );

  let totalProductPrice = 0; // 선택된 상품들의 총 상품 가격
  const selectedItems = document.querySelectorAll('.ck:checked'); // 선택된 상품 체크박스들

  selectedItems.forEach((checkbox) => {
    const index = checkbox.closest('tr').querySelector('.quantity input')
      .dataset.index;
    const quantity = parseInt(
      checkbox.closest('tr').querySelector('.quantity input').value
    );
    const price = parseInt(
      JSON.parse(localStorage.getItem('cartItems'))[index].price
    );
    totalProductPrice += quantity * price;
  });

  // 배송비 및 총 가격 초기 값 설정
  let shippingCost = 0;
  let finalTotalPrice = 0;

  if (totalProductPrice !== 0) {
    // 상품 총 가격이 30000원 미만이면 3000원, 그 이상이면 0원으로 설정
    shippingCost = totalProductPrice < 30000 ? 3000 : 0;
    finalTotalPrice = totalProductPrice + shippingCost;
  }

  // Infobox 내 Shipping 및 Total 업데이트
  shippingPriceElement.textContent = `₩${shippingCost.toLocaleString()}`;
  totalPriceElement.textContent = `₩${finalTotalPrice.toLocaleString()}`;

  // 추가된 부분: infobox의 total 업데이트
  const totalElement = document.querySelector('.totalPrice .total .price');
  totalElement.textContent = `₩${finalTotalPrice.toLocaleString()}`;
}

document.addEventListener('DOMContentLoaded', function () {
  // 전체 선택 체크박스
  const selectAllCheckbox = document.querySelector('.ck-all');
  // 개별 상품 체크박스들
  const selectOneCheckboxes = document.querySelectorAll('.ck');
  // 삭제 버튼
  const removeButton = document.getElementById('removeBtn');
  // 장바구니 전체삭제 버튼
  const removeAllButton = document.getElementById('removeallBtn');
  // 주문하기 버튼
  const checkoutButton = document.querySelector('.checkout');

  // 주문하기 버튼 클릭 이벤트 리스너
  checkoutButton.addEventListener('click', function () {
    // 체크박스로 선택된 모든 상품 찾기
    const selectedCheckboxes = document.querySelectorAll('.ck:checked');

    // 선택된 상품이 없으면 알림 띄우기
    if (selectedCheckboxes.length === 0) {
      if (!this.alertShown) {
        alert('주문하실 상품을 선택해주세요.');
        this.alertShown = true;
      }
      return;
    }
    this.alertShown = false;

    // 선택된 상품 정보를 담을 배열
    const selectedItemsForOrder = [];

    selectedCheckboxes.forEach((checkbox) => {
      const productRow = checkbox.closest('tr');
      const index = productRow.querySelector('.quantity input').dataset.index; // 상품 인덱스
      const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
      const selectedItem = cartItems[index];

      // 선택된 상품 정보를 배열에 추가
      if (selectedItem) {
        selectedItemsForOrder.push(selectedItem);
      }
    });

    // 선택된 상품 정보를 로컬 스토리지에 'selectedItemsForOrder' 키로 저장
    localStorage.setItem(
      'selectedItemsForOrder',
      JSON.stringify(selectedItemsForOrder)
    );

    // 주문 페이지로 이동
    window.location.href = '/order'; // 주문 페이지로 이동
  });

  // "REMOVE ALL" 버튼 클릭 이벤트 리스너
  removeAllButton.addEventListener('click', function () {
    // 로컬 스토리지에서 'cartItems' 항목 삭제
    localStorage.removeItem('cartItems');

    // 페이지 새로고침으로 장바구니 목록 업데이트
    window.location.reload();
  });

  // 전체 선택 체크박스 클릭 이벤트
  selectAllCheckbox.addEventListener('click', () => {
    // 전체 선택 체크박스의 상태에 따라 개별 상품 체크박스들의 상태 변경
    selectOneCheckboxes.forEach((ck) => {
      ck.checked = selectAllCheckbox.checked;
    });

    // 총 가격과 배송비 업데이트
    updateTotalAndShipping();
  });

  // 개별 상품 체크박스 클릭 이벤트
  selectOneCheckboxes.forEach((ck) => {
    ck.addEventListener('click', () => {
      // 모든 개별 상품 체크박스가 체크되었는지 확인
      const allChecked = Array.from(selectOneCheckboxes).every(
        (ck) => ck.checked
      );
      // 전체 선택 체크박스의 상태 변경
      selectAllCheckbox.checked = allChecked;

      // 총 가격과 배송비 업데이트
      updateTotalAndShipping();
    });
  });

  // 삭제 버튼 클릭 이벤트
  removeButton.addEventListener('click', () => {
    const selectedItems = document.querySelectorAll('.ck:checked'); // 선택된 상품 체크박스
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || []; // 로컬 스토리지에서 상품 목록 가져오기

    selectedItems.forEach((item) => {
      const productRow = item.closest('tr');
      const productName = productRow.querySelector('td h3').textContent.trim(); // 상품 이름으로 식별

      // 로컬 스토리지에서 해당 상품 제거
      const itemIndex = cartItems.findIndex(
        (cartItem) => cartItem.name === productName
      );
      if (itemIndex > -1) {
        cartItems.splice(itemIndex, 1); // 배열에서 제거
      }

      // 상품의 부모 tr 요소를 페이지에서 삭제
      productRow.remove();
      window.location.reload();
    });

    // 로컬 스토리지 업데이트
    localStorage.setItem('cartItems', JSON.stringify(cartItems));

    // 페이지 내용 업데이트
    loadCartItems(); // 장바구니 항목 다시 로드
    updateTotalAndShipping(); // 총액과 배송비 업데이트

    // 전체 선택 체크박스 해제
    selectAllCheckbox.checked = false;
  });
});
