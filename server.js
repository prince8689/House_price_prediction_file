const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const fetch = require("node-fetch");
const { getAccessToken } = require("./config");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

app.post("/predict", async (req, res) => {
  try {
    const token = await getAccessToken();

    const fields = [
      "area_type", "availability", "location", "size",
      "society", "total_sqft", "bath", "balcony"
    ];

    const values = [fields.map(field => req.body[field])];

    const payload = {
      input_data: [{ fields, values }]
    };

    const response = await fetch(process.env.SCORING_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    console.log("✅ Watson Response:\n", JSON.stringify(result, null, 2));

    // Make sure predictions exist
    if (
      result &&
      result.predictions &&
      result.predictions[0] &&
      result.predictions[0].values &&
      result.predictions[0].values[0]
    ) {
      const prediction = result.predictions[0].values[0][0];
      res.json({ prediction });
    } else {
      res.status(500).json({ error: "Invalid prediction response from Watson." });
    }

  } catch (err) {
    console.error("❌ Prediction Error:", err.message);
    res.status(500).json({ error: "Server error during prediction." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
