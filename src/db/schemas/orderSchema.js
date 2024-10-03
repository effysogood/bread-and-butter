const { Schema } = require('mongoose');

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    img_url: {
      type: String,
      required: true,
    },
    quantity: { type: Number },
  },
  { _id: false }
);

const AddressSchema = new Schema(
  {
    postcode: { type: String },
    main: { type: String },
    detail: { type: String },
  },
  { _id: false }
);

const OrdererSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    address: {
      type: AddressSchema,
      required: true,
    },
    shipping_message: {
      type: String,
    },
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    products: {
      type: [ProductSchema],
      required: true,
    },
    orderer: {
      type: OrdererSchema,
      required: true,
    },
    shipping_fee: {
      type: Number,
    },
    total_price: {
      type: Number,
      required: true,
    },
    order_status: {
      type: String,
      enum: ['주문 완료', '배송 중', '배송 완료', '주문 취소'],
      default: '주문 완료',
      required: true,
    },
    deleted_at: {
      type: Date,
      default: null,
    },
  },
  { collection: 'orders', timestamps: true }
);

module.exports = OrderSchema;
