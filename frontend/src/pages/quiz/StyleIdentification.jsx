import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const StyleIdentification = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  const choices = [
    {
      id: "visual",
      icon: "▶️",
      title: "Watch a video tutorial",
      subtitle: "Visual & Auditory learner"
    },
    {
      id: "text",
      icon: "📖",
      title: "Baca artikel atau blog",
      subtitle: "Text-based & Reading learner"
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto space-y-12 animate-in fade-in duration-700">
      <h1 className="text-3xl font-black text-text-primary text-center max-w-md leading-snug">
        Kalo mau belajar biasanya kaya gimana
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {choices.map((choice) => (
          <button
            key={choice.id}
            onClick={() => setSelected(choice.id)}
            className={`group relative flex flex-col items-center p-12 rounded-[2.5rem] transition-all bg-white border-2 text-center space-y-6 ${
              selected === choice.id
                ? "border-primary shadow-xl shadow-primary/10 ring-4 ring-primary/5"
                : "border-slate-50 hover:border-primary/30"
            }`}
          >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl transition-transform duration-300 group-hover:scale-110 ${
              selected === choice.id ? "bg-primary text-white" : "border-2 border-primary/20 text-primary"
            }`}>
              {choice.icon}
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl font-black text-text-primary uppercase tracking-tight">
                {choice.title}
              </h2>
              <p className="text-sm font-bold text-text-secondary/60 italic">
                {choice.subtitle}
              </p>
            </div>
            
          </button>
        ))}
      </div>

      <div className="flex justify-between items-center w-full pt-12 border-t border-background-alt shadow-[0_-1px_0_rgba(120,98,74,0.05)]">
        <button
          onClick={() => navigate("/welcome")}
          className="text-text-secondary font-black text-sm uppercase tracking-widest hover:text-text-primary transition"
        >
          ← Previous
        </button>

        <Button
          onClick={() => {
            localStorage.setItem("learningStyle", selected);
            navigate("/quiz-level");
          }}
          disabled={!selected}
          className={`h-14 px-10 rounded-2xl text-white font-black text-sm transition-all shadow-lg ${
            selected
              ? "bg-primary hover:bg-primary-dark shadow-primary/20"
              : "bg-slate-200 cursor-not-allowed opacity-50"
          }`}
        >
          Next Question
        </Button>
      </div>
    </div>
  );
};

export default StyleIdentification;