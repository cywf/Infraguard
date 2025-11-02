import * as fs from 'fs';
import * as path from 'path';

interface MiscItem {
  type: 'packer' | 'vagrant' | 'docker' | 'other';
  name: string;
  path: string;
  description: string;
}

function findFiles(dir: string, pattern: RegExp): string[] {
  const results: string[] = [];
  
  if (!fs.existsSync(dir)) {
    return results;
  }
  
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      results.push(...findFiles(filePath, pattern));
    } else if (pattern.test(file)) {
      results.push(filePath);
    }
  }
  
  return results;
}

function extractDescription(filePath: string): string {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    
    for (const line of lines.slice(0, 20)) {
      const trimmed = line.trim();
      if (trimmed.startsWith('#') && trimmed.length > 2) {
        return trimmed.substring(1).trim();
      }
    }
    
    return 'Configuration file';
  } catch (error) {
    return 'Configuration file';
  }
}

function indexMisc(): MiscItem[] {
  const items: MiscItem[] = [];
  const rootDir = path.join(process.cwd(), '..');
  
  const packerDir = path.join(rootDir, 'packer');
  if (fs.existsSync(packerDir)) {
    const packerFiles = findFiles(packerDir, /\.(json|pkr\.hcl)$/);
    for (const file of packerFiles) {
      const relativePath = path.relative(rootDir, file);
      const name = path.basename(file);
      
      items.push({
        type: 'packer',
        name: name.replace(/\.(json|pkr\.hcl)$/, '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        path: relativePath,
        description: extractDescription(file),
      });
    }
  }
  
  const vagrantDir = path.join(rootDir, 'vagrant');
  if (fs.existsSync(vagrantDir)) {
    const vagrantFiles = findFiles(vagrantDir, /Vagrantfile$/);
    for (const file of vagrantFiles) {
      const relativePath = path.relative(rootDir, file);
      const name = path.basename(path.dirname(file)) || 'Vagrantfile';
      
      items.push({
        type: 'vagrant',
        name: name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        path: relativePath,
        description: extractDescription(file),
      });
    }
  }
  
  const dockerDir = path.join(rootDir, 'docker');
  if (fs.existsSync(dockerDir)) {
    const dockerFiles = findFiles(dockerDir, /\.(sh|yml|yaml)$/);
    for (const file of dockerFiles) {
      const relativePath = path.relative(rootDir, file);
      const name = path.basename(file);
      
      items.push({
        type: 'docker',
        name: name.replace(/\.(sh|yml|yaml)$/, '').replace(/-|_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        path: relativePath,
        description: extractDescription(file),
      });
    }
  }
  
  const otherDirs = ['cloudinit', 'networking', 'stacks'];
  for (const dirName of otherDirs) {
    const dir = path.join(rootDir, dirName);
    if (fs.existsSync(dir)) {
      const files = findFiles(dir, /\.(ya?ml|conf|cfg|sh)$/);
      for (const file of files) {
        const relativePath = path.relative(rootDir, file);
        const name = path.basename(file);
        
        items.push({
          type: 'other',
          name: name.replace(/\.(ya?ml|conf|cfg|sh)$/, '').replace(/-|_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          path: relativePath,
          description: extractDescription(file),
        });
      }
    }
  }
  
  return items;
}

const items = indexMisc();
const outputDir = path.join(process.cwd(), 'public', 'explorer');
fs.mkdirSync(outputDir, { recursive: true });

const outputFile = path.join(outputDir, 'misc.json');
fs.writeFileSync(outputFile, JSON.stringify(items, null, 2));

console.log(`Indexed ${items.length} misc items to ${outputFile}`);
