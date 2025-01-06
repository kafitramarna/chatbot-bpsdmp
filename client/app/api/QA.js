import { supabase } from "@/lib/supabase";

async function getQA() {
  const { error, data } = await supabase.from("list_qa").select();
  if (error) throw error;
  return data;
}

async function getQAOnly() {
  const { error, data } = await supabase
    .from("list_qa")
    .select("pertanyaan, jawaban");
  if (error) throw error;
  return data;
}

async function getQAById(id) {
  const { error, data } = await supabase.from("list_qa").select().eq("id", id);
  if (error) throw error;
  return data;
}

async function createQA(data) {
  const { error, data: newData } = await supabase.from("list_qa").insert(data);
  if (error) throw error;
  return newData;
}

async function updateQA(id, data) {
  const { error, data: updatedData } = await supabase
    .from("list_qa")
    .update(data)
    .eq("id", id);
  if (error) throw error;
  return updatedData;
}

async function deleteQA(id) {
  const { error } = await supabase.from("list_qa").delete().eq("id", id);
  if (error) throw error;
  return { message: `Data with ID ${id} has been deleted.` };
}

export { getQA, getQAOnly, getQAById, createQA, updateQA, deleteQA };
