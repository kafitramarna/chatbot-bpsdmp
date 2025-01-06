"use client";
import { App } from "@/components/layouts/App";
import { useState, useEffect } from "react";
import QRCode from "react-qr-code";

export default function Whatsapp() {
  const [status, setStatus] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Use boolean instead of number

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:5000");

    socket.onopen = () => {
      console.log("Connected to WebSocket");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "status") {
        setStatus(data.message);
      } else if (data.type === "qr") {
        setQrCode(data.qr);
      }
      setIsAuthenticated(data.status === 1);
    };

    socket.onerror = (error) => {
      console.log("WebSocket Error:", error);
    };

    socket.onclose = () => {
      console.log("Disconnected from WebSocket");
    };

    // Cleanup saat komponen dibersihkan
    return () => {
      socket.close();
    };
  }, []);

  const handleLogout = () => {
    const socket = new WebSocket("ws://localhost:5000");
    socket.onopen = () => {
      socket.send(JSON.stringify({ type: "logout" }));
    };
  };

  return (
    <App>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
        Connect Your WhatsApp Account
      </h1>
      <p className="mt-6 mb-6 text-lg text-gray-700">
        Seamlessly link your WhatsApp and get started with a few simple steps.
        Whether you're new to the platform or need help, this page has
        everything you need.
      </p>

      <div className="text-center">
        <p className="text-xl font-semibold mb-4">
          Status: {isAuthenticated ? "Connected" : "Disconnected"}
        </p>

        {!isAuthenticated && (
          <>
            {!qrCode ? (
              <p className="text-lg font-medium text-gray-500">
                Generating QR Code... Please give us a moment to set things up.
              </p>
            ) : (
              <div className="flex justify-center items-center mt-6">
                <QRCode
                  value={qrCode}
                  size={256}
                  className="border p-4 rounded-md shadow-md"
                />
              </div>
            )}
          </>
        )}

        {isAuthenticated && (
          <button
            onClick={handleLogout}
            className="mt-6 bg-red-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        )}
      </div>
    </App>
  );
}
