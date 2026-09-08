import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";

const AnalysisLoading = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/quiz-result");
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center w-full max-w-[500px] mx-auto animate-in fade-in duration-500">
      <Card className="w-full bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-none p-12 flex flex-col items-center text-center space-y-8">
        
        <div className="relative">
          <div className="w-28 h-28 border-[5px] border-background-alt rounded-full animate-ping absolute opacity-50" />
          <div className="w-28 h-28 border-[5px] border-primary border-t-transparent rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center text-4xl">
            🧠
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-[1.4rem] font-extrabold text-text-primary animate-pulse tracking-tight">
            Menganalisis Profilmu...
          </h2>
          <p className="text-text-secondary text-[14.5px] leading-relaxed max-w-[280px]">
            Sistem kami sedang menyusun rekomendasi materi yang paling pas buat kamu.
          </p>
        </div>

        <div className="w-full h-2 bg-background-alt rounded-full overflow-hidden mt-4">
          <div
            className="h-full bg-primary rounded-full animate-[loading_3s_ease-in-out_infinite]"
            style={{ width: "100%" }}
          />
        </div>
        
      </Card>
    </div>
  );
};

export default AnalysisLoading;