import { Button } from "@/components/ui/button";
import { CheckCircle, ChevronLeft } from "lucide-react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "@/services/api";

const VisualLearningPage = () => {
  const { videoId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [isDone, setIsDone] = useState(false);
  const videoDetails = location.state?.video;
  const userStr = localStorage.getItem("userProfile") || sessionStorage.getItem("userProfile");
  const userProfile = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    if (userProfile && videoId && videoDetails) {
      api.post("/progress/save", {
        user_id: userProfile.id,
        external_id: videoId,
        video_metadata: videoDetails,
        status: "in_progress",
      })
        .then((res) => {
          const data = res.data;
          if (data.success && data.data && data.data.status === "completed") {
            setIsDone(true);
          }
        })
        .catch(console.error);
    }
  }, [videoId, userProfile, videoDetails]);

  const handleMarkAsDone = async () => {
    if (!userProfile) return;
    try {
      const res = await api.post("/progress/save", {
        user_id: userProfile.id,
        external_id: videoId,
        video_metadata: videoDetails,
        status: "completed",
      });
      const data = res.data;
      if (data.success) {
        setIsDone(true);
        // Notify LearningLayout to refresh next/previous navigation
        window.dispatchEvent(new Event("materialMarkedAsDone"));
        const profileRes = await api.get(`/auth/profile/${userProfile.id}`);
        const profileData = profileRes.data;
        if (profileData.success) {
          const storage = localStorage.getItem("userSession") ? localStorage : sessionStorage;
          storage.setItem("userProfile", JSON.stringify(profileData.data));

          if (profileData.data.needs_reassessment) {
            window.location.href = "/welcome";
          }
        }
      }
    } catch (error) {
      console.error("Gagal menyimpan progress:", error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 lg:px-8 py-10 flex flex-col items-center">
      <div className="w-full flex justify-start mb-4">
        <Button variant="ghost" onClick={() => navigate("/dashboard")} className="flex items-center gap-2 text-gray-600 -ml-4">
          <ChevronLeft size={20} /> Kembali
        </Button>
      </div>

      <div className="w-full mb-10 items-center shadow-lg rounded-[16px] lg:rounded-[24px] overflow-hidden">
        <div className="w-full aspect-video bg-[#dbdbdb]">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title={videoDetails?.title || "YouTube video player"}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      <h1 className="text-2xl lg:text-4xl font-extrabold text-gray-900 mb-4 text-center leading-tight tracking-tight px-4">
        {videoDetails?.title || "Materi Video YouTube"}
      </h1>

      <p className="text-gray-600 text-sm lg:text-base leading-relaxed text-center max-w-2xl lg:max-w-3xl mb-12 font-medium">
        {videoDetails?.channel ? `Diunggah oleh ${videoDetails.channel}` : "Pelajari dengan saksama materi visual berikut untuk pemahaman yang lebih baik."}
      </p>

      <div className="mb-16 lg:mb-24">
        <Button
          onClick={handleMarkAsDone}
          disabled={isDone}
          className={`px-10 lg:px-12 py-6 rounded-xl gap-2 lg:gap-3 text-base lg:text-lg font-bold shadow-md transition-all duration-300 ${isDone ? 'bg-green-600 hover:bg-green-700 opacity-90 cursor-default' : 'bg-[#ef5a1a] hover:bg-[#d44d15]'} text-white`}
        >
          <CheckCircle size={22} className="stroke-[2.5px]" />
          {isDone ? "Selesai" : "Mark as Done"}
        </Button>
      </div>
    </div>
  );
};

export default VisualLearningPage;