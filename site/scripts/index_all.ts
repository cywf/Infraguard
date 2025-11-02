import * as fs from 'fs';
import * as path from 'path';

async function runScript(scriptPath: string) {
  console.log(`\n=== Running ${path.basename(scriptPath)} ===`);
  try {
    await import(scriptPath);
  } catch (error) {
    console.error(`Error running ${scriptPath}:`, error);
  }
}

async function discoverMermaidDiagrams() {
  const rootDir = path.join(process.cwd(), '..');
  const diagramsDir = path.join(process.cwd(), 'public', 'diagrams');
  
  fs.mkdirSync(diagramsDir, { recursive: true });
  
  const diagrams: Array<{ name: string; path: string; content: string }> = [];
  
  function findMmdFiles(dir: string, depth: number = 0): string[] {
    if (depth > 5) return [];
    
    const results: string[] = [];
    if (!fs.existsSync(dir)) return results;
    
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
        results.push(...findMmdFiles(filePath, depth + 1));
      } else if (file.endsWith('.mmd')) {
        results.push(filePath);
      }
    }
    
    return results;
  }
  
  const mmdFiles = findMmdFiles(rootDir);
  
  for (const file of mmdFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const relativePath = path.relative(rootDir, file);
    const name = path.basename(file, '.mmd');
    
    diagrams.push({
      name: name.replace(/-|_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      path: relativePath,
      content,
    });
  }
  
  const readmePath = path.join(rootDir, 'README.md');
  if (fs.existsSync(readmePath)) {
    const readme = fs.readFileSync(readmePath, 'utf-8');
    const mermaidRegex = /```mermaid\n([\s\S]*?)```/g;
    let match;
    let index = 0;
    
    while ((match = mermaidRegex.exec(readme)) !== null) {
      diagrams.push({
        name: `README Diagram ${++index}`,
        path: 'README.md',
        content: match[1].trim(),
      });
    }
  }
  
  const indexFile = path.join(diagramsDir, 'index.json');
  fs.writeFileSync(indexFile, JSON.stringify(diagrams, null, 2));
  
  console.log(`\n=== Discovered ${diagrams.length} Mermaid diagrams ===`);
}

(async () => {
  console.log('Starting indexing process...\n');
  
  await runScript('./index_ansible.ts');
  await runScript('./index_terraform.ts');
  await runScript('./index_misc.ts');
  await runScript('./fetch_repo_data.ts');
  await runScript('./fetch_discussions.ts');
  await runScript('./fetch_projects.ts');
  await discoverMermaidDiagrams();
  
  console.log('\n=== Indexing complete ===\n');
})();
