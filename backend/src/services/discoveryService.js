const fetchYoutube = async (tag) => {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey || apiKey === 'your_youtube_api_key') {
    return [
      {
        title: `${tag.toUpperCase()} Masterclass & Tutorial`,
        url: `https://www.youtube.com/results?search_query=${encodeURIComponent(tag)}`,
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
        type: 'video',
        source: 'auto'
      }
    ];
  }

  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(tag)}&type=video&maxResults=3&key=${apiKey}`
    );
    if (!res.ok) throw new Error(`YouTube API HTTP ${res.status}`);
    const data = await res.json();
    return (data.items || []).map((item) => ({
      title: item.snippet.title,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url || '',
      type: 'video',
      source: 'auto'
    }));
  } catch (err) {
    console.warn('fetchYoutube failed, using fallback:', err.message);
    return [
      {
        title: `${tag} Concept Explanation & Crash Course`,
        url: `https://www.youtube.com/results?search_query=${encodeURIComponent(tag)}`,
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
        type: 'video',
        source: 'auto'
      }
    ];
  }
};

const fetchGithub = async (tag) => {
  try {
    const headers = { 'User-Agent': 'EduHive-Academic-App' };
    if (process.env.GITHUB_TOKEN && process.env.GITHUB_TOKEN !== 'your_github_token') {
      headers.Authorization = `token ${process.env.GITHUB_TOKEN}`;
    }

    const res = await fetch(
      `https://api.github.com/search/repositories?q=${encodeURIComponent(tag)}&sort=stars&order=desc&per_page=3`,
      { headers }
    );
    if (!res.ok) throw new Error(`GitHub API HTTP ${res.status}`);
    const data = await res.json();
    return (data.items || []).map((repo) => ({
      title: repo.full_name,
      url: repo.html_url,
      thumbnail: repo.owner?.avatar_url || '',
      type: 'github',
      source: 'auto'
    }));
  } catch (err) {
    console.warn('fetchGithub failed, using fallback:', err.message);
    return [
      {
        title: `awesome-${tag.toLowerCase()}-resources`,
        url: `https://github.com/search?q=${encodeURIComponent(tag)}`,
        thumbnail: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
        type: 'github',
        source: 'auto'
      }
    ];
  }
};

const fetchArxiv = async (tag) => {
  try {
    const res = await fetch(
      `https://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(tag)}&start=0&max_results=3`
    );
    if (!res.ok) throw new Error(`arXiv API HTTP ${res.status}`);
    const text = await res.text();

    const entries = [];
    const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
    let match;
    while ((match = entryRegex.exec(text)) !== null) {
      const entryContent = match[1];
      const titleMatch = /<title>([\s\S]*?)<\/title>/.exec(entryContent);
      const idMatch = /<id>([\s\S]*?)<\/id>/.exec(entryContent);

      if (titleMatch && idMatch) {
        entries.push({
          title: titleMatch[1].replace(/\n/g, ' ').trim(),
          url: idMatch[1].trim(),
          thumbnail: '',
          type: 'research_paper',
          source: 'auto'
        });
      }
    }
    return entries.length > 0
      ? entries
      : [
          {
            title: `Recent Advances in ${tag}`,
            url: `https://arxiv.org/search/?query=${encodeURIComponent(tag)}&searchtype=all`,
            thumbnail: '',
            type: 'research_paper',
            source: 'auto'
          }
        ];
  } catch (err) {
    console.warn('fetchArxiv failed, using fallback:', err.message);
    return [
      {
        title: `Comprehensive Survey on ${tag}`,
        url: `https://arxiv.org/search/?query=${encodeURIComponent(tag)}&searchtype=all`,
        thumbnail: '',
        type: 'research_paper',
        source: 'auto'
      }
    ];
  }
};

const discoverExternalResources = async (tag) => {
  const results = await Promise.allSettled([
    module.exports.fetchYoutube(tag),
    module.exports.fetchGithub(tag),
    module.exports.fetchArxiv(tag)
  ]);

  const discovered = [];
  results.forEach((res) => {
    if (res.status === 'fulfilled' && Array.isArray(res.value)) {
      discovered.push(...res.value);
    }
  });

  return discovered;
};

module.exports = {
  fetchYoutube,
  fetchGithub,
  fetchArxiv,
  discoverExternalResources
};
