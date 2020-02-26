const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Role = require("../models/role");

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '')
    const decoded = jwt.verify(token, 'my_secret')
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

    if (!user) {
      throw new Error('user not found')
    }

    req.token = token
    req.user = user
    next()
  } catch (e) {
    res.status(200).send({
      error: 'Please Login',
    })
  };
}

const checkRole = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, 'my_secret');

    const check = await Role.findOne({
      _id: decoded.role
    });

    if (check.role === "admin") {
      next();
    } else {
      res.status(200).send({
        message: "No Authorization"
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error : " + error
    });
    console.log(error);
  }
};


module.exports = {auth, checkRole}
