import mongoose from "mongoose";
const { Schema, model } = mongoose;

const transactionSchema = new Schema({
  date: {
    type: String,
    required: true,
  },
  products: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
      qty: {
        type: Number,
        required: true,
        min: 1,
      },
    },
  ],
  total: {
    type: Number,
    required: true,
  },
});

const Transaction = model("Transaction", transactionSchema);
export default Transaction;
