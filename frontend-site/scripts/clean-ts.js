const fs = require('fs');
const path = require('path');

function deleteTypeScriptFiles(dir) {
  try {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Skip node_modules directory
        if (item === 'node_modules') {
          continue;
        }
        // Recursively process subdirectories
        deleteTypeScriptFiles(fullPath);
      } else if (stat.isFile() && item.endsWith('.ts')) {
        // Delete .ts files
        fs.unlinkSync(fullPath);
        console.log(`Deleted: ${fullPath}`);
      }
    }
  } catch (error) {
    console.error(`Error processing directory ${dir}:`, error.message);
  }
}

// Start from current directory
console.log('Cleaning TypeScript files...');
deleteTypeScriptFiles('.');
console.log('TypeScript cleanup completed.');