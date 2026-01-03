import React, { useState, useRef } from "react";
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
  const [answered, setAnswered] = useState(false);
  const [textAnswer, setTextAnswer] = useState("");
  const [uploading, setUploading] = useState(false);

  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [recording, setRecording] = useState(false);
  const [mediaBlob, setMediaBlob] = useState<Blob | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleOptionClick = (option: string) => {
    console.log("clicked");
    setSelectedOption(option);
    onAnswer(option);
  };

  const handleTextSubmit = () => {
    if (!textAnswer.trim()) return;
    onAnswer(textAnswer.trim());
    onNext();
    setTextAnswer("");
  };

  // 🎙️ Start recording (audio/video)
  const handleStartRecording = async () => {
    if (recording) return;
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

        const formData = new FormData();
        formData.append("file", blob, `${question.question_id}.webm`);

        // Upload to S3
        const uploadRes = await QuizServices.uploadToS3(blob);
        if (uploadRes.err) {
          console.error("Error uploading to S3:", uploadRes.err);
          return;
        }

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
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-[#04061C] rounded-2xl shadow-xl border border-gray-100 p-10">
      <div className="flex justify-between mb-6 text-sm text-white-500">
        <span className="text-white">Question {questionNumber}</span>
        <span className="capitalize text-white">
          {question.dimension} • {question.level}
        </span>
      </div>

      <h2
        className="text-xl font-semibold text-white mb-6"
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

      {/* Audio (Question) */}
      {question.audio_url && (
        <div className="mb-6">
          <audio controls className="w-full">
            <source src={question.audio_url} type="audio/mpeg" />
            Your browser does not support the audio tag.
          </audio>
        </div>
      )}

      {/* Question Type Handling */}
      <div className="mb-8">
        {question.question_type === "mcq" && (
          <div className="grid gap-4">
            {question.options &&
              question.options.map((opt) => {
                const isSelected = selectedOption === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => {
                      handleOptionClick(opt);
                      console.log("clicked");
                    }}
                    disabled={answered}
                    className={`px-4 py-3 rounded-xl border text-left transition-all duration-200
                    ${
                      isSelected
                        ? "bg-primary-600 text-white border-primary-700"
                        : "bg-white text-gray-800 border-gray-300 hover:bg-primary-50"
                    }
                    disabled:opacity-80`}
                  >
                    {opt}
                  </button>
                );
              })}
          </div>
        )}

        {question.question_type === "text" && (
          <div className="flex flex-col gap-4">
            <textarea
              rows={4}
              placeholder="Type your answer here..."
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 text-white"
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
              disabled={answered}
            />
            {!answered && (
              <Button variant="primary" size="lg" onClick={handleTextSubmit}>
                Submit Answer →
              </Button>
            )}
          </div>
        )}

        {["audio", "video", "image"].includes(question.question_type) && (
          <div className="flex flex-col items-center gap-4">
            {/* 🎙️ AUDIO / 🎥 VIDEO RECORDING */}
            {(question.question_type === "audio" ||
              question.question_type === "video") && (
              <>
                {!recording && !answered && (
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleStartRecording}
                  >
                    {question.question_type === "audio"
                      ? "🎙️ Start Recording"
                      : "🎥 Start Recording"}
                  </Button>
                )}
                {recording && (
                  <Button
                    variant="danger"
                    size="lg"
                    onClick={handleStopRecording}
                  >
                    ⏹️ Stop Recording
                  </Button>
                )}

                {/* Playback */}
                {mediaBlob && question.question_type === "audio" && (
                  <audio ref={audioRef} controls className="mt-4" />
                )}
                {mediaBlob && question.question_type === "video" && (
                  <video
                    ref={videoRef}
                    controls
                    className="mt-4 w-full rounded-lg"
                  />
                )}
              </>
            )}

            {/* 📸 IMAGE CAPTURE / UPLOAD */}
            {question.question_type === "image" && (
              <CameraCapture
                onAnswer={async (blob: Blob) => {
                  setUploading(true);

                  try {
                    const uploadRes = await QuizServices.uploadToS3(blob);

                    if (uploadRes.err) {
                      console.error("Error uploading to S3:", uploadRes.err);
                      setUploading(false);
                      return;
                    }

                    const s3Url = uploadRes.data;

                    // Pass URL to Quiz Logic
                    onAnswer(s3Url);
                    setMediaBlob(blob); // optional – for preview
                  } finally {
                    setUploading(false);
                  }
                }}
              />
            )}
          </div>
        )}
      </div>

      {/* Next Button */}
      {!answered && question.question_type !== "text" && (
        <div className="text-center mt-6">
          <Button
            variant="primary"
            size="lg"
            disabled={uploading}
            onClick={onNext}
          >
            Next Question →
          </Button>
        </div>
      )}

      {uploading && (
        <div className="text-center text-blue-400 font-medium mb-4 animate-pulse">
          Uploading image… please wait
        </div>
      )}
    </div>
  );
};

export default QuizQuestion;
