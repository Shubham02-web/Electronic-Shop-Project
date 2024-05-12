import mongoose from "mongoose";
const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "product name is required"],
    },
    description: {
      type: String,
      required: [true, "product description required"],
    },
    price: {
      type: Number,
      required: [true, "product price required"],
    },
    stock: {
      type: Number,
      required: [true, "product stock is required"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    images: [
      {
        public_id: String,
        url: String,
      },
    ],
  },
  { timestamps: true }
);

const ProductModel = mongoose.model("Products", ProductSchema);
export default ProductModel;
