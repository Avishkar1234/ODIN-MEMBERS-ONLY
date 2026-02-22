const express = require("express");
require("dotenv").config();

const app = express();

app.use(express.urlencoded({ extended: true }))
app.use(express.json());

app.get("/", (req, res) => {
    res.send("<h1>Server is running</h1>")
})

app.listen(3000, () =>{
    console.log("Server is running on port 3000")
})