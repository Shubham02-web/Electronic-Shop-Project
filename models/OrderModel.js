import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderItems: [
      {
        name: {
          type: String,
          required: [true, "Product Name is required"],
        },
        price: {
          type: Number,
          required: [true, "Product Price is required"],
        },
        quantity: {
          type: Number,
          required: [true, "Product quantity is required"],
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Products",
          required: true,
        },
      },
    ],
    paymentMethod: {
      type: String,
      enum: ["CASH", "ONLINE"],
      default: "CASH",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    PaidAt: Date,
    paymentInfo: {
      id: String,
      status: String,
    },
    itemPrice: {
      type: Number,
      required: [true, "itemPrice is required"],
    },
    tax: {
      type: Number,
      required: [true, "tax price is required"],
    },
    totalAmount: {
      type: Number,
      requried: [true, "total price amount is required"],
    },

    deliverdAt: Date,
  },
  { timestamps: true }
);
export const Order = mongoose.model("Orders", orderSchema);
