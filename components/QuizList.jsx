import Link from "next/link";
import RemoveButton from "./RemoveButton";
import { HiPencilAlt } from "react-icons/hi";

export default function QuizList() {
  return (
    <>
      <div className="p-4 border border-slate-300 my-3 flex justify-between gap-5">
        <div>
          <h2>Quiz Title</h2>
          <h2>Description</h2>
        </div>
        <div className = "flex gap-2 items-start">
          <RemoveButton />
          <Link href={"/editQuiz/123"}>
            <HiPencilAlt size={24} />
          </Link>
        </div>
      </div>
    </>
  );
}
