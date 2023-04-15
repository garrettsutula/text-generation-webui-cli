import { WebSocket } from "ws";
const sessionHash = Math.floor(Math.random() * (2 ** 31 - 1) + 1);
const paramsFnIndex = 6;
const replyFnIndex = 7;
const modelParamsFnIndex = 19;
const modelFnIndex = 20;

//{"fn_index":19,"data":[0,true,false,false,false,false,4,128,"None",0,0],"event_data":null,"session_hash":"gfdzf1d5gss"}
function doConversation(data: Array<any>, baseUrl: string, fnIndex: number, eventData: any = null): Promise<string> {
  const queue = new WebSocket(baseUrl);

  return new Promise((resolve, reject) => {
    queue.on('error', (err) => {
      console.error(err);
      reject(err);
    });

    queue.on('message', (dataStr) => {
      const message = JSON.parse(dataStr.toString());
      switch (message.msg) {
        case 'send_hash':
          queue.send(JSON.stringify({ fn_index: fnIndex, session_hash: sessionHash }));
          break;
        case 'send_data':
          queue.send(JSON.stringify({ fn_index: fnIndex, data, event_data: eventData, session_hash: sessionHash }));
          break;
        case 'process_completed':
          resolve(message?.output?.data[0]);
          break;
        case 'estimation':
        case 'process_starts':
        case 'process_generating':
          // noop
          break;
        default:
          console.warn(`unhandled event: ${dataStr}`);
      }
    });
  });
}

export function updateModelParameters(data: Array<any>, baseUrl: string): Promise<string> {
  return doConversation(data, baseUrl, modelParamsFnIndex);
}

export function configureParameters(data: Array<any>, baseUrl: string): Promise<string> {
  return doConversation(data, baseUrl, paramsFnIndex);
}

export function text2text(prompt: string, baseUrl: string): Promise<string> {
  return doConversation([prompt, null], baseUrl, replyFnIndex);
}

export function setModel(modelName: string, baseUrl: string): Promise<string> {
  return doConversation([modelName], baseUrl, modelFnIndex);
}