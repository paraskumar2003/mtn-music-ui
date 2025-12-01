import FadeIn from "~/components/Animate/FadeIn";
import RiskScore from "~/components/ScoreCard";

export default function Score() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 bg-[url('/assets/background-image.jpg')]">
      <FadeIn>
        <RiskScore
          score={7.5}
          parameters={{ visual: 6, auditory: 5, subconscious: 10, rhythmic: 9 }}
        />
      </FadeIn>
    </div>
  );
}
