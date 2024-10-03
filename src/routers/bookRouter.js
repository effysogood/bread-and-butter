const express = require('express');
const bookRouter = express.Router();
const bookService = require('../services/bookService');
const asyncHandler = require('../utils/async-handler');

// 홈페이지 베스트셀러
bookRouter.get(
  '/bestsellers',
  asyncHandler(async (req, res) => {
    const bestSellers = await bookService.getBestSellers();
    res.status(200).json({
      status: 200,
      msg: '베스트셀러 목록 조회 완료',
      data: bestSellers,
    });
  })
);

//책 정렬 조회
bookRouter.get(
  '/sort',
  asyncHandler(async (req, res) => {
    const page = Number(req.query.page || 1);
    const perPage = Number(req.query.perPage || 24);
    const option = req.query.option || '최신순';
    const result = await bookService.getBooksBySort(page, perPage, option);
    res.status(200).json({
      status: 200,
      msg: '상품 정렬 조회 완료',
      data: result,
    });
  })
);

// 상품 목록 조회
bookRouter.get(
  '/all',
  asyncHandler(async (req, res) => {
    const page = Number(req.query.page || 1);
    const perPage = Number(req.query.perPage || 24);
    const result = await bookService.getBooks(page, perPage, { _id: -1 });
    res.status(200).json({
      status: 200,
      msg: '상품 목록 조회 완료',
      data: result,
    });
  })
);

// 상품 상세 조회
bookRouter.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const book = await bookService.getBook(req.params.id);
    if (!book) {
      return res
        .status(404)
        .json({ status: 404, msg: '책을 찾을 수 없습니다.' });
    }
    res.status(200).json({
      status: 200,
      msg: '상품 상세 조회 완료',
      data: book,
    });
  })
);

// 상품 추가 *admin
bookRouter.post(
  '/admin',
  asyncHandler(async (req, res) => {
    const newBook = await bookService.addBook(req.body);
    res.status(201).json({
      status: 201,
      msg: '상품 추가 완료',
      data: newBook,
    });
  })
);

// 상품 삭제 *admin
bookRouter.delete(
  '/admin/:id',
  asyncHandler(async (req, res) => {
    const deletedBook = await bookService.deleteBook(req.params.id);
    res.status(200).json({
      status: 200,
      msg: '상품 삭제 완료',
      data: deletedBook,
    });
  })
);

// 상품 수정 *admin
bookRouter.patch(
  '/admin/:id',
  asyncHandler(async (req, res) => {
    const updatedBook = await bookService.updateBook(req.params.id, req.body);
    res.status(200).json({
      status: 200,
      msg: '상품 수정 완료',
      data: updatedBook,
    });
  })
);

module.exports = bookRouter;
