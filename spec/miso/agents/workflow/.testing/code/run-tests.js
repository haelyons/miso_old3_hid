#!/usr/bin/env node

// Test discovery and runner for miso system
// Finds and executes all *.test.js files in feature code/ directories

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Find the spec root directory (should be 4 levels up from this script)
const specRoot = path.resolve(__dirname, '../../../../..');

function findTestFiles(dir) {
    const testFiles = [];
    
    function searchDir(currentDir) {
        try {
            const entries = fs.readdirSync(currentDir, { withFileTypes: true });
            
            for (const entry of entries) {
                const fullPath = path.join(currentDir, entry.name);
                
                if (entry.isDirectory()) {
                    // Look for code/ directories in metafolders (directories starting with .)
                    if (entry.name.startsWith('.') && entry.name !== '.git') {
                        const codeDir = path.join(fullPath, 'code');
                        if (fs.existsSync(codeDir)) {
                            // Find test files in this code directory
                            const codeEntries = fs.readdirSync(codeDir);
                            for (const codeFile of codeEntries) {
                                if (codeFile.endsWith('.test.js')) {
                                    testFiles.push(path.join(codeDir, codeFile));
                                }
                            }
                        }
                    } else {
                        // Recurse into regular directories
                        searchDir(fullPath);
                    }
                }
            }
        } catch (error) {
            // Skip directories we can't read
        }
    }
    
    searchDir(dir);
    return testFiles;
}

function main() {
    console.log('🔍 Discovering test files in miso system...');
    
    const testFiles = findTestFiles(specRoot);
    
    if (testFiles.length === 0) {
        console.log('❌ No test files found');
        process.exit(1);
    }
    
    console.log(`✅ Found ${testFiles.length} test files:`);
    testFiles.forEach(file => {
        const relativePath = path.relative(specRoot, file);
        console.log(`   ${relativePath}`);
    });
    
    console.log('\n🧪 Running tests...');
    
    try {
        // Run jest with the discovered test files
        const jestCommand = `npx jest ${testFiles.map(f => `"${f}"`).join(' ')}`;
        execSync(jestCommand, { 
            stdio: 'inherit',
            cwd: __dirname 
        });
        
        console.log('\n✅ All tests completed successfully!');
    } catch (error) {
        console.log('\n❌ Some tests failed');
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = { findTestFiles };