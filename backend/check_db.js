import { supabase } from "./config/supabaseClient.js";

async function checkEnums() {
    const { data: materials, error: mError } = await supabase.from('materials').select('format').limit(5);
    console.log("Materials formats:", materials);

    const { data: users, error: uError } = await supabase.from('users').select('learning_style').limit(5);
    console.log("Users learning styles:", users);
}

checkEnums();
