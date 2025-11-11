import { useState } from "react";
import QuizQuestion from "~/components/Quiz/QuizQuestion";

const quizData = [
  {
    question_id: "6905fabf860f501d917dfb1f",
    prompt_html: "Identify the <b>time signature</b> in this 4-bar excerpt.",
    image_url: "https://yourcdn/mtnp/q01.png",
    audio_url: null,
    options: ["2/4", "3/4", "4/4", "6/8"],
    dimension: "visual",
    level: "basic",
    question_type: "multiple_choice",
    rubric: [
      { options: ["3/4"], score: 0.9, dimension: "visual" },
      { options: ["2/4", "4/4"], score: -0.1, dimension: "rhythmic" },
      { options: ["6/8"], score: -0.1, dimension: "subconscious" },
    ],
  },
];

export default function QuizPage() {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleAnswer = (option: string) => {
    const q = quizData[index];
    setAnswers((prev) => ({ ...prev, [q.question_id]: option }));
  };

  const handleNext = () => {
    if (index < quizData.length - 1) setIndex(index + 1);
    else alert("Quiz Completed 🎉");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <QuizQuestion
        question={quizData[index]}
        questionNumber={index + 1}
        totalQuestions={quizData.length}
        onAnswer={handleAnswer}
        onNext={handleNext}
      />
    </div>
  );
}
