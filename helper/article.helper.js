const articleModel = require("../Models/Article");

exports.removeUserArticle = async (_id) => {
    try {
        console.log(_id);
        await articleModel.deleteMany({ userId: _id });
    } catch (error) {
        throw error;
    }
};
