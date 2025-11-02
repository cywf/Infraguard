import * as fs from 'fs';
import * as path from 'path';

interface AnsibleItem {
  type: 'role' | 'playbook';
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
      if (trimmed.startsWith('description:')) {
        return trimmed.substring('description:'.length).trim().replace(/['"]/g, '');
      }
    }
    
    return 'No description available';
  } catch (error) {
    return 'No description available';
  }
}

function indexAnsible(): AnsibleItem[] {
  const items: AnsibleItem[] = [];
  const ansibleDir = path.join(process.cwd(), '..', 'ansible');
  
  if (!fs.existsSync(ansibleDir)) {
    console.log('Ansible directory not found');
    return items;
  }
  
  const playbooks = findFiles(path.join(ansibleDir, 'playbooks'), /\.ya?ml$/);
  for (const playbook of playbooks) {
    const relativePath = path.relative(path.join(process.cwd(), '..'), playbook);
    const name = path.basename(playbook, path.extname(playbook));
    const description = extractDescription(playbook);
    
    items.push({
      type: 'playbook',
      name: name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      path: relativePath,
      description,
    });
  }
  
  const rolesDir = path.join(ansibleDir, 'roles');
  if (fs.existsSync(rolesDir)) {
    const roles = fs.readdirSync(rolesDir).filter(f => {
      const stat = fs.statSync(path.join(rolesDir, f));
      return stat.isDirectory();
    });
    
    for (const role of roles) {
      const rolePath = path.join(rolesDir, role);
      const relativePath = path.relative(path.join(process.cwd(), '..'), rolePath);
      
      let description = 'Ansible role';
      const metaFile = path.join(rolePath, 'meta', 'main.yml');
      const readmeFile = path.join(rolePath, 'README.md');
      
      if (fs.existsSync(metaFile)) {
        description = extractDescription(metaFile);
      } else if (fs.existsSync(readmeFile)) {
        description = extractDescription(readmeFile);
      }
      
      items.push({
        type: 'role',
        name: role.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        path: relativePath,
        description,
      });
    }
  }
  
  return items;
}

const items = indexAnsible();
const outputDir = path.join(process.cwd(), 'public', 'explorer');
fs.mkdirSync(outputDir, { recursive: true });

const outputFile = path.join(outputDir, 'ansible.json');
fs.writeFileSync(outputFile, JSON.stringify(items, null, 2));

console.log(`Indexed ${items.length} Ansible items to ${outputFile}`);
