const mongoose = require('mongoose');
const BookSchema = require('../schemas/bookSchema');

exports.Book = mongoose.model('Book', BookSchema);
