import * as dotenv from "dotenv";
dotenv.config();
import express, { urlencoded } from "express";
import mongoose from "mongoose";
import methodOverride from "method-override";
import engine from "ejs-mate";
import ExpressError from "./utils/ExpressError.js";
import productRouter from "./routes/products.js";
import transactionRouter from "./routes/transactions.js";
import userRouter from "./routes/users.js";
import session from "express-session";
import flash from "connect-flash";
import passport from "passport";
import LocalStrategy from "passport-local";
import User from "./models/user.js";
import MongoStore from "connect-mongo";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.engine("ejs", engine);

//Middleware
app.use(urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/kangenKamu";
const secret = process.env.SECRET;

const sessionConfig = {
  store: MongoStore.create({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 3600,
  }),
  name: "session",
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
    maxAge: 24 * 3600 * 1000,
  },
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

async function main() {
  await mongoose.connect(dbUrl);
  console.log("Database Connected");
}

main().catch((e) => {
  console.log(e);
});

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", userRouter);
app.use("/products", productRouter);
app.use("/transactions", transactionRouter);

//Routing
app.get("/", (req, res) => {
  res.render("home");
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something Went Wrong";
  res.status(statusCode).render("error", { err });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`On Port ${port}`);
});
