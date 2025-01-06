"use client";
import { App } from "@/components/layouts/App";
import { useState, useEffect } from "react";
import {
  getContentConfiguration,
  updateContentConfiguration,
} from "../api/ContentConfiguration";

export default function ContentConfiguration() {
  const [data, setData] = useState({
    max_output_tokens: "",
    temperature: "",
    top_p: "",
    top_k: "",
    presence_penalty: "",
    frequency_penalty: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getContentConfiguration();
        console.log(response);
        setData(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateContentConfiguration(data);
      alert("Configuration updated successfully.");
    } catch (error) {
      console.error(error);
      setError("Failed to update configuration.");
    } finally {
      setIsLoading(false);
    }
  };

  const formFields = [
    {
      label: "Max Output Tokens",
      id: "max-output-tokens",
      name: "max_output_tokens",
      type: "number",
      min: "1",
      value: data.max_output_tokens,
      description:
        "The maximum number of tokens to include in a response candidate.",
    },
    {
      label: "Temperature",
      id: "temperature",
      name: "temperature",
      type: "number",
      step: "0.01",
      min: "0.0",
      max: "2.0",
      value: data.temperature,
      description:
        "Controls the randomness of the output. Range from 0.0 to 2.0.",
    },
    {
      label: "Top P",
      id: "top-p",
      name: "top_p",
      type: "number",
      step: "0.01",
      min: "0.0",
      max: "1.0",
      value: data.top_p,
      description:
        "The maximum cumulative probability of tokens to consider when sampling.",
    },
    {
      label: "Top K",
      id: "top-k",
      name: "top_k",
      type: "number",
      min: "1",
      value: data.top_k,
      description:
        "The maximum number of tokens to consider when sampling. Used in top-k sampling.",
    },
    {
      label: "Presence Penalty",
      id: "presence-penalty",
      name: "presence_penalty",
      type: "number",
      step: "0.01",
      value: data.presence_penalty,
      description:
        "A penalty applied to the next token's logprobs if the token has already been seen in the response.",
    },
    {
      label: "Frequency Penalty",
      id: "frequency-penalty",
      name: "frequency_penalty",
      type: "number",
      step: "0.01",
      value: data.frequency_penalty,
      description:
        "A penalty applied to the next token's logprobs, multiplied by the number of times each token has been used.",
    },
  ];

  return (
    <App>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
        Content Configuration
      </h1>
      <div className="mt-3">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {formFields.map((field) => (
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
                name={field.name}
                min={field.min}
                max={field.max}
                step={field.step}
                value={field.value}
                onChange={(e) => {
                  setData({ ...data, [field.name]: e.target.value });
                }}
                className="mt-2 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">{field.description}</p>
            </div>
          ))}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Submit
          </button>
        </form>
      </div>
    </App>
  );
}
