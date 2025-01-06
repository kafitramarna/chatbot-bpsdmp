import axios from "axios";
import fs from "fs/promises";

// Function to read and parse JSON file
async function readConfigFile(filePath) {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    throw new Error(`Error reading config file ${filePath}: ${err.message}`);
  }
}

async function generateContent(prompt) {
  try {
    // Read and parse both configuration files asynchronously
    const modelConfig = await readConfigFile("config/model_configuration.json");
    const contentConfig = await readConfigFile(
      "config/content_configuration.json"
    );

    const { model_name } = modelConfig;

    console.log(model_name);

    const {
      max_output_tokens,
      temperature,
      top_p,
      top_k,
      presence_penalty,
      frequency_penalty,
    } = contentConfig;

    console.log(contentConfig);
    // Send request to the API
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/${model_name}:generateContent?key=AIzaSyBbBNb1xKWeoFJsw-R0W-_JdMTu72hwOYo`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: contentConfig,
      }
    );
    console.log(response.data);

    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error during content generation:", error.message);
    throw new Error("Failed to generate content");
  }
}

export { generateContent };
