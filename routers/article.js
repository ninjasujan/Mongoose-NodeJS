const express = require("express");
const { createArticle, getArticle } = require("../controllers/article");
const router = express.Router();

router.get("/:userId", getArticle);

router.post("/create", createArticle);

module.exports = router;
