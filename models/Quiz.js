import mongoose, { Schema } from "mongoose";

const QuizSchema = new Schema(
  {
    title: String,
    description: String,
    questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
    timeTaken: { type: Number, default: null },
    bestScore : { type: Number, default: 0 } 
  },
  {
    timestamps: true,
  }
);

const Quiz = mongoose.models.Quiz || mongoose.model("Quiz", QuizSchema);

export default Quiz;
