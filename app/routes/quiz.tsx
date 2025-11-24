import { useEffect, useState } from "react";
import QuizAgreementModal from "~/components/Modal/QuizAgreementModal";
import QuizQuestion from "~/components/Quiz/QuizQuestion";

const quizData = [
  {
    question_id: "q21",
    dimension: "visual",
    level: "basic",
    type: "written",
    prompt_html:
      "Look at this 4-bar melody in C major. Count how many notes move by <b>step</b> (not skip).",
    image_url: "./assets/q21.png",
    audio_url: null,
    options: null,
    question_type: "text",
  },
  {
    question_id: "q22",
    dimension: "visual",
    level: "basic",
    type: "mcq",
    prompt_html: "Identify the <b>time signature</b> of this rhythm snippet.",
    image_url: "./assets/q22.png",
    audio_url: null,
    options: ["2/4", "3/4", "4/4", "6/8"],
    question_type: "mcq",
  },
  {
    question_id: "q23",
    dimension: "visual",
    level: "intermediate",
    type: "mcq",
    prompt_html:
      "Observe this chord staff — which <b>inversion</b> is written here?",
    image_url: "./assets/q23.png",
    audio_url: null,
    options: ["Root", "1st inversion", "2nd inversion", "3rd inversion"],
    question_type: "mcq",
  },
  {
    question_id: "q24",
    dimension: "visual",
    level: "intermediate",
    type: "written",
    prompt_html:
      "If this is in <b>G major</b>, which accquestion_idental note is missing in bar 3?",
    image_url: "./assets/q24.png",
    audio_url: null,
    options: null,
    question_type: "text",
  },
  {
    question_id: "q25",
    dimension: "visual",
    level: "intermediate",
    type: "image",
    prompt_html:
      "Copy this short 2-bar motif on paper and upload its <b>mirror image</b>.",
    image_url: "./assets/q25.png",
    audio_url: null,
    options: null,
    question_type: "image",
  },
  {
    question_id: "q26",
    dimension: "visual",
    level: "basic",
    type: "mcq",
    prompt_html:
      "The excerpt ends on a half-note tied to a quarter — what is the <b>total duration</b>?",
    image_url: "./assets/q26.png",
    audio_url: null,
    options: ["2 beats", "3 beats", "4 beats", "6 beats"],
    question_type: "mcq",
  },
  {
    question_id: "q27",
    dimension: "auditory",
    level: "basic",
    type: "audio",
    prompt_html:
      "Listen to this short clip. Tap along — is the pulse <b>duple</b> or <b>triple</b>?",
    image_url: null,
    audio_url: "./assets/q27.mp3",
    options: ["Duple", "Triple"],
    question_type: "mcq",
  },
  {
    question_id: "q28",
    dimension: "auditory",
    level: "basic",
    type: "audio",
    prompt_html:
      "After hearing two scales, choose which one feels <b>major</b>.",
    image_url: null,
    audio_url: "./assets/q28.mp3",
    options: ["First", "Second"],
    question_type: "mcq",
  },
  {
    question_id: "q29",
    dimension: "auditory",
    level: "intermediate",
    type: "audio",
    prompt_html: "Hum the rhythm you just heard and record your voice.",
    image_url: null,
    audio_url: "./assets/q21.mp3",
    options: null,
    question_type: "audio",
  },
  {
    question_id: "q30",
    dimension: "auditory",
    level: "intermediate",
    type: "audio",
    prompt_html:
      "Identify if the melody ascends, descends, or oscillates around a central tone.",
    image_url: null,
    audio_url: "./assets/q28.mp3",
    options: ["Ascends", "Descends", "Oscillates"],
    question_type: "mcq",
  },
  {
    question_id: "q31",
    dimension: "auditory",
    level: "intermediate",
    type: "audio",
    prompt_html:
      "Two chords are played. Are they the <b>same</b> or <b>different</b> in quality (major/minor)?",
    image_url: null,
    audio_url: "./assets/q23.mp3",
    options: ["Same", "Different"],
    question_type: "mcq",
  },
  {
    question_id: "q32",
    dimension: "subconscious",
    level: "basic",
    type: "psychometric",
    prompt_html:
      "When faced with a new tune, what do you instinctively notice first?",
    image_url: null,
    audio_url: null,
    options: ["Shape", "Sound", "Feel"],
    question_type: "mcq",
  },
  {
    question_id: "q33",
    dimension: "subconscious",
    level: "basic",
    type: "psychometric",
    prompt_html:
      "If a teammate plays wrong notes mquestion_id-performance, what’s your immediate reaction?",
    image_url: null,
    audio_url: null,
    options: [
      "Ignore and continue",
      "Stop and correct",
      "Adjust quickly and adapt",
    ],
    question_type: "mcq",
  },
  {
    question_id: "q34",
    dimension: "subconscious",
    level: "intermediate",
    type: "psychometric",
    prompt_html:
      "You’re asked to compose in 10 minutes — what’s your starting point?",
    image_url: null,
    audio_url: null,
    options: ["Melody", "Rhythm", "Harmony", "Mood"],
    question_type: "mcq",
  },
  {
    question_id: "q35",
    dimension: "subconscious",
    level: "basic",
    type: "psychometric",
    prompt_html: "Choose the sentence that fits you most.",
    image_url: null,
    audio_url: null,
    options: ["I see music", "I feel music", "I hear music"],
    question_type: "mcq",
  },
  {
    question_id: "q36",
    dimension: "subconscious",
    level: "intermediate",
    type: "psychometric",
    prompt_html: "Which activity relaxes you more?",
    image_url: null,
    audio_url: null,
    options: ["Writing", "Listening", "Organizing playlists"],
    question_type: "mcq",
  },
  {
    question_id: "q37",
    dimension: "rhythmic",
    level: "basic",
    type: "audio",
    prompt_html:
      "Tap along with the metronome (♩ = 100). Then double the tempo. Were you able to stay steady?",
    image_url: null,
    audio_url: "./assets/q27.mp3",
    options: ["Yes", "No", "Partly"],
    question_type: "mcq",
  },
  {
    question_id: "q38",
    dimension: "rhythmic",
    level: "basic",
    type: "mcq",
    prompt_html:
      "Look at this 1-bar rhythm: eighth-eighth-quarter-quarter. Which beat feels strongest?",
    image_url: "./assets/q26.png",
    audio_url: null,
    options: ["Beat 1", "Beat 2", "Beat 3", "Beat 4"],
    question_type: "mcq",
  },
  {
    question_id: "q39",
    dimension: "rhythmic",
    level: "intermediate",
    type: "image",
    prompt_html:
      "You have 60 seconds to copy a 2-bar rhythm pattern — start when ready and upload your written image.",
    image_url: "./assets/q25.png",
    audio_url: null,
    options: null,
    question_type: "image",
  },
  {
    question_id: "q40",
    dimension: "rhythmic",
    level: "psychometric",
    type: "psychometric",
    prompt_html:
      "Rate yourself: how regularly do you practice or study (1 = chaotic, 5 = highly consistent)?",
    image_url: null,
    audio_url: null,
    options: ["1", "2", "3", "4", "5"],
    question_type: "mcq",
  },
  {
    question_id: "q41",
    dimension: "rhythmic",
    level: "psychometric",
    type: "psychometric",
    prompt_html:
      "When working late nights, does your focus improve or decline sharply?",
    image_url: null,
    audio_url: null,
    options: ["Improves", "Declines", "No change"],
    question_type: "mcq",
  },
];

export default function QuizPage() {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showPopup, setShowPopup] = useState(false);

  const handleAnswer = (option: any) => {
    const q = quizData[index];
    setAnswers((prev) => ({ ...prev, [q.question_id]: option }));
  };

  useEffect(() => {
    console.log({ index });
  }, [index]);

  const handleNext = () => {
    if (index < quizData.length - 1) {
      setIndex(index + 1);
    } else {
      setShowPopup(true);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    // Optionally reset the quiz or redirect
    // window.location.href = "/";
  };

  const [started, setStarted] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 bg-[url('/assets/background-image.jpg')]">
      {!started && <QuizAgreementModal onStart={() => setStarted(true)} />}

      {started && (
        <QuizQuestion
          question={quizData[index]}
          questionNumber={index + 1}
          totalQuestions={quizData.length}
          onAnswer={handleAnswer}
          onNext={handleNext}
        />
      )}

      {showPopup && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm text-center">
            <h2 className="text-xl font-semibold mb-4">Quiz Completed 🎉</h2>
            <p className="text-gray-600 mb-6">
              Results will be shared on mail with you shortly.
            </p>
            <button
              onClick={handleClosePopup}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
