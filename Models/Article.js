const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const articleSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        dateOfPublish: {
            type: Date,
            required: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "Users",
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        timestamps: true,
    }
);

// virtual populate
articleSchema.virtual("user", {
    ref: "Users",
    localField: "userId",
    foreignField: "_id",
    // count: true, // return only count of documents
});

module.exports = mongoose.model("Article", articleSchema);
