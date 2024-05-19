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
    console.log("an error has occurred.");
    throw err; // Re-throw the error to handle it in the parent component if needed
  }
};

export default function QuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true); // State to track loading status

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    setLoading(true); // Set loading to true when fetching starts
    try {
      const { quizzes } = await getQuizzes();
      setQuizzes(quizzes);
    } catch (error) {
      // Handle error if needed
    } finally {
      setLoading(false); // Set loading to false when fetching completes (either success or error)
    }
  };

  const handleDelete = async (e, id) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:3000/api/quizzes?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Quiz deleted successfully!");
        fetchQuizzes();
      } else {
        alert("Failed to delete quiz.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while deleting the quiz.");
    }
  };

  return (
    <>
      {loading && <h1 className="text-3xl font-bold mb-4">Loading...</h1>}{" "}
      {!loading && // Render quizzes if not loading
        quizzes.map((q) => (
          <div
            key={q._id}
            className="p-4 border border-slate-300 my-3 flex justify-between gap-5"
          >
            <Link href={`/GiveQuiz/${q._id}`} className="flex-1">
              <div>
                <h2 className="font-bold text-xl">{q.title}</h2>
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
