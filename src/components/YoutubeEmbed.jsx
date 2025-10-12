// src/components/YouTubeEmbed.jsx

import React, { useState, useRef, useEffect } from 'react';
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
 * A component to responsively embed videos from various sources.
 * It handles YouTube URLs, direct video URLs, and provides a clean error state for invalid links.
 */
export const YouTubeEmbed = ({ url }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const iframeRef = useRef(null);
  
  useEffect(() => {
    // Reset states when URL changes
    setIsLoading(true);
    setHasError(false);
    setRetryCount(0);
  }, [url]);
  
  if (!url) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <Alert className="w-auto bg-white/80 backdrop-blur-sm border border-gray-200/50">
          <VideoOff className="h-4 w-4" />
          <AlertTitle>No Video</AlertTitle>
          <AlertDescription>
            No video URL provided for this lesson.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const videoId = getYoutubeVideoId(url);

  // Check if it's a YouTube URL
  if (videoId) {
    // Enhanced embed URL with proper parameters
    const baseEmbedUrl = `https://www.youtube.com/embed/${videoId}`;
    const embedUrl = `${baseEmbedUrl}?rel=0&modestbranding=1&playsinline=1&enablejsapi=1&origin=${window.location.origin}&fs=1&cc_load_policy=1`;
    
    const handleIframeLoad = () => {
      setIsLoading(false);
      setHasError(false);
    };
    
    const handleIframeError = (e) => {
      setHasError(true);
      setIsLoading(false);
    };
    
    const retryLoad = () => {
      if (retryCount < 3) {
        setHasError(false);
        setIsLoading(true);
        setRetryCount(prev => prev + 1);
        
        // Try different iframe configurations on retry
        if (iframeRef.current) {
          if (retryCount === 0) {
            // First retry: use basic embed URL
            iframeRef.current.src = baseEmbedUrl;
          } else if (retryCount === 1) {
            // Second retry: add autoplay parameter
            iframeRef.current.src = `${baseEmbedUrl}?autoplay=1&rel=0`;
          } else {
            // Third retry: force reload with full parameters
            iframeRef.current.src = embedUrl;
          }
        }
      } else {
        // After 3 retries, show error with link to YouTube
        setHasError(true);
        setIsLoading(false);
      }
    };
    
    return (
      <div className="w-full h-full relative bg-black rounded-lg overflow-hidden">
        {/* Primary iframe */}
        <iframe
          ref={iframeRef}
          src={embedUrl}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
          allowFullScreen
          className="w-full h-full border-0 rounded-lg"
          loading="lazy"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          style={{ minHeight: '400px' }}
        ></iframe>
        
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
              <p className="text-sm">Loading video...</p>
            </div>
          </div>
        )}
        
        {/* Error state */}
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white">
            <div className="text-center">
              <VideoOff className="h-12 w-12 mx-auto mb-4 text-red-400" />
              <p className="text-sm mb-4">
                {retryCount >= 3 ? 'Unable to load video after multiple attempts' : 'Failed to load video'}
              </p>
              {retryCount < 3 ? (
                <button 
                  onClick={retryLoad}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
                >
                  Retry ({retryCount + 1}/3)
                </button>
              ) : (
                <div className="space-y-2">
                  <a 
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                  >
                    Open in YouTube
                  </a>
                  <p className="text-xs text-gray-400">
                    If the video is private or restricted, it cannot be embedded
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
        
      </div>
    );
  }

  // Check if it's a direct video URL (mp4, webm, etc.)
  const isDirectVideo = /\.(mp4|webm|ogg|mov|avi|mkv)(\?.*)?$/i.test(url);
  if (isDirectVideo) {
    
    return (
      <video
        controls
        className="w-full h-full"
        preload="metadata"
      >
        <source src={url} type="video/mp4" />
        <source src={url} type="video/webm" />
        <source src={url} type="video/ogg" />
        Your browser does not support the video tag.
      </video>
    );
  }

  // Check if it's a Cloudinary URL or other streaming service
  const isCloudinary = url.includes('cloudinary.com') || url.includes('vimeo.com') || url.includes('dailymotion.com');
  if (isCloudinary) {
    
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <Alert className="w-auto bg-white/80 backdrop-blur-sm border border-orange-200/50">
          <VideoOff className="h-4 w-4" />
          <AlertTitle>Please Use YouTube URLs</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>This video format is not supported. Please use YouTube URLs for better compatibility.</p>
            <p className="text-sm text-gray-600">Current URL: {url}</p>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-700">Supported formats:</p>
              <p className="text-sm text-gray-600">• https://www.youtube.com/watch?v=VIDEO_ID</p>
              <p className="text-sm text-gray-600">• https://youtu.be/VIDEO_ID</p>
            </div>
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Open video in new tab
            </a>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // If the URL is invalid or not recognized, show an error message
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
      <Alert variant="destructive" className="w-auto bg-white/80 backdrop-blur-sm border border-red-200/50">
        <VideoOff className="h-4 w-4" />
        <AlertTitle>Video Error</AlertTitle>
        <AlertDescription className="space-y-2">
          <p>Invalid or unsupported video URL format.</p>
          <p className="text-sm text-gray-600">URL: {url}</p>
          <p className="text-sm">Supported formats: YouTube URLs, direct video files (.mp4, .webm, .ogg)</p>
        </AlertDescription>
      </Alert>
    </div>
  );
};