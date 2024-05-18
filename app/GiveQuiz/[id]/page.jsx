"use client";
import React, { useEffect, useState } from "react";

export default function GiveQuiz({ params: { id } }) {
  const [quizData, setQuizData] = useState({
    quiz: { title: "", description: "" },
    questions: [],
    totalQuestions: null,
    isMore: null,
  });
  const [page, setPage] = useState(1);
  const [answers, setAnswers] = useState([]);
  const [askedNext, setAskedNext] = useState(false);
  const [askedPrev, setAskedPrev] = useState(false);
  const [prevData, setPrevData] = useState(null);
  const [nextData, setNextData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDataCurrent = async () => {
    console.log("Fetching CURR:", page);
    try {
      const response = await fetch(
        `http://localhost:3000/api/quizzes/${id}?page=${page}&pageSize=5`,
        { method: "GET" }
      );
      const data = await response.json();
      setQuizData(data);
      console.log("got data : ", data);
      if (data.isMore) {
        fetchDataNext();
      } else {
        setNextData(null);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };
  const fetchDataPrev = async () => {
    console.log("Fetching PREVV:", page - 1);
    try {
      const response = await fetch(
        `http://localhost:3000/api/quizzes/${id}?page=${page - 1}&pageSize=5`,
        { method: "GET" }
      );
      const data = await response.json();
      setPrevData(data);
      // return data;
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };
  const fetchDataNext = async () => {
    console.log("Fetching NEXTT:", page + 1);
    try {
      const response = await fetch(
        `http://localhost:3000/api/quizzes/${id}?page=${page + 1}&pageSize=5`,
        { method: "GET" }
      );
      const data = await response.json();
      setNextData(data);
      // return data;
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  // useEffect(() => {
  //   console.log("Page: ", page);
  //   console.log("Fetched Curr: ", quizData);
  // }, [quizData]);
  // useEffect(() => {
  //   console.log("Fetched prev: ", [prevData]);
  // }, [prevData]);
  // useEffect(() => {
  //   console.log("Fetched next: ", nextData);
  // }, [nextData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Sending answers : ", answers);

      const response = await fetch(`http://localhost:3000/api/quizzes/${id}`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(answers),
      });
      const { totalMarks, totalQuestions } = await response.json();
      if (response.ok) {
        alert(`You got: ${totalMarks}/${totalQuestions}`);
        setAnswers([]);
      }
    } catch (error) {
      console.error("Error sending answers:", error);
      toast.error("Error submitting quiz");
    }
  };

  const handleOptionSelection = (questionIndex, optionIndex) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  useEffect(() => {
    if (askedNext) {
      setPrevData(quizData);
      setQuizData(nextData);
      if (nextData.isMore) {
        fetchDataNext();
      } else {
        setNextData(null);
      }
      setAskedNext(false);
    } else if (askedPrev) {
      setNextData(quizData);
      setQuizData(prevData);
      if (page > 1) {
        fetchDataPrev();
      } else {
        setPrevData(null);
      }

      setAskedPrev(false);
    } else {
      console.log("page updated but waiting for them to update");
    }
  }, [page]);

  useEffect(() => {
    fetchDataCurrent();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Quiz</h1>
      <h2 className="text-2xl font-bold mb-4">{quizData.quiz.title}</h2>
      <h3 className="text-1xl font-bold mb-4">{quizData.quiz.description}</h3>

      {quizData.questions.map((question, questionIndex) => (
        <div key={question._id} className="mb-4">
          <h4 className="font-bold">{question.question}</h4>
          {question.options.map((option, optionIndex) => (
            <div key={optionIndex} className="flex items-center">
              <input
                type="radio"
                id={`option_${questionIndex}_${optionIndex}`}
                name={`question_${questionIndex}`}
                value={optionIndex}
                onChange={() =>
                  handleOptionSelection(questionIndex, optionIndex)
                }
              />
              <label
                htmlFor={`option_${questionIndex}_${optionIndex}`}
                className="ml-2"
              >
                {option}
              </label>
            </div>
          ))}
        </div>
      ))}

      <div className="mt-6">
        <button
          disabled={page === 1}
          onClick={() => {
            setAskedPrev(true);
            setPage((prevPage) => prevPage - 1);
          }}
          className={`px-2 py-2 rounded-md ${
            page === 1 ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          } text-white mr-2`}
        >
          Previous
        </button>
        <p>
          {page}/{Math.ceil(quizData.totalQuestions / 5)}
        </p>
        <button
          disabled={!quizData.isMore}
          onClick={() => {
            setAskedNext(true);
            setPage((prevPage) => prevPage + 1);
          }}
          className={`px-2 py-2 rounded-md ${
            !quizData.isMore ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          } text-white mr-2`}
        >
          Next
        </button>
      </div>

      <button
        onClick={(e) => handleSubmit(e)}
        className="px-4 py-2 rounded-md bg-green-700 hover:bg-blue-600 text-white mt-4"
      >
        Submit
      </button>
    </div>
  );
}
