// @ts-check
const {buildHtml} = require('./build');
const http = require('http');
const fs = require('fs');
const path = require('path');

const mdPath = path.resolve(process.cwd(), process.argv[2]);

console.log(mdPath);

const mimeMap = {
    '.ico': 'image/x-icon',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword'
};

http.createServer((req, res) => {
    try {
        if (req.url === '/') {
            const html = buildHtml();
            res.end(html);
        } else if (req.url && req.url.startsWith('/assets/')) {
            const p = path.resolve(path.dirname(mdPath), req.url.slice(1));
            const mimeType = mimeMap[path.extname(p)];
            res.setHeader('Content-type', mimeType);
            fs.createReadStream(p).pipe(res);
        } else {
            res.statusCode = 404;
            res.end('not-found');
        }
    } catch(e) {
        res.statusCode = 500;
        console.error(e);
        res.end('err');
    }
}).listen(4444);

console.log('Open: http://localhost:4444/');
