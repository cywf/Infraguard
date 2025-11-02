import * as fs from 'fs';
import * as path from 'path';

interface ProjectItem {
  title: string;
  url: string;
  labels: string[];
}

interface ProjectData {
  todo: ProjectItem[];
  doing: ProjectItem[];
  done: ProjectItem[];
}

async function fetchProjects(): Promise<ProjectData> {
  const token = process.env.GITHUB_TOKEN;
  const repo = 'cywf/Infraguard';
  
  if (!token) {
    console.warn('GITHUB_TOKEN not set, skipping projects fetch');
    return { todo: [], doing: [], done: [] };
  }
  
  const headers = {
    'Authorization': `token ${token}`,
    'Accept': 'application/vnd.github.v3+json',
  };
  
  try {
    const response = await fetch(`https://api.github.com/repos/${repo}/issues?state=open&per_page=100`, { headers });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch issues: ${response.statusText}`);
    }
    
    const issues = await response.json();
    
    const data: ProjectData = {
      todo: [],
      doing: [],
      done: [],
    };
    
    for (const issue of issues) {
      const item: ProjectItem = {
        title: issue.title,
        url: issue.html_url,
        labels: issue.labels.map((l: any) => l.name),
      };
      
      const labelNames = item.labels.map(l => l.toLowerCase());
      
      if (labelNames.includes('in-progress') || labelNames.includes('doing')) {
        data.doing.push(item);
      } else if (labelNames.includes('done') || labelNames.includes('completed')) {
        data.done.push(item);
      } else {
        data.todo.push(item);
      }
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return { todo: [], doing: [], done: [] };
  }
}

(async () => {
  const projects = await fetchProjects();
  const outputDir = path.join(process.cwd(), 'public', 'data');
  fs.mkdirSync(outputDir, { recursive: true });
  
  const outputFile = path.join(outputDir, 'projects.json');
  fs.writeFileSync(outputFile, JSON.stringify(projects, null, 2));
  
  console.log(`Fetched projects to ${outputFile}`);
  console.log(`Todo: ${projects.todo.length}, Doing: ${projects.doing.length}, Done: ${projects.done.length}`);
})();
