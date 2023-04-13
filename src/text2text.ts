import { WebSocket } from "ws";

export function sendSessionHash(queue: WebSocket) {
  queue.send(JSON.stringify({ fn_index: 8, session_hash: 'u2qt' }));
}

export function sendPrompt(queue: WebSocket, prompt: string) {
  // {"fn_index":8,"data":["Common sense questions and answers\n\nQuestion: \nFactual answer:",null],"event_data":null,"session_hash":"0zw35a2lt82m"}
  queue.send(JSON.stringify({ fn_index: 8, data: [prompt, null], event_data: null, session_hash: 'u2qt' }));
  return prompt;
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
          sendSessionHash(queue);
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
