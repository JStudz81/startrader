const https = require('https');
const http = require('http');
const ejs = require('ejs');
const fs = require('fs');


const hostname = '127.0.0.1';
const port = 3000;

const authToken = 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZGVudGlmaWVyIjoiSlNUVURaODEiLCJpYXQiOjE2ODM1ODA4NTMsInN1YiI6ImFnZW50LXRva2VuIn0.ZkmxWV9Dz3sxiQpZMqVlAK6ax57q5R3PEg8qcUUVpv9cJmxPv_aLUNQYimiCW62jMOg-Qr-5dPum4ldUbVeSCphh2muWo4gY4JQzvSTtORxxryQXucoQUKSbPcySp9-PmhWZaT3r3A6Ozni5pzbPMqjhcaXuytLtNXjLuNjCnELB5YIc2BL7sEgVLM1L6z3n9m9fG3ABTWSSAUJJDbnJeSWs8sANNF7z7ozCZL_W88iE4iRLg9sAyLLTrzrkqUB2DS_WxXLYXrTRJsZkfc-eNfYGGo3TY7SdjiNIy0jGgYfNdURea2aFb2yy0KOqUfPLmseBjSPcfknetPv9KxEYLZUm0iOyjwuidPZ3jZIMpfiKk49qCfcjS1CvjcdPqRVRpcVIn94mPvV_piK6hizfoCrj8T-KCMA8O88nF47jcSjX399RZA54HvryOKOIycmh9LmfbOp3FuU-UZO0ko187H6Ka7yecGpAYvs9DrignTXacl5hb2OHJajWhhAUctb9';


const server = http.createServer((req, res) => {
    const url = req.url;
    if(url ==='/agent') {
        agentRequest((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            console.log('Data: ' + resp.data)
            let template = applyHeader('agent.html');
            res.end(ejs.render(template, resp, {}));
        });
    } else if (url === '/contracts') {
        contractRequest((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            console.log('Data: ' + JSON.stringify(resp.data));
            let template = applyHeader('contracts.html');
            res.end(ejs.render(template, resp, {}));
        })
    } else {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Hello World');
    }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

function agentRequest(callback) {
    let request = https.get('https://api.spacetraders.io/v2/my/agent', {headers: {Authorization: authToken}} ,(res) => {
        if (res.statusCode !== 200) {
        console.error(`Did not get an OK from the server. Code: ${res.statusCode}`);
        res.resume();
        return;
        }
    
        let data = '';
    
        res.on('data', (chunk) => {
        data += chunk;
        });
    
        res.on('close', () => {
            callback(JSON.parse(data));
        });
    });
}

function contractRequest(callback) {
    let request = https.get('https://api.spacetraders.io/v2/my/contracts', {headers: {Authorization: authToken}} ,(res) => {
        if (res.statusCode !== 200) {
        console.error(`Did not get an OK from the server. Code: ${res.statusCode}`);
        res.resume();
        return;
        }
    
        let data = '';
    
        res.on('data', (chunk) => {
        data += chunk;
        });
    
        res.on('close', () => {
            callback(JSON.parse(data));
        });
    });
}

function applyHeader(fileName) {
    header = fs.readFileSync('header.html');
    return header + fs.readFileSync(fileName).toString();
}


