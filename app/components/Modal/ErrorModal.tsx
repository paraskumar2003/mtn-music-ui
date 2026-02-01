// components/ErrorModal.tsx
import Button from "../Button";

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  actionText?: string;
  onAction?: () => void;
}

const ErrorModal: React.FC<ErrorModalProps> = ({
  isOpen,
  onClose,
  title = "Error",
  message,
  actionText = "Try Again",
  onAction,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div className="bg-white rounded-2xl max-w-md w-full mx-4 shadow-xl">
        <div className="p-8">
          {/* Error Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          {/* Error Content */}
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
            {title}
          </h2>

          <p className="text-gray-600 text-center mb-6">{message}</p>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {onAction && (
              <Button
                variant="primary"
                className="flex-1"
                onClick={() => {
                  onAction();
                  onClose();
                }}
              >
                {actionText}
              </Button>
            )}

            <Button variant="outline" className="flex-1" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
