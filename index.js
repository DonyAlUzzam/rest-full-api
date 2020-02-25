const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const router = require("./src/routers/index");
require("./db");

const app = express();
const port =  8081;

// Package
app.use("/uploads", express.static("uploads"));
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(router);

app.listen(port, () => console.log(`Server Running on Port : ${port}`));
