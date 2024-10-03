import { API_HOST } from '/src/views/common/api.js';

document.addEventListener('DOMContentLoaded', async function () {
  // 모달 열기 버튼과 모달 가져오기
  const openModalBtn2 = document.getElementById('openModalbtn2');
  const modal2 = document.getElementById('myModal2');

  // 모달 열기 버튼에 이벤트 리스너 추가
  openModalBtn2.onclick = function () {
    modal2.style.display = 'flex';
  };
  // 모달 닫기 함수
  modal2.addEventListener('click', function (e) {
    if (e.target !== modal2) return;
    modal2.style.display = 'none';
  });
  // 삭제 버튼과 취소 버튼에 이벤트 리스너 추가
  const deleteBtn = document.getElementById('delete-Btn');
  const backBtn = document.getElementById('back-btn');

  deleteBtn.onclick = function () {
    // 실제로 삭제하는 작업 추가
    alert('상품이 삭제되었습니다.');
    modal2.style.display = 'none';
  };

  backBtn.onclick = function () {
    modal2.style.display = 'none';
  };

  await loadOrders(); // 주문 데이터(주문서)를 불러와서 화면에표시
});

async function loadOrders() {
  try {
    // API 호출을 통해 주문 데이터를 가져옵니다.
    const response = await fetch(`${API_HOST}/api/orders/admin`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${accessToken}`, // 필요한 경우 인증 헤더를 추가합니다.
      },
    });

    if (!response.ok) {
      throw new Error('주문 데이터를 불러오는데 실패했습니다.');
    }

    // 응답 데이터를 JSON 형태로 변환합니다.
    const orders = await response.json();
    console.log(orders);
    // 가져온 주문 데이터를 기반으로 HTML을 동적으로 생성합니다.
    displayOrders(orders);
  } catch (error) {
    console.error('주문 데이터 불러오기 오류:', error);
  }
}

function displayOrders(orders) {
  const tableBody = document.querySelector('.tableList table tbody');
  tableBody.innerHTML = ''; // 기존의 테이블 내용을 초기화합니다.

  // 주문 데이터 배열을 순회합니다.
  orders.data.forEach((order) => {
    // 각 주문에 대한 HTML 요소를 생성합니다.
    const tr = document.createElement('tr');
    tr.innerHTML = `
            <td>
                <ul>
                    <li><b>주문 일자 : </b> ${new Date(
                      order.createdAt
                    ).toLocaleDateString()}</li>
                    <li><b>주문 시간 : </b> ${new Date(
                      order.createdAt
                    ).toLocaleTimeString()}</li>
                    <li><b>주문 번호 : </b> ${order._id}</li>
                    <li><b>상태 : </b> ${order.order_status}</li>
                    <li><b>메세지 : </b> ${
                      order.orderer.shipping_message || '없음'
                    }</li>
                </ul>
            </td>
            <td>
                <ul>
                    <li>${order.orderer.name}</li>
                    <li>${order.orderer.email}</li>
                    <li>${order.orderer.phone}</li>
                    <li>${order.orderer.address.postcode} ${
      order.orderer.address.main
    }</li>
                </ul>
            </td>
            <td class="center">
                <select name="state" class="stateSelect" data-order-id="${order._id}">
                  <option value="주문 완료" ${order.order_status === '주문 완료' ? 'selected' : ''}>주문 완료</option>
                  <option value="배송중" ${order.order_status === '배송중' ? 'selected' : ''}>배송중</option>
                  <option value="배송 완료" ${order.order_status === '배송 완료' ? 'selected' : ''}>배송 완료</option>
                  <option value="주문 취소" ${order.order_status === '주문 취소' ? 'selected' : ''}>주문 취소</option>
                </select>
            </td>
            <td>
                <button class="delete" data-order-id="${
                  order._id
                }">삭제</button>
            </td>
        `;
    tableBody.appendChild(tr);
  });

  function setupOrderStatusChangeEventListener() {
    document.querySelectorAll('.stateSelect').forEach((selectElement) => {
      selectElement.addEventListener('change', async function () {
        const orderId = this.getAttribute('data-order-id'); // 주문 ID를 가져옵니다.
        const newStatus = this.value; // 새로운 주문 상태를 가져옵니다.

        try {
          const response = await fetch(
            `${API_HOST}/api/orders/admin/${orderId}`,
            {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${accessToken}`, // 인증 토큰이 필요한 경우 추가
              },
              body: JSON.stringify({ order_status: newStatus }),
            }
          );

          if (!response.ok) {
            throw new Error('주문 상태를 변경하는 데 실패했습니다.');
          }

          // 성공적으로 상태가 변경되었음을 사용자에게 알립니다.
          alert('주문 상태가 성공적으로 변경되었습니다.');

          // 페이지를 새로고침하여 변경사항을 반영합니다.
          window.location.reload();

          // 변경된 주문 상태를 반영하기 위해 셀렉트 박스의 값을 업데이트합니다.
          // 이 부분은 실제로는 필요하지 않을 수 있습니다. 왜냐하면 셀렉트 박스의 값이 이미
          // 사용자에 의해 변경되었기 때문입니다. 하지만, 상태가 프로그래매틱하게 변경되는
          // 다른 시나리오를 대비하여 이를 포함할 수 있습니다.
          this.value = newStatus;
        } catch (error) {
          console.error('주문 상태 변경 오류:', error);
          alert('주문 상태 변경에 실패했습니다.');
          // 실패한 경우, 사용자에게 상태 변경 실패를 알리고, 셀렉트 박스를 이전 상태로 되돌립니다.
          // 이를 위해 셀렉트 박스의 이전 값을 저장해둘 필요가 있습니다. 예를 들어, 상태 변경 시도 전에
          // 셀렉트 박스의 현재 값을 어딘가에 저장하고, 실패 시 그 값을 다시 셀렉트 박스의 값으로 설정합니다.
        }
      });
    });
  }

  function setupDeleteButtonEventListener() {
    // 페이지에 존재하는 모든 삭제 버튼에 대해 이벤트 리스너를 설정
    document.querySelectorAll('.delete').forEach((button) => {
      button.addEventListener('click', async function () {
        const orderId = this.getAttribute('data-order-id');
        const isConfirmed = confirm('주문을 삭제하시겠습니까?');

        console.log('삭제 버튼 클릭, 주문 ID:', orderId);
        if (!isConfirmed) {
          return; // 사용자가 취소하면 함수 실행 중단
        }

        try {
          const response = await fetch(
            `${API_HOST}/api/orders/admin/${orderId}`,
            {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                // 인증 토큰이 필요한 경우 'Authorization': `Bearer ${accessToken}` 추가
              },
            }
          );

          if (!response.ok) {
            throw new Error('주문을 삭제하는 데 실패했습니다.');
          }

          alert('주문이 성공적으로 삭제되었습니다.');

          // 현재 클릭된 버튼이 속한 <tr> 요소를 찾아서 삭제
          this.closest('tr').remove();
        } catch (error) {
          console.error('주문 삭제 오류:', error);
          alert('주문 삭제에 실패했습니다.');
        }
      });
    });
  }

  // 모든 주문 데이터가 페이지에 추가된 후, 상태 변경 및 삭제 버튼에 대한 이벤트 리스너를 설정합니다.
  setupOrderStatusChangeEventListener();
  setupDeleteButtonEventListener();
}
