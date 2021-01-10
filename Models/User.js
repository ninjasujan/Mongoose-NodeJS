const mongoose = require("mongoose");
const crypto = require("crypto");
const { v4 } = require("uuid");
const Schema = mongoose.Schema;

const User = new Schema({
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
  encry_passwd: {
    type: String,
    required: true,
  },
  salt: String,
});

User.methods = {
  hashPasswd: function (password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha256", this.salt)
        .update("I love nodejs")
        .digest("hex");
    } catch (err) {
      return "";
    }
  },

  authenticate: function (passsword) {
    return this.encry_passwd === this.hashPasswd(passsword);
  },
};

User.virtual("password")
  .set(function (password) {
    this._passwd = password;
    this.salt = v4();
    this.encry_passwd = this.hashPasswd(password);
  })
  .get(function () {
    return this._passwd;
  });

module.exports = mongoose.model("Users", User);
