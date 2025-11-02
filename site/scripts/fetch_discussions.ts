import * as fs from 'fs';
import * as path from 'path';

interface Discussion {
  title: string;
  url: string;
  category: string;
  author: string;
  comments: number;
  createdAt: string;
}

async function fetchDiscussions(): Promise<Discussion[]> {
  const token = process.env.GITHUB_TOKEN;
  const owner = 'cywf';
  const repo = 'Infraguard';
  
  if (!token) {
    console.warn('GITHUB_TOKEN not set, skipping discussions fetch');
    return [];
  }
  
  const query = `
    query {
      repository(owner: "${owner}", name: "${repo}") {
        discussions(first: 25, orderBy: {field: UPDATED_AT, direction: DESC}) {
          nodes {
            title
            url
            category {
              name
            }
            author {
              login
            }
            comments {
              totalCount
            }
            createdAt
          }
        }
      }
    }
  `;
  
  try {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch discussions: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.errors) {
      console.warn('GraphQL errors:', data.errors);
      return [];
    }
    
    const discussions: Discussion[] = data.data?.repository?.discussions?.nodes?.map((node: any) => ({
      title: node.title,
      url: node.url,
      category: node.category?.name || 'General',
      author: node.author?.login || 'Unknown',
      comments: node.comments?.totalCount || 0,
      createdAt: node.createdAt,
    })) || [];
    
    return discussions;
  } catch (error) {
    console.error('Error fetching discussions:', error);
    return [];
  }
}

(async () => {
  const discussions = await fetchDiscussions();
  const outputDir = path.join(process.cwd(), 'public', 'data');
  fs.mkdirSync(outputDir, { recursive: true });
  
  const outputFile = path.join(outputDir, 'discussions.json');
  fs.writeFileSync(outputFile, JSON.stringify(discussions, null, 2));
  
  console.log(`Fetched ${discussions.length} discussions to ${outputFile}`);
})();
