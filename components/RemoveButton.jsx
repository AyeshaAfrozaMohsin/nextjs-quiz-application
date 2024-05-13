import { HiOutlineTrash } from "react-icons/hi";

export default function RemoveButton({ id }) {
  const handleClick = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/quizzes?id=${id}`, {
        method: "DELETE"
      });

      if (res.ok) {
        // Successful deletion
        alert("Quiz deleted successfully!");
        // You might want to handle UI updates or redirection here
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
    <button className="text-red-400" onClick={handleClick}>
      <HiOutlineTrash size={24} />
    </button>
  );
}
