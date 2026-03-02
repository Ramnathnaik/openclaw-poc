/**
 * @file This file sets up an Express server to handle requests for the AI agent.
 * @summary The server exposes a `/doTask` endpoint that takes a user query, passes it to the agent, and returns the conversation history.
 * @requires express
 * @requires ./agent.js
 */

import express from "express";
import { run } from "./agent.js";

/**
 * The Express application instance.
 * @type {express.Application}
 */
const app = express();

/**
 * The port the server will run on.
 * @type {number}
 */
const PORT = process.env.PORT || 8000;

// Middleware to parse JSON bodies
app.use(express.json());

/**
 * @route GET /
 * @description A simple route to check if the server is running.
 * @returns {string} "Hello, World!"
 */
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

/**
 * @route POST /doTask
 * @description The main endpoint that receives a user query, passes it to the AI agent, and returns the conversation history.
 * @param {object} req.body - The request body.
 * @param {string} req.body.query - The user's query.
 * @returns {object} The conversation history.
 */
app.post("/doTask", async (req, res) => {
  const { query } = req.body;
  const messages = await run(query);
  res.json({ messages });
});

/**
 * Starts the Express server.
 */
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
