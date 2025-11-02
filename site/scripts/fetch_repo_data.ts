import * as fs from 'fs';
import * as path from 'path';

interface RepoStats {
  stars: number;
  forks: number;
  watchers: number;
  languages: Record<string, number>;
  commits: Array<{ date: string; count: number }>;
}

async function fetchRepoData(): Promise<RepoStats> {
  const token = process.env.GITHUB_TOKEN;
  const repo = 'cywf/Infraguard';
  
  if (!token) {
    console.warn('GITHUB_TOKEN not set, using mock data');
    return {
      stars: 0,
      forks: 0,
      watchers: 0,
      languages: {},
      commits: [],
    };
  }
  
  const headers = {
    'Authorization': `token ${token}`,
    'Accept': 'application/vnd.github.v3+json',
  };
  
  try {
    const repoResponse = await fetch(`https://api.github.com/repos/${repo}`, { headers });
    if (!repoResponse.ok) {
      throw new Error(`Failed to fetch repo: ${repoResponse.statusText}`);
    }
    const repoData = await repoResponse.json();
    
    const langResponse = await fetch(`https://api.github.com/repos/${repo}/languages`, { headers });
    const languages = langResponse.ok ? await langResponse.json() : {};
    
    const activityResponse = await fetch(`https://api.github.com/repos/${repo}/stats/commit_activity`, { headers });
    let commits: Array<{ date: string; count: number }> = [];
    
    if (activityResponse.ok) {
      const activity = await activityResponse.json();
      if (Array.isArray(activity)) {
        commits = activity.slice(-12).map((week: any) => ({
          date: new Date(week.week * 1000).toISOString().split('T')[0],
          count: week.total,
        }));
      }
    }
    
    const stats: RepoStats = {
      stars: repoData.stargazers_count || 0,
      forks: repoData.forks_count || 0,
      watchers: repoData.watchers_count || 0,
      languages,
      commits,
    };
    
    return stats;
  } catch (error) {
    console.error('Error fetching repo data:', error);
    return {
      stars: 0,
      forks: 0,
      watchers: 0,
      languages: {},
      commits: [],
    };
  }
}

(async () => {
  const stats = await fetchRepoData();
  const outputDir = path.join(process.cwd(), 'public', 'data');
  fs.mkdirSync(outputDir, { recursive: true });
  
  const outputFile = path.join(outputDir, 'stats.json');
  fs.writeFileSync(outputFile, JSON.stringify(stats, null, 2));
  
  console.log(`Fetched repo stats to ${outputFile}`);
  console.log(`Stars: ${stats.stars}, Forks: ${stats.forks}, Watchers: ${stats.watchers}`);
})();
