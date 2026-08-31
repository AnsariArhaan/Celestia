import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Award, RotateCcw, CheckCircle2, XCircle, Sparkles, X, Target, Zap } from 'lucide-react';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  planetId: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'Which planet has the hottest surface temperature in the entire solar system?',
    options: ['Mercury (closest to Sun)', 'Venus (dense greenhouse atmosphere)', 'Mars', 'Jupiter'],
    correctAnswer: 1,
    explanation: 'Venus has an intense runaway greenhouse effect trapping heat, reaching a baking 464°C—hotter than Mercury despite being further from the Sun!',
    planetId: 'venus'
  },
  {
    id: 2,
    question: 'On which planet does the Sun rise in the west and set in the east?',
    options: ['Mars', 'Uranus', 'Venus', 'Saturn'],
    correctAnswer: 2,
    explanation: 'Venus rotates in retrograde (clockwise) direction, causing the Sun to rise in the west and set in the east.',
    planetId: 'venus'
  },
  {
    id: 3,
    question: 'Which ice giant rotates nearly completely on its side with an axial tilt of ~98°?',
    options: ['Neptune', 'Uranus', 'Pluto', 'Saturn'],
    correctAnswer: 1,
    explanation: 'Uranus has an axial tilt of 97.77°, likely caused by a massive collision with a protoplanet billions of years ago.',
    planetId: 'uranus'
  },
  {
    id: 4,
    question: 'Which celestial body in our solar system has an average density less than liquid water?',
    options: ['Saturn (0.69 g/cm³)', 'Jupiter', 'Ceres', 'Neptune'],
    correctAnswer: 0,
    explanation: 'Saturn has an average density of only 0.687 g/cm³ and would float if placed in a giant bathtub of water!',
    planetId: 'saturn'
  },
  {
    id: 5,
    question: 'Where is Olympus Mons—the largest volcano and highest mountain in the solar system—located?',
    options: ['Earth', 'Venus', 'Mars', 'Io'],
    correctAnswer: 2,
    explanation: 'Olympus Mons on Mars towers 22 km high—almost 3 times higher than Mount Everest!',
    planetId: 'mars'
  },
  {
    id: 6,
    question: 'Which moon of Jupiter is the most volcanically active body known in the solar system?',
    options: ['Europa', 'Ganymede', 'Io', 'Callisto'],
    correctAnswer: 2,
    explanation: 'Io experiences immense tidal heating from Jupiter’s gravity, driving over 400 continuously erupting sulfur volcanoes.',
    planetId: 'jupiter'
  },
  {
    id: 7,
    question: 'Which planet experiences the fastest recorded supersonic winds exceeding 2,100 km/h?',
    options: ['Jupiter', 'Neptune', 'Earth', 'Saturn'],
    correctAnswer: 1,
    explanation: 'Neptune has the fastest planetary winds ever measured, clocking speeds exceeding 2,100 km/h (1,300 mph).',
    planetId: 'neptune'
  }
];

interface PlanetQuizProps {
  onClose: () => void;
}

