// print_tree.js
const fs = require('fs');
const path = require('path');

function getTree(dir, prefix = '') {
    const files = fs.readdirSync(dir).filter(f => !['node_modules', '.git', 'dist', 'vite.config.ts.timestamp-*'].includes(f));
    return files.map((file, index, arr) => {
        const filePath = path.join(dir, file);
        const isDir = fs.statSync(filePath).isDirectory();
        const connector = index === arr.length - 1 ? '└── ' : '├── ';
        let line = prefix + connector + (isDir ? '📂 ' : '📄 ') + file + '\n';
        if (isDir) line += getTree(filePath, prefix + (index === arr.length - 1 ? '    ' : '│   '));
        return line;
    }).join('');
}

console.log('📂 Lunara Project Structure (Frontend)');
console.log(getTree('.'));