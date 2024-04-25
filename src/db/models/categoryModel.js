const mongoose = require('mongoose');
const CategorySchema = require('../schemas/categorySchema')

exports.Category = mongoose.model('Category', CategorySchema)