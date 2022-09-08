import express from "express";
import wrapAsync from "../utils/wrapAsync.js";

import isLoggedIn from "../middleware.js";
import {
  index,
  renderNewForm,
  addTransaction,
  showTransaction,
  renderEditForm,
  updateTransaction,
  deleteTransaction,
} from "../controllers/transactions.js";

const transactionRouter = express.Router();

transactionRouter
  .route("/")
  .get(isLoggedIn, wrapAsync(index))
  .post(isLoggedIn, wrapAsync(addTransaction));

transactionRouter.get("/new", isLoggedIn, wrapAsync(renderNewForm));

transactionRouter
  .route("/:id")
  .get(isLoggedIn, wrapAsync(showTransaction))
  .put(isLoggedIn, wrapAsync(updateTransaction))
  .delete(isLoggedIn, wrapAsync(deleteTransaction));

transactionRouter.get("/:id/edit", isLoggedIn, wrapAsync(renderEditForm));

export default transactionRouter;
