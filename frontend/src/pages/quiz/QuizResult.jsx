import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import api from "@/services/api";

const QuizResult = () => {
  const navigate = useNavigate();
  
  const [style] = useState(() => localStorage.getItem("learningStyle") || "text");
  
  const [resultData] = useState(() => {
    const savedResultsStr = localStorage.getItem("quizResults");
    const savedResults = savedResultsStr ? JSON.parse(savedResultsStr) : [];
    
    let correctCount = 0;
    let difficultyScore = 0;
    
    savedResults.forEach(r => {
      const d = r.difficulty || "Easy";
      if (r.isCorrect) {
        correctCount += 1;
        const diff = d.toLowerCase();
        if (diff === "easy") difficultyScore += 1;
        else if (diff === "medium") difficultyScore += 2;
        else if (diff === "hard") difficultyScore += 3;
        else if (diff === "extreme" || diff === "expert") difficultyScore += 4;
        else difficultyScore += 1;
      }
    });

    const totalQ = savedResults.length;
    let computedLevel = "Beginner Level"; // Default
    if (totalQ > 0) {
      const ratio = correctCount / totalQ;
      // If correct 0/10 or score reach 15pts(10 * 1.5)
      if (ratio >= 0.9 || difficultyScore >= (totalQ * 1.5)) {
        computedLevel = "Advanced Level";
      } else if (ratio >= 0.45) {
        computedLevel = "Intermediate Level";
      }
    }

    return {
      level: computedLevel,
      correct: correctCount,
      total: totalQ
    };
  });

  const [countdown, setCountdown] = useState(0);

  const [syncing, setSyncing] = useState(true);

  useEffect(() => {
    const syncResults = async () => {
      try {
        setSyncing(true);
        const profileStr = localStorage.getItem("userProfile") || sessionStorage.getItem("userProfile");
        if (!profileStr) {
          setSyncing(false);
          return;
        }

        const profile = JSON.parse(profileStr);
        const userId = profile.id;

        if (!userId) {
          setSyncing(false);
          return;
        }

        const response = await api.post("/quiz/submit-result", {
          userId,
          learning_style: style,
          skill_level: resultData.level,
        });

        if (response.status === 200 || response.data?.success) {
          // Update local profile immediately to stop redirect loop
          const updatedProfile = { 
            ...profile, 
            needs_reassessment: false, 
            last_quiz_at: new Date().toISOString(), // Mark that the user has completed their first quiz
            skill_level: resultData.level.replace(" Level", "") === "Advanced" ? "Mahir" : 
                         resultData.level.replace(" Level", "") === "Intermediate" ? "Menengah" : "Pemula",
            learning_style: style === "visual" ? "Visual" : "Teks"
          };
          const storage = localStorage.getItem("userSession") ? localStorage : sessionStorage;
          storage.setItem("userProfile", JSON.stringify(updatedProfile));
          
          setCountdown(60);
        }
      } catch (err) {
        console.error("Failed to sync quiz results:", err);
      } finally {
        setSyncing(false);
      }
    };

    syncResults();
  }, [style, resultData.level]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const styleTitle = style === "visual" ? "Visual Learner" : "Text Enjoyer";
  const styleIcon = style === "visual" ? "▶️" : "📄";
  
  const description = style === "visual"
    ? `Kamu berhasil menjawab ${resultData.correct} dari ${resultData.total} pertanyaan dengan benar. Berdasarkan preferensimu, kamu lebih cocok belajar menggunakan pendekatan visual dan auditorial seperti video tutorial atau demonstrasi grafis.`
    : `Kamu berhasil menjawab ${resultData.correct} dari ${resultData.total} pertanyaan dengan benar. Preferensimu menunjukkan kekuatan pada teks, sehingga kami sangat merekomendasikan bahan bacaan dan dokumentasi terstruktur untuk mempercepat belajarmu.`;

  return (
    <div className="flex items-center justify-center w-full max-w-3xl mx-auto animate-in fade-in zoom-in-95 duration-700">
      <Card className="w-full bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border-none px-10 py-12 md:px-20 md:py-20 flex flex-col items-center text-center">
        
        <div className="border border-primary/20 bg-primary/5 text-primary px-6 py-2 rounded-full text-[11px] font-black tracking-widest uppercase mb-10">
          HASIL ANALISA
        </div>
        
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
           <span className="text-3xl text-primary">{styleIcon}</span>
        </div>
        
        <h1 className="text-4xl text-text-primary font-black mb-2 tracking-tight">
          {styleTitle}
        </h1>
        <p className="text-text-secondary text-[16px] font-bold mb-10">
          {resultData.level}
        </p>

        <p className="text-[15px] text-text-primary/70 leading-loose mb-12 max-w-[520px]">
          {description}
        </p>

        <div className="flex flex-col sm:flex-row gap-5 w-full">
          <Button 
            disabled={syncing}
            onClick={() => navigate("/dashboard")}
            className="bg-primary hover:bg-primary-dark text-white h-16 flex-[1.5] rounded-full font-black text-[15px] transition-all shadow-xl shadow-primary/25 disabled:opacity-70"
          >
            {syncing ? "Menyimpan..." : (
              <>LIHAT REKOMENDASI MATERI <span className="ml-2 font-normal text-2xl">→</span></>
            )}
          </Button>
          
          <button 
            disabled={countdown > 0 || syncing}
            onClick={() => {
              localStorage.removeItem("quizResults");
              navigate("/welcome");
            }}
            className={`h-16 flex-1 rounded-full border-2 text-[15px] font-black uppercase transition-all ${
              countdown > 0 
                ? "bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed" 
                : "bg-white hover:bg-slate-50 border-slate-100/60 text-text-secondary"
            }`}
          >
            {countdown > 0 ? `Coba Lagi (${countdown}s)` : "Ulangi Kuis"}
          </button>
        </div>

      </Card>
    </div>
  );
};

export default QuizResult;