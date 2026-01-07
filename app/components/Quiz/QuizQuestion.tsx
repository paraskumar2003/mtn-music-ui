import React, { useState, useRef, useEffect } from "react";
import Button from "../Button";
import { QuizServices } from "~/services/quiz/quiz.service";
import CameraCapture from "../Camera/CaptureImage";

export interface Question {
  question_id: string;
  prompt_html: string;
  image_url?: string | null;
  audio_url?: string | null;
  options?: string[] | null;
  dimension: string;
  timer_in_seconds?: number;
  level: string;
  question_type: string | "mcq" | "text" | "audio" | "video" | "image";
  rubric?: {
    options: string[];
    score: number;
    dimension: string;
    note?: string;
  }[];
}

export interface QuizQuestionProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  remainingQuestions?: number;
  isFirstQuestion?: boolean;
  onAnswer: (selected: string) => void;
  onNext: () => void;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  questionNumber,
  totalQuestions,
  remainingQuestions = 0,
  isFirstQuestion = false,
  onAnswer,
  onNext,
}) => {
  const [answered, setAnswered] = useState(false);
  const [textAnswer, setTextAnswer] = useState("");
  const [uploading, setUploading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [recording, setRecording] = useState(false);
  const [mediaBlob, setMediaBlob] = useState<Blob | null>(null);
  const [timeLeft, setTimeLeft] = useState(question.timer_in_seconds || 180);
  const [timerActive, setTimerActive] = useState(true);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const uploadModalRef = useRef<HTMLDivElement>(null);

  // Timer countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setTimerActive(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timeLeft]);

  // Check when timer reaches 0
  useEffect(() => {
    if (timeLeft === 0) {
      setTimerActive(false);
    }
  }, [timeLeft]);

  // Reset timer when question changes
  useEffect(() => {
    setTimeLeft(question.timer_in_seconds || 180);
    setTimerActive(true);
    setAnswered(false);
    setMediaBlob(null);
    setSelectedOption(null);
    setTextAnswer("");
    setUploading(false); // Reset uploading state
  }, [questionNumber, question]);

  // Cleanup on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (mediaRecorder) {
        mediaRecorder.stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [mediaRecorder]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Calculate progress percentage for timer
  const initialTime = question.timer_in_seconds || 180;
  const timerProgress = ((initialTime - timeLeft) / initialTime) * 100;

  const handleOptionClick = (option: string) => {
    if (!timerActive) {
      setSelectedOption(option);
      setAnswered(true);
      onAnswer(option);
    }
  };

  // Handle text area change - ONLY allow during timer
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!answered) {
      setTextAnswer(e.target.value);
    }
  };

  const handleTextSubmit = () => {
    if (!textAnswer.trim() || timerActive) return;
    setAnswered(true);
    onAnswer(textAnswer.trim());
    // Don't call onNext here, let parent handle the transition
  };

  // 🎙️ Start recording (audio/video)
  const handleStartRecording = async () => {
    if (recording || timerActive) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: question.question_type === "video",
      });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = async () => {
        const blob = new Blob(chunks, {
          type:
            question.question_type === "audio" ? "audio/webm" : "video/webm",
        });
        setMediaBlob(blob);

        const uploadRes = await QuizServices.uploadToS3(blob);
        if (uploadRes.err) {
          console.error("Error uploading to S3:", uploadRes.err);
          return;
        }

        setAnswered(true);
        onAnswer(uploadRes.data);

        if (question.question_type === "audio" && audioRef.current) {
          audioRef.current.src = URL.createObjectURL(blob);
        }
        if (question.question_type === "video" && videoRef.current) {
          videoRef.current.src = URL.createObjectURL(blob);
        }
      };

      recorder.start();
      setRecording(true);
      setMediaRecorder(recorder);
    } catch (err) {
      console.error("Error accessing media devices:", err);
    }
  };

  // 🛑 Stop recording
  const handleStopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
    }
  };

  // Handle Next button click
  const handleNextClick = () => {
    if (!timerActive) {
      setAnswered(false);
      onNext();
    }
  };
  const getSubmitButtonText = () => {
    if (timerActive) {
      return "Submit & Next"; // Timer चल रहा है तो "Submit"
    }

    // पहला question होने पर हमेशा "Submit & Next"
    if (isFirstQuestion) {
      return "Submit & Next";
    }

    // बाकी questions के लिए remainingQuestions > 0 होने पर "Submit & Next"
    if (remainingQuestions > 0) {
      return "Submit & Next";
    }

    // Last question होने पर "Submit"
    return "Submit";
  };

  const getStatusMessage = () => {
    if (timerActive) {
      return `Type your answer within ${formatTime(timeLeft)}`;
    }
    if (answered) {
      return "Answer submitted!";
    }
    if (isFirstQuestion) {
      return "Time's up! Submit to proceed to next question.";
    }
    if (remainingQuestions > 0) {
      return `Time's up! ${remainingQuestions} more question(s) remaining.`;
    }
    return "Time's up! Submit your answer.";
  };

  return (
    <div className="w-full mx-auto bg-gradient-to-br from-gray-900 to-[#04061C] rounded-3xl shadow-2xl border border-gray-800 p-4 md:p-8 lg:p-10">
      {/* Header with Question Number and Timer */}
      <div className="flex flex-col min-[480px]:flex-row justify-between items-start min-[480px]:items-center mb-6 md:mb-8 gap-3 md:gap-4">
        {/* Left side - Question info - Desktop पर timer के साथ same row में */}
        <div className="flex items-center gap-2 md:gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="bg-blue-600/20 text-white px-3 py-1 md:px-4 md:py-2 rounded-full font-semibold text-sm md:text-base">
              Q{questionNumber}
            </div>
          </div>
        </div>

        {/* Timer Container - Desktop पर right side, Mobile पर नीचे */}
        <div
          className={`flex flex-col items-end w-full sm:w-auto mt-3 sm:mt-0 ${timerActive ? "animate-pulse-slow" : ""}`}
        >
          <div className="flex flex-row items-start sm:items-center justify-between w-full sm:w-auto gap-1 sm:gap-2">
            <div
              className={`text-xs md:text-sm font-semibold ${timerActive ? "text-yellow-400" : "text-red-400"}`}
            >
              {timerActive ? "⏳ TIME LEFT" : "⏰ TIME'S UP"}
            </div>
            <div
              className={`text-xl md:text-2xl font-bold font-mono ${timerActive ? "text-yellow-300" : "text-red-300"}`}
            >
              {formatTime(timeLeft)}
            </div>
          </div>

          {/* Timer Progress Bar */}
          <div className="w-full sm:w-48 h-1.5 md:h-2 bg-gray-800 rounded-full overflow-hidden mt-1">
            <div
              className={`h-full rounded-full transition-all duration-1000 ease-out ${
                timerActive
                  ? "bg-gradient-to-r from-blue-500 to-cyan-400"
                  : "bg-gradient-to-r from-red-500 to-orange-400"
              }`}
              style={{ width: `${timerProgress}%` }}
            ></div>
          </div>

          <div className="text-[10px] md:text-xs text-gray-500 mt-1 text-right w-full sm:w-auto">
            {timerActive
              ? `${Math.floor(timerProgress)}% time used`
              : "Time's up! Submit your answer"}
          </div>
        </div>
      </div>

      {/* Question Prompt */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-3 md:p-4 mb-4 md:mb-6">
        <h2
          className="text-base md:text-lg lg:text-xl font-medium text-white leading-relaxed"
          dangerouslySetInnerHTML={{ __html: question.prompt_html }}
        />
      </div>

      {/* Question Media (Image/Audio) */}
      {question.image_url && (
        <div className="flex justify-center mb-6 md:mb-8">
          <img
            src={question.image_url}
            alt="Question"
            className="rounded-lg md:rounded-xl border-2 border-gray-700 max-h-48 md:max-h-64 lg:max-h-72 w-full object-contain shadow-lg"
          />
        </div>
      )}

      {question.audio_url && (
        <div className="mb-6 md:mb-8">
          <div className="bg-gray-800/50 rounded-lg md:rounded-xl p-3 md:p-4">
            <p className="text-gray-400 text-xs md:text-sm mb-2">
              📢 Listen to the audio:
            </p>
            <audio controls className="w-full">
              <source src={question.audio_url} type="audio/mpeg" />
              Your browser does not support the audio tag.
            </audio>
          </div>
        </div>
      )}

      {/* Main Answer Area */}
      <div className="mb-8 md:mb-10">
        {/* MCQ Options */}
        {question.question_type === "mcq" && (
          <div className="grid gap-2 md:gap-3">
            {question.options?.map((opt, index) => {
              const isSelected = selectedOption === opt;
              const isDisabled = timerActive || answered;

              return (
                <button
                  key={opt}
                  onClick={() => handleOptionClick(opt)}
                  disabled={isDisabled}
                  className={`group relative p-3 md:p-4 lg:p-5 rounded-lg md:rounded-xl border-2 text-left transition-all duration-300 active:scale-[0.98]
                    ${
                      isSelected
                        ? "border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20"
                        : isDisabled
                          ? "border-gray-700 bg-gray-800/50 cursor-not-allowed opacity-70"
                          : "border-gray-700 bg-gray-800/30 hover:border-blue-400 hover:bg-blue-500/5"
                    }`}
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    <div
                      className={`flex-shrink-0 w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 rounded-full flex items-center justify-center font-semibold text-sm md:text-base
                      ${
                        isSelected
                          ? "bg-blue-500 text-white"
                          : isDisabled
                            ? "bg-gray-700 text-gray-500"
                            : "bg-gray-700 text-gray-300 group-hover:bg-blue-500/20 group-hover:text-blue-300"
                      }`}
                    >
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span
                      className={`text-sm md:text-base lg:text-lg font-medium ${isSelected ? "text-white" : "text-gray-300"}`}
                    >
                      {opt}
                    </span>
                  </div>

                  {isDisabled && timerActive && (
                    <div className="absolute inset-0 bg-gray-900/80 rounded-lg md:rounded-xl flex items-center justify-center">
                      <span className="text-gray-400 text-xs md:text-sm">
                        ⏳ Please wait to select
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Text Answer */}
        {question.question_type === "text" && (
          <div className="space-y-4 md:space-y-6">
            <div className="relative">
              <textarea
                rows={4}
                placeholder={
                  timerActive
                    ? "Type your answer here..."
                    : "⏰ Time's up! You can still type. Click submit when ready."
                }
                className={`w-full rounded-lg md:rounded-xl p-3 md:p-4 text-base md:text-lg font-medium border-2 transition-all duration-300 resize-none
                  ${
                    timerActive
                      ? "bg-gray-800/30 border-gray-600 text-white"
                      : "bg-gray-800/30 border-red-500 text-white"
                  }`}
                value={textAnswer}
                onChange={handleTextChange}
                readOnly={answered}
                disabled={answered}
              />
            </div>

            <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-3">
              <div className="text-gray-400 text-xs md:text-sm">
                {getStatusMessage()}
              </div>

              <Button
                variant={timerActive ? "secondary" : "primary"}
                size="lg"
                onClick={handleTextSubmit}
                disabled={timerActive || !textAnswer.trim() || answered}
                className="w-full xs:w-auto min-w-[140px] md:min-w-[200px] transition-all duration-300 cursor-pointer"
              >
                {timerActive ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⏳</span>
                    <span className=" sm:inline">Submit & Next</span>
                  </span>
                ) : answered ? (
                  "Submitted ✓"
                ) : textAnswer.trim() ? (
                  <span className="flex items-center gap-2">
                    {getSubmitButtonText()} <span className="text-xl">→</span>
                  </span>
                ) : (
                  "No Answer to Submit"
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Media Recording (Audio/Video/Image) */}
        {["audio", "video", "image"].includes(question.question_type) && (
          <div className="space-y-6 md:space-y-8">
            {/* Recording Status */}
            <div className="bg-gray-800/30 rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-700">
              <h3 className="text-base md:text-lg font-semibold text-white mb-2">
                {question.question_type === "audio" && "🎙️ Audio Response"}
                {question.question_type === "video" && "🎥 Video Response"}
                {question.question_type === "image" && "📸 Photo Response"}
              </h3>
              <p className="text-gray-400 text-sm md:text-base mb-4">
                {question.question_type === "audio" &&
                  "Record your audio answer"}
                {question.question_type === "video" &&
                  "Record your video answer"}
                {question.question_type === "image" &&
                  "Capture or upload your photo"}
              </p>

              {/* Timer Status */}
              {timerActive ? (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg md:rounded-xl p-3 md:p-4 mb-4 md:mb-6">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="text-xl md:text-2xl text-blue-400 animate-pulse">
                      ⏳
                    </div>
                    <div>
                      <h4 className="font-bold text-blue-300 text-sm md:text-base">
                        Recording Disabled
                      </h4>
                      <p className="text-blue-200/80 text-xs md:text-sm">
                        Recording will be enabled in {formatTime(timeLeft)}. You
                        can prepare your response.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg md:rounded-xl p-3 md:p-4 mb-4 md:mb-6">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="text-xl md:text-2xl text-red-400">⏰</div>
                    <div>
                      <h4 className="font-bold text-red-300 text-sm md:text-base">
                        Time's Up!
                      </h4>
                      <p className="text-red-200/80 text-xs md:text-sm">
                        Recording time has ended. Submit what you've recorded.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Audio/Video Recording Controls */}
              {(question.question_type === "audio" ||
                question.question_type === "video") && (
                <div className="space-y-3 md:space-y-4">
                  {!recording && !answered && timerActive && (
                    <div className="text-center p-3 md:p-4 border-2 border-dashed border-gray-700 rounded-lg md:rounded-xl">
                      <div className="text-2xl md:text-3xl text-gray-600 mb-1 md:mb-2">
                        {question.question_type === "audio" ? "🎙️" : "🎥"}
                      </div>
                      <p className="text-gray-400 text-sm mb-1 md:mb-2">
                        Recording will start in:
                      </p>
                      <div className="text-xl md:text-2xl font-bold font-mono text-gray-300 mb-2 md:mb-3">
                        {formatTime(timeLeft)}
                      </div>
                      <p className="text-gray-500 text-xs md:text-sm">
                        Prepare your response. Recording will begin when timer
                        ends.
                      </p>
                    </div>
                  )}

                  {!recording && !answered && !timerActive && (
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handleStartRecording}
                      className="w-full py-3 md:py-4 text-base md:text-lg"
                    >
                      <span className="flex items-center justify-center gap-2 md:gap-3">
                        {question.question_type === "audio" ? "🎙️" : "🎥"}
                        {question.question_type === "audio"
                          ? "Start Recording"
                          : "Start Recording"}
                      </span>
                    </Button>
                  )}

                  {recording && (
                    <div className="space-y-3 md:space-y-4">
                      <Button
                        variant="danger"
                        size="lg"
                        onClick={handleStopRecording}
                        className="w-full py-3 md:py-4 text-base md:text-lg animate-pulse"
                      >
                        <span className="flex items-center justify-center gap-2 md:gap-3">
                          ⏹️ Stop Recording
                        </span>
                      </Button>
                      <div className="text-center">
                        <div className="inline-flex items-center gap-2 bg-red-500/20 text-red-300 px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm">
                          <span className="h-1.5 w-1.5 md:h-2 md:w-2 bg-red-500 rounded-full animate-ping"></span>
                          Recording...
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Playback */}
                  {mediaBlob && question.question_type === "audio" && (
                    <div className="mt-4 md:mt-6">
                      <p className="text-gray-400 text-sm mb-2">
                        Your recording:
                      </p>
                      <audio
                        ref={audioRef}
                        controls
                        className="w-full rounded-lg"
                      />
                    </div>
                  )}

                  {mediaBlob && question.question_type === "video" && (
                    <div className="mt-4 md:mt-6">
                      <p className="text-gray-400 text-sm mb-2">Your video:</p>
                      <video
                        ref={videoRef}
                        controls
                        className="w-full rounded-lg md:rounded-xl border border-gray-700"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Image Capture */}
              {question.question_type === "image" && (
                <>
                  {timerActive ? (
                    <div className="text-center p-4 md:p-6 border-2 border-dashed border-gray-700 rounded-lg md:rounded-xl">
                      <div className="text-3xl md:text-4xl text-gray-600 mb-2 md:mb-3">
                        📸
                      </div>
                      <p className="text-gray-400 text-sm mb-1 md:mb-2">
                        Camera will be enabled in:
                      </p>
                      <div className="text-2xl md:text-3xl font-bold font-mono text-gray-300 mb-3 md:mb-4">
                        {formatTime(timeLeft)}
                      </div>
                      <p className="text-gray-500 text-xs md:text-sm">
                        Prepare your photo. Camera will unlock when timer ends.
                      </p>
                    </div>
                  ) : (
                    <CameraCapture
                      onAnswer={async (blob: Blob) => {
                        setUploading(true);
                        try {
                          const uploadRes = await QuizServices.uploadToS3(blob);
                          if (uploadRes.err) {
                            console.error(
                              "Error uploading to S3:",
                              uploadRes.err
                            );
                            setUploading(false);
                            return;
                          }
                          setAnswered(true);
                          onAnswer(uploadRes.data);
                          setMediaBlob(blob);
                        } finally {
                          setUploading(false);
                        }
                      }}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Next Button for non-text questions */}
      {!answered && question.question_type !== "text" && (
        <div className="border-t border-gray-800 pt-6 md:pt-8">
          <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-3">
            <div className="text-gray-400 text-xs md:text-sm">
              {timerActive
                ? `Next question will unlock in ${formatTime(timeLeft)}`
                : remainingQuestions > 0
                  ? `${remainingQuestions} questions remaining`
                  : "Time's up! Ready to move to next question"}
            </div>
            <Button
              variant={timerActive ? "secondary" : "primary"}
              size="lg"
              disabled={timerActive}
              onClick={handleNextClick}
              className="w-full xs:w-auto min-w-[140px] md:min-w-[180px]"
            >
              {timerActive ? (
                <span className="flex items-center gap-2">
                  <span className="animate-pulse">⏳</span>
                  {formatTime(timeLeft)}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  {isFirstQuestion || remainingQuestions > 0
                    ? "Next Question"
                    : "Submit"}
                  <span className="text-xl">→</span>
                </span>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Uploading Status - Fixed with ref and proper cleanup */}
      {uploading && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div
            ref={uploadModalRef}
            className="bg-gray-800 rounded-xl md:rounded-2xl p-6 md:p-8 max-w-[90%] md:max-w-sm mx-4 text-center"
          >
            <div className="text-3xl md:text-4xl mb-3 md:mb-4 animate-spin">
              🔄
            </div>
            <h3 className="text-lg md:text-xl font-bold text-white mb-2">
              Uploading Media
            </h3>
            <p className="text-gray-300 text-sm md:text-base">
              Processing your {question.question_type}...
            </p>
            <div className="mt-4 md:mt-6">
              <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 animate-pulse w-full"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submitted Success Message */}
      {answered && (
        <div className="animate-fade-in">
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl md:rounded-2xl p-3 md:p-4 mb-4 md:mb-6">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="text-xl md:text-2xl">✅</div>
              <div>
                <h4 className="font-bold text-green-300 text-sm md:text-base">
                  Answer Submitted!
                </h4>
                <p className="text-green-200/80 text-xs md:text-sm">
                  Your answer has been submitted successfully.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizQuestion;
