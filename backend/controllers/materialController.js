import { supabase } from "../config/supabaseClient.js";

export const getMaterials = async (req, res) => {
  try {
    const { level, format, topic } = req.query;
    
    let query = supabase
      .from("materials")
      .select("id, title, external_id, source_api, format, level, topic, created_at, thumbnail")
      .order("created_at", { ascending: true }); 

    if (level) query = query.eq("level", level);          
    if (format) query = query.eq("format", format);        
    if (topic) query = query.ilike("topic", `%${topic}%`); 

    const { data: list, error } = await query;
    if (error) throw error;

    res.json({ success: true, total: list.length, data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const getMaterialById = async (req, res) => {
  try {
    const { data: material, error } = await supabase
      .from("materials")
      .select("*") 
      .eq("id", req.params.id)
      .single(); 

    if (error || !material)
      return res.status(404).json({ success: false, message: "Materi tidak ditemukan" });

    res.json({ success: true, data: material });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const getMaterialsByLevel = async (req, res) => {
  try {
    const { level } = req.params;
    const { user_id } = req.query;

    const valid = ["Pemula", "Menengah", "Mahir"];
    if (!valid.includes(level))
      return res.status(400).json({ success: false, message: "Level tidak valid" });

    const { data: levelMats, error } = await supabase
      .from("materials")
      .select("id, title, external_id, source_api, format, level, topic, created_at, thumbnail")
      .eq("level", level)
      .order("created_at", { ascending: true });

    if (error) throw error;

    let progressMap = {};
    if (user_id) {
      const { data } = await supabase
        .from("user_progress")
        .select("material_id, status, completed_at")
        .eq("user_id", user_id);
      
      if (data) data.forEach((p) => (progressMap[p.material_id] = p));
    }

    const result = levelMats.map((m) => ({
      ...m,
      progress: progressMap[m.id] || { status: "not_started", completed_at: null },
    }));

    res.json({ success: true, level, total: result.length, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


export const getTopics = async (req, res) => {
  try {
    const { data, error } = await supabase.from("materials").select("topic");
    if (error) throw error;

    const topics = [...new Set(data.map((m) => m.topic))];
    
    res.json({ success: true, data: topics });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
