import mongoose from "mongoose";
const { Schema, model } = mongoose;

const imageSchema = new Schema({ url: String, filename: String });

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
  },
  price: {
    type: Number,
    min: 0,
  },
  image: imageSchema,
});

export default model("Product", productSchema);
