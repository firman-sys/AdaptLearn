import axios from "axios";
import { supabase } from "../config/supabaseClient.js";

const apiKeys = process.env.YOUTUBE_API_KEYS ? process.env.YOUTUBE_API_KEYS.split(',') : [];

// Rollet
const getRandomApiKey = () => {
  const randomIndex = Math.floor(Math.random() * apiKeys.length);
  return apiKeys[randomIndex]?.trim();
};

export const getRecommendations = async (req, res) => {
  try {
    const { user_id } = req.params;

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("skill_level, learning_style")
      .eq("id", user_id)
      .single();

    if (userError || !user) {
      return res.status(404).json({ success: false, message: "User tidak ditemukan" });
    }

    const skill_level = user.skill_level || "Pemula";
    const learning_style = user.learning_style || "Visual";

    const { data: progressData } = await supabase
      .from("user_progress")
      .select("material_id, status, updated_at")
      .eq("user_id", user_id);

    const progressMap = {};
    (progressData || []).forEach(p => progressMap[p.material_id] = p);

    const completedIds = new Set(
      (progressData || []).filter((p) => p.status === "completed").map((p) => p.material_id)
    );
    const inProgressIds = new Set(
      (progressData || []).filter((p) => p.status === "in_progress").map((p) => p.material_id)
    );

    const { data: levelMatsData, error: levelMatsError } = await supabase
      .from("materials")
      .select("id, title, external_id, source_api, format, level, topic, created_at, thumbnail")
      .eq("level", skill_level)
      .order("created_at", { ascending: true });

    if (levelMatsError) throw levelMatsError;
    const levelMats = levelMatsData || [];

    const inProgressMats = levelMats
      .filter((m) => inProgressIds.has(m.id))
      .map((m) => ({ ...m, recommendation_reason: "Sedang dipelajari — lanjutkan!" }))
      .sort((a, b) => {
        const timeA = new Date(progressMap[a.id]?.updated_at || 0).getTime();
        const timeB = new Date(progressMap[b.id]?.updated_at || 0).getTime();
        return timeB - timeA;
      });

    const notStartedMats = levelMats
      .filter((m) => !completedIds.has(m.id) && !inProgressIds.has(m.id))
      .slice(0, 3)
      .map((m) => ({ ...m, recommendation_reason: "Materi berikutnya untuk level kamu" }));

    const recommended = [...inProgressMats, ...notStartedMats];

    // Get ALL completed external_id for user
    const { data: allCompletedMats } = await supabase
      .from("user_progress")
      .select("material_id")
      .eq("user_id", user_id)
      .eq("status", "completed");
    
    const allCompletedIds = (allCompletedMats || []).map(p => p.material_id);
    
    const { data: externalIdsData } = await supabase
      .from("materials")
      .select("external_id")
      .in("id", allCompletedIds)
      .eq("source_api", "YouTube")
      .not("external_id", "is", null);

    const completedExternalIds = new Set((externalIdsData || []).map(m => m.external_id));

    let videos = [];
    let youtubeError = null;

    if (apiKeys.length === 0) {
      youtubeError = "no_api_key";
    } else {
      const topicsToSearch = [...new Set(levelMats.slice(0, 3).map((m) => m.topic))];
      const baseTopic = topicsToSearch[Math.floor(Math.random() * topicsToSearch.length)] || skill_level;
      
      let query = `javascript ${baseTopic} tutorial bahasa indonesia`;
      
      const refresh = req.query.refresh === 'true';
      if (refresh) {
        const randomKeywords = ["tutorial", "dasar", "tips", "tricks", "coding", "pemrograman", "belajar"];
        const randomWord = randomKeywords[Math.floor(Math.random() * randomKeywords.length)];
        query = `javascript ${baseTopic} ${randomWord} bahasa indonesia`;
      }

      // Try all available keys, stop when one succeeds
      const shuffledKeys = [...apiKeys].sort(() => Math.random() - 0.5);
      for (const key of shuffledKeys) {
        try {
          const ytRes = await axios.get("https://www.googleapis.com/youtube/v3/search", {
            params: {
              part: "snippet",
              q: query,
              type: "video",
              maxResults: 12, 
              relevanceLanguage: "id",
              key: key.trim(),
            },
            timeout: 5000,
          });

          let rawVideos = ytRes.data.items || [];
          
          // Shuffle results for variety
          rawVideos = rawVideos.sort(() => Math.random() - 0.5);

          videos = rawVideos
            .filter((v) => !completedExternalIds.has(v.id.videoId))
            .slice(0, 6) // Ensure we only return 6
            .map((v) => ({
              title: v.snippet.title,
              channel: v.snippet.channelTitle,
              url: `https://youtube.com/watch?v=${v.id.videoId}`,
              external_id: v.id.videoId,
              thumbnail: v.snippet.thumbnails.medium.url,
              published_at: v.snippet.publishedAt,
              level: skill_level,
              topic: topicsToSearch[0] || "Umum"
            }));
          youtubeError = null;
          break; // sukses, stop coba key lain
        } catch (ytErr) {
          if (ytErr.response?.status === 403) {
            console.error(`Quota exceeded for key: ${key.trim().substring(0, 10)}...`);
            youtubeError = "quota_exceeded";
            // lanjut coba key berikutnya
          } else {
            console.warn("YouTube API error:", ytErr.message);
            youtubeError = "api_error";
            break; // error lain, stop
          }
        }
      }
    }

    res.json({
      success: true,
      user_level: skill_level,
      learning_style,
      recommended_materials: recommended,
      youtube_videos: videos,
      youtube_error: youtubeError, // null = ok, "quota_exceeded" / "api_error" / "no_api_key"
      total_materials_at_level: levelMats.length,
      completed_at_level: levelMats.filter((m) => completedIds.has(m.id)).length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const getYoutubeMaterials = async (req, res) => {
  try {
    const { topic } = req.query;
    if (!topic) return res.status(400).json({ success: false, message: "Query 'topic' wajib diisi" });

    if (apiKeys.length === 0) {
      return res.status(503).json({ success: false, message: "YouTube API key tidak tersedia" });
    }

    let currentKey = getRandomApiKey();
    const response = await axios.get("https://www.googleapis.com/youtube/v3/search", {
      params: {
        part: "snippet",
        q: `javascript ${topic} tutorial`,
        type: "video",
        maxResults: 5,
        key: currentKey,
      },
      timeout: 8000,
    });

    const videos = response.data.items.map((video) => ({
      title: video.snippet.title,
      channel: video.snippet.channelTitle,
      url: `https://youtube.com/watch?v=${video.id.videoId}`,
      thumbnail: video.snippet.thumbnails.medium.url,
    }));

    res.json({ success: true, data: videos });
  } catch (error) {
    if (error.response?.status === 403) {
      console.error(`Quota exceeded for YouTube key: ${error.config?.params?.key?.substring(0, 10)}...`);
    }
    console.error("YouTube error:", error.response?.data || error.message);
    res.status(500).json({ success: false, message: "Gagal mengambil video YouTube" });
  }
};

export const getRelatedMaterials = async (req, res) => {
  try {
    const { topic, level } = req.query;

    let query = supabase.from("materials").select("id, title, external_id, source_api, format, level, topic, created_at, thumbnail");

    if (level) {
      query = query.eq("level", level);
    }
    if (topic) {
      query = query.or(`topic.ilike.%${topic}%,title.ilike.%${topic}%`);
    }

    const { data: result, error } = await query;
    if (error) throw error;

    res.json({ success: true, total: result.length, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const getNextMaterial = async (req, res) => {
  try {
    const { current_id } = req.params;
    const { user_id } = req.query;

    const { data: currentMaterial, error: currentError } = await supabase
      .from("materials")
      .select("*")
      .eq("id", current_id)
      .single();

    if (currentError || !currentMaterial) {
      return res.status(404).json({ success: false, message: "Material saat ini tidak ditemukan" });
    }

    let completedIds = new Set();
    if (user_id) {
      const { data: progressData } = await supabase
        .from("user_progress")
        .select("material_id")
        .eq("user_id", user_id)
        .eq("status", "completed");
      
      if (progressData) {
        completedIds = new Set(progressData.map(p => p.material_id));
      }
    }

    const { data: sameLevelMaterials, error: sameLevelError } = await supabase
      .from("materials")
      .select("*")
      .eq("level", currentMaterial.level)
      .gt("created_at", currentMaterial.created_at)
      .order("created_at", { ascending: true })
      .limit(10);

    if (sameLevelError) throw sameLevelError;

    const availableSameLevel = sameLevelMaterials?.filter(m => !completedIds.has(m.id)) || [];

    if (availableSameLevel.length > 0) {
      return res.json({ success: true, data: availableSameLevel[0] });
    }

    return res.json({ success: true, data: null, message: "Kamu sudah mempelajari semuanya di level ini" });

  } catch (error) {
    console.error("Error in getNextMaterial:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const getPreviousMaterial = async (req, res) => {
  try {
    const { current_id } = req.params;

    const { data: currentMaterial, error: currentError } = await supabase
      .from("materials")
      .select("*")
      .eq("id", current_id)
      .single();

    if (currentError || !currentMaterial) {
      return res.status(404).json({ success: false, message: "Material saat ini tidak ditemukan" });
    }

    const { data: previousMaterials, error: previousError } = await supabase
      .from("materials")
      .select("*")
      .eq("level", currentMaterial.level)
      .lt("created_at", currentMaterial.created_at)
      .order("created_at", { ascending: false })
      .limit(1);

    if (previousError) throw previousError;

    if (previousMaterials && previousMaterials.length > 0) {
      return res.json({ success: true, data: previousMaterials[0] });
    }

    return res.json({ success: true, data: null, message: "Ini adalah materi pertama" });

  } catch (error) {
    console.error("Error in getPreviousMaterial:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};