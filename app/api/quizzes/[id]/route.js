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

// export async function PUT(request, { params }) {
//   try {
//     const { id } = params;
//     const { question, options } = request.json(); // Extract question and options from request body
//     await connectMongoDB();

//     // Update the quiz document by pushing the new question and options into the questions array
//     const updatedQuiz = await Quiz.findByIdAndUpdate(
//       id,
//       { $push: { questions: { question, options } } },
//       { new: true }
//     );

//     if (!updatedQuiz) {
//       return NextResponse.json({ error: "Quiz not found." }, { status: 404 });
//     }

//     return NextResponse.json(
//       { message: "Question added to quiz.", quiz: updatedQuiz },
//       { status: 200 }
//     );
//   } catch (error) {
//     // Handle any errors that occur during MongoDB connection or quiz update
//     console.error("Error:", error);
//     return NextResponse.json({ error: "An error occurred." }, { status: 500 });
//   }
// }

export async function GET(request, { params }) {
  try {
    const { id } = params; // the _id of the quiz
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const page = searchParams.get("page");
    const pageSize = searchParams.get("pageSize");

    console.log("got page :", page);
    console.log("got pageSize :", pageSize);

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

    if (page === null) {
      const questions = await Question.find({ _id: { $in: quiz.questions } });
      return NextResponse.json(
        { quiz, questions, totalQuestions, isMore: false },
        { status: 200 }
      );
    }

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

    let isBest = false;

    if (quiz.bestScore < totalMarks) {
      isBest = true;
      await Quiz.updateOne(
        { _id: id },
        {
          $set: {
            bestScore: totalMarks,
            bestTime: answers.timeTaken,
          },
        }
      );
    } else if (
      quiz.bestScore == totalMarks &&
      (quiz.bestTime ? quiz.bestTime : 99999) > answers.timeTaken
    ) {
      isBest = true;
      await Quiz.updateOne(
        { _id: id },
        {
          $set: {
            bestTime: answers.timeTaken,
          },
        }
      );
    }

    return NextResponse.json(
      {
        _id: id,
        totalMarks,
        totalQuestions: quiz.questions.length,
        isBest,
        bestScore: quiz.bestScore,
        bestTime: quiz.bestTime,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "An error occurred." }, { status: 500 });
  }
}
