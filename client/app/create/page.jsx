"use client";
import { useState } from "react";
import { App } from "@/components/layouts/App";
import { createQA } from "../api/QA";

export default function Create() {
  const [formData, setFormData] = useState({
    pertanyaan: "",
    jawaban: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    try {
      const response = await createQA(formData);
      console.log("Response:", response);
      alert("Pertanyaan dan jawaban berhasil ditambahkan.");
    } catch (err) {
      console.error("Error:", err);
      alert("Terjadi kesalahan saat menambahkan pertanyaan dan jawaban.");
    } finally {
      window.location.href = "/";
    }
  };

  const inputFields = [
    {
      id: "pertanyaan",
      label: "Pertanyaan",
      type: "text",
      extraProps: { required: true },
    },
    {
      id: "jawaban",
      label: "Jawaban",
      type: "text",
      extraProps: { required: true },
    },
  ];

  return (
    <App>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
        Tambah Pertanyaan dan Jawaban
      </h1>
      <div className="mb-3">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {inputFields.map((field) => (
            <div key={field.id}>
              <label
                htmlFor={field.id}
                className="block text-sm font-medium text-gray-700"
              >
                {field.label}
              </label>
              <input
                type={field.type}
                id={field.id}
                name={field.id}
                value={formData[field.id]}
                onChange={handleChange}
                className="mt-2 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                {...field.extraProps}
              />
              <p className="text-xs text-gray-500 mt-1">{field.description}</p>
            </div>
          ))}
          <div className="mt-6">
            <button
              className="h-10 px-6 font-semibold rounded-md bg-black text-white"
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </App>
  );
}
