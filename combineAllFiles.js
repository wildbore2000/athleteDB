const fs = require('fs');
const path = require('path');

// Output file paths
const structureFile = path.join(__dirname, 'structure.txt');
const combinedFile = path.join(__dirname, 'combinedfiles.txt');

// Relevant file extensions to include for concatenation
const relevantExtensions = ['.js', '.json', '.jsx', '.css', '.html'];

// Directories and specific files to exclude
const excludedDirs = ['node_modules', '.git', '.vscode', 'build', 'dist', 'logs', 'coverage'];
const excludedFiles = ['package-lock.json']; // Exclude package-lock.json specifically
const excludePatterns = [
  'node_modules', 'package-lock.json', '*.md', '.gitignore', 'LICENSE', 
  'structure.txt', 'tests', 'deploy.sh', '.git', '.vscode'
]; // For directory structure
const maxSize = 1024 * 1024; // 1MB size limit for files

// Initialize the output file for directory structure
fs.writeFileSync(structureFile, '');

// Function to recursively list directories and files, excluding certain files and directories
function listDirectory(dirPath, indent = '') {
  fs.readdirSync(dirPath, { withFileTypes: true }).forEach((dirent) => {
    const fullPath = path.join(dirPath, dirent.name);

    // If it's a directory and not in the exclude list, process it
    if (dirent.isDirectory() && !excludedDirs.includes(dirent.name)) {
      fs.appendFileSync(structureFile, `${indent}|-- ${dirent.name}\n`);
      listDirectory(fullPath, indent + '    '); // Recurse into the directory with increased indentation
    } else if (!dirent.isDirectory()) {
      const ext = path.extname(dirent.name);
      if (!excludePatterns.includes(dirent.name) && !excludePatterns.includes(ext)) {
        fs.appendFileSync(structureFile, `${indent}|-- ${dirent.name}\n`);
      }
    }
  });
}

// Function to recursively find all relevant files in a directory for concatenation
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(function (file) {
    const filePath = path.join(dirPath, file);

    if (fs.statSync(filePath).isDirectory()) {
      if (!excludedDirs.includes(file)) {
        arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
      }
    } else {
      // Only include relevant file extensions and exclude oversized or excluded files
      const ext = path.extname(file);
      const fileSize = fs.statSync(filePath).size;
      const fileName = path.basename(filePath);

      if (
        relevantExtensions.includes(ext) &&
        !excludedFiles.includes(fileName) &&
        fileSize <= maxSize
      ) {
        arrayOfFiles.push(filePath);
      }
    }
  });

  return arrayOfFiles;
}

// Function to concatenate files into a single file
function concatenateFiles(fileList, outputPath) {
  let combinedContent = '';

  fileList.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      combinedContent += `\n\n// Content from: ${filePath}\n\n` + fileContent;
    } else {
      console.error(`File not found: ${filePath}`);
    }
  });

  fs.writeFileSync(outputPath, combinedContent, 'utf8');
  console.log(`Files have been combined into ${outputPath}`);
}

// Start listing from the current directory and output directory structure to structure.txt
listDirectory('.');

// Get all relevant files from the backend and frontend directories
const allFiles = getAllFiles(__dirname);
//const frontendFiles = getAllFiles(path.join(__dirname, 'frontend'));

// Combine both arrays of files for concatenation
//const allFiles = backendFiles.concat(frontendFiles);

// Run the concatenation function with all relevant files
concatenateFiles(allFiles, combinedFile);

console.log(`Directory structure has been written to ${structureFile}`);
