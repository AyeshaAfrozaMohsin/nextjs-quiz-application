"use client";

import { useState, useEffect } from "react";
import { HiOutlineTrash } from "react-icons/hi";
import Link from "next/link";

const getQuizzes = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/quizzes", {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error("Failed to fetch topics.");
    } else {
      return res.json();
    }
  } catch (err) {
    // <div className="font-bold text-red-600 text-center">
    //   An error has occured.
    // </div>
    console.log("an error has occured.");
  }
};

export default function QuizList() {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    fetchQuizzes();
  }, [quizzes]);

  const fetchQuizzes = async () => {
    const { quizzes } = await getQuizzes();
    setQuizzes(quizzes);
  };

  const handleDelete = async (e, id) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:3000/api/quizzes?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // Successful deletion
        alert("Quiz deleted successfully!");
        // Refresh the list of quizzes
        fetchQuizzes();
      } else {
        // If the deletion fails
        alert("Failed to delete quiz.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while deleting the quiz.");
    }
  };

  return (
    <>
      {quizzes.map((q) => (
        <div
          key={q._id}
          className="p-4 border border-slate-300 my-3 flex justify-between gap-5"
        >
          <Link href={`/GiveQuiz/${q._id}`} className="bg-gray-200 flex-1">
            <div>
              <h2>{q.title}</h2>
              <h2>{q.description}</h2>
            </div>
          </Link>
          <div className="flex gap-2 items-start">
            <button
              className="text-red-400"
              onClick={(e) => handleDelete(e, q._id)}
            >
              <HiOutlineTrash size={24} />
            </button>
          </div>
        </div>
      ))}
    </>
  );
}
