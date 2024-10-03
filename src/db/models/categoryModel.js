const mongoose = require('mongoose');
const CategorySchema = require('../schemas/categorySchema');
const Category = mongoose.model('Category', CategorySchema);

class CategoryModel {
  async findAll() {
    return await Category.find({}).sort({ sort: 1 });
  }

  async findByCategory(categoryName) {
    return await Category.findOne({ name: categoryName }).lean();
  }

  async findByCategoryId(categoryId) {
    return await Category.findById(categoryId).lean();
  }

  async create(toCreate) {
    return await Category.create(toCreate);
  }

  async updateCategoryById(categoryId, toUpdate) {
    return await Category.findByIdAndUpdate(categoryId, toUpdate).lean();
  }

  async delete(categoryId) {
    return await Category.findOneAndDelete({ _id: categoryId });
  }
}

const categoryModel = new CategoryModel();
module.exports = categoryModel;
