import React, { useState } from "react";
import Button from "../Button";

interface Question {
  question_id: string;
  prompt_html: string;
  image_url?: string | null;
  audio_url?: string | null;
  options: string[];
  dimension: string;
  level: string;
  question_type: string;
  rubric: {
    options: string[];
    score: number;
    dimension: string;
    note?: string;
  }[];
}

interface QuizQuestionProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (selected: string) => void;
  onNext: () => void;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  onNext,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);

  const handleOptionClick = (option: string) => {
    if (answered) return;
    setSelectedOption(option);
    onAnswer(option);
    setAnswered(true);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 p-10">
      <div className="flex justify-between mb-6 text-sm text-gray-500">
        <span>
          Question {questionNumber} of {totalQuestions}
        </span>
        <span className="capitalize">
          {question.dimension} • {question.level}
        </span>
      </div>

      <h2
        className="text-xl font-semibold text-gray-900 mb-6"
        dangerouslySetInnerHTML={{ __html: question.prompt_html }}
      />

      {/* Image */}
      {question.image_url && (
        <div className="flex justify-center mb-6">
          <img
            src={question.image_url}
            alt="Question"
            className="rounded-lg border border-gray-200 max-h-64 object-contain"
          />
        </div>
      )}

      {/* Audio */}
      {question.audio_url && (
        <div className="mb-6">
          <audio controls className="w-full">
            <source src={question.audio_url} type="audio/mpeg" />
            Your browser does not support the audio tag.
          </audio>
        </div>
      )}

      {/* Options */}
      <div className="grid gap-4 mb-8">
        {question.options.map((opt) => {
          const isSelected = selectedOption === opt;
          return (
            <button
              key={opt}
              onClick={() => handleOptionClick(opt)}
              disabled={answered}
              className={`px-4 py-3 rounded-xl border text-left transition-all duration-200
                ${
                  isSelected
                    ? "bg-blue-600 text-white border-blue-700"
                    : "bg-white text-gray-800 border-gray-300 hover:bg-blue-50"
                }
                disabled:opacity-80`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      {answered && (
        <div className="text-center">
          <Button variant="primary" size="lg" onClick={onNext}>
            Next Question →
          </Button>
        </div>
      )}
    </div>
  );
};

export default QuizQuestion;
