# Text Generation Web UI CLI Tool
Basic CLI tool for using the [Text Generation Web UI](https://github.com/oobabooga/text-generation-webui) websocket API.

## Getting Started

1. Clone this Repository.
2. Run `npm i` to install project dependencies.
3. Run `npm run build` to build the project.
4. Run the script locally like `node ./dist/index.js --prompt "whatever"`

## CLI Args

| Flag                                                        | Default                          | Description |
|-------------------------------------------------------------|----------------------------------|-------------|
| `--prompt PROMPT`                                           |                                  | Pass the desired prompt **Required** |
| `--model MODEL`                                             |                                  | Change to the specified model prior to passing the prompt |
| `--baseUrl BASE_URL`                                        | `ws://127.0.0.1:7860/queue/join` | the websocket "join" URL |
| `--softPromptPath SOFT_PROMPT_PATH`                         |                                  | Loads a template to wrap the prompt, must contain `__prompt__` which will be replaced with the prompt value |
| `--promptReplacePath PROMPT_REPLACE_PATH`                   |                                  | Loads and parses a newline-limited list of values to generate output for each value. The prompt must contain the string `__replace__` which will be (logically) replaced with a value in the list for each generation |
| `--max_new_tokens MAX_NEW_TOKENS`                           | `200`                            | See: [HuggingFace Generation Config](https://huggingface.co/docs/transformers/main_classes/text_generation#transformers.GenerationConfig) |
| `--seed SEED`                                               | `-1`                             | See: [HuggingFace Generation Config](https://huggingface.co/docs/transformers/main_classes/text_generation#transformers.GenerationConfig) |
| `--temperature TEMPERATURE`                                 | `0.7`                            | See: [HuggingFace Generation Config](https://huggingface.co/docs/transformers/main_classes/text_generation#transformers.GenerationConfig) |
| `--top-p TOP_P`                                             | `40`                             | See: [HuggingFace Generation Config](https://huggingface.co/docs/transformers/main_classes/text_generation#transformers.GenerationConfig) |
| `--top-k TOP_K`                                             | `0.1`                            | See: [HuggingFace Generation Config](https://huggingface.co/docs/transformers/main_classes/text_generation#transformers.GenerationConfig) |
| `--typical-p TYPICAL_P`                                     | `1`                              | See: [HuggingFace Generation Config](https://huggingface.co/docs/transformers/main_classes/text_generation#transformers.GenerationConfig) |
| `--repetition_penalty REPETITION_PENALTY`                   | `1.18`                           | See: [HuggingFace Generation Config](https://huggingface.co/docs/transformers/main_classes/text_generation#transformers.GenerationConfig) |
| `--encoder_repetitition_penalty ENCODER_REPETITION_PENALTY` | `1`                              | See: [HuggingFace Generation Config](https://huggingface.co/docs/transformers/main_classes/text_generation#transformers.GenerationConfig) |
| `--no_repeat_ngram_size NO_REPEAT_NGRAM_SIZE`               | `1`                              | See: [HuggingFace Generation Config](https://huggingface.co/docs/transformers/main_classes/text_generation#transformers.GenerationConfig) |
| `--min_length MIN_LENGTH`                                   | `0`                              | See: [HuggingFace Generation Config](https://huggingface.co/docs/transformers/main_classes/text_generation#transformers.GenerationConfig) |
| `--do_sample true|false`                                    | `true`                           | See: [HuggingFace Generation Config](https://huggingface.co/docs/transformers/main_classes/text_generation#transformers.GenerationConfig) |
| `--penalty_alpha PENALTY_ALPHA`                             | `0`                              | See: [HuggingFace Generation Config](https://huggingface.co/docs/transformers/main_classes/text_generation#transformers.GenerationConfig) |
| `--num_beams NUM_BEAMS`                                     | `1`                              | See: [HuggingFace Generation Config](https://huggingface.co/docs/transformers/main_classes/text_generation#transformers.GenerationConfig) |
| `--length_penalty LENGTH_PENALTY`                           | `1`                              | See: [HuggingFace Generation Config](https://huggingface.co/docs/transformers/main_classes/text_generation#transformers.GenerationConfig) |
| `--early_stopping true|false`                               | `false`                          | See: [HuggingFace Generation Config](https://huggingface.co/docs/transformers/main_classes/text_generation#transformers.GenerationConfig) |
| `--add_bos_token true|false`                                | `true`                           | See: [HuggingFace Generation Config](https://huggingface.co/docs/transformers/main_classes/text_generation#transformers.GenerationConfig) |
| `--ban_bos_token true|false`                                | `false`                          | See: [HuggingFace Generation Config](https://huggingface.co/docs/transformers/main_classes/text_generation#transformers.GenerationConfig) |
| `--truncation_length TRUNCATION_LENGTH`                     | `2048`                           | See: [HuggingFace Generation Config](https://huggingface.co/docs/transformers/main_classes/text_generation#transformers.GenerationConfig) |
| `--custom_stopping_strings CUSTOM_STOPPING_STRINGS`         | `""`                             | See: [HuggingFace Generation Config](https://huggingface.co/docs/transformers/main_classes/text_generation#transformers.GenerationConfig) |
| `--gpu_memory_0 0...MAX_VRAM`                               | `0`                             | See: [HuggingFace Generation Config](https://huggingface.co/docs/transformers/main_classes/text_generation#transformers.GenerationConfig) |
| `--cpu_memory 0...MAX_CPU`                                  | `""`                             | See: [HuggingFace Generation Config](https://huggingface.co/docs/transformers/main_classes/text_generation#transformers.GenerationConfig) |
| `--auto_devices true|false`                                 | `""`                             | See: [HuggingFace Generation Config](https://huggingface.co/docs/transformers/main_classes/text_generation#transformers.GenerationConfig) |
| `--disk true|false`                                         | `""`                             | See: [HuggingFace Generation Config](https://huggingface.co/docs/transformers/main_classes/text_generation#transformers.GenerationConfig) |
| `--cpu true|false`                                          | `""`                             | See: [HuggingFace Generation Config](https://huggingface.co/docs/transformers/main_classes/text_generation#transformers.GenerationConfig) |
| `--bf16 true|false`                                         | `""`                             | See: [HuggingFace Generation Config](https://huggingface.co/docs/transformers/main_classes/text_generation#transformers.GenerationConfig) |
| `--load_in_8bit true|false`                                 | `""`                             | See: [HuggingFace Generation Config](https://huggingface.co/docs/transformers/main_classes/text_generation#transformers.GenerationConfig) |
| `--wbits 1|2|3|4|8`                                         | `""`                             | See: [HuggingFace Generation Config](https://huggingface.co/docs/transformers/main_classes/text_generation#transformers.GenerationConfig) |
| `--groupsize 32|64|128`                                     | `""`                             | See: [HuggingFace Generation Config](https://huggingface.co/docs/transformers/main_classes/text_generation#transformers.GenerationConfig) |
| `--model_type None|llama|opt|gptj`                          | `""`                             | See: [HuggingFace Generation Config](https://huggingface.co/docs/transformers/main_classes/text_generation#transformers.GenerationConfig) |
| `--pre_layer 0...100`                                       | `""`                             | See: [HuggingFace Generation Config](https://huggingface.co/docs/transformers/main_classes/text_generation#transformers.GenerationConfig) |