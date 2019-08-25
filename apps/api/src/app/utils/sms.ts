import { get } from 'http';
export function sms(to: string, msg: string) {
    msg = msg.substr(0, 140);
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
    console.warn(`Sending SMS to: ${to}\nMsg: ${msg}`);

}