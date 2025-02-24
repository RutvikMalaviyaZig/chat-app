require("dotenv").config();
// core modules
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(
    cors({
        origin: "*",
    })
);

app.get("/", (req, res) => {
    res.json({ message: "Hello World" });
});

app.listen(PORT, (req, res) => {
    console.log(`server is listening at http://localhost:${PORT}`);
});
