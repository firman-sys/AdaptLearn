import { useState, useEffect } from "react";
import {
  Play,
  FileText,
  LayoutGrid,
  Eye,
  ArrowRight,
  LogOut,
  RotateCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";

const DashboardHome = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("userSession");
    localStorage.removeItem("userProfile");
    sessionStorage.removeItem("userSession");
    sessionStorage.removeItem("userProfile");
    window.location.href = "/";
  };

  useEffect(() => {
    const fetchDashboardInfo = async () => {
      try {
        const profileStr = localStorage.getItem("userProfile") || sessionStorage.getItem("userProfile");
        if (!profileStr) {
          navigate("/login");
          return;
        }

        const profile = JSON.parse(profileStr);
        setUserProfile(profile);

        const response = await api.get(`/recommendations/${profile.id}`);
        const data = response.data;
        if (data.success) {
          setDashboardData(data);
        }
      } catch (error) {
        console.error("Gagal memuat data dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardInfo();
  }, [navigate]);

  const handleRefreshVideos = async () => {
    if (refreshing) return;
    setRefreshing(true);
    try {
      const response = await api.get(`/recommendations/${userProfile.id}`, {
        params: { refresh: true }
      });
      const data = response.data;
      if (data.success) {
        setDashboardData(prev => ({
          ...prev,
          youtube_videos: data.youtube_videos,
          youtube_error: data.youtube_error
        }));
      }
    } catch (error) {
      console.error("Gagal menyegarkan video:", error);
    } finally {
      setRefreshing(false);
    }
  };

  if (loading || !userProfile) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <p className="text-text-secondary font-medium">Memuat Dashboard...</p>
      </div>
    );
  }

  const { recommended_materials = [], youtube_videos = [], youtube_error = null, user_level } = dashboardData || {};

  const inProgressItems = recommended_materials.filter(m => m.recommendation_reason && m.recommendation_reason.includes('Sedang'));
  const currentLearning = inProgressItems.length > 0 ? inProgressItems[0] : (recommended_materials.length > 0 ? recommended_materials[0] : null);

  const bacaanMats = recommended_materials.filter(m => m.id !== currentLearning?.id && m.format !== 'video' && m.format !== 'Video');

  const handleNavigateCurrent = () => {
    if (currentLearning.format === 'video' || currentLearning.format === 'Video') {
      navigate(`/belajar/video/${currentLearning.external_id}`, { state: { video: currentLearning } });
    } else {
      navigate(`/belajar/materi/${currentLearning.id}`);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column */}
      <div className="lg:col-span-2 space-y-8 order-2 lg:order-1">

        {/* Lanjutkan Pembelajaran Section */}
        {currentLearning && (
          <section>
            <div className="">
              <h2 className="text-primary font-bold text-lg mb-4 uppercase tracking-wide flex items-center gap-2">
                Lanjutkan Pembelajaran
              </h2>
            </div>

            <Card className="bg-surface border-background-alt overflow-hidden cursor-pointer" onClick={handleNavigateCurrent}>
              <CardContent className="p-6 flex flex-col sm:flex-row gap-6 items-center">
                <div className="w-full sm:w-48 h-32 bg-background-alt rounded-xl flex items-center justify-center overflow-hidden">
                  {currentLearning.thumbnail ? (
                    <img src={currentLearning.thumbnail} alt={currentLearning.title} className="w-full h-full object-cover" />
                  ) : (
                    <LayoutGrid size={48} strokeWidth={1.5} className="text-primary/30" />
                  )}
                </div>

                <div className="flex-1 w-full translate-y-[-4px]">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-text-primary">
                      {currentLearning.title}
                    </h3>
                    <span className="text-primary font-bold text-sm text-right leading-tight">
                      {currentLearning.recommendation_reason || "Belum Selesai"}
                    </span>
                  </div>

                  {/* Progress mock (can be dynamic if added to backend logic) */}
                  <Progress value={25} className="h-2 mb-6 mt-4" />

                  <Button className="bg-primary hover:bg-primary-dark text-white font-bold rounded-xl gap-2">
                    <Play size={18} fill="currentColor" />
                    Lanjutkan Belajar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        <section>
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-text-primary font-bold text-lg">
              Rekomendasi Bacaan ({user_level})
            </h2>
            <Button variant="link" className="text-primary font-bold p-0 h-auto">
              Lihat Semua
            </Button>
          </div>

          <div className="space-y-4">
            {bacaanMats.map((materi) => (
              <Card key={materi.id} className="bg-surface border-background-alt cursor-pointer hover:border-primary/50 transition-colors" onClick={() => navigate(`/belajar/materi/${materi.id}`)}>
                <CardContent className="p-4 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center overflow-hidden shrink-0">
                      {materi.thumbnail ? (
                        <img src={materi.thumbnail} alt={materi.title} className="w-full h-full object-cover" />
                      ) : (
                        <FileText size={20} />
                      )}
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1 line-clamp-1">
                        {materi.topic || "WEB DEVELOPMENT"} • BACAAN
                      </div>
                      <h4 className="font-bold text-text-primary line-clamp-1">
                        {materi.title}
                      </h4>
                    </div>
                  </div>
                  <Button variant="outline" className="bg-background hover:bg-background-alt text-text-primary font-bold text-sm px-6 h-9 rounded-lg border-background-alt shrink-0">
                    Baca
                  </Button>
                </CardContent>
              </Card>
            ))}
            {bacaanMats.length === 0 && (
              <p className="text-sm text-text-secondary italic">Tidak ada rekomendasi saat ini.</p>
            )}
          </div>
        </section>

        <section>
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-text-primary font-bold text-lg">
              Rekomendasi Video YouTube
            </h2>
            <div className="flex items-center gap-2">
              {refreshing ? (
                <RotateCw size={16} className="text-primary animate-spin" />
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-text-secondary hover:text-primary rounded-full"
                  onClick={handleRefreshVideos}
                  title="Refresh Rekomendasi"
                >
                  <RotateCw size={16} />
                </Button>
              )}
              <Button variant="link" className="text-primary font-bold p-0 h-auto" onClick={() => window.open('https://youtube.com', '_blank')}>
                Lihat Semua
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {youtube_videos.map((video, index) => (
              <Card key={index} className="bg-surface border-background-alt overflow-hidden flex flex-col hover:border-primary/50 transition-colors">
                <div
                  className="aspect-video bg-background-alt relative flex items-center justify-center group cursor-pointer"
                  onClick={() => navigate(`/belajar/video/${video.url.split('v=')[1]}`, { state: { video } })}
                >
                  {video.thumbnail ? (
                    <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                  ) : null}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                  <div className="absolute w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary group-hover:scale-110 shadow-lg transition-transform z-10">
                    <Play size={20} fill="currentColor" className="ml-1" />
                  </div>
                </div>
                <CardHeader className="p-3">
                  <h4 className="font-bold text-text-primary text-sm leading-tight line-clamp-2" title={video.title}>
                    {video.title}
                  </h4>
                  <p className="text-xs text-text-secondary mt-1 truncate">
                    {video.channel}
                  </p>
                </CardHeader>
              </Card>
            ))}
            {youtube_videos.length === 0 && (
              <p className="text-sm text-text-secondary italic col-span-2">
                {youtube_error === "quota_exceeded"
                  ? "⚠️ Video YouTube tidak tersedia saat ini karena limit API harian habis. Coba lagi besok."
                  : youtube_error === "no_api_key"
                    ? "⚠️ YouTube API key belum dikonfigurasi."
                    : "Tidak ada video terkait yang ditemukan."}
              </p>
            )}
          </div>
        </section>
      </div>

      {/* Right Column */}
      <div className="space-y-6 order-1 lg:order-2">

        <Card className="bg-primary border-none overflow-hidden hover:shadow-lg transition-shadow">
          <CardContent className="p-6">

            <div className="flex items-center gap-4 mb-5">
              <div className="w-16 h-16 bg-white/20 border-2 border-white/40 flex items-center justify-center flex-shrink-0" style={{ borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%' }}>
                <span className="text-white text-2xl font-bold">
                  {userProfile.name.charAt(0).toUpperCase()}
                </span>
              </div>

              <div>
                <p className="text-white/80 text-sm font-medium">Welcome Back!</p>
                <h2 className="text-white text-2xl font-extrabold leading-tight truncate max-w-[150px]">
                  {userProfile.name.split(" ")[0]}
                </h2>
                <div className="inline-flex items-center gap-1.5 bg-white/20 text-white px-3 py-1 rounded-full text-xs font-semibold mt-1.5 border border-white/10">
                  <Eye size={11} />
                  {userProfile.learning_style || "Visual"} Learner
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/5 rounded-xl p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white/70 text-xs font-semibold">SKILL LEVEL</span>
                <span className="text-white font-bold text-sm bg-white/20 px-2 py-0.5 rounded">{userProfile.skill_level || user_level || "Pemula"}</span>
              </div>
              <p className="text-white/90 text-sm leading-relaxed line-clamp-3">
                Lanjutkan perjalanan belajarmu hari ini. Kamu disarankan untuk mempelajari materi yang difokuskan pada tipe gaya belajar dan tingkatan pemahamanmu saat ini.
              </p>
            </div>

            <div className="flex justify-between items-center mt-2 border-t border-white/10 pt-3">
              <Button
                variant="link"
                className="text-white/90 hover:text-white font-semibold text-xs p-0 h-auto gap-1"
                onClick={() => navigate("/profile")}
              >
                View Profile <ArrowRight size={13} />
              </Button>
              <Button
                variant="ghost"
                className="text-white/80 hover:text-white hover:bg-white/10 font-bold text-xs px-2 h-7 gap-1.5 rounded-lg transition-colors"
                onClick={handleLogout}
              >
                <LogOut size={13} /> Logout
              </Button>
            </div>

          </CardContent>
        </Card>

        <Card className="bg-amber-50 border border-amber-100">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">💡</span>
              <h3 className="text-primary font-bold text-base">Tips Hari Ini</h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed italic">
              "Fokus pada satu topik pada satu waktu dan praktikkan langsung apa yang telah kamu pelajari.
              Konsistensi adalah kunci keberhasilan."
            </p>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default DashboardHome;