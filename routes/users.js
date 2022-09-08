import express from "express";
import User from "../models/user.js";
import passport from "passport";

const userRouter = express.Router();

userRouter.get("/register", (req, res) => {
  res.render("users/register");
});

userRouter.post("/register", async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const newUser = await User.register(user, password);
    req.login(newUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Successfully registered");
      res.redirect("/products");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
});

userRouter.get("/login", (req, res) => {
  res.render("users/login");
});

userRouter.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash("success", "Successfully logged in");
    res.redirect("/products");
  }
);

userRouter.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Successfully signed out");
    res.redirect("/");
  });
});

export default userRouter;
