const User = require("../Models/User");

exports.signUp = async (req, res, next) => {
  try {
    const user = new User(req.body);
    const savedUser = await user.save();
    return res.status(201).json(savedUser);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
