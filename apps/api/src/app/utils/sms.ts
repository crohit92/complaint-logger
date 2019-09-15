import { get } from 'http';
import { environment } from '../../environments/environment';
export function sms(to: string, msg: string) {
    send(environment.production ? to : '9646073913', msg);
    console.warn(`Sending SMS to: ${to}\nMsg: ${msg}`);
}
function send(to, msg) {
    get(`http://103.247.98.91/API/SendMsg.aspx?uname=20171991&pass=iamhere_123&send=galaxy&dest=${to}&msg=${msg}`, (resp => {
        let data = '';
        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });
        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            console.log(data);
        });
    })).on("error", (err) => {
        console.log("Error: " + err.message);
    });
}