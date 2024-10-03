import { API_HOST } from '/src/views/common/api.js';


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


// 카테고리 리스트 뿌리기
async function renderCategory() {
    try{
        const categories = await getCategory()
        
        console.log(categories)
    

        const categoryListElement = document.getElementById('categoryList');

        // 카테고리 리스트를 받아온 후 각 카테고리에 대한 요청을 보냅니다.
        categories.forEach(async (category) => {

            
            // 리스트 생성
            const categoryItem = document.createElement('tr');
            categoryItem.classList.add('category');
            categoryItem.innerHTML = `
            <td>${category.sort}</td>
            <td>${category.name}</td>
            <td>
                <button type="button" id="openModalbtn1" class="edit" data-category-id="${category._id}">수정</button>
                <button type="button" id="openModalbtn2" class="delete" data-category-id="${category._id}">삭제</button>
            </td>
            `;

            // 상품 리스트에 상품 추가
            categoryListElement.appendChild(categoryItem);

            

        });

        

        modalEditDelete()



    } catch (error) {
        console.error("카테고리를 렌더링하는 중 오류가 발생했습니다.", error)
    }
}


//  카테고리 추가하기
// 추가 버튼 이벤트
function addButtonEvent () {

    // 모달 열기 버튼과 모달 가져오기
    const addBtn = document.getElementById("add-btn");
    const modal1 = document.getElementById("myModal1");


    // 카테고리 추가 모달 열기
    addBtn.addEventListener("click", function ()  {
        const pargraph = modal1.querySelector("p");
        if (pargraph) {
        pargraph.innerText = "카테고리 추가"
        }
        modal1.style.display = "flex";

        // 초기화 함수
        initializeForm()

        // 저장 누르면 추가 함수 실행
        const saveBtn1 = document.getElementById("save-Btn1");
        saveBtn1.onclick = addCategory
    });



    // 모달 닫기 
    modal1.addEventListener("click", function(e) {
        if (e.target !== modal1) return;
        modal1.style.display = "none";
    })

}


// 추가 함수
async function addCategory() {

    const categoryName = document.getElementById('categoryInput')
    const categorySort = document.getElementById('categorySort')
    const modal1 = document.getElementById("myModal1");

    try {
        // 서버에 POST 요청을 보내어 카테고리 추가
        const response = await fetch(`${API_HOST}/api/categories`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: categoryName.value,
                sort: Number(categorySort.value)
            })
        });
        
        const result = await response.json();

        if (response.ok) {
            alert("새로운 카테고리가 추가되었습니다.");
            modal1.style.display = "none";
            window.location.reload()
            renderCategory();
        } else {
            alert('상품 추가 실패');
            console.log("상품 추가 실패", result)
        }

    } catch (error) {
        console.error('카테고리 추가 중 오류가 발생했습니다:', error);
    }
}



// moal1 초기화
function initializeForm() {
    const categoryNameInput = document.querySelector("#myModal1 input[placeholder='카테고리']");
    const categorySortInput = document.querySelector("#myModal1 input[placeholder='순서, 0 부터 입력']");
    
    // 폼 필드 초기화
    categoryNameInput.value = "";
    categorySortInput.value = "";
}



// 카테고리 수정하기

// 카테고리 id로 해당 카테고리 찾기
async function fetchCategoryById(categoryId) {
    try {
        const response = await fetch(`${API_HOST}/api/categories/${categoryId}`);
        if (!response.ok) {
            throw new Error('카테고리 정보를 가져오지 못했습니다.');
        }
        const category = await response.json();
        console.log(category)

        const categoryNameInput = document.querySelector("#myModal1 input[placeholder='카테고리']");
        const categorySortInput = document.querySelector("#myModal1 input[placeholder='순서, 0 부터 입력']");

        // 폼에 카테고리 정보 채우기
        categoryNameInput.value = category.data.name;
        categorySortInput.value = category.data.sort;
    } catch (error) {
        console.error('카테고리 정보를 가져오는 중 오류 발생:', error);
        throw error;
    }
}


// 수정 삭제 클릭 이벤트
function modalEditDelete() {
    const editButtons = document.querySelectorAll('.edit');
    const deleteButtons = document.querySelectorAll('.delete');
    const modal1 = document.getElementById("myModal1");

    // 수정 버튼
    editButtons.forEach(editButton => {
        editButton.addEventListener('click', () => {
            const paragraph = modal1.querySelector("p");
            if (paragraph) {
                paragraph.innerText = "카테고리 수정";
            }
            modal1.style.display = "flex";

            const categoryId = editButton.dataset.categoryId; // 해당 id 불러오기
            if (!categoryId) return;

            const category = fetchCategoryById(categoryId)

            // 저장 버튼에 이벤트 리스너 추가
            const saveBtn1 = document.getElementById("save-Btn1");
            saveBtn1.onclick = () => updateCategory(categoryId);

            console.log(saveBtn1)
        });
    });



    // 삭제 버튼
    deleteButtons.forEach(function (deleteButton) {
        deleteButton.addEventListener("click", function () {
            const categoryId = deleteButton.dataset.categoryId;
            if (!categoryId) return;
            deleteCategory(categoryId)
        });
    });
}



// 수정 폼에서 정보를 업데이트
async function updateCategory(categoryId) {
    const categoryNameInput = document.querySelector("#myModal1 input[placeholder='카테고리']");
    const categorySortInput = document.querySelector("#myModal1 input[placeholder='순서, 0 부터 입력']");
    const modal1 = document.getElementById("myModal1");

    const newName = categoryNameInput.value;
    const newSort = categorySortInput.value;

    try {
        const response = await fetch(`${API_HOST}/api/categories/${categoryId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: newName,
            sort: newSort
        })
        });

        if (!response.ok) {
        throw new Error('카테고리 정보를 업데이트하지 못했습니다.');
        }

        // 카테고리 정보 업데이트 후 필요한 작업 수행
        window.alert("수정을 완료했습니다.")
        modal1.style.display = "none";
        window.location.reload()
        getCategory(); 
    } catch (error) {
        console.error('카테고리 정보를 업데이트하는 중 오류 발생:', error);
    }
}



// 삭제하기
async function deleteCategory(categoryId) {

    try {
        const response = await fetch(`${API_HOST}/api/categories/${categoryId}`, {
            method: "DELETE"
        })

        if (response.ok) {

            window.alert("카테고리가 삭제되었습니다.");
            window.location.reload()
            getCategory();
        }
    } catch (error) {
        console.error('삭제 중 오류가 발생했습니다:', error);
        alert('삭제를 실패 했습니다.');
    }

}

// 페이지 로드
window.addEventListener('load', () => {
    getCategory()
    addButtonEvent()
    renderCategory()
}); 
