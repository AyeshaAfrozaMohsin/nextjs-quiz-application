// User.js
import mongoose, { Schema } from "mongoose";

// Define User schema
const UserSchema = new Schema({
  username: String,
  password: String,
  highestScores: [
    {
      quiz: { type: Schema.Types.ObjectId, ref: "Quiz" },
      score: Number,
    },
  ],
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
