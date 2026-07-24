// Dynamic YouTube Data API v3 Service
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || 'AIzaSyB2aLa84WdIv7Q4m_zn7IlhivdwBxz2waI';

export const youtubeService = {
  /**
   * Search YouTube for live video lectures matching a query
   * @param {string} query Search topic
   * @returns {Promise<Array>} List of YouTube video objects
   */
  async searchVideos(query) {
    if (!query) return [];

    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
          query + ' course lecture'
        )}&type=video&videoEmbeddable=true&maxResults=5&key=${YOUTUBE_API_KEY}`
      );

      if (!res.ok) {
        throw new Error(`YouTube API Error: ${res.status}`);
      }

      const data = await res.json();
      return (data.items || []).map((item) => ({
        videoId: item.id.videoId,
        title: item.snippet.title,
        channel: item.snippet.channelTitle,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url,
        badge: 'YouTube Live'
      }));
    } catch (err) {
      console.warn('Live YouTube API search fallback:', err.message);
      return [];
    }
  }
};
