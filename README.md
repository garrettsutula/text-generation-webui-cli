# Text Generation Web UI CLI Tool
Basic CLI tool for using the [Text Generation Web UI](https://github.com/oobabooga/text-generation-webui) websocket API.

## Getting Started

1. Clone this Repository.
2. Run `npm i` to install project dependencies.
3. Run `npm build` to build the project.
4. Run the script locally like `node ./dist/index.js --prompt "whatever"`

## CLI Args

`--prompt` - **Required** - pass the desired prompt

`--baseUrl` - **Optional** - the websocket "join" URL, default: "ws://192.168.0.29:7860/queue/join"

`--softPromptPath` - **Optional** - loads a template to wrap the prompt, must contain `__prompt__` which will be replaced with the prompt value.

`--promptReplacePath` - **Optional** - loads and parses a newline-limited list of values to generate output for each value. The prompt must contain the string `__replace__` which will be (logically) replaced with a value in the list for each generation.