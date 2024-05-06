export default function CreateQuiz() {
  return (
    <form className="flex flex-col gap-3">
      <input
        className="border border-slate-500 px-8 py-2"
        type="text"
        placeholder="Quiz Title"
      />
      <input
        className="border border-slate-500 px-8 py-2"
        type="text"
        placeholder="Quiz Description"
      />
      <button className ="text-white font-bold py-3 px-6 w-fit bg-green-600">Add Quiz</button>
    </form>
  );
}
