import connectMongoDB from "@/libs/mongodb";
import Question from "@/models/Question";
import Quiz from "@/models/Quiz";
import { NextResponse } from "next/server";

// export async function PUT(request, { params }) {
//   try {
//     const { id } = params;
//     const { title, description } = request.json();
//     await connectMongoDB;
//     await Quiz.findByIdAndUpdate(id);
//     return NextResponse.json({ message: "Quiz Updated." }, { status: 200 });
//   } catch (error) {
//     // Handle any errors that occur during MongoDB connection or quiz creation
//     console.error("Error:", error);
//     return NextResponse.json({ error: "An error occurred." }, { status: 500 });
//   }
// }

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { question, options } = request.json(); // Extract question and options from request body
    await connectMongoDB();

    // Update the quiz document by pushing the new question and options into the questions array
    const updatedQuiz = await Quiz.findByIdAndUpdate(
      id,
      { $push: { questions: { question, options } } },
      { new: true }
    );

    if (!updatedQuiz) {
      return NextResponse.json({ error: "Quiz not found." }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Question added to quiz.", quiz: updatedQuiz },
      { status: 200 }
    );
  } catch (error) {
    // Handle any errors that occur during MongoDB connection or quiz update
    console.error("Error:", error);
    return NextResponse.json({ error: "An error occurred." }, { status: 500 });
  }
}

export async function GET(request, { params }) {
  try {
    const { id } = params; // the _id of the quiz
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const page = searchParams.get("page") || 1;
    const pageSize = searchParams.get("pageSize") || 5;

    await connectMongoDB();

    // Find the quiz by id
    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found." }, { status: 404 });
    }

    // Count the total number of questions associated with the quiz
    const totalQuestions = await Question.countDocuments({
      _id: { $in: quiz.questions },
    });

    // Paginate the questions
    const questions = await Question.find({ _id: { $in: quiz.questions } })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .select("-correctOption"); // Exclude correct option from response

    // Determine if there are more questions available for pagination
    const isMore = totalQuestions > page * pageSize;

    return NextResponse.json(
      { quiz, questions, totalQuestions, isMore },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error.message);
    return NextResponse.json({ error: "An error occurred." }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const answers = await request.json();
    await connectMongoDB();

    const quiz = await Quiz.findById(id);

    const questions = await Question.find({ _id: { $in: quiz.questions } });

    let totalMarks = 0;
    for (let i = 0; i < questions.length; i++) {
      if (answers[i] === questions[i].correctOption) {
        totalMarks++;
      }
    }

    return NextResponse.json(
      { _id: id, totalMarks, totalQuestions: quiz.questions.length },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "An error occurred." }, { status: 500 });
  }
}
