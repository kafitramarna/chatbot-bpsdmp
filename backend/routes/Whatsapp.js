import { WebSocketServer } from "ws";
import WhatsAppController from "../controllers/WhatsappController.js";

const wsRoute = (server) => {
  const wss = new WebSocketServer({ server });
  WhatsAppController.setupWebSocket(wss);
};

export default wsRoute;
