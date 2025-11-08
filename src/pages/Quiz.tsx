import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Volume2, CheckCircle, XCircle, Award, Clock, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useHaptic } from "@/hooks/useHaptic";
import { CookstoveComparison } from "@/components/CookstoveComparison";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const questions: Question[] = [
  {
    id: 1,
    question: "How much CO₂ can a clean cookstove prevent per year compared to traditional stoves?",
    options: ["1-2 tons", "0.5 tons", "5 tons", "10 tons"],
    correctAnswer: 0,
    explanation: "Clean cookstoves can prevent 1-2 tons of CO₂ emissions per year, which is equivalent to planting 50-100 trees!",
  },
  {
    id: 2,
    question: "What percentage of fuel can clean cookstoves save compared to traditional methods?",
    options: ["10-20%", "30-40%", "50-60%", "70-80%"],
    correctAnswer: 2,
    explanation: "Clean cookstoves can save 50-60% of fuel, which means more money saved and less time collecting firewood.",
  },
  {
    id: 3,
    question: "How many people globally still rely on traditional cooking methods?",
    options: ["500 million", "1 billion", "2.4 billion", "4 billion"],
    correctAnswer: 2,
    explanation: "Approximately 2.4 billion people worldwide still rely on traditional biomass cooking methods.",
  },
  {
    id: 4,
    question: "What is the primary health benefit of clean cookstoves?",
    options: [
      "Better taste of food",
      "Reduced indoor air pollution",
      "Faster cooking time",
      "Uses less water"
    ],
    correctAnswer: 1,
    explanation: "Clean cookstoves reduce indoor air pollution by up to 90%, preventing respiratory diseases and improving family health.",
  },
  {
    id: 5,
    question: "How does using a clean cookstove help combat climate change?",
    options: [
      "It produces renewable energy",
      "It reduces greenhouse gas emissions",
      "It creates oxygen",
      "It cools the atmosphere"
    ],
    correctAnswer: 1,
    explanation: "Clean cookstoves reduce greenhouse gas emissions by burning fuel more efficiently and producing less smoke and particulate matter.",
  },
];

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerActive, setTimerActive] = useState(true);
  const navigate = useNavigate();
  const haptic = useHaptic();

  // Timer countdown
  useEffect(() => {
    if (!timerActive || showExplanation) return;
    
    if (timeLeft <= 0) {
      // Auto-submit wrong answer when time runs out
      handleAnswerSelect(-1);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, timerActive, showExplanation]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (showExplanation) return;
    
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    setTimerActive(false);
    
    const isCorrect = answerIndex === questions[currentQuestion].correctAnswer;
    
    if (isCorrect) {
      setScore(score + 1);
      haptic.triggerSuccess();
    } else {
      haptic.triggerError();
    }
  };

  const handleNext = () => {
    haptic.triggerLight();
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setTimeLeft(30);
      setTimerActive(true);
    } else {
      setQuizComplete(true);
    }
  };

  const handleVoiceQuestion = () => {
    haptic.triggerLight();
    const utterance = new SpeechSynthesisUtterance(questions[currentQuestion].question);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    window.speechSynthesis.cancel(); // Stop any ongoing speech
    window.speechSynthesis.speak(utterance);
    toast.info("🔊 Reading question aloud");
  };

  const handleShare = () => {
    haptic.triggerLight();
    const percentage = Math.round((score / questions.length) * 100);
    const shareText = `I scored ${percentage}% on the Climate Quiz and earned ${creditsEarned} credits! 🌍💚`;
    
    if (navigator.share) {
      navigator.share({
        title: "EcoCredit Quiz Results",
        text: shareText,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success("Score copied to clipboard!");
    }
  };

  const creditsEarned = score * 2;
  const percentage = Math.round((score / questions.length) * 100);

  if (quizComplete) {
    return (
      <div className="min-h-screen pb-20 bg-background">
        <div className="px-4 py-6 max-w-screen-lg mx-auto">
          <div className="text-center mb-8 animate-bounce-in">
            <div className="inline-flex p-4 rounded-full bg-success/10 mb-4">
              <Award className="h-16 w-16 text-success" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Quiz Complete!
            </h1>
            <p className="text-muted-foreground">
              Great job learning about clean cookstoves
            </p>
          </div>

          <Card className="p-8 mb-6 bg-gradient-to-br from-primary via-primary to-success text-primary-foreground text-center">
            <div className="space-y-2 mb-6">
              <p className="text-sm font-medium opacity-90">Your Score</p>
              <p className="text-6xl font-bold">{score}/{questions.length}</p>
              <p className="text-2xl font-semibold opacity-95">{percentage}%</p>
              <p className="text-sm opacity-90">
                {score === questions.length
                  ? "Perfect Score! 🏆"
                  : score >= 4
                  ? "Excellent! 🌟"
                  : score >= 3
                  ? "Good Job! 👍"
                  : "Keep Learning! 📚"}
              </p>
            </div>
            
            <div className="pt-6 border-t border-primary-foreground/20 space-y-2">
              <p className="text-sm font-medium opacity-90">Credits Breakdown</p>
              <div className="space-y-1 text-sm opacity-90">
                <div className="flex justify-between">
                  <span>Correct Answers ({score})</span>
                  <span>+{score * 2} credits</span>
                </div>
                {score === questions.length && (
                  <div className="flex justify-between font-semibold">
                    <span>Perfect Score Bonus</span>
                    <span>+5 credits</span>
                  </div>
                )}
              </div>
              <div className="pt-3 border-t border-primary-foreground/20">
                <p className="text-4xl font-bold">
                  {score === questions.length ? creditsEarned + 5 : creditsEarned}
                </p>
                <p className="text-xs opacity-75">Total Credits Earned</p>
              </div>
            </div>
          </Card>

          <div className="mb-6">
            <CookstoveComparison />
          </div>

          <div className="space-y-3">
            <Button
              size="lg"
              onClick={handleShare}
              className="w-full gap-2 h-14"
              variant="secondary"
            >
              <Share2 className="h-5 w-5" />
              Share Your Score
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button
                size="lg"
                onClick={() => navigate("/dashboard")}
                className="gap-2 h-12"
              >
                Dashboard
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  haptic.triggerLight();
                  setCurrentQuestion(0);
                  setSelectedAnswer(null);
                  setShowExplanation(false);
                  setScore(0);
                  setQuizComplete(false);
                  setTimeLeft(30);
                  setTimerActive(true);
                }}
                className="h-12"
              >
                Retake Quiz
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen pb-20 bg-background">
      <div className="px-4 py-6 max-w-screen-lg mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-2xl font-bold text-foreground">Climate Quiz</h1>
            <div className="flex items-center gap-2">
              <Clock className={`h-4 w-4 ${timeLeft <= 5 ? 'text-destructive animate-pulse' : 'text-muted-foreground'}`} />
              <span className={`text-sm font-medium ${timeLeft <= 5 ? 'text-destructive' : 'text-muted-foreground'}`}>
                {timeLeft}s
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm font-medium text-primary">
              {score * 2} credits
            </span>
          </div>
          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-success transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <Card className="p-6 mb-6">
          <div className="flex items-start justify-between gap-4 mb-6">
            <h2 className="text-xl font-semibold text-foreground flex-1">
              {questions[currentQuestion].question}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleVoiceQuestion}
              className="flex-shrink-0"
            >
              <Volume2 className="h-5 w-5" />
            </Button>
          </div>

          {/* Answer Options */}
          <div className="space-y-3">
            {questions[currentQuestion].options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === questions[currentQuestion].correctAnswer;
              const showResult = showExplanation;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showExplanation}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                    showResult
                      ? isCorrect
                        ? "border-success bg-success/10"
                        : isSelected
                        ? "border-destructive bg-destructive/10"
                        : "border-muted bg-muted/50"
                      : isSelected
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium text-foreground">{option}</span>
                    {showResult && isCorrect && (
                      <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                    )}
                    {showResult && isSelected && !isCorrect && (
                      <XCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <Card className="p-4 mt-6 bg-muted/50 border-primary/20 animate-fade-in">
              <p className="text-sm">
                <span className="font-semibold text-primary">Explanation: </span>
                <span className="text-muted-foreground">
                  {questions[currentQuestion].explanation}
                </span>
              </p>
            </Card>
          )}
        </Card>

        {/* Navigation */}
        {showExplanation && (
          <Button
            size="lg"
            onClick={handleNext}
            className="w-full gap-2 h-14 animate-scale-in"
          >
            {currentQuestion < questions.length - 1 ? "Next Question" : "See Results"}
          </Button>
        )}

        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index < currentQuestion
                  ? 'w-8 bg-success'
                  : index === currentQuestion
                  ? 'w-10 bg-primary'
                  : 'w-2 bg-muted'
              }`}
            />
          ))}
        </div>

        {/* Credits Info */}
        <Card className="p-4 mt-6 bg-gradient-to-r from-accent/10 to-primary/10 border-accent/20">
          <p className="text-sm text-center">
            <span className="font-semibold text-accent">Earn 2 credits</span>{" "}
            <span className="text-muted-foreground">for each correct answer!</span>
          </p>
        </Card>
      </div>
    </div>
  );
}
