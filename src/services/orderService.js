const orderModel = require('../db/models/orderModel');
const { filterResponseOrder } = require('../utils/utils');
const customError = require('../middlewares/customError');

class OrderService {
  constructor(orderModel) {
    this.orderModel = orderModel;
  }

  async getOrderList() {
    const orders = await this.orderModel.findAll();
    if (!orders) {
      throw new customError(404, '주문 내역이 없습니다.');
    }
    return filterResponseOrder(orders);
  }

  async getOrdersByOrderId(orderId) {
    const orders = await this.orderModel.findByOrderId(orderId);
    if (!orders) {
      throw new customError(404, '해당 주문 ID의 주문 내역이 없습니다.');
    }
    return filterResponseOrder(orders);
  }

  async getOrdersByEmail(userEmail) {
    const orders = await this.orderModel.findAll();
    const ordersByEmail = orders.filter(
      (orders) => orders.email === userEmail
    );
    if (!ordersByEmail.length) {
      throw new customError(404, '해당 사용자의 주문 내역이 없습니다.');
    }
    return filterResponseOrder(ordersByEmail);
  }

  async createOrder(toCreate) {
    if (!toCreate.total_price || toCreate.total_price === 0) {
      throw new customError(401, '주문 금액의 합이 0원 입니다.');
    }

    const order = await this.orderModel.create(toCreate);
    return order;
  }

  async updateOrderById(orderId, toUpdate) {
    const order = await this.orderModel.updateOrderById(orderId, toUpdate);
    if (!order) {
      throw new customError(404, '해당 ID의 주문 내역이 없습니다.');
    }
    return order;
  }

  async deleteOrder(orderId) {
    const order = await this.orderModel.delete(orderId);
    if (!order) {
      throw new customError(404, '해당 ID의 주문 내역이 없습니다.');
    }
    return order;
  }
}

const orderService = new OrderService(orderModel);
module.exports = orderService;
