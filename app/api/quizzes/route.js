import connectMongoDB from "@/libs/mongodb";
import Quiz from "@/models/Quiz";
import Question from "@/models/Question";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { title, description, questions } = await request.json();
  console.log("endpoint accessed");
  try {
    await connectMongoDB(); // Wait for MongoDB connection to be established
    const createdQuestions = await Promise.all(
      questions.map(async (q) => {
        const { question, options, correctOption } = q;
        const createdQuestion = await Question.create({ question, options, correctOption});
        return createdQuestion._id; // Pushing only the ObjectId into createdQuestions
      })
    );
    const quiz = await Quiz.create({
      title,
      description,
      questions: createdQuestions,
    });
    return NextResponse.json(
      { message: "Quiz Created."},
      { status: 201 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "An error occurred." }, { status: 500 });
  }
}


export async function GET() {
  try {
    await connectMongoDB(); // Wait for MongoDB connection to be established
    const quizzes = await Quiz.find().populate("questions"); // Populate questions for each quiz
    return NextResponse.json({ quizzes }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "An error occurred." }, { status: 500 });
  }
}

export async function DELETE(request) {
  const id = request.nextUrl.searchParams.get("id");

  try {
    await connectMongoDB();
    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found." }, { status: 404 });
    }
    // Delete associated questions first
    await Promise.all(
      quiz.questions.map(async (questionId) => {
        await Question.findByIdAndDelete(questionId);
      })
    );
    // Then delete the quiz itself
    await Quiz.findByIdAndDelete(id);
    return NextResponse.json({ message: "Quiz Deleted." }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "An error occurred." }, { status: 500 });
  }
}
