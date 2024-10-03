const express = require('express');
const categoryRouter = express.Router();
const categoryService = require('../services/categoryService');
const bookService = require('../services/bookService');
const loginRequired = require('../middlewares/loginRequired');
const adminOnly = require('../middlewares/adminOnly');
const asyncHandler = require('../utils/async-handler');

// 카테고리 조회
categoryRouter.get(
  '/',
  asyncHandler(async (req, res, next) => {
    const categories = await categoryService.getAll();
    res.status(200).json({
      status: 200,
      message: '전체 카테고리 목록 조회 성공',
      data: categories,
    });
  })
);

// 카테고리 별 목록 조회
categoryRouter.get('/books/:categoryId', async (req, res, next) => {
  const books = await bookService.getBooksByCategory(req.params.categoryId);

  if (!books) {
    return res.status(404).json({
      status: 404,
      message: '해당 카테고리의 상품을 찾을 수 없습니다.',
    });
  }

  res.status(200).json({
    status: 200,
    message: '카테고리 별 상품 목록 조회 성공',
    data: { books },
  });
});

// 카테고리 정보 조회 *admin
categoryRouter.get(
  '/:categoryId',
  loginRequired,
  adminOnly,
  asyncHandler(async (req, res, next) => {
    const { categoryId } = req.params;
    const category = await categoryService.getCategory(categoryId);
    res.status(200).json({
      status: 200,
      message: '카테고리 정보 조회 성공',
      data: category,
    });
  })
);

// 카테고리 추가 *admin
categoryRouter.post(
  '/',
  loginRequired,
  adminOnly,
  asyncHandler(async (req, res, next) => {
    const newCategory = await categoryService.addCategory(req.body);

    res.status(201).json({
      status: 201,
      message: '카테고리 추가 성공',
      data: newCategory,
    });
  })
);

// 카테고리 수정 *admin
categoryRouter.patch(
  '/:categoryId',
  loginRequired,
  adminOnly,
  asyncHandler(async (req, res, next) => {
    const { categoryId } = req.params;
    const { name, sort } = req.body;
    const toUpdate = { name, sort };
    const updatedCategory = await categoryService.updateCategory(
      categoryId,
      toUpdate
    );

    res.status(201).json({
      status: 201,
      message: '카테고리 수정 완료',
      data: updatedCategory,
    });
  })
);

// 카테고리 삭제 *admin
categoryRouter.delete(
  '/:categoryId',
  loginRequired,
  adminOnly,
  asyncHandler(async (req, res, next) => {
    const { categoryId } = req.params;
    const deletedCategory = await categoryService.deleteCategory(categoryId);

    res.status(200).json({
      status: 200,
      message: '카테고리 삭제 완료',
      data: deletedCategory,
    });
  })
);

module.exports = categoryRouter;
