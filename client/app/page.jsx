"use client";

import { useState, useEffect } from "react";
import { App } from "@/components/layouts/App";
import { getQA, deleteQA } from "./api/QA";

export default function Home() {
  const [qa, setQA] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchQA() {
      try {
        setLoading(true);
        const data = await getQA();
        setQA(data);
      } catch (err) {
        console.error("Error fetching QA:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchQA();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteQA(id);
      setQA((prevQA) => prevQA.filter((item) => item.id !== id));
      alert("Item deleted successfully.");
    } catch (err) {
      console.error("Error deleting QA:", err.message);
      setError("Failed to delete item.");
    }
  };

  return (
    <App>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
        List QA
      </h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  No
                </th>
                <th scope="col" className="px-6 py-3">
                  Pertanyaan
                </th>
                <th scope="col" className="px-6 py-3">
                  Jawaban
                </th>
                <th scope="col" className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {qa.map((item, index) => (
                <tr
                  key={item.id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4">{item.pertanyaan}</td>
                  <td className="px-6 py-4">{item.jawaban}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </App>
  );
}
