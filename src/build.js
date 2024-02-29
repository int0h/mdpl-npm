const fs = require('fs');
const path = require('path');

const htmlPath = path.resolve(__dirname, './static/index.html');
const remarkjsPath = path.resolve(__dirname, './static/remark.js');
const cssPath = path.resolve(__dirname, './static/style.css');
const mdPath = path.resolve(process.cwd(), process.argv[2]);
const customStylePath = path.resolve(path.dirname(mdPath), 'style.css');

function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
 }

function escapeJsHtml(unsafe) {
    return unsafe
        .replace(/<\/script>/g, '<\\/script>');
}

function buildHtml() {
    const html = fs.readFileSync(htmlPath, 'utf-8');
    const remarkjsCode = fs.readFileSync(remarkjsPath, 'utf-8');
    const cssCode = fs.readFileSync(cssPath, 'utf-8');
    const mdCode = fs.readFileSync(mdPath, 'utf-8');
    const customCss = fs.existsSync(customStylePath) ? fs.readFileSync(customStylePath, 'utf-8') : '';

    const replaceMap = {
        style: `<style>${escapeHtml(cssCode)}</style>`,
        custom_style: `<style>${escapeHtml(customCss)}</style>`,
        script: `<script>${escapeJsHtml(remarkjsCode)}</script>`,
        md: `<textarea id="source">${escapeHtml(mdCode)}</textarea>`,
    };

    const readyHTML = html.replace(/<!--{(.+)}-->/g, (str, key) => {
        return replaceMap[key] ?? str;
    });

    return readyHTML;
}

function writeHtml() {
    const outPath = path.resolve(process.cwd(), process.argv[3]);
    const readyHTML = buildHtml();
    fs.writeFileSync(outPath, readyHTML);
}

module.exports = {buildHtml, writeHtml};
