const mongoose = require("mongoose");
const crypto = require("crypto");
const { v4 } = require("uuid");
const { default: BaseError } = require("../Exception/Error");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 30,
    },
    lastName: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    salt: {
        type: String,
        required: true,
    },
});

// Mongoose instance methods
userSchema.methods.encryptPassword = function (password) {
    // Password encryption method
    this.salt = crypto.randomBytes(16).toString("hex");
    this.password = crypto
        .pbkdf2Sync(password, this.salt, 1000, 64, `sha512`)
        .toString(`hex`);
};

userSchema.methods.comparePassword = function (password) {
    const hash = crypto
        .pbkdf2Sync(password, this.salt, 1000, 64, `sha512`)
        .toString(`hex`);
    return this.password === hash;
};

// Mongoose statis methods
userSchema.static.validateUser = function (email) {
    try {
        const user = this.findOne({ email });
        if (!user) {
            throw new BaseError("Invalid email provided", 400);
        }
    } catch (error) {
        throw error;
    }
};

module.exports = mongoose.model("Users", userSchema);
