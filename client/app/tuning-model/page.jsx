"use client";
import { App } from "@/components/layouts/App";
import { getTunedModel } from "../api/TunedModel";
import {
  getModelConfiguration,
  updateModelConfiguration,
} from "../api/ModelConfiguration";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function TuningModel() {
  const [tunedModel, setTunedModel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modelConfiguration, setModelConfiguration] = useState(null);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [errorConfig, setErrorConfig] = useState(null);

  useEffect(() => {
    async function fetchTunedModel() {
      try {
        setLoading(true);
        const data = await getTunedModel();
        setTunedModel(data);
      } catch (err) {
        console.error("Error fetching tuned model:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchTunedModel();
  }, []);

  useEffect(() => {
    async function fetchModelConfiguration() {
      try {
        setLoadingConfig(true);
        const data = await getModelConfiguration();
        setModelConfiguration(data.data);
      } catch (err) {
        console.error("Error fetching model configuration:", err.message);
        setErrorConfig(err.message);
      } finally {
        setLoadingConfig(false);
      }
    }
    fetchModelConfiguration();
  }, []);

  // Handle updating model configuration
  async function handleModelConfigurationChange(tunedModelName) {
    try {
      const response = await updateModelConfiguration({
        model_name: tunedModelName,
      });
      setModelConfiguration(response.data);
    } catch (err) {
      console.error("Error updating model configuration:", err.message);
      setErrorConfig(err.message);
    }
  }

  return (
    <App>
      <div className="mb-3">
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 leading-tight mb-3">
          Tuning Model
        </h1>

        <Link
          href="/tuning-model/create"
          className="inline-flex items-center justify-center h-10 px-6 font-semibold text-white bg-black rounded-md hover:bg-gray-800 transition duration-200"
        >
          Tambah Model
        </Link>
      </div>

      <div>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : (
          <div>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    No
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Nama Model
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Tuned Model
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Created At
                  </th>
                  <th scope="col" className="px-6 py-3">
                    <span className="sr-only">Lihat Status</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {tunedModel.map((item, index) => (
                  <tr
                    key={index}
                    className={`${
                      item.tuned_model === modelConfiguration?.model_name
                        ? "bg-blue-100"
                        : "bg-white"
                    } border-b dark:bg-gray-800 dark:border-gray-700`}
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {index + 1}
                    </th>
                    <td className="px-6 py-4">{item.name}</td>
                    <td className="px-6 py-4">{item.tuned_model}</td>
                    <td className="px-6 py-4">
                      {new Date(
                        new Date(item.created_at).getTime() + 7 * 60 * 60 * 1000
                      ).toLocaleString("id-ID", {
                        timeZone: "Asia/Jakarta",
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}{" "}
                      WIB
                    </td>
                    <td className="px-6 py-4 flex flex-col items-center">
                      <Link
                        href={`/tuning-model/${item.id}`}
                        className="mb-2 p-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 text-center"
                      >
                        Lihat Status
                      </Link>
                      {item.tuned_model !== modelConfiguration?.model_name ? (
                        <button
                          className="mt-2 p-2 text-white bg-green-500 rounded-md hover:bg-green-600 text-center"
                          onClick={() =>
                            handleModelConfigurationChange(item.tuned_model)
                          }
                        >
                          Gunakan Model
                        </button>
                      ) : (
                        <p className="mt-2 p-2 text-white bg-gray-500 rounded-md hover:bg-gray-600 text-center">
                          Sedang digunakan
                        </p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </App>
  );
}
