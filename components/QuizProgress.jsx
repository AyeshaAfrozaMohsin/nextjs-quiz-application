import React from "react";

const QuizProgress = ({ totalAnswered, totalQuestions }) => {
  if (!totalAnswered) totalAnswered = 0;
  const progress = (totalAnswered / totalQuestions) * 100;
  return (
    <div className="w-full bg-gray-300 rounded-full m-4 p-1">
      <div
        className="h-2 bg-green-700 rounded-full"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default QuizProgress;
