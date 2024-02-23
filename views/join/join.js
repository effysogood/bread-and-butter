
/* 메세지 직접 입력 선택 시 인풋 노출 */
function selectText () {
    const select = document.getElementById("message")
    const value = select.options[select.selectedIndex].value
    const messageInput = document.querySelector(".messageInput")

    if (value == 6) {
        messageInput.classList.remove("off")
    } else {
        messageInput.classList.add("off")
    }
}

