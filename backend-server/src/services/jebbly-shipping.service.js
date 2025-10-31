const axios = require("axios");

const createShipment = async (data) => {
  const url = "https://demo.jeebly.com/customer/create_shipment";
  const headers = {
    "X-API-KEY": "XXXXXXXXXXXX", // Replace with your actual X-API-KEY
    client_key: "XXXXXXXXXXXX", // Replace with your actual client_key
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.post(url, data, { headers });
    return response.data; // Return the response from the API
  } catch (error) {
    console.error(
      "Error creating shipment:",
      error.response ? error.response.data : error.message
    );
    throw error; // You can throw or handle the error as you need
  }
};

const cancelShipment = async (reference_number) => {
  const url = "https://demo.jeebly.com/customer/cancel_shipment";
  const headers = {
    "X-API-KEY": "XXXXXXXXXXXX", // Replace with your actual X-API-KEY
    client_key: "XXXXXXXXXXXX", // Replace with your actual client_key
    "Content-Type": "application/json",
  };

  const data = { reference_number };

  try {
    const response = await axios.post(url, data, { headers });
    return response.data; // Return the response from the API
  } catch (error) {
    console.error(
      "Error canceling shipment:",
      error.response ? error.response.data : error.message
    );
    throw error; // You can throw or handle the error as you need
  }
};

module.exports = {
  createShipment,
  cancelShipment,
};
