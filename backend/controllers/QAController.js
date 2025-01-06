import QAModel from "../models/QAModel.js";

class QAController {
  // GET: Ambil semua data QA
  static async getAllQA(req, res) {
    try {
      const qa = await QAModel.getQA();
      res.status(200).json({ message: "Data QA berhasil diambil.", data: qa });
    } catch (error) {
      res.status(500).json({ message: error.message, status: 500 });
    }
  }

  // GET: Ambil data QA berdasarkan ID
  static async getQAById(req, res) {
    try {
      const { id } = req.params;
      const qa = await QAModel.getQAById(id);
      if (!qa || qa.length === 0) {
        return res.status(404).json({ message: "Data tidak ditemukan." });
      }
      res
        .status(200)
        .json({ message: "Data QA berhasil diambil.", data: qa[0] });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // POST: Tambahkan data QA baru
  static async createQA(req, res) {
    try {
      const newQA = await QAModel.createQA(req.body);
      res
        .status(201)
        .json({ message: "Data QA berhasil ditambahkan.", data: newQA });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // PUT: Update data QA berdasarkan ID
  static async updateQA(req, res) {
    try {
      const { id } = req.params;
      const updatedQA = await QAModel.updateQA(id, req.body);
      if (!updatedQA || updatedQA.length === 0) {
        return res
          .status(404)
          .json({ message: "Data tidak ditemukan untuk diupdate." });
      }
      res
        .status(200)
        .json({ message: "Data QA berhasil diupdate.", data: updatedQA });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // DELETE: Hapus data QA berdasarkan ID
  static async deleteQA(req, res) {
    try {
      const { id } = req.params;
      const result = await QAModel.deleteQA(id);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default QAController;
