import Transaction from "../models/transaction.js";
import dateFormat, { masks } from "dateformat";
import Product from "../models/product.js";
import mongoose from "mongoose";

export async function index(req, res) {
  const transactions = (await Transaction.find({})).reverse();
  res.render("transactions/index", { transactions });
}

export async function renderNewForm(req, res) {
  const products = await Product.find({});
  res.render("transactions/new", { products });
}

export async function addTransaction(req, res) {
  const now = new Date();
  const date = dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT");
  const transaction = new Transaction({
    date: date,
  });
  const products = await Product.find({});
  let total = 0;
  for (let product of products) {
    if (req.body[product.name].qty > 0) {
      transaction.products.push({
        product: product,
        qty: req.body[product.name].qty,
      });
      total += product.price * req.body[product.name].qty;
    }
  }
  transaction.total = total;
  await transaction.save();
  req.flash("success", "Successfully added a new transaction");
  res.redirect(`/transactions/${transaction._id}`);
}

export async function showTransaction(req, res) {
  const { id } = req.params;
  if (mongoose.Types.ObjectId.isValid(id)) {
    const transaction = await Transaction.findById(id).populate(
      "products.product"
    );
    res.render("transactions/show", { transaction });
  } else {
    req.flash("error", "Transaction Not Found");
    res.redirect("/transactions");
  }
}

export async function renderEditForm(req, res) {
  const { id } = req.params;
  if (mongoose.Types.ObjectId.isValid(id)) {
    const transaction = await Transaction.findById(id).populate(
      "products.product"
    );
    const products = await Product.find({});
    res.render("transactions/edit", { transaction, products });
  } else {
    req.flash("error", "Transaction Not Found");
    res.redirect("/transactions");
  }
}

export async function updateTransaction(req, res) {
  const { id } = req.params;
  const date = await Transaction.findById(id).date;
  const transaction = {
    date: date,
    products: [],
    total: 0,
  };
  const products = await Product.find({});
  let total = 0;
  for (let product of products) {
    if (req.body[product.name].qty > 0) {
      transaction.products.push({
        product: product,
        qty: req.body[product.name].qty,
      });
      total += product.price * req.body[product.name].qty;
    }
  }
  transaction.total = total;

  await Transaction.findByIdAndUpdate(id, transaction);
  req.flash("success", "Successfully updated transaction");
  await res.redirect(`/transactions/${id}`);
}

export async function deleteTransaction(req, res) {
  const { id } = req.params;
  await Transaction.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted transaction");
  res.redirect("/transactions");
}
