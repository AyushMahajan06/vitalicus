'use client'
import React, { useRef, useEffect } from 'react';

const HeroVideo = () => {
  // Tell TypeScript this ref will hold an HTMLVideoElement or null.
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // The 'if' check is now also a type guard for TypeScript.
    if (videoRef.current) {
      // TypeScript now correctly knows that .current is an HTMLVideoElement.
      videoRef.current.playbackRate = 0.2;
    }
  }, []);

  return (
    <video
      ref={videoRef}
      className="hero-video"
      src="/videos/hero.mp4"
      autoPlay
      muted
      loop
      playsInline
    />
  );
};

export default HeroVideo;