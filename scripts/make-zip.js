import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

const rootDir = process.cwd();
const outputFile = path.resolve(rootDir, '..', 'algorise-clean-deploy.zip');

const zip = new JSZip();
let fileCount = 0;

function addFilesRecursively(currentDir, relativePath = '') {
  const entries = fs.readdirSync(currentDir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(currentDir, entry.name);
    const relPath = relativePath ? `${relativePath}/${entry.name}` : entry.name;

    // Exclude dependencies, version control, and OS artifacts
    if (entry.name === 'node_modules') continue;
    if (entry.name === '.git') continue;
    if (entry.name === '.DS_Store' || entry.name === 'Thumbs.db') continue;
    if (entry.name.endsWith('.tmp') || entry.name.endsWith('.log')) continue;

    if (entry.isDirectory()) {
      addFilesRecursively(fullPath, relPath);
    } else {
      const fileData = fs.readFileSync(fullPath);
      zip.file(relPath, fileData);
      fileCount++;
    }
  }
}

console.log(`Packaging Algorise deployment archive...`);
addFilesRecursively(rootDir);

const buffer = await zip.generateAsync({
  type: 'nodebuffer',
  compression: 'DEFLATE',
  compressionOptions: { level: 9 }
});

fs.writeFileSync(outputFile, buffer);
console.log(`✅ Successfully generated clean zip:`);
console.log(`📁 Path: ${outputFile}`);
console.log(`📦 Files: ${fileCount}`);
console.log(`📊 Size: ${(buffer.length / 1024 / 1024).toFixed(2)} MB`);
