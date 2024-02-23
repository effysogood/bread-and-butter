// cart.js 파일의 내용

document.addEventListener("DOMContentLoaded", function() {
    // 전체 선택 체크박스
    const allCheck = document.querySelector('.allCheck input[type="checkbox"]');
    // 개별 상품 체크박스들
    const productCheckboxes = document.querySelectorAll('.cartList input[type="checkbox"]');
    // 삭제 버튼
    const removeButton = document.querySelector('.buttonBox button[type="button"]');
    // 주문하기 버튼
    const checkoutButton = document.querySelector('.checkout');

    // 전체 선택 체크박스가 변경되었을 때
    allCheck.addEventListener('change', function() {
        productCheckboxes.forEach(function(checkbox) {
            checkbox.checked = allCheck.checked;
        });
    });

    // 개별 상품 체크박스 중 하나라도 변경되었을 때
    productCheckboxes.forEach(function(checkbox) {
        checkbox.addEventListener('change', function() {
            // 전체 선택 체크박스 업데이트
            let allChecked = true;
            productCheckboxes.forEach(function(checkbox) {
                if (!checkbox.checked) {
                    allChecked = false;
                }
            });
            allCheck.checked = allChecked;
        });
    });

    // 삭제 버튼 클릭 시
    removeButton.addEventListener('click', function() {
        const checkedProducts = document.querySelectorAll('.cartList input[type="checkbox"]:checked');
        checkedProducts.forEach(function(checkbox) {
            checkbox.closest('tr').remove();
        });
    });

    // 주문하기 버튼 클릭 시
    checkoutButton.addEventListener('click', function() {
        alert('주문이 완료되었습니다!');
    });

    // 수량에 따른 가격 변동 함수
    const quantityInputs = document.querySelectorAll('.quantity input[type="text"]');
    quantityInputs.forEach(function(input) {
        input.addEventListener('change', function() {
            const quantity = parseInt(input.value);
            const pricePerItem = parseInt(input.closest('tr').querySelector('.total_price').textContent.slice(1)); // 가격에서 통화 기호 제거 후 정수로 변환
            const totalPrice = quantity * pricePerItem;
            input.closest('tr').querySelector('.total_price').textContent = '₩' + totalPrice;
        });
    });
});
