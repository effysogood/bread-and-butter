const { Schema } = require('mongoose');

const UserSchema = new Schema({
    // shortId: {
    //     type: String,
    //     required: true,
    // },
    password:  {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    address: {
        type: new Schema(
          {
            postcode: {
              type: String,
              required: false,
              default: null,
            },
            main: {
              type: String,
              required: false,
              default: null,
            },
            detail: {
              type: String,
              required: false,
              default: null,
            },
          },
          {
            _id: false,
          }
        ),
        required: false,
        default: {},
    },
    phone: {
        type: String,
        required: true,
    },
    deleted_at: {
        type: Date,
    },
    is_admin: {
        type: Boolean,
    },
}, {
  timestamps: true,
});

module.exports = UserSchema;
