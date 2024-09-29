import { supabaseClient } from "../lib/supabaseClient.js";

export async function get_all_training() {
  try {
    const { data, error } = await supabaseClient.from("documents").select("*");

    if (error) {
      console.error("Error fetching files from Supabase:", error);
      throw new Error("Failed to fetch training data from the database");
    }

    if (!data || !Array.isArray(data)) {
      console.error("Unexpected data format from Supabase:", data);
      throw new Error("Received invalid data format from the database");
    }

    return data.map((doc) => ({
      id: doc.id,
      name: doc.metadata,
      type: "file",
    }));
  } catch (error) {
    console.error("Error in get_all_training function:", error);
    throw error;
  }
}
