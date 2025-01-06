import axios from "axios";

const getModelConfiguration = async () => {
  try {
    const response = await axios.get(
      "http://localhost:5000/api/get-model-configuration"
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const updateModelConfiguration = async (data) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/update-model-configuration",
      data
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export { getModelConfiguration, updateModelConfiguration };
