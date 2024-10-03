const { Schema } = require('mongoose')

const BookSchema = new Schema({
    isBestSeller: {
        type: Boolean,
        default: false,
    },
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
        type: Number,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    img_url: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    rate: {
        type: Number,
        enum: [1, 2, 3, 4, 5],
    },

})

module.exports = BookSchema

