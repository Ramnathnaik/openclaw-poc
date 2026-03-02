/**
 * @file This file contains the core logic for an AI agent that can execute commands on the user's machine.
 * @summary The agent uses the OpenAI API to understand user queries and then executes commands using `execSync`.
 * @requires openai
 * @requires node:child_process
 * @requires dotenv
 * @requires zod
 */

import OpenAI from "openai";
import { execSync } from "node:child_process";
import "dotenv/config";
import z from "zod";
import { zodTextFormat } from "openai/helpers/zod";

/**
 * The path to the bash executable.
 * @type {string}
 */
const bashPath = "C:\\Program Files\\Git\\bin\\bash.exe";

/**
 * The OpenAI client instance.
 * @type {OpenAI}
 */
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Executes a shell command and returns the output.
 * @param {string} cmd - The command to execute.
 * @returns {string} The output of the command.
 */
const executeCommand = (cmd = "") => {
  const result = execSync(cmd, {
    shell: bashPath,
    encoding: "utf-8",
  });
  return result.toString();
};

/**
 * A mapping of function names to their implementations.
 * @type {Object.<string, Function>}
 */
const functionMapping = {
  executeCommand,
};

/**
 * The system prompt that provides instructions to the AI model.
 * @type {string}
 */
const SYSTEM_PROMPT = `You are an expert AI Assistant that is expert in controlling the user's machine.
Analyze the user's query carefully and plan the step on what needs to be done.
Then based on the user query you can create commands and then call the tool to run that command and execute on the user's machine.

Available Tools:
- executeCommand(command: string): Output from the command

You can use executeCommand tool to execute any command on user's machine
`;

/**
 * The Zod schema for the expected output from the AI model.
 * @type {z.ZodObject}
 */
const outputSchema = z.object({
  type: z.enum(["tool_call", "text"]).describe("What kind of response this is"),
  finalOutput: z.boolean().describe("If this is the last message of the chat"),
  text_content: z
    .string()
    .optional()
    .nullable()
    .describe("text content if the type is text"),
  tool_call: z
    .object({
      tool_name: z.string().describe("name of the tool"),
      params: z.array(z.string()),
    })
    .optional()
    .nullable()
    .describe("The param to call the tool if the type is tool_call"),
});

/**
 * The array that holds the conversation history.
 * @type {Array<Object>}
 */
const messages = [
  {
    role: "system",
    content: SYSTEM_PROMPT,
  },
];

/**
 * The main function that orchestrates the agent's logic.
 * It takes a user query, interacts with the OpenAI API, and handles tool calls and text responses.
 * @param {string} query - The user's query.
 * @returns {Promise<Array<Object>>} The conversation history.
 */
export async function run(query = "") {
  messages.push({
    role: "user",
    content: query,
  });
  while (true) {
    const result = await client.responses.parse({
      model: "gpt-5-codex",
      input: messages,
      text: {
        format: zodTextFormat(outputSchema, "output"),
      },
    });

    console.log(`Agent says: ${JSON.stringify(result.output_parsed, null, 2)}`);

    const parsedOutput = result.output_parsed;
    messages.push({
      role: "assistant",
      content: result.output_text,
    });

    switch (parsedOutput.type) {
      case "tool_call":
        {
          if (parsedOutput.tool_call) {
            const { params, tool_name } = parsedOutput.tool_call;
            console.log(`Tool call: ${tool_name}: ${params}`);

            if (functionMapping[tool_name]) {
              try {
                const toolOutput = functionMapping[tool_name](...params);
                console.log(`Tool output (${tool_name})`, toolOutput);
                messages.push({
                  role: "developer",
                  content: JSON.stringify({
                    tool_name,
                    params,
                    tool_output: toolOutput,
                  }),
                });
              } catch (error) {
                messages.push({
                  role: "developer",
                  content: JSON.stringify({
                    tool_name,
                    params,
                    error: JSON.stringify(error),
                  }),
                });
              }
            }
          }
        }
        break;
      case "text":
        {
          console.log(`Text: ${parsedOutput.text_content}`);
        }
        break;
    }

    if (parsedOutput.finalOutput) {
      return messages;
    }
  }
}

// run("create a folder called testing");
