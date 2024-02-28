import http from 'http';
import fs from 'fs';
import path from 'path';

const htmlPath = path.resolve(__dirname, './index.html');
const remarkjsPath = path.resolve(__dirname, './remark.js');
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
            const htmlTemplate = fs.readFileSync(htmlPath, 'utf-8');
            const md = fs.readFileSync(mdPath, 'utf-8');
            const html = htmlTemplate.replace('<!-- MARKDOWN -->', md);
            res.end(html);
        } else if (req.url === '/remark.js') {
            const remarkjs = fs.readFileSync(remarkjsPath, 'utf-8');
            res.end(remarkjs);
        } else if (req.url!.startsWith('/assets/')) {
            const p = path.resolve(path.dirname(mdPath), req.url!.slice(1));
            const mimeType = mimeMap[path.extname(p) as keyof typeof mimeMap];
            res.setHeader('Content-type', mimeType);
            fs.createReadStream(p).pipe(res);
            // res.end();
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
