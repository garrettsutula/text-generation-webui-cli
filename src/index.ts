import WebSocket from "ws";
import { text2text } from './text2text';
import { writeFile } from "fs/promises";

const softPromptTemplate = `Today is 1st March 2023, and Alice is sitting in the Bodleian Library, Oxford. Alice is a smart, honest, helpful, harmless assistant to Bob. Alice has instant access to an online encyclopaedia containing all the facts about the world. Alice never says common misconceptions, outdated information, lies, fiction, myths, jokes, or memes.

Bob: __basePromptReplace__

Alice: 
`;
const promptTemplate = 'Make a comma-separated list of the typical subjects in photos by famous photographer __promptReplace__. Be concise but descriptive.';
const promptReplaceArr = [
  'Ansel Adams'
];
const outputArr: string[] = [];

async function processPromptReplaceList() {
  for (const promptReplace of promptReplaceArr) {
    console.log(`Sending prompt for: ${promptReplace}`)
    const basePrompt = promptTemplate.replace('__promptReplace__', promptReplace);
    const prompt = softPromptTemplate.replace('__basePromptReplace__', basePrompt);
    const output = await text2text(prompt);
    outputArr.push(output.replace(prompt, ''));
  }
  console.log(`${promptReplaceArr.length} prompts generated successfully!!!`);
  await writeFile('./output.txt', outputArr.join('\n\n\n'))
}

processPromptReplaceList();