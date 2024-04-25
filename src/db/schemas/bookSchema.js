const { Schema } = require('mongoose')

const BookSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    category_id:  {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    img_url: {
        type: [String],
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    rating: {
        type: Number,
        enum: [1, 2, 3, 4, 5],
    },
})

module.exports = BookSchema