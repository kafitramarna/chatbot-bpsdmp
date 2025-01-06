import express from "express";
import cors from "cors";
import QARoute from "./routes/QARoute.js";
import { createServer } from "http";
import wsRoute from "./routes/Whatsapp.js";
import ContentConfigurationRoute from "./routes/ContentConfigurationRoute.js";
import ModelConfigurationRoute from "./routes/ModelConfigurationRoute.js";

const app = express();
const server = createServer(app);

wsRoute(server);

app.use(cors());
app.use(express.json());

app.use("/api", QARoute);
app.use("/api", ContentConfigurationRoute);
app.use("/api", ModelConfigurationRoute);

app.use((req, res) => {
  res.status(404).json({ message: "Endpoint tidak ditemukan." });
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
