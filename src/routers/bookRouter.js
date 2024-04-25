const express = require('express');
const router = express.Router();
const { Book } = require('../db/models/bookModel');
const asyncHandler = require('../utils/async-handler');

// 상품 목록 조회
router.get(
  '/',
  asyncHandler(async (req, res, next) => {
    const page = Number(req.query.page || 1);
    const perPage = Number(req.query.perPage || 24);

    const [total, books] = await Promise.all([
      Book.countDocuments({}),
      Book.find({})
        //.sort({ createdAt: -1 })
        .skip(perPage * (page - 1))
        .limit(perPage)
        .populate('category_id'),
    ]);
    const totalPage = Math.ceil(total / perPage);

    res.status(200).json({
      status: 200,
      msg: '상품 목록 조회 완료',
      data: {
        totalPage: totalPage,
        productCount: total,
        books,
      },
    });
  })
);

// 상품 상세 조회
router.get(
  '/:id',
  asyncHandler(async (req, res, next) => {
    const _id = req.params.id;
    const book = await Book.findById(_id).populate('category_id');
    
    // 해당 상품의 카테고리 이름 찾는 법
    console.log(book.category_id.name);

    res.status(200).json({
      status: 200,
      msg: '상품 상세 조회 성공',
      data: book,
    });
  })
);
// 상품 추가 *admin
// router.post(
//   '/admin',
//   asyncHandler(async (req, res, next) => {
//     try {
//       const newbook = new Book(req.body);
//       await newbook.save();

//       res.status(201).json({
//         status: 201,
//         message: '상품 추가 완료',
//         data: newbook,
//       });
//     } catch (error) {
//       next(error);
//     }
//   })
// );

router.post('/admin', asyncHandler(async(req, res, next) => {
  const { title, category_id, price, content, img_url, is_sale, quantity, rating } = req.body;
  await Book.create({
    title,
    category_id,
    price,
    content,
    img_url,
    is_sale,
    quantity,
    rating
  });
  res.status(201).json({
    status: 201,
    msg: '상품 추가 완료'
  });
}));

// 상품 삭제 *admin
// router.delete(
//   '/admin/:id',
//   asyncHandler(async (req, res, next) => {
//     try {
//       const deletedBook = await Book.findByIdAndDelete(req.params.id);

//       res.status(200).json({
//         status: 200,
//         message: '상품 삭제 완료',
//         data: {
//           deletedBook,
//         },
//       });
//     } catch (error) {
//       next(error);
//     }
//   })
// );

router.delete('/admin/:id', asyncHandler (async(req, res, next) => {
  const id = req.params.id;
  await Book.deleteOne({ _id: id });
    res.status(200).json({
      status: 200,
      msg: '상품 삭제 완료'
    });
}));

// 상품 수정 *admin
router.patch(
  '/admin/:id',
  asyncHandler(async (req, res, next) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = [
      'name',
      'category_name',
      'price',
      'content',
      'img_url',
      'is_sale',
      'quantity',
      'rate',
    ];

    const updatedBookInfo = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: 200,
      message: '상품 수정 완료',
      data: updatedBookInfo,
    });
  })
);

module.exports = router;
