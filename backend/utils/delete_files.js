import { supabaseClient } from "../lib/supabaseClient.js";

export async function delete_all_files(ids) {
  const { error } = await supabaseClient
    .from("documents")
    .delete()
    .in("id", ids);

  if (error) {
    console.error("Error deleting all files:", error);
    throw error;
  }
}

export async function delete_file(fileId) {
  const { error } = await supabaseClient
    .from("documents")
    .delete()
    .eq("id", fileId);

  if (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
}
