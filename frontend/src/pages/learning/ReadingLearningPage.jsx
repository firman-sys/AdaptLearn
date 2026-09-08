/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle, ChevronLeft, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import api from "@/services/api";

const ReadingLearningPage = () => {
  const { materiId } = useParams();
  const navigate = useNavigate();
  const [materi, setMateri] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDone, setIsDone] = useState(false);
  const [saving, setSaving] = useState(false);
  const [nextMaterial, setNextMaterial] = useState(null);
  const [previousMaterial, setPreviousMaterial] = useState(null);
  const [navLoading, setNavLoading] = useState(false);

  const getUserProfile = useCallback(() => {
    const userStr = localStorage.getItem("userProfile") || sessionStorage.getItem("userProfile");
    return userStr ? JSON.parse(userStr) : null;
  }, []);

  const userProfile = useMemo(() => getUserProfile(), [getUserProfile]);

  const fetchNavigationMaterials = useCallback(async () => {
    if (!materiId) return;

    const profile = getUserProfile();

    try {
      setNavLoading(true);

      // Fetch next material
      const nextResponse = await api.get(`/recommendations/next/${materiId}`, {
        params: profile ? { user_id: profile.id } : {}
      });
      const nextData = nextResponse.data;

      if (nextData.success && nextData.data) {
        setNextMaterial(nextData.data);
      } else {
        setNextMaterial(null);
      }

      // Fetch previous material
      const prevResponse = await api.get(`/recommendations/previous/${materiId}`, {
        params: profile ? { user_id: profile.id } : {}
      });
      const prevData = prevResponse.data;

      if (prevData.success && prevData.data) {
        setPreviousMaterial(prevData.data);
      } else {
        setPreviousMaterial(null);
      }
    } catch (error) {
      console.error("Error fetching navigation materials:", error);
      setNextMaterial(null);
      setPreviousMaterial(null);
    } finally {
      setNavLoading(false);
    }
  }, [materiId]);

  useEffect(() => {
    setIsDone(false);
    setMateri(null);
    setNextMaterial(null);
    setPreviousMaterial(null);

    const fetchMaterialAndProgress = async () => {
      try {
        setLoading(true);
        const materialRes = await api.get(`/materials/${materiId}`);
        const materialData = materialRes.data;

        if (materialData.success) {
          setMateri(materialData.data);
        } else {
          console.error("Failed to load material:", materialData);
        }

        if (userProfile && userProfile.id) {
          const progressRes = await api.get(`/progress/${userProfile.id}`);
          const progressData = progressRes.data;
          let alreadyCompleted = false;
          if (progressData.success) {
            const currentMaterial = progressData.data.find(m => m.id === materiId);
            if (currentMaterial && currentMaterial.progress.status === "completed") {
              setIsDone(true);
              alreadyCompleted = true;
            }
          }

          if (!alreadyCompleted) {
            await api.post("/progress/save", {
              user_id: userProfile.id,
              material_id: materiId,
              status: "in_progress",
            });
          }
        } else {
          console.warn("User not logged in");
        }
      } catch (error) {
        console.error("Error in fetchMaterialAndProgress:", error);
      } finally {
        setLoading(false);
      }
    };

    if (materiId) {
      fetchMaterialAndProgress();
      fetchNavigationMaterials();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [materiId, fetchNavigationMaterials]);

  // Listen for markAsDone event to refresh next/prev navigation
  useEffect(() => {
    window.addEventListener("materialMarkedAsDone", fetchNavigationMaterials);
    return () => window.removeEventListener("materialMarkedAsDone", fetchNavigationMaterials);
  }, [fetchNavigationMaterials]);

  const handleNextLesson = () => {
    if (!nextMaterial) {
      alert("Tidak ada materi selanjutnya. Anda sudah menyelesaikan semua materi!");
      navigate("/dashboard");
      return;
    }

    if (nextMaterial.format === 'Video' || nextMaterial.format === 'video') {
      if (nextMaterial.external_id) {
        navigate(`/belajar/video/${nextMaterial.external_id}`, { state: { video: nextMaterial } });
      } else {
        navigate(`/belajar/video/${nextMaterial.id}`);
      }
    } else {
      navigate(`/belajar/materi/${nextMaterial.id}`);
    }
  };

  const handlePreviousLesson = () => {
    if (!previousMaterial) return;

    if (previousMaterial.format === 'Video' || previousMaterial.format === 'video') {
      if (previousMaterial.external_id) {
        navigate(`/belajar/video/${previousMaterial.external_id}`, { state: { video: previousMaterial } });
      } else {
        navigate(`/belajar/video/${previousMaterial.id}`);
      }
    } else {
      navigate(`/belajar/materi/${previousMaterial.id}`);
    }
  };

  const handleMarkAsDone = async () => {

    if (!materiId) {
      console.error("Material ID tidak valid!");
      return;
    }

    setSaving(true);

    try {
      const res = await api.post("/progress/save", {
        user_id: userProfile.id,
        material_id: materiId,
        status: "completed",
      });
      
      const data = res.data;
      if (data.success) {
        setIsDone(true);
        window.dispatchEvent(new Event("materialMarkedAsDone"));
        
        const profileRes = await api.get(`/auth/profile/${userProfile.id}`);
        const profileData = profileRes.data;
        if (profileData.success) {
          const storage = localStorage.getItem("userSession") ? localStorage : sessionStorage;
          storage.setItem("userProfile", JSON.stringify(profileData.data));

          if (profileData.data.needs_reassessment) {
            alert("Kamu berhasil menyelesaikan 5 materi, ulangi lagi kuisnya yuk!")
            setTimeout(() => {
              window.location.href = "/welcome";
            }, 1000);
          }
        }
      } else {
        console.error("Failed to save progress:", data);
      }
    } catch (error) {
      console.error("Error saving progress:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500 font-medium">Memuat Materi...</div>;
  }

  if (!materi) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500 font-medium">Materi tidak ditemukan.</div>;
  }

  const normalizedContent = materi.content_text?.replace(/\/n/g, '\n').replace(/\\n/g, '\n');

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-6 -ml-4 flex items-center gap-2 text-gray-600">
          <ChevronLeft size={20} /> Kembali
        </Button>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          {materi.title}
        </h1>
        <p className="text-sm font-semibold text-orange-600 uppercase tracking-widest mb-8">{materi.topic} • BACAAN</p>

        {materi.thumbnail && (
          <div className="w-full flex justify-center mb-8 gap-2 flex-col">
            <img src={materi.thumbnail} alt={materi.title} className="w-full max-h-[400px] object-cover rounded-xl shadow-sm border border-gray-100" />
          </div>
        )}

        <div className="text-gray-800 text-base leading-loose mb-12 max-w-none text-justify prose prose-slate">
          <ReactMarkdown
            components={{
              h1: ({ node: _, ...props }) => <h1 className="text-2xl font-bold mt-8 mb-4 text-gray-900" {...props} />,
              h2: ({ node: _, ...props }) => <h2 className="text-xl font-bold mt-6 mb-3 text-gray-900" {...props} />,
              h3: ({ node: _, ...props }) => <h3 className="text-lg font-bold mt-5 mb-2 text-gray-900" {...props} />,
              p: ({ node: _, ...props }) => <div className="mb-4 leading-relaxed" {...props} />,
              ul: ({ node: _, ...props }) => <ul className="list-disc pl-5 mb-4 space-y-2" {...props} />,
              ol: ({ node: _, ...props }) => <ol className="list-decimal pl-5 mb-4 space-y-2" {...props} />,
              li: ({ node: _, ...props }) => <li className="leading-relaxed" {...props} />,
              a: ({ node: _, ...props }) => <a className="text-orange-600 font-medium hover:underline" {...props} />,
              strong: ({ node: _, ...props }) => <strong className="font-bold text-gray-900" {...props} />,
              em: ({ node: _, ...props }) => <em className="italic" {...props} />,
              blockquote: ({ node: _, ...props }) => <blockquote className="border-l-4 border-orange-500 pl-4 py-1 italic bg-orange-50/50 my-5 rounded-r" {...props} />,
              code: ({ node: _, inline, className, children, ...props }) => {
                return inline ? (
                  <code className="bg-gray-100 text-orange-600 px-1.5 py-0.5 rounded text-sm font-mono border border-gray-200" {...props}>
                    {children}
                  </code>
                ) : (
                  <pre className="bg-[#1e1e1e] text-gray-100 p-4 rounded-xl overflow-x-auto my-6 text-sm font-mono shadow-sm">
                    <code className={className} {...props}>
                      {children}
                    </code>
                  </pre>
                )
              },
              pre: ({ node: _, ...props }) => (
                <pre className="bg-[#1e1e1e] text-gray-100 p-4 rounded-xl overflow-x-auto my-6 text-sm font-mono shadow-sm" {...props} />
              ),
              img: ({ node: _, ...props }) => (
                <span className="flex flex-col items-center my-8">
                  <img className="max-w-full rounded-xl shadow-sm border border-gray-100" {...props} />
                  {props.alt && <span className="text-sm text-gray-500 mt-2 text-center inline-block">{props.alt}</span>}
                </span>
              ),
            }}
          >
            {normalizedContent}
          </ReactMarkdown>
        </div>

        <div className="flex justify-end mb-16 pt-8 border-t border-gray-100">
          <Button
            onClick={handleMarkAsDone}
            disabled={isDone || saving}
            className={`flex items-center gap-2 px-8 py-6 rounded-xl font-bold text-base transition-all duration-300 ${isDone
                ? 'bg-green-600 hover:bg-green-700 opacity-90 cursor-default'
                : saving
                  ? 'bg-gray-400 cursor-wait'
                  : 'bg-orange-600 hover:bg-[#d44d15]'
              } text-white shadow-md`}
          >
            <CheckCircle size={22} className="stroke-[2.5px]" />
            {saving ? "Menyimpan..." : isDone ? "Selesai" : "Mark as Done"}
          </Button>
        </div>

      </div>

      {/* Next/Previous Navigation */}
      <div className="w-full bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-6 flex justify-between items-center">
          {previousMaterial ? (
            <button
              onClick={handlePreviousLesson}
              className="flex items-center gap-2 px-6 py-3 font-bold text-primary hover:text-gray-400 transition-all bg-transparent border-none shadow-none outline-none"
            >
              <ArrowLeft size={20} strokeWidth={2.5} /> Previous
            </button>
          ) : (
            <div className="w-32"></div>
          )}
          <div className="text-sm text-gray-500">
            {nextMaterial ? (
              <span className="font-medium">
                Selanjutnya: <span className="text-gray-900">{nextMaterial.title}</span>
              </span>
            ) : navLoading ? (
              <span>Memuat...</span>
            ) : (
              <span>Tidak ada materi selanjutnya</span>
            )}
          </div>
          <button
            onClick={handleNextLesson}
            disabled={!nextMaterial || navLoading}
            className={`flex items-center gap-2 px-6 py-3 font-bold text-base transition-all bg-transparent border-none shadow-none outline-none ${nextMaterial && !navLoading
                ? 'text-primary'
                : 'text-gray-400 cursor-not-allowed'
              }`}
          >
            Next Lesson <ArrowRight size={20} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReadingLearningPage;
