document.addEventListener("DOMContentLoaded", function () {
    // 전체 선택 체크박스
    const selectAllCheckbox = document.querySelector(".ck-all");
    // 개별 상품 체크박스들
    const selectOneCheckboxes = document.querySelectorAll(".ck");
    // 삭제 버튼
    const removeButton = document.getElementById("removeBtn");
    // 주문하기 버튼
    const checkoutButton = document.querySelector(".checkout");

    // 전체 선택 체크박스 클릭 시
    selectAllCheckbox.addEventListener("click", () => {
        selectOneCheckboxes.forEach(ck => {
            ck.checked = selectAllCheckbox.checked;
        });
    });

    // 개별 상품 체크박스들 클릭 시
    selectOneCheckboxes.forEach(ck => {
        ck.addEventListener("click", () => {
            let cnt = 0;
            selectOneCheckboxes.forEach(ck => {
                if (ck.checked) {
                    cnt++;
                }
            });

            if (cnt === selectOneCheckboxes.length) {
                selectAllCheckbox.checked = true;
            } else {
                selectAllCheckbox.checked = false;
            }
        });
    });

    // 삭제 버튼 클릭 시
    removeButton.addEventListener("click", () => {
        const selectedItems = document.querySelectorAll('.ck:checked');
        selectedItems.forEach(item => {
            item.closest('tr').remove(); // 선택된 상품의 부모 tr 요소를 삭제
        });
        // 삭제 후에는 전체 선택 체크박스도 해제
        selectAllCheckbox.checked = false;
    });
});

