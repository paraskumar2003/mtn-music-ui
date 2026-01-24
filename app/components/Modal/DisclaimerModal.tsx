import { useState } from "react";
import Button from "../Button";

interface DisclaimerModalProps {
  onAgree: () => void;
  onBack?: () => void;
  loading?: boolean;
}

const DisclaimerModal = ({
  onAgree,
  onBack,
  loading = false,
}: DisclaimerModalProps) => {
  const [agree, setAgree] = useState(false);

  const isDisabled = !agree || loading;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div className="bg-white rounded-2xl max-w-2xl w-full mx-4 shadow-xl">
        <div className="p-8">
          <h2 className="text-2xl text-black text-center font-bold mb-6">
            Important Assessment Information
          </h2>

          <div className="space-y-6 text-gray-700">
            {/* Warning Section */}
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
              <h3 className="font-bold text-amber-800 mb-2">Mandatory Note:</h3>
              <p className="text-amber-700 font-medium">
                This assessment is NOT designed to qualify or quantify musical
                knowledge, skill, or training.
              </p>
            </div>

            {/* Purpose Section */}
            <div>
              <p className="mb-4">
                Musical notation and structured visuals are used only as
                <span className="font-medium"> neutral symbolic stimuli</span>
                to observe how you physically and structurally interpret
                information.
              </p>

              <div className="p-4 bg-red-50 border border-red-100 rounded-lg">
                <p className="text-red-700 font-bold mb-2">
                  *Please do not explain anything musically.*
                </p>
                <p className="text-red-600">
                  Musical descriptions, theory-based explanations, or references
                  to musical correctness will disqualify the response, as they
                  do not reflect the purpose of this assessment.
                </p>
              </div>
            </div>

            {/* Instructions */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-800 mb-2">
                Focus only on the structures you see in front of you.
              </p>
              <p className="text-gray-700">
                You are free to think, pause, observe, question, reflect,
                comment, engage, and express anything you notice about the
                structure, patterns, relationships, or impressions presented.
              </p>
            </div>

            {/* Agreement Checkbox */}
            <div className="pt-6 border-t border-gray-200">
              <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="mt-1"
                />
                <div>
                  <span className="font-medium text-gray-800">
                    I understand this is not a musical assessment
                  </span>
                  <p className="text-gray-600 mt-1 text-sm">
                    I will focus only on visual structures and patterns, and
                    will not provide any musical explanations or
                    interpretations.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-8">
            {onBack && (
              <Button
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={onBack}
                disabled={loading}
              >
                ← Back
              </Button>
            )}

            <Button
              variant="primary"
              size="lg"
              className={`flex-1 ${!onBack ? "w-full" : ""}`}
              disabled={isDisabled}
              onClick={onAgree}
            >
              {loading ? "Processing..." : "I Understand & Continue →"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerModal;