export const PlanetQuiz: React.FC<PlanetQuizProps> = ({ onClose }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = QUIZ_QUESTIONS[currentIdx];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    if (idx === currentQ.correctAnswer) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < QUIZ_QUESTIONS.length) {
      setCurrentIdx(i => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      confetti({
        particleCount: 140,
        spread: 90,
        origin: { y: 0.6 }
      });
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsFinished(false);
    setScore(0);
  };

  return (
    <div id="planet-quiz-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#070B14]/95 border border-cyan-500/30 rounded-3xl p-6 md:p-8 shadow-[0_0_80px_rgba(0,0,0,0.9),inset_0_0_20px_rgba(6,182,212,0.08)] flex flex-col gap-6 text-gray-100 font-sans">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.35)]">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-cyan-400 tracking-[0.25em] uppercase block font-mono">
                Astrophysics Evaluation
              </span>
              <h2 className="text-lg md:text-xl font-extrabold tracking-tight text-white uppercase font-display">
                Solar System Challenge
              </h2>
            </div>
          </div>
          <button
            id="close-quiz-btn"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-cyan-500/10 text-gray-400 hover:text-cyan-300 border border-white/10 hover:border-cyan-500/30 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isFinished ? (
          <div className="flex flex-col gap-5">
            {/* Progress bar */}
            <div className="flex items-center justify-between text-xs font-mono text-gray-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                Question {currentIdx + 1} of {QUIZ_QUESTIONS.length}
              </span>
              <span className="text-cyan-300 font-bold bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-0.5 rounded-lg">
                Score: {score}
              </span>
            </div>
            <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden border border-gray-800">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300 shadow-[0_0_12px_rgba(6,182,212,0.6)]"
                style={{ width: `${((currentIdx + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
              />
            </div>

            {/* Question title */}
            <h3 className="text-base md:text-lg font-bold text-white leading-snug font-display">
              {currentQ.question}
            </h3>

            {/* Options List */}
            <div className="space-y-2.5">
              {currentQ.options.map((opt, oIdx) => {
                let btnStyle = 'bg-white/5 border-white/10 hover:border-cyan-500/40 hover:bg-cyan-500/5 text-gray-200';
                if (isAnswered) {
                  if (oIdx === currentQ.correctAnswer) {
                    btnStyle = 'bg-emerald-500/20 border-emerald-400 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.3)]';
                  } else if (oIdx === selectedOption) {
                    btnStyle = 'bg-rose-500/20 border-rose-400 text-rose-200 shadow-[0_0_20px_rgba(244,63,94,0.2)]';
                  } else {
                    btnStyle = 'bg-black/40 border-gray-900 text-gray-600 opacity-40';
                  }
                }

                return (
                  <button
                    key={oIdx}
                    id={`quiz-option-${oIdx}`}
                    onClick={() => handleSelectOption(oIdx)}
                    disabled={isAnswered}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                  >
                    <span className="text-xs md:text-sm font-sans">{opt}</span>
                    {isAnswered && oIdx === currentQ.correctAnswer && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 ml-2" />
                    )}
                    {isAnswered && oIdx === selectedOption && oIdx !== currentQ.correctAnswer && (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation box after answer */}
            {isAnswered && (
              <div className="p-4 bg-white/5 rounded-2xl border border-cyan-500/30 text-xs text-gray-300 space-y-1.5 animate-fadeIn">
                <div className="flex items-center gap-1.5 font-bold text-cyan-400 uppercase text-[10px] tracking-wider font-display">
                  <Sparkles className="w-4 h-4" />
                  <span>Astronomical Verification:</span>
                </div>
                <p className="leading-relaxed text-gray-200">{currentQ.explanation}</p>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex justify-end pt-2">
              <button
                id="quiz-next-btn"
                onClick={handleNext}
                disabled={!isAnswered}
                className={`px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all cursor-pointer font-display ${
                  isAnswered
                    ? 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)] active:scale-95'
                    : 'bg-white/5 border border-white/10 text-gray-600 cursor-not-allowed'
                }`}
              >
                {currentIdx + 1 === QUIZ_QUESTIONS.length ? 'View Telemetry Results' : 'Next Question →'}
              </button>
            </div>
          </div>
        ) : (
          /* Finished Screen */
          <div className="flex flex-col items-center text-center py-6 space-y-5">
            <div className="w-20 h-20 rounded-3xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-[0_0_30px_rgba(6,182,212,0.4)]">
              <Award className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-2xl font-extrabold text-white uppercase tracking-tight font-display">
                {score === QUIZ_QUESTIONS.length
                  ? 'Master Astronomer'
                  : score >= 4
                  ? 'Senior Flight Specialist'
                  : 'Cosmic Cadet'}
              </h3>
              <p className="text-xs text-gray-400 mt-2 font-mono">
                Evaluation Score: <strong className="text-cyan-300 font-bold">{score}</strong> of {QUIZ_QUESTIONS.length} Questions Correct
              </p>
            </div>

            <button
              id="quiz-restart-btn"
              onClick={handleRestart}
              className="flex items-center gap-2 px-8 py-3.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs uppercase tracking-widest rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all cursor-pointer active:scale-95 font-display"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Evaluation</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};


