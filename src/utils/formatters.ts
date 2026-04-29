/**
 * Display formatters for numbers, dates, and IDs
 */

export const formatViews = (n: number): string => {
  if (n >= 1e9) return (n / 1e9).toFixed(1) + "B";
  if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
  return n.toString();
};

export const formatNumber = (n: number): string => {
  return new Intl.NumberFormat().format(n);
};

export const formatDate = (isoString: string): string => {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }); // e.g. 12 Jan 2024
  } catch {
    return isoString;
  }
};

/**
 * Formats ISO 8601 duration (e.g. PT14M32S) to HH:MM:SS or MM:SS
 */
export const formatDuration = (iso8601: string): string => {
  const match = iso8601.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "00:00";
  
  const h = parseInt(match[1] || "0");
  const m = parseInt(match[2] || "0");
  const s = parseInt(match[3] || "0");
  
  const parts = [];
  if (h > 0) parts.push(h.toString().padStart(2, "0"));
  parts.push(m.toString().padStart(2, "0"));
  parts.push(s.toString().padStart(2, "0"));
  
  return parts.join(":");
};

export const extractVideoId = (url: string): string | null => {
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&?/\s]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^&?/\s]+)/,
    /(?:https?:\/\/)?youtu\.be\/([^&?/\s]+)/,
    /^([^&?/\s]{11})$/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

export const extractChannelId = (url: string): string | null => {
  // Handles /channel/ID, /c/name, /@handle, raw ID, or direct @handle
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/channel\/([^&?/\s]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/c\/([^&?/\s]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/user\/([^&?/\s]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/@([^&?/\s]+)/,
    /^(@[^&?/\s]+)$/,
    /^(UC[^&?/\s]{22})$/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      const value = match[1];
      if (url.includes("@") || value.startsWith("@")) {
        return value.startsWith("@") ? value : "@" + value;
      }
      return value;
    }
  }
  return null;
};
