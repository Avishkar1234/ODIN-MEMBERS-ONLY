const express = require("express");
require("dotenv").config();
const path = require("path");
const app = express();

const authRoutes = require("./routes/authRoutes");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", authRoutes);

app.get("/", (req, res) => {
    res.send("<h1>Server is running</h1>")
})

app.listen(3000, () =>{
    console.log("Server is running on port 3000")
})