const { Schema } = require('mongoose');

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    sort: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
  { collection: 'categories' }
);

module.exports = CategorySchema;
