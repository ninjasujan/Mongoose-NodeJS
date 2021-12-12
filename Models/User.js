const mongoose = require("mongoose");
const crypto = require("crypto");
const { v4 } = require("uuid");
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

// Mongoose instance methods - this points to the current doc object
userSchema.methods.encryptPassword = async function (password) {
    // schema level queries
    // const user = await mongoose
    //     .model("Users")
    //     .find({ email: "sujan@appyhigh.com" });
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
userSchema.statics.findByName = async function (name) {
    const users = await this.find({ firstName: new RegExp(name, "i") });
    return users;
};

// Query helper
userSchema.query.getName = async function (name) {
    const user = this.where({ firstName: new RegExp(name, "i") });
    return user;
};

module.exports = mongoose.model("Users", userSchema);
