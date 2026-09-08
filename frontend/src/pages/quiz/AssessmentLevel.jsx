import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import logoAdaptLearn from "@/assets/logo-adaptlearn.webp";
import api from "@/services/api";

const AssessmentLevel = () => {
  const navigate = useNavigate();
  const userProfile = JSON.parse(localStorage.getItem("userProfile") || sessionStorage.getItem("userProfile") || "{}");
  const isReassessment = userProfile.last_quiz_at && userProfile.needs_reassessment;

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const res = await api.get("/quiz/questions");
        const data = res.data;
        
        if (Array.isArray(data)) {
          setQuestions(data);
        } else if (data.data && Array.isArray(data.data)) {
          // Handle case where backend wraps data in a 'data' property
          setQuestions(data.data);
        } else {
          setError("Failed to load questions format");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.response?.data?.message || "Could not connect to the quiz server.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const [userAnswers, setUserAnswers] = useState({});

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      const finalResults = questions.map((q, index) => {
        const selectedId = userAnswers[index];
        const selectedOption = q.options.find(opt => opt.id === selectedId);
        return {
          questionId: q.id,
          difficulty: q.difficulty,
          isCorrect: !!selectedOption?.is_correct
        };
      });

      localStorage.setItem('quizResults', JSON.stringify(finalResults));
      navigate("/analyzing");
    }
  };

  const selected = userAnswers[currentIndex] || null;

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full min-h-[600px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-text-secondary font-bold font-geist animate-pulse">Preparing your assessment...</p>
        </div>
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <div className="flex items-center justify-center w-full">
        <Card className="p-10 text-center space-y-4">
          <p className="text-red-500 font-bold">{error || "No questions found."}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <div className="flex items-center justify-center w-full max-w-4xl mx-auto animate-in fade-in duration-500">
      <Card className="w-full bg-white rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.03)] border-none px-8 py-10 md:px-14 md:py-16 space-y-10">
        <div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <img src={logoAdaptLearn} alt="Logo" className="w-10 h-10 object-contain" />
              <span className="text-xl font-black text-primary font-geist">AdaptLearn</span>
            </div>
            <span className="text-text-secondary font-bold text-sm font-geist">
              Question {currentIndex + 1} of {questions.length}
            </span>
          </div>
          <div className="mt-8">
            <div className="flex justify-between text-[11px] font-black text-text-secondary mb-2 uppercase tracking-widest font-geist">
              <span>ASSESSMENT PROGRESS</span>
              <span className="text-primary font-black">{progress}%</span>
            </div>
            <div className="w-full h-2 bg-background-alt rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-500" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-black text-text-primary leading-tight font-geist min-h-[80px]">
          {currentQuestion.question}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {currentQuestion.options.map((option) => (
            <button
              key={option.id}
              onClick={() => setUserAnswers({ ...userAnswers, [currentIndex]: option.id })}
              className={`flex items-center gap-5 p-6 rounded-2xl border-2 text-left transition-all min-h-[100px] w-full group
                ${
                  selected === option.id
                    ? "border-primary bg-background-alt/30 shadow-lg shadow-primary/5"
                    : "border-slate-50 hover:border-primary/20 bg-white shadow-sm"
                }`}
            >
              <div
                className={`shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center bg-white transition-colors
                  ${
                    selected === option.id
                      ? "border-primary"
                      : "border-slate-200 group-hover:border-primary/30"
                  }`}
              >
                {selected === option.id && <div className="w-3 h-3 bg-primary rounded-full" />}
              </div>
              <span className="text-text-primary text-[15px] font-bold leading-relaxed whitespace-pre-wrap flex-1 font-geist">
                {option.text}
              </span>
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center pt-10 border-t border-background-alt">
          <button
            onClick={() => {
              if (currentIndex > 0) {
                setCurrentIndex(prev => prev - 1);
              } else if (!isReassessment) {
                navigate("/quiz-style");
              }
            }}
            disabled={currentIndex === 0 && isReassessment}
            className={`text-sm font-black uppercase tracking-widest transition flex items-center gap-2 font-geist
              ${(currentIndex === 0 && isReassessment) 
                ? "text-slate-300 cursor-not-allowed" 
                : "text-text-secondary hover:text-text-primary"}`}
          >
            ← Previous
          </button>

          <Button
            onClick={handleNext}
            disabled={!selected}
            className={`h-14 px-10 rounded-2xl text-white font-black text-sm transition-all shadow-lg font-geist
              ${
                selected
                  ? "bg-text-secondary hover:bg-text-primary shadow-text-secondary/20"
                  : "bg-slate-200 cursor-not-allowed opacity-50"
              }`}
          >
            {currentIndex < questions.length - 1 ? "Next Question" : "Finish Assessment"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AssessmentLevel;