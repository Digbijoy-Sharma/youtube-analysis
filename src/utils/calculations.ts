/**
 * Core formulas for YouTube metrics and analysis
 */

/**
 * Calculates engagement rate as a percentage
 * Formula: ((Likes + Comments) / Views) * 100
 */
export const calcEngagementRate = (likes: number, comments: number, views: number): number => {
  if (views === 0) return 0;
  return Number(((likes + comments) / views * 100).toFixed(2));
};

/**
 * Calculates views per hour since publication
 */
export const calcViewsPerHour = (views: number, publishedAt: string): number => {
  const publishedDate = new Date(publishedAt).getTime();
  const now = Date.now();
  const hoursSince = Math.max(1, (now - publishedDate) / (1000 * 60 * 60));
  return Math.round(views / hoursSince);
};

/**
 * Calculates comment velocity (comments per day since publication)
 */
export const calcCommentVelocity = (comments: number, publishedAt: string): number => {
  const publishedDate = new Date(publishedAt).getTime();
  const now = Date.now();
  const daysSince = Math.max(1, (now - publishedDate) / (1000 * 60 * 60 * 24));
  return Number((comments / daysSince).toFixed(2));
};

/**
 * Basic SEO scoring logic (0-100)
 */
export interface SEOScoreBreakdown {
  title: number;
  description: number;
  tags: number;
  captions: number;
  engagement: number;
  total: number;
}

export const calcSEOScore = (
  title: string,
  description: string,
  tags: string[],
  hasCaptions: boolean,
  engagementRate: number
): SEOScoreBreakdown => {
  const breakdown = {
    title: 0,
    description: 0,
    tags: 0,
    captions: hasCaptions ? 20 : 0,
    engagement: 0,
  };

  // Title: max 20pts. Ideal: 50-70 chars
  const titleLen = title.length;
  if (titleLen >= 50 && titleLen <= 70) breakdown.title = 20;
  else if (titleLen > 20) breakdown.title = 10;

  // Description: max 20pts. Ideal: 250+ chars, has links, has hashtags
  if (description.length > 250) breakdown.description += 10;
  if (description.includes("http")) breakdown.description += 5;
  if (description.includes("#")) breakdown.description += 5;

  // Tags: max 20pts. Ideal: 5-15 tags
  if (tags.length >= 5 && tags.length <= 15) breakdown.tags = 20;
  else if (tags.length > 0) breakdown.tags = 10;

  // Engagement: max 20pts. Green (> 4%) = 20, Yellow (2-4%) = 10
  if (engagementRate > 4) breakdown.engagement = 20;
  else if (engagementRate > 2) breakdown.engagement = 10;

  return {
    ...breakdown,
    total: breakdown.title + breakdown.description + breakdown.tags + breakdown.captions + breakdown.engagement,
  };
};

/**
 * Mock sentiment analyzer using keyword matching as requested
 */
export const calcSentiment = (comments: string[]) => {
  const positiveWords = ["great", "awesome", "perfect", "good", "love", "help", "thank", "wow", "amazing", "best"];
  const negativeWords = ["bad", "terrible", "worst", "hate", "useless", "confusing", "slow", "broken", "issue", "boring"];
  
  let positiveCount = 0;
  let negativeCount = 0;
  
  comments.forEach(comment => {
    const lower = comment.toLowerCase();
    if (positiveWords.some(w => lower.includes(w))) positiveCount++;
    if (negativeWords.some(w => lower.includes(w))) negativeCount++;
  });
  
  const total = positiveCount + negativeCount || 1;
  return {
    positive: Math.round((positiveCount / total) * 100),
    negative: Math.round((negativeCount / total) * 100),
    neutral: Math.max(0, 100 - Math.round((positiveCount / total) * 100) - Math.round((negativeCount / total) * 100)),
  };
};
