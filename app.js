const express = require("express");
require("dotenv").config();
const path = require("path");
const app = express();
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const pool = require("./config/db");
const bcrypt = require("bcrypt");

//Routes
const authRoutes = require("./routes/authRoutes");
const messageRoutes = require("./routes/messageRoutes");
const membershipRoutes = require("./routes/membershipRoutes");

const { ensureAuthenticated } = require("./middleware/authMiddleware");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    store: new pgSession({
      pool: pool,
      tableName: "session",
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

app.set("trust proxy", 1);

app.get("/debug-auth", (req, res) => {
  res.json({
    nodeEnv: process.env.NODE_ENV,
    sessionSecretExists: !!process.env.SESSION_SECRET,
    authenticated: req.isAuthenticated(),
    user: req.user || null,
    session: req.session || null,
  });
});

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const result = await pool.query(
          "SELECT * FROM users WHERE email = $1",
          [email],
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
      } catch (err) {
        return done(err);
      }
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    done(null, result.rows[0]);
  } catch (err) {
    return done(err);
  }
});

app.use("/", authRoutes);

app.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT messages.*, users.first_name, users.last_name
            FROM messages
            JOIN users ON messages.user_id = users.id
            ORDER BY created_at DESC`,
    );

    res.render("home", {
      user: req.user,
      messages: result.rows,
    });
  } catch (err) {
    console.error(err);
    res.send("Error loading messages");
  }
});

app.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.send(`<h1>Dashboard for ${req.user.first_name}</h1>`);
});

app.use("/", messageRoutes);
app.use("/", membershipRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
