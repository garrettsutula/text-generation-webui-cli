import { readFile, writeFile } from "fs/promises";
import yargs from 'yargs';

import { text2text, configureParameters, setModel, updateModelParameters } from './text2text';

const argv = yargs(process.argv.slice(2)).options({
  baseUrl: { type: 'string', default: 'ws://192.168.0.29:7860/queue/join' },
  prompt: { type: 'string', require: true },
  model: { type: 'string' },
  softPromptPath: { type: 'string' },
  promptReplacePath: { type: 'string' },
  max_new_tokens: { type: 'number', default: 200 },
  seed: { type: 'number', default: -1 },
  temperature: { type: 'number', default: 0.7 },
  top_p: { type: 'number', default: 0.1 },
  top_k: { type: 'number', default: 40 },
  typical_p: { type: 'number', default: 1 },
  repetition_penalty: { type: 'number', default: 1.18 },
  encoder_repetition_penalty: { type: 'number', default: 1 },
  no_repeat_ngram_size: { type: 'number', default: 0 },
  min_length: { type: 'number', default: 0 },
  do_sample: { type: 'boolean', default: true },
  penalty_alpha: { type: 'number', default: 0 },
  num_beams: { type: 'number', default: 1 },
  length_penalty: { type: 'number', default: 1 },
  early_stopping: { type: 'boolean', default: false },
  add_bos_token: { type: 'boolean', default: true },
  ban_bos_token: { type: 'boolean', default: false },
  truncation_length: { type: 'number', default: 2048 },
  custom_stopping_strings: { type: 'string', default: "" },
  gpu_memory_0: { type: 'number', default: 0 },
  cpu_memory: { type: 'number', default: 0 },
  auto_devices: { type: 'boolean', default: true },
  disk: { type: 'boolean', default: false },
  cpu: { type: 'boolean', default: false },
  bf16: { type: 'boolean', default: false },
  load_in_8bit: { type: 'boolean', default: false },
  wbits: { type: 'number', default: 4, choices: ["None", 1, 2, 3, 4, 8] },
  groupsize: { type: 'number', default: 128, choices: ["None", 32, 64, 128] },
  model_type: { type: 'string', default: "None", choices: ["None", "llama", "opt", "gptj"] },
  pre_layer: { type: 'number', default: 0 },
}).parseSync();

const outputArr: string[] = [];
let count = 1;

async function processPromptReplaceList() {
  let softPromptTemplate = '';
  let promptReplaceArr: string[] = [];

  // Load soft prompt if passed in args
  try {
    if (argv.softPromptPath) {
      softPromptTemplate = (await readFile(argv.softPromptPath)).toString();
    }
  } catch (e) {
    console.error(`Error loading soft prompt from path: ${argv.softPromptPath}`);
    console.error(e);
  }

  // Load prompt replace list if passed in args.
  try {
    if (argv.promptReplacePath) {
      promptReplaceArr = (await readFile(argv.promptReplacePath)).toString().split(/\r?\n/);
    }
  } catch (e) {
    console.error(`Error loading prompt replace from path: ${argv.promptReplacePath}`);
    console.error(e);
  }

  // Argument order is determined based upon the order they are defined in the gradio app config shown here: https://github.com/oobabooga/text-generation-webui/blob/28a11f57244f130f346b560cfd78bc0c47351e9a/server.py#L347-L406
  let paramOrder = [
    "max_new_tokens", "seed", "temperature", "top_p", "top_k", "typical_p",
    "repetition_penalty", "encoder_repetition_penalty", "no_repeat_ngram_size",
    "min_length", "do_sample", "penalty_alpha", "num_beams", "length_penalty",
    "early_stopping", "add_bos_token", "ban_bos_token", "truncation_length",
    "custom_stopping_strings"
  ];

  let params: Array<any> = [];
  for (let i = 0, il = paramOrder.length; i < il; i++) {
    params.push(argv[paramOrder[i]]);
  }

  await configureParameters(params, argv.baseUrl);

  if (argv.model) {
    let modelParamOrder = [
      "gpu_memory_0", "cpu_memory", "auto_devices", "disk", "cpu", "bf16",
      "load_in_8bit", "wbits", "groupsize", "model_type", "pre_layer",
    ];
    let modelParams: Array<any> = [];
    for (let j = 0, jl = modelParamOrder.length; j < jl; j++) {
      modelParams.push(argv[modelParamOrder[j]]);
    }
    // Set the model parameters prior to changing it as that's what triggers the update
    await updateModelParameters(modelParams, argv.baseUrl);
    await setModel(argv.model, argv.baseUrl);
  }

  if (promptReplaceArr.length) {
    for (const promptReplace of promptReplaceArr) {
      const basePrompt = argv.prompt.replace('__replace__', promptReplace);
      const prompt = softPromptTemplate ? softPromptTemplate.replace('__prompt__', basePrompt) : basePrompt;
      console.log(`⚙️ (${count}/${promptReplaceArr.length}) - Starting: "${basePrompt}"`)
      const output = await text2text(prompt, argv.baseUrl);
      outputArr.push(output.replace(prompt, ''));
      count += 1;
    }
    await writeFile('./output.txt', outputArr.join('\n\n\n'));
    console.log(`✅ ${promptReplaceArr.length} prompt outputs generated successfully!!!`);
  } else {
    const prompt = softPromptTemplate ? softPromptTemplate.replace('__basePromptReplace__', argv.prompt) : argv.prompt;
    const output = await text2text(prompt, argv.baseUrl);
    console.log(`✅ Prompt output generated successfully!!!`);
    console.log(output);
  }
}

processPromptReplaceList();