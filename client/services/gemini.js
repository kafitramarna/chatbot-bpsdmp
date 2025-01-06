import axios from "axios";
import { createTunedModel } from "@/app/api/TunedModel";

async function tuningModel(params) {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/tunedModels?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
      {
        ...params,
      }
    );
    const { name, metadata } = response.data;

    const saveData = {
      name: name,
      tuned_model: metadata?.tunedModel || null,
      is_active: 0,
    };
    const savedModel = await createTunedModel(saveData);
    return savedModel;
  } catch (error) {
    throw new Error("Failed to tune model");
  }
}

async function getTunedModelStatus(model_name) {
  try {
    const response = await axios.get(
      `https://generativelanguage.googleapis.com/v1beta/${model_name}?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export { tuningModel, getTunedModelStatus };
