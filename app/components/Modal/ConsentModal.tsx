import { useState } from "react";
import Button from "../Button";

interface ConsentModalProps {
  onAgree: () => void;
  onBack?: () => void;
  loading?: boolean;
}

const ConsentModal = ({
  onAgree,
  onBack,
  loading = false,
}: ConsentModalProps) => {
  const [agree, setAgree] = useState(false);

  const isDisabled = !agree || loading;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div className="bg-white rounded-2xl max-w-2xl w-full mx-4 shadow-xl">
        <div className="p-8">
          <h2 className="text-2xl text-black text-center font-bold mb-6">
            Research Participation Consent
          </h2>

          <div className="space-y-6 text-gray-700">
            {/* Title Section */}
            <div className="text-center">
              <h3 className="font-bold text-gray-800 text-lg mb-2">
                Mandatory Research Consent
              </h3>
              <div className="w-16 h-1 bg-blue-500 mx-auto rounded-full"></div>
            </div>

            {/* Consent Content */}
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                <p className="mb-3">
                  This assessment forms part of ongoing definitive research into
                  cognitive structuring and information absorption.
                </p>
                <p className="mb-3">
                  By proceeding, you acknowledge and agree that your responses
                  may be anonymously collected, stored, and used for research
                  and analytical purposes, including the improvement and
                  validation of the MTNP system.
                </p>
              </div>

              <div className="p-4 bg-green-50 border border-green-100 rounded-lg">
                <p className="font-medium text-green-800">
                  No personally identifiable information will be published or
                  disclosed.
                </p>
                <p className="text-green-700 mt-2 text-sm">
                  Your responses will be anonymized and used only for research
                  purposes.
                </p>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">
                  What this means for you:
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li>Your participation helps advance cognitive research</li>
                  <li>Your data is anonymized and secure</li>
                  <li>No personal information is shared publicly</li>
                  <li>You contribute to improving assessment systems</li>
                </ul>
              </div>
            </div>

            {/* Final Statement */}
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-800">
                If you are comfortable with this, please proceed and indicate
                your consent below.
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
                    I consent to participate in this research
                  </span>
                  <p className="text-gray-600 mt-1 text-sm">
                    I understand and agree that my anonymous responses may be
                    used for research purposes to improve the MTNP system. I
                    acknowledge that no personally identifiable information will
                    be published or disclosed.
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
              {loading ? "Processing..." : "I Consent & Continue →"}
            </Button>
          </div>

          <p className="text-center text-xs text-gray-500 mt-4">
            Your consent is required to proceed with the assessment
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConsentModal;
