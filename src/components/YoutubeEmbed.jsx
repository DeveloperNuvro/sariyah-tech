// src/components/YouTubeEmbed.jsx

import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { VideoOff } from 'lucide-react';

/**
 * A helper function to extract the YouTube video ID from various URL formats.
 * @param {string} url - The YouTube URL.
 * @returns {string | null} The video ID or null if not found.
 */
const getYoutubeVideoId = (url) => {
  if (!url) return null;
  
  try {
    const urlObj = new URL(url);
    // Standard watch URL: https://www.youtube.com/watch?v=VIDEO_ID
    if (urlObj.hostname.includes('youtube.com')) {
      const videoId = urlObj.searchParams.get('v');
      if (videoId) return videoId;
    }
    // Shortened URL: https://youtu.be/VIDEO_ID
    if (urlObj.hostname === 'youtu.be') {
      return urlObj.pathname.slice(1);
    }
  } catch (error) {
    console.error("Invalid URL provided to getYoutubeVideoId:", url);
    return null;
  }
  
  return null;
};

/**
 * A component to responsively embed a YouTube video.
 * It handles URL parsing and provides a clean error state for invalid links.
 */
export const YouTubeEmbed = ({ url }) => {
  const videoId = getYoutubeVideoId(url);

  // If the URL is invalid or not a recognized YouTube link, show an error message.
  if (!videoId) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted">
        <Alert variant="destructive" className="w-auto">
          <VideoOff className="h-4 w-4" />
          <AlertTitle>Video Error</AlertTitle>
          <AlertDescription>
            An invalid YouTube URL was provided for this lesson.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}`;

  return (
    <iframe
      src={embedUrl}
      title="YouTube video player"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
      className="w-full h-full" // This makes it fill the aspect-ratio container
    ></iframe>
  );
};