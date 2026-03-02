# OpenClaw POC

This project is a proof-of-concept for an AI agent that can control a user's machine. It uses the OpenAI API to understand user queries and execute commands on the local machine. The project is built with Node.js and Express.

## Installation

1.  Clone the repository.
2.  Install the dependencies using `npm install` or `pnpm install`.
3.  Create a `.env` file in the root directory and add your OpenAI API key as `OPENAI_API_KEY`.

    ```
    OPENAI_API_KEY=your_openai_api_key
    ```

## Usage

1.  Start the server:

    ```bash
    node index.js
    ```

2.  Send a POST request to `http://localhost:8000/doTask` with a JSON body containing the `query` you want the agent to execute.

    For example, using `curl`:

    ```bash
    curl -X POST http://localhost:8000/doTask -H "Content-Type: application/json" -d '{"query": "create a folder called testing"}'
    ```

The server will process the query with the AI agent, execute the command, and return the conversation history.
