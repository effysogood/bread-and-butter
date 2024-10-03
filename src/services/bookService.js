// const bookModel = require('../db/models/bookModel');
const { Book } = require('../db/models/bookModel');
const categoryModel = require('../db/models/categoryModel');

class BookService {
  // 홈페이지 베스트셀러
  async getBestSellers() {
    const bestSellers = await Book.find({ isBestSeller: true }).populate(
      'category_id'
    );
    return bestSellers;
  }
// 정렬 
  async getBooksBySort(page = 1, perPage = 24, option = '최신순') {
    const skip = (page - 1) * perPage;
    const total = await Book.countDocuments({}); 
    let filter =  { _id: -1 }

switch (option) {
    case '최신순':
        filter =  { _id: -1 }
        break;
    case '인기순':
        filter = { rate: -1 }
        break;
    case '낮은 가격순':
        filter = { price: 1 }
        break;
    case '높은 가격순':
        filter = { price: -1 }
        break;
    default:
      case '최신순':
      filter =  { _id: -1 }
        break;
}
const books = await Book.find({})
    .sort(filter)
    .skip(skip)
    .limit(perPage)
    .populate('category_id');

    return {
      totalPage: Math.ceil(total / perPage),
      productCount: total,
      books,
      filter
    };
}



// 카테고리별 조회
  async getBooksByCategory(categoryId, page = 1, perPage = 24) {
    const skip = (page - 1) * perPage;
    const category = await categoryModel.findByCategoryId(categoryId);
    const total = await Book.countDocuments({ category_id: categoryId });
    const books = await Book.find({ category_id: categoryId })
      .skip(skip)
      .limit(perPage)
      .populate('category_id');

    return {
      totalPage: Math.ceil(total / perPage),
      productCount: total,
      books,
      category: category.name,
    };
  }
// 상품 목록 조회 
  async getBooks(page = 1, perPage = 24, sortCriteria = { createdAt: -1 }) {
    const skip = (page - 1) * perPage;
    const total = await Book.countDocuments({});
    const books = await Book.find({})
      .sort(sortCriteria)
      .skip(skip)
      .limit(perPage)
      .populate('category_id');

    return {
      totalPage: Math.ceil(total / perPage),
      productCount: total,
      books,
    };
  }
// 상품 상세 조회 
  async getBook(id) {
    const book = await Book.findById(id).populate('category_id');
    return book;
  }
// 상품 추가 *admin
  async addBook(bookData) {
    const newBook = await Book.create(bookData);
    return newBook;
  }
// 상품 삭제 *admin
  async deleteBook(id) {
    const deletedBook = await Book.deleteOne({ _id: id });
    return deletedBook;
  }
// 상품 수정 *admin
  async updateBook(id, updateData) {
    const updatedBook = await Book.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    return updatedBook;
  }
}





















module.exports = new BookService();
