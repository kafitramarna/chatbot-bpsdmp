import axios from "axios";

const getContentConfiguration = async () => {
  try {
    const response = await axios.get(
      "http://localhost:5000/api/get-content-configuration"
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const updateContentConfiguration = async (data) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/update-content-configuration",
      data
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export { getContentConfiguration, updateContentConfiguration };
