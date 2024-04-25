const mongoose = require('mongoose');
const UserSchema = require('../schemas/userSchema');

exports.User = mongoose.model('User', UserSchema);