const BaseError = require("../Exception/Error");
const userModel = require("../Models/User");

exports.signUp = async (req, res, next) => {
    try {
        const { firstName, lastName, email, password, platform } = req.body;
        const user = new userModel({
            firstName,
            lastName,
            email,
            password,
            platform,
        });
        user.encryptPassword(password);
        const savedUser = await user.save();

        return res.status(201).json({
            savedUser,
            fullName: savedUser.fullName,
        });
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

exports.getUsers = async (req, res, next) => {
    try {
        const { name } = req.params;
        const users = await userModel.findByName(name);
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

exports.getUser = async (req, res, next) => {
    try {
        const { _id } = req.params;
        const user = await userModel.findById(_id).lean();
        res.status(200).json({ ...user, fullName: user.fullName });
    } catch (error) {
        next(error);
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        const { _id } = req.params;
        const user = await userModel.findById(_id);
        await user.deleteOne({ _id });
        res.status(200).json({ message: "User deleted" });
    } catch (error) {
        next(error);
    }
};
