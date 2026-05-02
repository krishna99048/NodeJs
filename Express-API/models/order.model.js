const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        total: {
          type: Number,
          required: true,
        },
      },
    ],

    totalbill: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "confirm", "cancel"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("order", OrderSchema);