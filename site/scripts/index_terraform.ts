import * as fs from 'fs';
import * as path from 'path';

interface TerraformModule {
  name: string;
  path: string;
  variables: string[];
  description: string;
}

function extractVariables(filePath: string): string[] {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const variables: string[] = [];
    const varRegex = /variable\s+"([^"]+)"/g;
    let match;
    
    while ((match = varRegex.exec(content)) !== null) {
      variables.push(match[1]);
    }
    
    return variables;
  } catch (error) {
    return [];
  }
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
    
    const dir = path.dirname(filePath);
    const readme = path.join(dir, 'README.md');
    if (fs.existsSync(readme)) {
      const readmeContent = fs.readFileSync(readme, 'utf-8');
      const firstLine = readmeContent.split('\n').find(l => l.trim().length > 0);
      if (firstLine) {
        return firstLine.replace(/^#+\s*/, '').trim();
      }
    }
    
    return 'Terraform module';
  } catch (error) {
    return 'Terraform module';
  }
}

function indexTerraform(): TerraformModule[] {
  const modules: TerraformModule[] = [];
  const terraformDir = path.join(process.cwd(), '..', 'terraform');
  
  if (!fs.existsSync(terraformDir)) {
    console.log('Terraform directory not found');
    return modules;
  }
  
  const findModules = (dir: string, level: number = 0) => {
    if (level > 5) return;
    
    const files = fs.readdirSync(dir);
    const hasTfFiles = files.some(f => f.endsWith('.tf'));
    
    if (hasTfFiles) {
      const relativePath = path.relative(path.join(process.cwd(), '..'), dir);
      const name = path.basename(dir);
      
      const variablesFile = path.join(dir, 'variables.tf');
      const mainFile = path.join(dir, 'main.tf');
      
      const variables = fs.existsSync(variablesFile) 
        ? extractVariables(variablesFile)
        : [];
      
      const description = extractDescription(mainFile);
      
      modules.push({
        name: name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        path: relativePath,
        variables,
        description,
      });
    }
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && !file.startsWith('.')) {
        findModules(filePath, level + 1);
      }
    }
  };
  
  findModules(terraformDir);
  
  return modules;
}

const modules = indexTerraform();
const outputDir = path.join(process.cwd(), 'public', 'explorer');
fs.mkdirSync(outputDir, { recursive: true });

const outputFile = path.join(outputDir, 'terraform.json');
fs.writeFileSync(outputFile, JSON.stringify(modules, null, 2));

console.log(`Indexed ${modules.length} Terraform modules to ${outputFile}`);
