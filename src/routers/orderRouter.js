const express = require('express');
const orderRouter = express.Router();
const orderService = require('../services/orderService');
const loginRequired = require('../middlewares/loginRequired');
const adminOnly = require('../middlewares/adminOnly');
const asyncHandler = require('express-async-handler');

// 주문 추가
orderRouter.post(
  '/',
  asyncHandler(async (req, res, next) => {
    const orderInfo = req.body;
    const newOrder = await orderService.createOrder(orderInfo);
    res.status(201).json({
      status: 201,
      message: '주문 등록 성공',
      data: newOrder,
    });
  })
);

// 주문 목록 조회 *admin
orderRouter.get(
  '/admin',
  loginRequired,
  adminOnly,
  asyncHandler(async (req, res, next) => {
    const orders = await orderService.getOrderList();
    res.status(200).json({
      status: 200,
      message: '전체 주문 목록 조회 성공',
      data: orders,
    });
  })
);

// 주문 상세 조회 *회원 Email
orderRouter.get(
  '/user',
  loginRequired,
  asyncHandler(async (req, res, next) => {
    const { userEmail } = req.user;
    const orders = await orderService.getOrdersByEmail(userEmail);
    res.status(200).json({
      status: 200,
      message: '주문 목록 조회 성공',
      data: orders,
    });
  })
);

// 주문 상세 조회 *주문 ID
orderRouter.get(
  '/:orderId',
  asyncHandler(async (req, res, next) => {
    const { orderId } = req.params;
    const orders = await orderService.getOrdersByOrderId(orderId);
    res.status(200).json({
      status: 200,
      message: '주문 ID로 주문 상세 조회',
      data: orders,
    });
  })
);

// 주문 정보 수정
orderRouter.patch(
  '/:orderId',
  loginRequired,
  asyncHandler(async (req, res, next) => {
    const { orderId } = req.params;
    const { orderer } = req.body;
    await orderService.updateOrderById(orderId, { orderer });
    res.status(201).json({
      status: 201,
      message: '주문 정보 수정 성공',
    });
  })
);

// 주문 상태 수정 *admin
orderRouter.patch(
  '/admin/:orderId',
  loginRequired,
  adminOnly,
  asyncHandler(async (req, res, next) => {
    const { orderId } = req.params;
    const { order_status } = req.body;
    await orderService.updateOrderById(orderId, { order_status });
    res.status(201).json({
      status: 201,
      message: '주문 상태 수정 성공',
    });
  })
);

// 주문 ID로 주문 삭제 *admin
orderRouter.delete(
  '/admin/:orderId',
  loginRequired,
  adminOnly,
  asyncHandler(async (req, res, next) => {
    const { orderId } = req.params;
    await orderService.deleteOrder(orderId);
    res.status(201).json({
      status: 201,
      message: '주문 삭제 성공',
    });
  })
);

module.exports = orderRouter;
