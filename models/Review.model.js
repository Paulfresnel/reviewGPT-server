const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const reviewSchema = new Schema(
  {
    placeName: {
      type: String,
      required: true
    },
    promptNotes: {
      type: String,
      required: true
    },
    language: {
      type: String,
      required: true
    },
    gptResponse: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["Restaurant", "Appartment", "Video", "Retail Store", "Corporate Office", "Company", "Entertainment"],
    }
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Review = model("Review", reviewSchema);

module.exports = Review;
