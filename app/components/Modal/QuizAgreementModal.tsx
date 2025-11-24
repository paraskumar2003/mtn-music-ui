import { useState } from "react";
import Button from "../Button";

const QuizAgreementModal = ({ onStart }: { onStart: () => void }) => {
  const [agree, setAgree] = useState(false);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-xl">
        <h2 className="text-2xl text-black text-center font-bold mb-4">
          Neuro-Profiling Disclaimer
        </h2>

        <div className="space-y-3 text-gray-700">
          <p>
            This assessment analyzes reading, writing, comprehension, listening,
            and speaking abilities.
          </p>

          <ul className="list-disc pl-5 space-y-1">
            <li>20–30 questions</li>
            <li>Some tasks require microphone or camera</li>
            <li>A stable internet connection is necessary</li>
            <li>Your audio/video may be recorded for evaluation</li>
          </ul>

          <p className="font-medium">Please confirm your participation:</p>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
            />
            <span>I have read and agree to the above requirements.</span>
          </label>
        </div>

        <Button
          variant="primary"
          size="lg"
          className="w-full mt-6"
          disabled={!agree}
          onClick={onStart}
        >
          Start Quiz →
        </Button>
      </div>
    </div>
  );
};

export default QuizAgreementModal;
