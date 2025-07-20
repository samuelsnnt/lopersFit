const fs = require('fs');
const path = require('path');

function findTsFiles(dir, results = []) {
  // Skip node_modules directory
  if (path.basename(dir) === 'node_modules') {
    return results;
  }

  try {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        findTsFiles(filePath, results);
      } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        results.push(filePath);
      }
    }
  } catch (error) {
    // Skip directories we can't read
  }
  
  return results;
}

const tsFiles = findTsFiles('.');
if (tsFiles.length > 0) {
  console.log('Found TypeScript files:');
  tsFiles.forEach(file => console.log(file));
} else {
  console.log('No TypeScript files found');
}