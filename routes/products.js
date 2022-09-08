import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import ExpressError from "../utils/ExpressError.js";
import productSchema from "../schema.js";
import isLoggedIn from "../middleware.js";
import multer from "multer";
import cloud from "../cloudinary/index.js";
const storage = cloud.storage;
const upload = multer({ storage });

import {
  index,
  renderNewForm,
  createProduct,
  renderEditForm,
  updateProduct,
  deleteProduct,
} from "../controllers/products.js";

const productRouter = express.Router();

const validateProduct = (req, res, next) => {
  const { error } = productSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else next();
};

productRouter
  .route("/")
  .get(isLoggedIn, wrapAsync(index))
  .post(
    isLoggedIn,
    upload.single("image"),
    validateProduct,
    wrapAsync(createProduct)
  );

productRouter.get("/new", isLoggedIn, renderNewForm);

productRouter
  .route("/:id")
  .put(
    isLoggedIn,
    upload.single("image"),
    validateProduct,
    wrapAsync(updateProduct)
  )
  .delete(isLoggedIn, wrapAsync(deleteProduct));

productRouter.get("/:id/edit", isLoggedIn, wrapAsync(renderEditForm));

export default productRouter;
