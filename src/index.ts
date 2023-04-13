import { readFile, writeFile } from "fs/promises";
import yargs from 'yargs';

import { text2text } from './text2text';

const argv = yargs(process.argv.slice(2)).options({
  baseUrl: {type: 'string', default: 'ws://192.168.0.29:7860/queue/join'},
  prompt: {type: 'string', require: true},
  softPromptPath: {type: 'string'},
  promptReplacePath: {type: 'string'},
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