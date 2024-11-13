const fs = require('fs');
const path = require('path');

// Set the output file name
const outputFile = 'structure.txt';

// Initialize the output file
fs.writeFileSync(outputFile, '');

// Patterns to exclude
const excludePatterns = [
  'node_modules',
  'package-lock.json',
  '.md',
  '.gitignore',
  'LICENSE',
  'structure.txt',
  'tests',
  'deploy.sh',
  '.git'
];

// Function to recursively list directories and files, excluding certain files and directories
function listDirectory(dirPath, indent = '') {
  // Read all directories and files in the current path
  fs.readdirSync(dirPath, { withFileTypes: true }).forEach((dirent) => {
    const fullPath = path.join(dirPath, dirent.name);

    // If it's a directory and not in the exclude list, process it
    if (
      dirent.isDirectory() &&
      !excludePatterns.includes(dirent.name)
    ) {
      // Write the directory name to the output file with indentation
      fs.appendFileSync(outputFile, `${indent}|-- ${dirent.name}\n`);

      // Recurse into the directory with increased indentation
      listDirectory(fullPath, indent + '    ');
    } else if (!dirent.isDirectory()) {
      const ext = path.extname(dirent.name);
      // If it's a file and doesn't match any exclude pattern, write it to the output file
      if (!excludePatterns.includes(dirent.name) && !excludePatterns.includes(ext)) {
        fs.appendFileSync(outputFile, `${indent}|-- ${dirent.name}\n`);
      }
    }
  });
}

// Start listing from the current directory
listDirectory('.');

console.log(`Directory structure has been written to ${outputFile}`);
