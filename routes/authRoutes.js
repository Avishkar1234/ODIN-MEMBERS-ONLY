const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const passport = require("passport");
const pool = require("../config/db")

const { ensureAuthenticated } = require("../middleware/authMiddleware");

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

router.get("/logout" , (req, res) => {
    req.logout(function (err) {
        if (err) return next(err);
        res.redirect("/");
    });
});

router.get("/join", ensureAuthenticated, (req, res) => {
    res.render("join", { error: null });
})

router.post("/join", ensureAuthenticated, async (req, res) => {
    if (req.body.passcode === process.env.MEMBER_PASSCODE) {
        await pool.query(
            "UPDATE users SET is_member = true WHERE id = $1",
            [req.user.id]
        );

        res.redirect("/");
    } else {
        res.render("join", { error: "Incorrect passcode" });
    }
});

module.exports = router;