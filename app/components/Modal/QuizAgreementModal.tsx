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
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div className="bg-white rounded-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto shadow-xl">
        <div className="p-8">
          <h2 className="text-2xl text-black text-center font-bold mb-6">
            MTN Profiling Assessment Agreement
          </h2>

          <div className="space-y-6 text-gray-700 text-sm">
            {/* Important Note Section */}
            {/* <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
              <h3 className="font-bold text-amber-800 mb-2">Important Note:</h3>
              <p className="text-amber-700">
                This assessment is <span className="font-bold">NOT</span>{" "}
                designed to qualify or quantify musical knowledge, skill, or
                training.
              </p>
            </div> */}

            {/* Purpose Explanation */}
            {/* <div>
              <h3 className="font-semibold text-gray-800 mb-2">
                Assessment Purpose
              </h3>
              <p>
                Musical notation and structured visuals are used only as
                <span className="font-medium"> neutral symbolic stimuli</span>
                to observe how you physically and structurally interpret
                information.
              </p>

              <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded">
                <p className="text-red-700 font-medium">
                  *Please do not explain anything musically.*
                </p>
                <p className="text-red-600 mt-1">
                  Musical descriptions, theory-based explanations, or references
                  to musical correctness will disqualify the response, as they
                  do not reflect the purpose of this assessment.
                </p>
              </div>
            </div> */}

            {/* Instructions */}
            {/* <div>
              <h3 className="font-semibold text-gray-800 mb-2">
                How to Respond
              </h3>
              <p>
                Focus only on the structures you see in front of you. You are
                free to think, pause, observe, question, reflect, comment,
                engage, and express anything you notice about the structure,
                patterns, relationships, or impressions presented.
              </p>
            </div> */}

            {/* Research Consent */}
            {/* <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-3">
                Mandatory Research Consent
              </h3>
              <p className="mb-3">
                This assessment forms part of ongoing definitive research into
                cognitive structuring and information absorption.
              </p>
              <p className="mb-3">
                By proceeding, you acknowledge and agree that your responses may
                be anonymously collected, stored, and used for research and
                analytical purposes, including the improvement and validation of
                the MTNP system.
              </p>
              <p className="font-medium">
                No personally identifiable information will be published or
                disclosed.
              </p>
            </div> */}

            {/* Assessment Details */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">
                Assessment Details
              </h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>This is a cognitive assessment, not a musical test</li>
                <li>You will analyze patterns and structures</li>
                <li>No musical knowledge or training is required</li>
                <li>Focus on visual patterns and structural relationships</li>
                <li>
                  Your responses should describe what you see, not what you hear
                </li>
              </ul>
            </div>

            {/* Agreement Checkbox */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="font-medium text-gray-800 mb-4 text-center">
                If you are comfortable with this, please proceed and indicate
                your consent below.
              </p>

              <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="mt-1"
                />
                <div>
                  <span className="font-medium text-gray-800">
                    I have read and understood all the information above
                  </span>
                  <p className="text-gray-600 mt-1 text-sm">
                    I acknowledge that this is not a musical test, agree to
                    focus only on visual structures and patterns, and consent to
                    the anonymous use of my responses for research purposes.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Start Button */}
          <Button
            variant="primary"
            size="lg"
            className={`w-full mt-6 cursor-pointer transition-all ${
              isDisabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isDisabled}
            onClick={onStart}
          >
            {loading
              ? "Starting Assessment..."
              : "I Consent & Start Assessment →"}
          </Button>

          <p className="text-center text-xs text-gray-500 mt-4">
            You must agree to all terms to begin the assessment
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuizAgreementModal;
