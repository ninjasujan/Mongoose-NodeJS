const articleModel = require("../Models/Article");

exports.createArticle = async (req, res, next) => {
    try {
        const { userId, title, dateOfPublish } = req.body;
        const article = await new articleModel({
            userId,
            title,
            dateOfPublish,
        }).save();
        res.status(200).json(article);
    } catch (error) {
        next(error);
    }
};
