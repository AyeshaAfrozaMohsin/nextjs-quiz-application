import mongoose, { Schema } from "mongoose";


const QuestionSchema = new Schema(
  {
    question: String,
    options: [String], 
    correctOption: { type: Number, required: true }, // Index of correct option
  },
  {
    timestamps: true,
  }
);

const Question = mongoose.models.Question || mongoose.model("Question", QuestionSchema);

export default Question;
