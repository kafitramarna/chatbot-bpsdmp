import { supabase } from "@/lib/supabase";

async function getTunedModel() {
  const { error, data } = await supabase.from("tuned_model").select();
  if (error) throw error;
  return data;
}

async function createTunedModel(data) {
  const { error, data: newData } = await supabase
    .from("tuned_model")
    .insert(data);
  if (error) throw error;
  return newData;
}

async function getTunedModelById(id) {
  const { error, data } = await supabase
    .from("tuned_model")
    .select()
    .eq("id", id);
  if (error) throw error;
  return data[0];
}

export { getTunedModel, createTunedModel, getTunedModelById };
