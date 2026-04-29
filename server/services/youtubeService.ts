import axios from 'axios';
import NodeCache from 'node-cache';
import { calcEngagementRate, calcViewsPerHour, calcCommentVelocity, calcSEOScore, calcSentiment } from '../../src/utils/calculations.js';

const cache = new NodeCache({ stdTTL: 3600 });
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

export class YouTubeService {
  private apiKeys: string[];
  private currentKeyIndex: number = 0;

  constructor(apiKeys: string[]) {
    this.apiKeys = apiKeys;
  }

  private getActiveKey(): string {
    if (this.apiKeys.length === 0) throw new Error('No YouTube API key provided');
    return this.apiKeys[this.currentKeyIndex];
  }

  private rotateKey() {
    this.currentKeyIndex = (this.currentKeyIndex + 1) % this.apiKeys.length;
  }

  private async fetchWithRotation(endpoint: string, params: any) {
    let attempts = 0;
    while (attempts < this.apiKeys.length) {
      try {
        const response = await axios.get(`${YOUTUBE_API_BASE}/${endpoint}`, {
          params: { ...params, key: this.getActiveKey() }
        });
        return response.data;
      } catch (error: any) {
        if (error.response?.status === 403) {
          console.warn(`API key ${this.getActiveKey()} failed (quota). Rotating...`);
          this.rotateKey();
          attempts++;
        } else {
          throw error;
        }
      }
    }
    throw new Error('All API keys quota exceeded');
  }

  async analyzeVideo(videoId: string) {
    const cacheKey = `video:${videoId}`;
    const cached = cache.get(cacheKey);
    if (cached) return { ...cached as any, fromCache: true };

    const data = await this.fetchWithRotation('videos', {
      id: videoId,
      part: 'snippet,contentDetails,statistics,status,player,topicDetails,recordingDetails'
    });

    if (!data.items?.length) throw new Error('Video not found or is private.');
    const video = data.items[0];

    // Enrichment
    const views = parseInt(video.statistics.viewCount);
    const likes = parseInt(video.statistics.likeCount || '0');
    const comments = parseInt(video.statistics.commentCount || '0');
    
    const engagementRate = calcEngagementRate(likes, comments, views);
    const seoScore = calcSEOScore(
      video.snippet.title,
      video.snippet.description,
      video.snippet.tags || [],
      video.contentDetails.caption === 'true',
      engagementRate
    );

    // Chapter parsing from description
    const chapters = this.parseChapters(video.snippet.description);

    const enriched = {
      ...video,
      chapters,
      analysis: {
        engagementRate,
        likeToViewRatio: Number(((likes / views) * 100).toFixed(2)),
        commentToViewRatio: Number(((comments / views) * 100).toFixed(2)),
        viewsPerHour: calcViewsPerHour(views, video.snippet.publishedAt),
        commentVelocity: calcCommentVelocity(comments, video.snippet.publishedAt),
        seoScore,
        estimatedDislikeCount: Math.round(views * 0.015) // Industry average estimate
      }
    };

    cache.set(cacheKey, enriched);
    return enriched;
  }

  private parseChapters(description: string) {
    const timeRegex = /(?:(\d{1,2}):)?(\d{1,2}):(\d{2})/g;
    const lines = description.split('\n');
    const chapters = [];

    for (const line of lines) {
      const matches = [...line.matchAll(timeRegex)];
      if (matches.length > 0) {
        const timeStr = matches[0][0];
        const title = line.replace(timeStr, '').trim().replace(/^[-:| ]+/, '');
        if (title) {
          chapters.push({ time: timeStr, title });
        }
      }
    }
    return chapters;
  }

  async fetchChannelVideos(channelId: string, maxResults = 50) {
    // 1. Get uploads playlist ID
    const channelData = await this.analyzeChannel(channelId);
    const uploadsPlaylistId = channelData.contentDetails.relatedPlaylists.uploads;

    // 2. Fetch playlist items
    const playlistItems = await this.fetchWithRotation('playlistItems', {
      playlistId: uploadsPlaylistId,
      part: 'snippet,contentDetails',
      maxResults
    });

    const videoIds = playlistItems.items.map((item: any) => item.contentDetails.videoId);

    // 3. Fetch full stats for those videos in batches
    const videoStats = await this.fetchWithRotation('videos', {
      id: videoIds.join(','),
      part: 'snippet,statistics,contentDetails'
    });

    return videoStats.items.map((video: any) => {
      const views = parseInt(video.statistics.viewCount);
      const likes = parseInt(video.statistics.likeCount || '0');
      const comments = parseInt(video.statistics.commentCount || '0');
      return {
        ...video,
        engagementRate: calcEngagementRate(likes, comments, views)
      };
    });
  }

  async analyzeChannel(channelId: string) {
    const cacheKey = `channel:${channelId}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const params: any = {
      part: 'snippet,statistics,contentDetails,brandingSettings,topicDetails'
    };

    if (channelId.startsWith('@')) {
      params.forHandle = channelId;
    } else {
      params.id = channelId;
    }

    let data = await this.fetchWithRotation('channels', params);

    if (!data.items?.length && channelId.startsWith('@')) {
      const search = await this.fetchWithRotation('search', {
        q: channelId,
        type: 'channel',
        part: 'id',
        maxResults: 1
      });
      if (search.items?.length) {
        const actualId = search.items[0].id.channelId;
        data = await this.fetchWithRotation('channels', {
          id: actualId,
          part: 'snippet,statistics,contentDetails,brandingSettings,topicDetails'
        });
      }
    }

    if (!data.items?.length) throw new Error('Channel not found');
    const channel = data.items[0];

    cache.set(cacheKey, channel);
    return channel;
  }

  async fetchComments(videoId: string, maxResults = 100) {
    const data = await this.fetchWithRotation('commentThreads', {
      videoId,
      part: 'snippet',
      maxResults,
      order: 'relevance'
    });

    const comments = data.items.map((item: any) => item.snippet.topLevelComment.snippet.textDisplay);
    const sentiment = calcSentiment(comments);
    
    // Extract questions and common words
    const questions = comments.filter((c: string) => c.includes('?') && c.length > 10).slice(0, 10);
    
    const wordFreq: Record<string, number> = {};
    comments.forEach((c: string) => {
      const words = c.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);
      words.forEach(w => {
        if (w.length > 4) wordFreq[w] = (wordFreq[w] || 0) + 1;
      });
    });

    const topWords = Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([text, value]) => ({ text, value }));

    return {
      threads: data.items,
      sentiment,
      questions,
      topWords,
      totalCount: comments.length
    };
  }

  async searchKeywords(query: string) {
    const cacheKey = `keywords:${query}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    // Use search.list - High Quota Cost (100 units)
    const data = await this.fetchWithRotation('search', {
      q: query,
      part: 'snippet',
      maxResults: 10,
      type: 'video'
    });

    // Extract tags from top 10 videos (requires another call or we just use snippet)
    // To save quota, we use the search titles and descriptions to suggest keywords
    const suggestions = data.items.map((item: any) => ({
      title: item.snippet.title,
      description: item.snippet.description,
      videoId: item.id.videoId
    }));

    cache.set(cacheKey, suggestions, 3600); // 1 hour cache
    return suggestions;
  }
}
