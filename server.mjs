import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config(); // Load environment variables

const app = express(); // Initialize the Express application
const apiKey = process.env.NY_TIMES_API_KEY; // NY Times API key

// Enable CORS
app.use(
  cors({
    origin: "http://localhost:3001", // Replace with your frontend's URL if different
  })
);

// Route to search articles by keyword
app.get("/api/search", async (req, res) => {
  const { keyword } = req.query;

  if (!keyword) {
    return res.status(400).json({ error: "Keyword parameter is required." });
  }

  try {
    const response = await fetch(
      `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${keyword}&api-key=${apiKey}`
    );
    const data = await response.json();

    if (!data.response || !data.response.docs || data.response.docs.length === 0) {
      return res.status(404).json({ error: "No articles found." });
    }

    res.json(data); // Send the data back to the frontend
  } catch (error) {
    console.error("Error fetching data from NY Times API:", error);
    res.status(500).json({ error: "Error fetching data from NY Times API." });
  }
});

// Start the Express server
app.listen(3000, () => console.log("Server is running on port 3000"));
