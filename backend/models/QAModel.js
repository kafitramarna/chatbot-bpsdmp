import { supabase } from "../config/Database.js";

class QAModel {
  async getQA() {
    const { data, error } = await supabase.from("list_qa").select("*");
    if (error) {
      throw error;
    }
    return data;
  }

  async getQAById(id) {
    const { data, error } = await supabase
      .from("list_qa")
      .select("*")
      .eq("id", id);
    if (error) {
      throw new Error("Gagal mengambil data QA berdasarkan ID.");
    }
    return data;
  }

  async createQA(data) {
    const { data: newData, error } = await supabase
      .from("list_qa")
      .insert(data)
      .select("*");
    if (error) {
      throw new Error("Gagal menambahkan data QA.");
    }
    return newData;
  }

  async updateQA(id, data) {
    const { data: updatedData, error } = await supabase
      .from("list_qa")
      .update(data)
      .eq("id", id)
      .select("*");
    if (error) {
      throw new Error("Gagal memperbarui data QA.");
    }
    return updatedData;
  }

  async deleteQA(id) {
    const { error } = await supabase.from("list_qa").delete().eq("id", id);
    if (error) {
      throw new Error("Gagal menghapus data QA.");
    }
    return { message: `Data dengan ID ${id} berhasil dihapus.` };
  }
}

export default new QAModel(); // Ekspor instance langsung
