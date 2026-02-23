const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { ensureAuthenticated } = require("../middleware/authMiddleware");

router.get("/messages/new", ensureAuthenticated, (req, res) => {
    res.render("newMessage");
})

router.post("/messages/new", ensureAuthenticated, async (req, res) => {
    try {
        await pool.query(
            "INSERT INTO messages (title, text, user_id) VALUES ($1, $2, $3)",
        [req.body.title, req.body.text, req.user.id]
        );

        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.send("Error creating message");
    }
});

module.exports = router;