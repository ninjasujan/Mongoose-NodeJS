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

exports.getArticle = async (req, res, next) => {
    try {
        const { userId } = req.params;
        // const articles = await articleModel.find({ userId }).populate({
        //     path: "userId",
        //     match: { firstName: "someds" },
        //     perDocumentLimit: 2,
        // });
        const articles = await articleModel.find({ userId }).populate("user");
        res.status(200).json(articles);
    } catch (error) {
        next(error);
    }
};
