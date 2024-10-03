const { User } = require('../db/models/userModel');
const customError = require('../middlewares/customError');
const { hashPassword, comparePassword } = require('../utils/hash-password');
const UserDTO = require('../utils/userValidator');
const jwt = require('jsonwebtoken');


class UserService {
    async registerUser(name, password, email, phone, address) {
        const userData = new UserDTO(name, password, email, phone, address);
        UserDTO.validateUserData(userData);

        const ifExists = await User.findOne({ email });
        if (ifExists) throw new customError(403, '이미 가입된 회원입니다.');

        const hashedPassword = await hashPassword(password);
        const newUser = await User.create({
            name,
            password: hashedPassword,
            email,
            phone,
            address,
            deleted_at: null,
            is_admin: false,
        });

        return newUser;
    }

    async loginUser(email, password) {
        const user = await User.findOne({ email });
        if (!user) throw new customError(401, '이메일이 일치하지 않습니다.');
        
        const correctPassword = user.password;
        if (!comparePassword(password, correctPassword)) {
        throw new customError(401, '비밀번호가 일치하지 않습니다.');
        }

        let token;
        let role;
        if (user.is_admin) {
        token = jwt.sign(
            {
            sub: user._id,
            email: email,
            name: user.name,
            role: "admin"
            },
            process.env.SECRET_KEY
        );
        role = "admin";
        } else {
        token = jwt.sign(
            {
            sub: user._id,
            email: email,
            name: user.name,
            role: "user"
            },
            process.env.SECRET_KEY
        );
        role = "user";
        }

        return {token, role};
    }

    async updateUser(id, data) {
        const { password, ...userData } = data;
        let hashedPassword;
        if (password) {
            hashedPassword = await hashPassword(password);
        }
        let updateData = { ... userData };
        if (hashedPassword) updateData.password = hashedPassword;
        
        const updateUser = await User.findByIdAndUpdate(id, updateData , { new: true });
        return updateUser;
    }

    async deleteUser(id) {
        const deleteUser = await User.findByIdAndUpdate(
            id, 
            { password: null,
            deleted_at: new Date() },
            {new: true}
        )
        return deleteUser;
    }
}

module.exports = new UserService();