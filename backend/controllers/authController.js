import { supabase } from "../config/supabaseClient.js";

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (authError) {
      return res.status(400).json({ message: authError.message });
    }

    const userId = authData.user?.id;
    
    if (userId) {
      const { data: userData, error: dbError } = await supabase
        .from("users")
        .insert([
          {
            id: userId,
            name: name,
            email: email,
            skill_level: "Pemula",
            learning_style: "Visual",
            needs_reassessment: false
          },
        ])
        .select()
        .single();

      if (dbError) {
        console.error("Database insert error:", dbError);
        return res.status(400).json({ 
          message: "Failed to create user profile.",
          error: dbError
        });
      }

      return res.status(201).json({
        message: "User registered successfully",
        user: authData.user,
        profile: userData,
        session: authData.session, 
      });
    }

    res.status(201).json({
      message: "User registered successfully",
      user: authData.user,
      session: authData.session, 
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      return res.status(400).json({ message: authError.message });
    }

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", authData.user.id)
      .single(); 

    res.status(200).json({
      message: "Login successful",
      user: authData.user,           
      profile: userData || null,      
      session: authData.session,     
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const getUserProfile = async (req, res) => {
  const { id } = req.params;
  
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
