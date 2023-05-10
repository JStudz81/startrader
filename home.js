const https = require('https');
const http = require('http');
const ejs = require('ejs');
const fs = require('fs');
var url = require('url');


const hostname = '127.0.0.1';
const port = 3000;

const authToken = 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZGVudGlmaWVyIjoiSlNUVURaODEiLCJpYXQiOjE2ODM1ODA4NTMsInN1YiI6ImFnZW50LXRva2VuIn0.ZkmxWV9Dz3sxiQpZMqVlAK6ax57q5R3PEg8qcUUVpv9cJmxPv_aLUNQYimiCW62jMOg-Qr-5dPum4ldUbVeSCphh2muWo4gY4JQzvSTtORxxryQXucoQUKSbPcySp9-PmhWZaT3r3A6Ozni5pzbPMqjhcaXuytLtNXjLuNjCnELB5YIc2BL7sEgVLM1L6z3n9m9fG3ABTWSSAUJJDbnJeSWs8sANNF7z7ozCZL_W88iE4iRLg9sAyLLTrzrkqUB2DS_WxXLYXrTRJsZkfc-eNfYGGo3TY7SdjiNIy0jGgYfNdURea2aFb2yy0KOqUfPLmseBjSPcfknetPv9KxEYLZUm0iOyjwuidPZ3jZIMpfiKk49qCfcjS1CvjcdPqRVRpcVIn94mPvV_piK6hizfoCrj8T-KCMA8O88nF47jcSjX399RZA54HvryOKOIycmh9LmfbOp3FuU-UZO0ko187H6Ka7yecGpAYvs9DrignTXacl5hb2OHJajWhhAUctb9';


const server = http.createServer((req, res) => {

    if(req.url ==='/agent') {
        agentRequest((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            let template = applyHeader('agent.html');
            res.end(ejs.render(template, resp, {}));
        });
    } else if (req.url === '/contracts') {
        contractRequest((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            let template = applyHeader('contracts.html');
            res.end(ejs.render(template, resp, {}));
        })
    } else if (req.url.includes('/contracts/accept')) {
        
        let id = req.url.replace("/contracts/accept/", "")
        contractAccept(id, () => {
            contractRequest((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html');
                let template = applyHeader('contracts.html');
                res.end(ejs.render(template, resp, {}));
            });
        });
    } else if (req.url.includes('/system')) {
        currentSystemWaypoints((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            let template = applyHeader('system.html');
            console.log(resp);
            res.end(ejs.render(template, resp, {}));
        });
    } else if (req.url.includes('/myShips')) {
        myShips((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            let template = applyHeader('ships.html');
            console.log(resp);
            res.end(ejs.render(template, resp, {}));
        });
    } else {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Hello World');
    }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/agent`);
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

function contractAccept(id, callback) {
    const options = {
        hostname: 'api.spacetraders.io',
        port: 443,
        path: '/v2/my/contracts/' + id + '/accept',
        method: 'POST',
        headers: {Authorization: authToken}
      };

    let request = https.request(options, (res) => {
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
            callback();
        });
    });

    request.on('error', (e) => {
        console.error(e);
        callback();
        request.end()
      });
    request.end();
}

function currentSystemWaypoints(callback) {
    let request = https.get('https://api.spacetraders.io/v2/systems/X1-DF55/waypoints', {headers: {Authorization: authToken}} ,(res) => {
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

function myShips(callback) {
    let request = https.get('https://api.spacetraders.io/v2/my/ships', {headers: {Authorization: authToken}} ,(res) => {
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

