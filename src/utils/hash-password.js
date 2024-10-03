const bcrypt = require('bcrypt');

async function hashPassword(password) {
    try {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (err) {
        next(err);
    }
}

function comparePassword(enteredPassword, hashedPassword) {
    try {
        const compare = bcrypt.compareSync(enteredPassword, hashedPassword);
        return compare;
    } catch (err) {
        next(err);
    }
}

module.exports = { hashPassword, comparePassword };
