
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.join(__dirname, 'src');

// Helper to get all files recursively
function getAllFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            getAllFiles(filePath, fileList);
        } else {
            fileList.push(filePath);
        }
    });
    return fileList;
}

// Get all actual file paths in the src directory
const allFiles = getAllFiles(rootDir);
const allFilesSet = new Set(allFiles);
const allFilesLowerCaseMap = new Map();
allFiles.forEach(f => allFilesLowerCaseMap.set(f.toLowerCase(), f));

// Function to resolve import path to absolute path
function resolveImport(currentFile, importPath) {
    if (importPath.startsWith('.')) {
        return path.resolve(path.dirname(currentFile), importPath);
    }
    return null; // Ignore non-relative imports for now
}

// Check imports in a file
function checkImports(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const importRegex = /import\s+.*?\s+from\s+['"](.*?)['"]/g;
    const dynamicImportRegex = /import\(['"](.*?)['"]\)/g;

    let match;
    const importsToCheck = [];

    while ((match = importRegex.exec(content)) !== null) {
        importsToCheck.push({ path: match[1], fullMatch: match[0], index: match.index });
    }
    while ((match = dynamicImportRegex.exec(content)) !== null) {
        importsToCheck.push({ path: match[1], fullMatch: match[0], index: match.index });
    }

    const errors = [];

    importsToCheck.forEach(imp => {
        const resolvedPathWithoutExt = resolveImport(filePath, imp.path);
        if (!resolvedPathWithoutExt) return;

        const extensions = ['', '.js', '.jsx', '.css', '.svg', '.png', '.jpg', '.jpeg', '.json'];
        let foundExact = false;
        let foundCaseMismatch = false;
        let actualPath = null;

        for (const ext of extensions) {
            const pathWithExt = resolvedPathWithoutExt + ext;

            if (allFilesSet.has(pathWithExt)) {
                foundExact = true;
                break;
            }

            if (allFilesLowerCaseMap.has(pathWithExt.toLowerCase())) {
                const found = allFilesLowerCaseMap.get(pathWithExt.toLowerCase());
                if (found !== pathWithExt) {
                    foundCaseMismatch = true;
                    actualPath = found;
                }
            }
        }

        if (!foundExact && foundCaseMismatch && actualPath) {
            let newImportPath = path.relative(path.dirname(filePath), actualPath);
            if (!newImportPath.startsWith('.')) newImportPath = './' + newImportPath;

            const ext = path.extname(actualPath);
            const originalExt = path.extname(imp.path);

            newImportPath = newImportPath.replace(/\\/g, '/'); // Ensure forward slashes

            if (!originalExt && (ext === '.js' || ext === '.jsx')) {
                // Remove extension for js/jsx if it wasn't there
                const extLen = ext.length;
                if (newImportPath.endsWith(ext)) {
                    newImportPath = newImportPath.slice(0, -extLen);
                }
            }

            errors.push({
                originalImport: imp.path,
                correctImport: newImportPath,
                line: content.substring(0, imp.index).split('\n').length
            });
        }
    });

    if (errors.length > 0) {
        fs.appendFileSync('import_errors_result.json', JSON.stringify({ file: filePath, errors }) + '\n');
    }
}

if (fs.existsSync('import_errors_result.json')) {
    fs.unlinkSync('import_errors_result.json');
}

allFiles.forEach(file => {
    if (file.endsWith('.js') || file.endsWith('.jsx')) {
        checkImports(file);
    }
});
