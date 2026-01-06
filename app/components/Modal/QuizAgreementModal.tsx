import { useEffect, useState } from "react";
import Button from "../Button";

const QuizAgreementModal = ({
  onStart,
  loading,
}: {
  onStart: () => void;
  loading: boolean;
}) => {
  const [agree, setAgree] = useState(false);

  const isDisabled = !agree || loading;

  useEffect(() => {
    console.log({ isDisabled, agree, loading });
  }, [isDisabled, agree, loading]);

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
            <li>The assessment includes 20–30 image-based questions</li>
            <li>Responses will be collected through user input only</li>
            <li>No audio or video permissions are required</li>
            <li>A stable internet connection is recommended</li>
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
          className="w-full mt-6 cursor-pointer"
          disabled={isDisabled}
          onClick={onStart}
        >
          {loading ? "Starting..." : "Start Quiz →"}
        </Button>
      </div>
    </div>
  );
};

export default QuizAgreementModal;
