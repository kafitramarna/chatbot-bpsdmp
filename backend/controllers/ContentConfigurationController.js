import fs from "fs";

class ContentConfigurationController {
  // GET: Ambil konfigurasi konten
  static async getContentConfiguration(req, res) {
    fs.readFile("config/content_configuration.json", "utf8", (err, data) => {
      if (err) {
        console.error("Error reading config file:", err);
        return res.status(500).json({
          status: "error",
          code: 500,
          message: "Error reading configuration file",
          data: null,
        });
      }

      const config = JSON.parse(data);
      return res.status(200).json({
        status: "success",
        code: 200,
        message: "Content configuration fetched successfully",
        data: config,
      });
    });
  }

  // POST: Update konfigurasi konten
  static async updateContentConfiguration(req, res) {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "No data provided to update",
        data: null,
      });
    }

    fs.writeFile(
      "config/content_configuration.json",
      JSON.stringify(req.body, null, 2),
      (err) => {
        if (err) {
          console.error("Error updating config file:", err);
          return res.status(500).json({
            status: "error",
            code: 500,
            message: "Error updating configuration file",
            data: null,
          });
        }

        return res.status(200).json({
          status: "success",
          code: 200,
          message: "Content configuration updated successfully",
          data: req.body,
        });
      }
    );
  }
}

export default ContentConfigurationController;
