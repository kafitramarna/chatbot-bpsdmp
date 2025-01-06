"use client";

import { App } from "@/components/layouts/App";
import { useState, useEffect } from "react";
import { getQAOnly } from "@/app/api/QA";
import { tuningModel } from "@/services/gemini";

// Constants for parameter descriptions
const PARAMETER_DESCRIPTIONS = {
  display_name: "A name to help you identify the model.",
  epoch_count: "A full training pass over the entire training set.",
  batch_size: "The number of examples in one training iteration.",
  learning_rate: "Adjusts the model parameters on each iteration.",
  temperature:
    "Controls creativity. Higher values (close to 1.0) produce more varied responses.",
  top_p:
    "Nucleus sampling. Selects tokens with cumulative probability ≥ this value.",
  top_k: "Top-k sampling. Considers the top-k most probable tokens.",
};

export default function TuningModelCreate() {
  const [qa, setQA] = useState([]);
  const [data, setData] = useState({
    display_name: "My Tuned Model",
    base_model: "models/gemini-1.5-flash-001-tuning",
    tuning_task: {
      hyperparameters: {
        epoch_count: 5,
        learning_rate: 0.001,
        batch_size: 4,
      },
      training_data: { examples: { examples: [] } },
    },
    temperature: 1,
    top_p: 0.95,
    top_k: 64,
  });

  // Fetch QA data and update training examples
  useEffect(() => {
    const fetchQA = async () => {
      try {
        const fetchedQA = await getQAOnly();
        setQA(fetchedQA);
        setData((prevData) => ({
          ...prevData,
          tuning_task: {
            ...prevData.tuning_task,
            training_data: {
              examples: {
                examples: fetchedQA.map((qa) => ({
                  text_input: qa.pertanyaan,
                  output: qa.jawaban,
                })),
              },
            },
          },
        }));
      } catch (err) {
        console.error("Error fetching QA:", err.message);
      }
    };
    fetchQA();
  }, []);

  // Handle input changes dynamically
  const handleChange = (e, field, subfield) => {
    const { name, value } = e.target;
    if (field && subfield) {
      setData((prevData) => ({
        ...prevData,
        [field]: {
          ...prevData[field],
          [subfield]: value,
        },
      }));
    } else {
      setData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Submitting tuning model data:", data);
      const response = await tuningModel(data);
      if (response) {
        console.log("Model tuned successfully:", response);
      } else {
        console.log("Failed to tune model.");
      }
    } catch (error) {
      console.error("Error submitting tuning model:", error);
    } finally {
      window.location.href = "/tuning-model";
    }
  };

  // Input field configuration
  const inputFields = [
    {
      id: "display_name",
      label: "Display Name",
      type: "text",
      value: data.display_name,
      description: PARAMETER_DESCRIPTIONS.display_name,
      onChange: (e) => handleChange(e),
      extraProps: { required: true },
    },
    {
      id: "epoch_count",
      label: "Epochs",
      type: "number",
      value: data.tuning_task.hyperparameters.epoch_count,
      description: PARAMETER_DESCRIPTIONS.epoch_count,
      onChange: (e) =>
        handleChange(e, "tuning_task", "hyperparameters", "epoch_count"),
      extraProps: { min: 1, required: true },
    },
    {
      id: "batch_size",
      label: "Batch Size",
      type: "number",
      value: data.tuning_task.hyperparameters.batch_size,
      description: PARAMETER_DESCRIPTIONS.batch_size,
      onChange: (e) =>
        handleChange(e, "tuning_task", "hyperparameters", "batch_size"),
      extraProps: { min: 1, required: true },
    },
    {
      id: "learning_rate",
      label: "Learning Rate",
      type: "number",
      value: data.tuning_task.hyperparameters.learning_rate,
      description: PARAMETER_DESCRIPTIONS.learning_rate,
      onChange: (e) =>
        handleChange(e, "tuning_task", "hyperparameters", "learning_rate"),
      extraProps: { step: 0.0001, required: true },
    },
    {
      id: "temperature",
      label: "Temperature",
      type: "number",
      value: data.temperature,
      description: PARAMETER_DESCRIPTIONS.temperature,
      onChange: handleChange,
      extraProps: { step: 0.01, min: 0, max: 1, required: true },
    },
    {
      id: "top_p",
      label: "TopP",
      type: "number",
      value: data.top_p,
      description: PARAMETER_DESCRIPTIONS.top_p,
      onChange: handleChange,
      extraProps: { step: 0.01, min: 0, max: 1, required: true },
    },
    {
      id: "top_k",
      label: "TopK",
      type: "number",
      value: data.top_k,
      description: PARAMETER_DESCRIPTIONS.top_k,
      onChange: handleChange,
      extraProps: { min: 1, required: true },
    },
  ];

  return (
    <App>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
        Create Tuning Model
      </h1>
      <div className="mt-6 space-y-6">
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
                value={field.value}
                onChange={field.onChange}
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
