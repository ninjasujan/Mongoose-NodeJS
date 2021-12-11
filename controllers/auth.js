const BaseError = require("../Exception/Error");
const userModel = require("../Models/User");

exports.signUp = async (req, res, next) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const user = new userModel({
            firstName,
            lastName,
            email,
            password,
        });
        user.encryptPassword(password);
        const savedUser = await user.save();
        return res.status(201).json(savedUser);
    } catch (error) {
        next(error);
    }
};

exports.signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            throw new BaseError("User not found", 400);
        }
        if (user.comparePassword(password)) {
            return res.status(200).json({ message: "User logged In" });
        } else {
            throw new BaseError("Invalid Password", 400);
        }
    } catch (error) {
        next(error);
    }
};
