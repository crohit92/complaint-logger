import { get } from 'http';
import { readFileSync } from 'fs';
import { environment } from '../../environments/environment';
export function sms(to: string, msg: string) {
  if (environment.production) {
    const cc = readFileSync(__dirname + '/assets/.cc-sms-to').toString('utf8');
    if (cc && cc.length) {
      send(cc, msg);
    }
  }
  send(to, msg);
  console.warn(`Sending SMS to: ${to}\nMsg: ${msg}`);
}
function send(to, msg) {
  get(`${process.env.SMS_API}&dest=${to}&msg=${msg}`, resp => {
    let data = '';
    // A chunk of data has been recieved.
    resp.on('data', chunk => {
      data += chunk;
    });
    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      console.log(data);
    });
  }).on('error', err => {
    console.log('Error: ' + err.message);
  });
}
