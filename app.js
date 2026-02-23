const express = require("express");
require("dotenv").config();
const path = require("path");
const app = express();
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const pool = require("./config/db");
const bcrypt = require("bcrypt");

const authRoutes = require("./routes/authRoutes");

const { ensureAuthenticated } = require("./middleware/authMiddleware");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new LocalStrategy(
        { usernameField: "email" },
        async (email, password, done) => {
            try {
                const result = await pool.query(
                    "SELECT * FROM users WHERE email = $1",
                    [email]
                );

            if (result.rows.length === 0) {
                return done(null, false, { message: "Incorrect email" });
            }

            const user = result.rows[0];

            const match = await bcrypt.compare(password, user.password);

            if (!match) {
                return done(null, false, { message: "Incorrect password" });
            }

            return done(null, user);
            } catch(err) {
                return done(err);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const result = await pool.query(
            "SELECT * FROM users WHERE id = $1",
            [id]
        );
        done(null, result.rows[0]);
    } catch (err) {
        return done(err);
    }
})

app.use("/", authRoutes);

app.get("/", (req, res) => {
    if (req.user) {
        res.send(`
            <h1>Welcome ${req.user.first_name}</h1>
            <a href="/dashboard">Dashboard</a>
            <br>
            `);
    } else {
        res.send(`
            <h1>Home Page</h1>
            <a href="/login">Login</a>
            <br>
            <a href="/signup">Sign Up</a>
            `);
    }
});

app.get("/dashboard",  ensureAuthenticated, (req, res) => {
    res.send(`<h1>Dashboard for ${req.user.first_name}</h1>`);
})

app.listen(3000, () =>{
    console.log("Server is running on port 3000")
})