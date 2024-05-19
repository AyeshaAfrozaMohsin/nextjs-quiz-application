"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Timer from "@/components/Timer";
import QuizProgress from "@/components/QuizProgress";

export default function GiveQuiz({ params: { id } }) {
  const [elapsedTime, setElapsedTime] = useState(0);
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
  const [loading, setLoading] = useState(true);
  const [totalAnswered, setTotalAnswered] = useState(0);

  const router = useRouter();

  const pageSize = 5;

  const handleTimeUpdate = (time) => {
    setElapsedTime(time);
  };

  const fetchDataCurrent = async () => {
    console.log("Fetching CURR:", page);
    try {
      const response = await fetch(
        `http://localhost:3000/api/quizzes/${id}?page=${page}&pageSize=${pageSize}`,
        { method: "GET" }
      );
      const data = await response.json();
      setQuizData(data);
      console.log("got data : ", data);
      setLoading(false);
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
        `http://localhost:3000/api/quizzes/${id}?page=${
          page - 1
        }&pageSize=${pageSize}`,
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
        `http://localhost:3000/api/quizzes/${id}?page=${
          page + 1
        }&pageSize=${pageSize}`,
        { method: "GET" }
      );
      const data = await response.json();
      setNextData(data);
      // return data;
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Form submitted with elapsed time:", elapsedTime);
      console.log("Sending answers : ", answers);

      const response = await fetch(`http://localhost:3000/api/quizzes/${id}`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ timeTaken: elapsedTime, ...answers }),
      });
      const { totalMarks, totalQuestions, isBest, bestScore, bestTime } =
        await response.json();
      if (response.ok) {
        alert(`You got: ${totalMarks}/${totalQuestions}`);
        localStorage.setItem("quizId", id);
        localStorage.setItem("score", totalMarks);
        localStorage.setItem("time", elapsedTime);
        localStorage.setItem("isBest", isBest);
        localStorage.setItem("bestScore", bestScore);
        localStorage.setItem("bestTime", bestTime);
        localStorage.setItem("quizAnswers", JSON.stringify(answers));
        setAnswers([]);
      }
      router.push(`/Results/${id}`);
    } catch (error) {
      console.error("Error sending answers:", error);
      toast.error("Error submitting quiz");
    }
  };

  const handleOptionSelection = (questionIndex, optionIndex) => {
    const newAnswers = [...answers];
    questionIndex = (page - 1) * pageSize + questionIndex;
    newAnswers[questionIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  useEffect(() => {
    const nonEmptyCount = answers.filter(
      (answer) => answer !== undefined && answer !== ""
    ).length;
    console.log("answers :", answers);
    console.log("non empty :", nonEmptyCount);
    setTotalAnswered(nonEmptyCount);
  }, [answers]);

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
    <>
      {loading ? (
        <h1 className="text-3xl font-bold mb-4">Loading...</h1>
      ) : (
        <div className="p-6">
          <Timer onTimeUpdate={handleTimeUpdate} />
          <h1 className="text-3xl font-bold mb-4">Quiz</h1>
          <h2 className="text-2xl font-bold mb-4">{quizData.quiz.title}</h2>
          <h3 className="text-1xl font-bold mb-4">
            {quizData.quiz.description}
          </h3>
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
                    checked={
                      optionIndex ===
                      answers[(page - 1) * pageSize + questionIndex]
                    }
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
          <div className=" flex">
            <button
              disabled={page === 1}
              onClick={() => {
                setAskedPrev(true);
                setPage((prevPage) => prevPage - 1);
              }}
              className={`px-2 py-2 rounded-md ${
                page === 1 ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
              } text-white`}
            >
              Previous
            </button>
            <p className="center m-2 ">
              Page : {page}/{Math.ceil(quizData.totalQuestions / 5)}
            </p>
            <button
              disabled={!quizData.isMore}
              onClick={() => {
                setAskedNext(true);
                setPage((prevPage) => prevPage + 1);
              }}
              className={`px-2 py-2 rounded-md ${
                !quizData.isMore
                  ? "bg-gray-400"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white`}
            >
              Next
            </button>
          </div>

          <QuizProgress
            totalAnswered={totalAnswered}
            totalQuestions={quizData.totalQuestions}
          />

          <button
            onClick={(e) => handleSubmit(e)}
            className="px-4 py-2 rounded-md bg-green-700 hover:bg-blue-600 text-white mt-4"
          >
            Submit
          </button>
        </div>
      )}
    </>
  );
}
