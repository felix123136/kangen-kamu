import Product from "../models/product.js";
import mongoose from "mongoose";
import cloud from "../cloudinary/index.js";
const cloudinary = cloud.cloudinary;

export async function index(req, res) {
  const products = await Product.find({});
  res.render("products/index", { products });
}

export function renderNewForm(req, res) {
  res.render("products/new");
}

export async function createProduct(req, res) {
  const product = new Product(req.body.product);
  product.image = { url: req.file.path, filename: req.file.filename };
  await product.save();
  req.flash("success", "Successfully created new product");
  res.redirect("/products");
}

export async function renderEditForm(req, res) {
  const { id } = req.params;
  if (mongoose.Types.ObjectId.isValid(id)) {
    const product = await Product.findById(id);
    res.render("products/edit", { product });
  } else {
    req.flash("error", "Product Not Found");
    res.redirect("/products");
  }
}

export async function updateProduct(req, res) {
  const { id } = req.params;
  const { name, price } = req.body.product;
  const product = await Product.findById(id);
  await Product.findByIdAndUpdate(
    id,
    { name, price },
    { runValidators: true, new: true }
  );
  if (req.file) {
    await cloudinary.uploader.destroy(product.image.filename);
    product.image = { url: req.file.path, filename: req.file.filename };
    await product.save();
  }
  req.flash("success", "Successfully updated product");
  res.redirect("/products");
}

export async function deleteProduct(req, res) {
  const { id } = req.params;
  const product = await Product.findById(id);
  await cloudinary.uploader.destroy(product.image.filename);
  await Product.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted product");
  res.redirect("/products");
}
