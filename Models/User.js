const mongoose = require("mongoose");
const crypto = require("crypto");
const { v4 } = require("uuid");
const Schema = mongoose.Schema;

const { removeUserArticle } = require("../helper/article.helper");

const userSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
            maxlength: 30,
            minlength: [4, "Not a valid last name"],
        },
        lastName: {
            type: String,
            trim: true,
            maxlength: [20, "Last name length exceeded"],
        },
        email: {
            type: String,
            trim: true,
            required: true,
            unique: true,
            validate: {
                validator: function () {
                    return this.email.includes("@");
                },
                message: "Not a valid emil",
            },
        },
        password: {
            type: String,
            required: true,
        },
        salt: {
            type: String,
            required: true,
        },
        platform: {
            type: String,
            enum: {
                values: ["ios", "android", "web"],
                message: "Not a valid platform field",
                default: "android",
            },
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        timestamps: true,
    }
);

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
    // this points to the query
    const user = this.where({ firstName: new RegExp(name, "i") });
    return user;
};

// Virtuals
userSchema
    .virtual("fullName")
    .get(function () {
        return this.firstName + " " + this.lastName;
    })
    .set((v) => {
        console.log(v);
        this.dateOfBirth = Date.now();
    });

// Middleware use case
/**
 * Custom validation
 * asynchronous tasks that a certain action triggers
 * Removing dependent module
 */
// middleware - pre hooks
userSchema.pre("deleteOne", { document: true }, async function (next) {
    await removeUserArticle(this._id);
    next();
});

userSchema.post(
    "deleteOne",
    { document: false, query: true },
    async function (next) {
        console.log("[Some Async Action to be trigger]");
    }
);

module.exports = mongoose.model("Users", userSchema, "persons");
