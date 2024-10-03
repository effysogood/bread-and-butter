class UserDTO {
    constructor(name, password, email, phone, address) {
        this.name = name;
        this.password = password;
        this.email = email;
        this.phone = phone;
        this.address = address;
    }

    static validateUserData(data) {
        if (!data.name || !data.password || !data.email || !data.phone || !data.address) {
            throw new Error('필수 사용자 정보를 입력하여 주십시오. ');
        }
        if (data.password.length < 8) {
            throw new Error('비밀번호는 최소 8자 이상이어야 합니다.');
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            throw new Error('유효한 이메일 형식이 아닙니다.');
        }
    }
}

module.exports = UserDTO;

