const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { ensureAuthenticated } = require("../middleware/authMiddleware");

//GET join page
router.get("/join", ensureAuthenticated, (req, res) => {
    res.render("join");
})

//POST join
router.post("/join", ensureAuthenticated, async (req, res) => {
    const secretCode = req.body.passcode;

    if (secretCode === process.env.CLUB_SECRET) {
        await pool.query(
            "UPDATE users SET is_member = true WHERE id = $1",
            [req.user.id]
        );

        return res.redirect("/");
    }

    res.render("join", { error: "Wrong passcode" })
})

module.exports = router;