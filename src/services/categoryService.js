const categoryModel = require('../db/models/categoryModel');
const customError = require('../middlewares/customError');

class CategoryService {
  constructor(categoryModel) {
    this.categoryModel = categoryModel;
  }

  // 카테고리 조회
  async getAll() {
    return await this.categoryModel.findAll({});
  }

  // 카테고리 개별 조회
  async getCategory(categoryId) {
    return await this.categoryModel.findByCategoryId(categoryId);
  }

  // 카테고리 추가
  async addCategory(categoryInfo) {
    const categoryName = await this.categoryModel.findByCategory(
      categoryInfo.name
    );
    if (categoryName) {
      throw new customError(409, '이미 있는 카테고리입니다.');
    }

    return await this.categoryModel.create(categoryInfo);
  }

  // 카테고리 수정
  async updateCategory(categoryId, toUpdate) {
    const category = await this.categoryModel.findByCategoryId(categoryId);
    if (!category) {
      throw new customError(404, '해당 카테고리의 id가 없습니다.');
    }
    const categoryName = await this.categoryModel.findByCategory(
      toUpdate.category
    );
    if (categoryName) {
      throw new customError(409, '이미 있는 카테고리입니다.');
    }

    return await this.categoryModel.updateCategoryById(categoryId, toUpdate);
  }

  // 카테고리 삭제
  async deleteCategory(categoryId) {
    let category = await categoryModel.delete(categoryId);
    if (!category) {
      throw new customError(404, '해당 카테고리의 id가 없습니다.');
    }

    return category;
  }
}

const categoryService = new CategoryService(categoryModel);
module.exports = categoryService;
