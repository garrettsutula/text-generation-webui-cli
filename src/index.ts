import WebSocket from "ws";
import { text2text } from './text2text';
import { writeFile } from "fs/promises";

const softPromptTemplate = `Today is 12th April 2023, and Alice is sitting in the Bodleian Library, Oxford. Alice is a smart, honest, helpful, harmless assistant to Bob. Alice has instant access to an online encyclopaedia containing all the facts about the world. Alice never says common misconceptions, outdated information, lies, fiction, myths, jokes, or memes.

Bob: __basePromptReplace__

Alice: 
`;
const promptTemplate = 'Make a bullet point list of the typical subjects in paintings by famous painter __promptReplace__.';
const promptReplaceArr = [
  'Vincent van Gogh',
  'Pablo Picasso',
  'Jackson Pollock'
];
const outputArr: string[] = [];
let count = 1;

async function processPromptReplaceList() {
  for (const promptReplace of promptReplaceArr) {
    const basePrompt = promptTemplate.replace('__promptReplace__', promptReplace);
    const prompt = softPromptTemplate.replace('__basePromptReplace__', basePrompt);
    console.log(`⚙️ (${count}/${promptReplaceArr.length}) - Starting: "${basePrompt}"`)
    const output = await text2text(prompt);
    outputArr.push(output.replace(prompt, ''));
    count += 1;
  }
  console.log(`✅ ${promptReplaceArr.length} prompts generated successfully!!!`);
  await writeFile('./output.txt', outputArr.join('\n\n\n'))
}

processPromptReplaceList();