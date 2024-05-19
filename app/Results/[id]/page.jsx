"use client";
import React, { useEffect, useState } from "react";

export default function Results({ params: { id } }) {
  const [quizData, setQuizData] = useState({
    quiz: { title: "", description: "" },
    questions: [],
    totalQuestions: null,
    isMore: null,
  });
  const [loading, setLoading] = useState(true);
  const quizId = localStorage.getItem("quizId");
  const score = localStorage.getItem("score");
  const time = localStorage.getItem("time");
  const isBest = JSON.parse(localStorage.getItem("isBest"));
  const bestScore = localStorage.getItem("bestScore");
  const bestTime = localStorage.getItem("bestTime");
  const quizAnswers = JSON.parse(localStorage.getItem("quizAnswers"));

  const fetchDataCurrent = async () => {
    console.log("Fetching");
    try {
      const response = await fetch(`http://localhost:3000/api/quizzes/${id}`, {
        method: "GET",
      });
      const data = await response.json();
      setQuizData(data);
      console.log("got data : ", data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  useEffect(() => {
    fetchDataCurrent();
    console.log("Score : ", score);
    console.log("time : ", time);
  }, []);

  const getColorClass = (questionIndex, optionIndex) => {
    // Replace the following condition with your specific logic
    if (optionIndex === quizData.questions[questionIndex].correctOption) {
      return "text-green-900 font-bold";
    } else if (quizId === id) {
      if (optionIndex === quizAnswers[questionIndex])
        return "text-red-900 font-bold";
    }
    return "";
  };

  return (
    <>
      {loading ? (
        <h1 className="text-3xl font-bold mb-4">Loading...</h1>
      ) : (
        <div className="p-6 ">
          <h1 className="text-3xl font-bold mb-4">Quiz</h1>
          <h2 className="text-2xl font-bold mb-4">{quizData.quiz.title}</h2>
          <h3 className="text-1xl font-bold mb-4">
            {quizData.quiz.description}
          </h3>

          {quizId === id ? (
            <div className="text-1xl mb-4 text-blue-800 font-bold">
              <h3>
                Score :  <strong>{score}/{quizData.totalQuestions}</strong>
                <br />
                Time :  <strong>{time} seconds</strong>
              </h3>
              {isBest ? (
                <p className="text-red-800 font-bold">
                  Congratulations! You have the best score!
                </p>
              ) : (
                <p className="text-red-800">
                  Best Score : <strong>{bestScore} </strong><br />
                  Best Time :  <strong>{bestTime} seconds</strong>
                </p>
              )}
            </div>
          ) : (
            ""
          )}

          {quizData.questions.map((question, questionIndex) => (
            <div key={question._id} className="mb-4 text-gray-500">
              <h4 className="font-bold">{question.question}</h4>
              {question.options.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center">
                  <input
                    type="radio"
                    disabled
                    id={`option_${questionIndex}_${optionIndex}`}
                    name={`question_${questionIndex}`}
                    value={optionIndex}
                    checked={optionIndex === question.correctOption}
                    onChange={() =>
                      handleOptionSelection(questionIndex, optionIndex)
                    }
                  />
                  <label
                    htmlFor={`option_${questionIndex}_${optionIndex}`}
                    className={`ml-2 ${getColorClass(
                      questionIndex,
                      optionIndex
                    )}`}
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
          ))}

          <button
            onClick={() => (window.location.href = "/")}
            className="px-4 py-2 rounded-md bg-green-700 hover:bg-blue-600 text-white mt-4"
          >
            Return to Quizzes
          </button>
        </div>
      )}
    </>
  );
}
