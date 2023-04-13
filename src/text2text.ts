import { WebSocket } from "ws";
const sessionHash = Math.floor(Math.random() * (2 ** 31 - 1) + 1);
const paramsFnIndex = 6;
const replyFnIndex = 7;

export function sendSessionHash(queue: WebSocket, fn_index: Number) {
  queue.send(JSON.stringify({ fn_index, session_hash: sessionHash }));
}

export function sendParameters(queue: WebSocket, data: Array<any>) {
  queue.send(JSON.stringify({ fn_index: paramsFnIndex, data, event_data: null, session_hash: sessionHash }));
}

export function sendPrompt(queue: WebSocket, prompt: string) {
  queue.send(JSON.stringify({ fn_index: replyFnIndex, data: [prompt, null], event_data: null, session_hash: sessionHash }));
  return prompt;
}

export function configureParameters(data: Array<any>, baseUrl: string): Promise<string> {
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
          sendSessionHash(queue, paramsFnIndex);
          break;
        case 'send_data':
          sendParameters(queue, data);
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
  })
}


export function text2text(prompt: string, baseUrl: string): Promise<string> {
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
          sendSessionHash(queue, replyFnIndex);
          break;
        case 'send_data':
            sendPrompt(queue, prompt);
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
  })


}