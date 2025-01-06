"use client";

import { App } from "@/components/layouts/App";
import { getTunedModelById } from "@/app/api/TunedModel";
import { useState, useEffect, useRef, use } from "react";
import { getTunedModelStatus } from "@/services/gemini";
import Chart from "chart.js/auto";

export default function TuningModelShow({ params }) {
  const { id } = use(params);

  const [tunedModel, setTunedModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [geminiData, setGeminiData] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const chartRef = useRef(null);

  // Fetch Gemini Data
  const fetchGeminiData = async (modelName) => {
    try {
      const status = await getTunedModelStatus(modelName);
      setGeminiData(status);
      if (status?.metadata?.completedPercent === 100) {
        setIsCompleted(true);
      }
    } catch (err) {
      console.error("Error fetching Gemini data:", err.message);
      setError(err.message || "Terjadi kesalahan saat mengambil data Gemini.");
    }
  };

  // Fetch Tuned Model Data on Initial Render
  useEffect(() => {
    async function fetchTunedModel() {
      try {
        setLoading(true);
        setError(null);
        const data = await getTunedModelById(id);
        setTunedModel(data);
        await fetchGeminiData(data.name); // Fetch Gemini data immediately
      } catch (err) {
        console.error("Error fetching tuned model:", err.message);
        setError(err.message || "Terjadi kesalahan saat mengambil data model.");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchTunedModel();
    }
  }, [id]);

  // Poll Gemini Data Every 10 Seconds (Stop if completed 100%)
  useEffect(() => {
    if (tunedModel && !isCompleted) {
      const interval = setInterval(() => {
        fetchGeminiData(tunedModel.name);
      }, 10000); // 10 seconds

      return () => clearInterval(interval); // Cleanup interval on unmount
    }
  }, [tunedModel, isCompleted]);

  // Render Chart when Gemini Data Updates
  useEffect(() => {
    if (geminiData?.response?.tuningTask?.snapshots) {
      const snapshot = geminiData.response.tuningTask.snapshots;
      const meanLossData = snapshot.map((item) => item.meanLoss);
      const labels = snapshot.map((_, index) => `Step ${index + 1}`);

      if (chartRef.current) {
        const ctx = chartRef.current.getContext("2d");

        // Destroy previous chart instance if it exists
        if (chartRef.current.chart) {
          chartRef.current.chart.destroy();
        }

        // Create new chart
        chartRef.current.chart = new Chart(ctx, {
          type: "line",
          data: {
            labels: labels,
            datasets: [
              {
                label: "Mean Loss",
                data: meanLossData,
                borderColor: "rgba(75,192,192,1)",
                backgroundColor: "rgba(75,192,192,0.2)",
                fill: true,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                title: {
                  display: true,
                  text: "Steps",
                },
              },
              y: {
                title: {
                  display: true,
                  text: "Mean Loss",
                },
                beginAtZero: true,
              },
            },
          },
        });
      }
    }
  }, [geminiData]);

  return (
    <App>
      <div>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 leading-tight mb-3">
          Tuning Model Status
        </h1>
      </div>
      <div>
        {loading ? (
          <p className="text-slate-700">Memuat data tuning model...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : tunedModel ? (
          <>
            <h2 className="text-2xl font-semibold text-slate-800">
              Model Name: {tunedModel.tuned_model}
            </h2>

            <div className="flex justify-between mb-1">
              <span
                className={`text-base font-medium  dark:text-white ${
                  isCompleted ? "text-green-600" : "text-blue-600"
                }`}
              >
                {isCompleted ? "Completed" : "Progress"}
              </span>
              <span
                className={`text-sm font-medium ${
                  isCompleted ? "text-green-600" : "text-blue-600"
                } dark:text-white`}
              >
                {geminiData?.metadata?.completedPercent || 0}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div
                className={`${
                  isCompleted ? "bg-green-600" : "bg-blue-600"
                } h-2.5 rounded-full`}
                style={{
                  width: `${geminiData?.metadata?.completedPercent || 0}%`,
                }}
              ></div>
            </div>

            {geminiData && geminiData.response?.tuningTask?.snapshots ? (
              <div style={{ height: "400px" }}>
                <canvas ref={chartRef}></canvas>
              </div>
            ) : (
              <p className="text-slate-700">
                Tidak ada snapshot tuning tersedia.
              </p>
            )}
          </>
        ) : (
          <p className="text-slate-700">Tidak ada data ditemukan.</p>
        )}
      </div>
    </App>
  );
}
