import client from "../config/Whatsapp.js";
import { generateContent } from "../services/gemini.js";

class WhatsAppController {
  static setupWebSocket(wss) {
    // Event ketika client WhatsApp siap
    client.on("ready", () => {
      console.log("WhatsApp client is ready!");
      wss.clients.forEach((ws) => {
        ws.send(
          JSON.stringify({
            type: "status",
            message: "WhatsApp client is ready!",
            status: 1,
          })
        );
      });
    });

    // Event untuk menerima QR Code
    client.on("qr", (qr) => {
      console.log("QR RECEIVED", qr);
      wss.clients.forEach((ws) => {
        ws.send(JSON.stringify({ type: "qr", qr, status: 0 }));
      });
    });

    // Event ketika client diautentikasi
    client.on("authenticated", () => {
      console.log("Client authenticated!");
      wss.clients.forEach((ws) => {
        ws.send(
          JSON.stringify({
            type: "status",
            message: "Client authenticated!",
            status: 1,
          })
        );
      });
    });

    // Event ketika client terputus
    client.on("disconnected", (reason) => {
      console.log("Client disconnected:", reason);
      wss.clients.forEach((ws) => {
        ws.send(
          JSON.stringify({
            type: "status",
            message: `Client disconnected: ${reason}`,
            status: 0,
          })
        );
      });
    });

    client.on("message", async (message) => {
      try {
        console.log("Message received:", message.body);
        const reply = await generateContent(message.body);
        console.log("Reply:", reply);
        message.reply(reply);
      } catch (error) {
        console.error("Error generating content:", error);
        message.reply("Sorry, I couldn't generate a reply at the moment.");
      }
    });

    // Event pada WebSocket untuk menangani logout
    wss.on("connection", (ws) => {
      console.log("WebSocket connection established!");

      ws.on("message", async (message) => {
        const { type } = JSON.parse(message);

        // Tangani permintaan logout
        if (type === "logout") {
          try {
            await client.destroy();
            ws.send(
              JSON.stringify({
                type: "status",
                message: "Client logged out!",
                status: 0,
              })
            );
            console.log("Client logged out!");
          } catch (error) {
            console.error("Error during logout:", error);
            ws.send(
              JSON.stringify({ type: "error", message: "Failed to log out!" })
            );
          }
        }
      });
    });

    // Start WhatsApp client
    client.initialize();
  }
}

export default WhatsAppController;
