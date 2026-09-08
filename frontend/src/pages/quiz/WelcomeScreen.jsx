import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const WelcomeScreen = () => {
  const navigate = useNavigate();
  const userProfile = JSON.parse(localStorage.getItem("userProfile") || sessionStorage.getItem("userProfile") || "{}");
  const isReassessment = userProfile.last_quiz_at && userProfile.needs_reassessment;

  return (
    <div className="flex items-center justify-center w-full max-w-4xl mx-auto animate-in fade-in duration-500">
      <Card className="flex flex-col py-0 md:flex-row w-full bg-surface rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden border-none min-h-[500px]">
        {/* Left */}
        <div className="md:w-1/2 shrink-0 h-64 md:h-auto relative overflow-hidden">
          <img 
             src={isReassessment 
               ? "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80" 
               : "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80"} 
             alt="Learning" 
             className="w-full h-full object-cover absolute inset-0"
          />
        </div>
        
        {/* Right */}
        <div className="md:w-1/2 p-8 md:px-12 md:py-16 flex flex-col justify-center bg-surface">
          <div className="inline-block border border-primary text-primary font-bold text-[10px] px-4 py-1.5 rounded-full mb-6 w-max uppercase tracking-widest">
            {isReassessment ? "PROGRESS EVALUATION" : "GETTING STARTED"}
          </div>
          
          <h1 className="text-[2rem] leading-tight font-extrabold text-text-primary mb-4">
            {isReassessment ? "Ready for a Level Up?" : "Let's Personalize Your Journey"}
          </h1>
          
          <p className="text-text-secondary text-[15px] mb-8 leading-relaxed max-w-sm">
            {isReassessment 
              ? "Kamu telah menyelesaikan 5 materi baru! Mari kita evaluasi pemahamanmu untuk menyesuaikan materi berikutnya."
              : "Answer a few fun questions so we can tailor the best learning materials for you."}
          </p>
          
          <div className="flex items-center gap-3 mt-auto">
            <Button 
              onClick={() => navigate(isReassessment ? "/quiz-level" : "/quiz-style")}
              className="bg-primary hover:bg-primary-dark text-white font-bold h-12 px-6 rounded-full shadow-md text-[14px]"
            >
              {isReassessment ? "Mulai Evaluasi" : "Start Assessment"} <span className="ml-2 font-normal">→</span>
            </Button>
            
            <div className="flex items-center gap-2 bg-surface px-4 h-12 rounded-full shadow-sm border border-slate-100 text-[13px] font-semibold text-slate-500">
              {isReassessment ? "Quick Check" : "Only 2 Minutes"}
              <span className="text-lg">⏱️</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default WelcomeScreen;