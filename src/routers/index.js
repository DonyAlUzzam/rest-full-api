const express = require("express");
const router = express.Router();

const userRouter = require("./user");
const roleRouter = require("./role");
const bookRouter = require("./book");
const orderRouter = require("./order");
const categoryRouter = require("./category");

router.use(userRouter);
router.use(roleRouter);
router.use(bookRouter);
router.use(orderRouter);
router.use(categoryRouter);

router.use((req, res, next) => {
  res.status(404).send({
    error: true,
    message: "There is no Route. Get Back !!!!"
  });
});

router.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message
    }
  });
});

module.exports = router;
