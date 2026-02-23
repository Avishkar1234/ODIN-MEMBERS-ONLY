const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const passport = require("passport");

router.get("/signup", authController.signup_get);
router.post("/signup", authController.signup_post);

router.get("/login", (req, res) => {
    res.render("login");
});

router.post("/login", 
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login",
    })
)

module.exports = router;