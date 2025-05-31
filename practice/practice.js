const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const folder = 'C:\\Users\\fatim\\Downloads\\task2';
const email = '2421235@iub.edu.bd';

// Read only files (not directories)
const files = fs.readdirSync(folder).filter(f => fs.statSync(path.join(folder, f)).isFile());

const hashes = [];

for (const file of files) {
    const fullPath = path.join(folder, file);
    const data = fs.readFileSync(fullPath);
    const hash = crypto.createHash('sha3-256').update(data).digest('hex');
    hashes.push(hash);
}

// Sort descending (as strings)
hashes.sort((a, b) => b.localeCompare(a));

// Join without separator and append lowercase email
const joined = hashes.join('') + email.toLowerCase();

// Final SHA3-256 hash
const finalHash = crypto.createHash('sha3-256').update(joined).digest('hex');

console.log(finalHash);
