const categoryModel = require('../db/models/categoryModel')
// const 

class CategoryService {

    constructor(categoryModel) {
        this.categoryModel = categoryModel
    }
 // 카테고리 조회
    async getCategories () {
        return await this.categoryModel.findAll()
    }

 // 카테고리 추가
    async addCategory(categoryInfo) {
        const { category } = categoryInfo;

        // 중복 확인
        const categoryName = await this.categoryModel.findByCategory(category)
        if (categoryName) {
            throw new Error('이미 있는 카테고리입니다.')
        }
        // db 저장
        return await this.categoryModel.create(categoryInfo)
    }

 // 카테고리 수정
    async setCategory(categoryId, toUpdate) {
        let category = await this.categoryModel.findById(categoryId)
        if (!category) {
            throw new Error('해당 카테고리의 id가 없습니다.')
        }
        // 중복 확인
        const categoryName = await this.categoryModel.findByCategory(toUpdate.category)
        if (categoryName) {
            throw new Error ('이미 있는 카테고리입니다.')
        }

        return await this.categoryModel.update({
            categoryId,
            update: toUpdate,
        })
    }

 // 카테고리 조회
    async deleteCategory(categoryId) {
        let category = await categoryModel.delete(categoryId);
        if (!category) {
            throw new Error('해당 카테고리의 id가 없습니다.')
        }

        return category
    }
}

module.exports = CategoryService