import mongoose, { Schema } from "mongoose";

const QuizSchema = new Schema(
  {
    title: String,
    description: String,
    questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
    bestTime: { type: Number, default: null } 
  },
  {
    timestamps: true,
  }
);

const Quiz = mongoose.models.Quiz || mongoose.model("Quiz", QuizSchema);

export default Quiz;
