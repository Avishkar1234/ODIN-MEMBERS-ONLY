const pool = require("../config/db");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");

exports.signup_get = (req, res) => {
    res.render("signup", { errors: [] });
}

exports.signup_post = [
    body("firstName").trim().notEmpty().withMessage("First name required"),
    body("lastName").trim().notEmpty().withMessage("Last name required"),
    body("email").isEmail().withMessage("Valid email required"),
    body("password")
        .isLength( { min: 6 })
        .withMessage("Password must be at least 6 charcters"),
    body("confirmPassword").custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("Passwords do not match");
        }
        return true;
    }),

    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.render("signup", { errors: errors.array() });
        }

        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);

            await pool.query(
                `INSERT INTO users (first_name, last_name, email, password)
                VALUES ($1, $2, $3, $4)`,
                [
                    req.body.firstName,
                    req.body.lastname,
                    req.body.email,
                    hashedPassword,
                ]
            );

            res.redirect("/");
        } catch(err) {
            console.log(err);
            res.render("signup", { errors: [{ msg: "Email already exists" }] });
        }
    },
]