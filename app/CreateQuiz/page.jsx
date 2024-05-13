"use client";

import { useState } from "react";

export default function EditQuiz() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([
    {
      question: "",
      options: ["", "", "", ""],
      correctOption: 0, // Index of the correct option
    },
  ]);

  const handleQuestionChange = (
    questionIndex,
    key,
    value,
    optionIndex = null
  ) => {
    const updatedQuestions = [...questions];
    if (optionIndex !== null) {
      updatedQuestions[questionIndex].options[optionIndex] = value;
    } else {
      updatedQuestions[questionIndex][key] = value;
    }
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].correctOption = optionIndex;
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        options: ["", "", "", ""],
        correctOption: 0,
      },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if title, description, and at least one question exist
    if (
      title.trim() === "" ||
      description.trim() === "" ||
      questions.length === 0
    ) {
      alert("Please fill in all fields.");
      return;
    }

    const quizData = {
      title,
      description,
      questions,
    };

    console.log(JSON.stringify(quizData));

    const res = await fetch("http://localhost:3000/api/quizzes", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(quizData),
    });

    if (res.ok) {
      alert("Quiz Added Successfully!");
      // Clear form fields after submission
      setTitle("");
      setDescription("");
      setQuestions([
        {
          question: "",
          options: ["", "", "", ""],
          correctOption: 0,
        },
      ]);
    } else {
      alert("Something went wrong!");
      console.log(res.status);
    }
  };

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
      <input
        className="border border-slate-500 px-8 py-2"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        type="text"
        placeholder="Quiz Title"
      />
      <input
        className="border border-slate-500 px-8 py-2"
        onChange={(e) => setDescription(e.target.value)}
        value={description}
        type="text"
        placeholder="Quiz Description"
      />

      {questions.map((question, questionIndex) => (
        <div key={questionIndex} className="flex flex-col gap-2 py-5">
          <input
            className="border border-slate-500 px-8 py-2"
            onChange={(e) =>
              handleQuestionChange(questionIndex, "question", e.target.value)
            }
            value={question.question}
            type="text"
            placeholder={`Question ${questionIndex + 1}`}
          />
          {question.options.map((option, optionIndex) => (
            <div key={optionIndex} className="flex items-center space-x-2 mb-2">
              <input
                type="radio"
                name={`question${questionIndex}`}
                checked={question.correctOption === optionIndex}
                onChange={() => handleOptionChange(questionIndex, optionIndex)}
                className="mr-2"
              />
              <input
                className="border border-slate-500 px-8 py-2"
                onChange={(e) =>
                  handleQuestionChange(
                    questionIndex,
                    "options",
                    e.target.value,
                    optionIndex
                  )
                }
                value={option}
                type="text"
                placeholder={`Option ${optionIndex + 1}`}
              />
            </div>
          ))}
        </div>
      ))}

      <button
        type="button"
        onClick={addQuestion}
        className="text-white font-bold py-3 px-6 w-fit bg-green-600"
      >
        Add Question
      </button>

      <button
        type="submit"
        className="text-white font-bold py-3 px-6 w-fit bg-green-600"
      >
        Add Quiz
      </button>
    </form>
  );
}
