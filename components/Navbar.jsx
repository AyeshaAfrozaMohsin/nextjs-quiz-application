import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center bg-slate-800 px-8 py-3 rounded">
      <Link className="text-white font-bold text-xl" href={"/"}>
        QuizHub
      </Link>
      <Link className="bg-white p-2 rounded-full" href={"/CreateQuiz"}>
        Create Quiz
      </Link>
    </nav>
  );
}
