import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "../Card";

export default function RiskScore({
  score = 7,
  parameters = {},
}: {
  score: number;
  parameters: {
    visual?: number;
    rhythmic?: number;
    auditory?: number;
    subconscious?: number;
  };
}) {
  const maxScore = 10;
  const percentage = (score / maxScore) * 100;

  const grades = [
    { label: "visual", value: parameters.visual || 0 },
    { label: "rhythmic", value: parameters.rhythmic || 0 },
    { label: "auditory", value: parameters.auditory || 0 },
    { label: "subconscious", value: parameters.subconscious || 0 },
  ];

  return (
    <div className="w-full max-w-xl mx-auto p-4">
      <Card className="p-6 rounded-2xl shadow-md bg-white">
        <CardContent className="flex flex-col gap-6">
          {/* Gauge */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-40 h-20 overflow-hidden">
              <svg viewBox="0 0 100 50" className="w-full h-full">
                <path
                  d="M10 50 A40 40 0 0 1 90 50"
                  fill="none"
                  stroke="#eee"
                  strokeWidth="10"
                />
                <motion.path
                  d="M10 50 A40 40 0 0 1 90 50"
                  fill="none"
                  stroke="#4f46e5"
                  strokeWidth="10"
                  strokeDasharray="126"
                  strokeDashoffset={126 - (126 * percentage) / 100}
                  transition={{ duration: 1 }}
                />
              </svg>
            </div>
            <div className="text-center mt-2">
              <p className="text-4xl font-bold text-gray-800">{score}</p>
              <p className="text-gray-500 text-sm">Score out of {maxScore}</p>
            </div>
          </div>

          {/* Parameters */}
          <div className="grid grid-cols-2 gap-4">
            {grades.map((p) => (
              <div
                key={p.label}
                className="p-4 rounded-xl bg-gray-100 flex flex-col items-center shadow-sm"
              >
                <p className="font-semibold capitalize text-black">{p.label}</p>
                <p className="text-2xl font-bold text-indigo-600">{p.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
