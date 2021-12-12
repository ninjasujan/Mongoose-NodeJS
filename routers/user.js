const express = require("express");
const {
    signUp,
    signIn,
    getUsers,
    getUser,
    deleteUser,
} = require("../controllers/user");
const router = express.Router();

router.post("/signup", signUp);
router.post("/login", signIn);
router.get("/users/:name", getUsers);
router.get("/:_id", getUser);
router.delete("/delete/:_id", deleteUser);

module.exports = router;
