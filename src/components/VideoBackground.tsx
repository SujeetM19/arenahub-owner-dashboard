import React, { useState, useEffect } from 'react';
import './VideoBackground.css';

const VideoBackground: React.FC = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const videos = [
    '/videos/Generate_a_intense_202509070318.mp4',
    '/videos/Make_videos_of_202509070316.mp4',
    '/videos/All_these_videos_202509070315.mp4',
    '/videos/All_these_videos_202509070305.mp4'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      
      setTimeout(() => {
        setCurrentVideoIndex((prevIndex) => 
          (prevIndex + 1) % videos.length
        );
        setIsTransitioning(false);
      }, 1000); // 1 second transition duration
    }, 8000); // Change video every 8 seconds

    return () => clearInterval(interval);
  }, [videos.length]);

  return (
    <div className="video-background">
      {videos.map((video, index) => (
        <video
          key={video}
          className={`video-layer ${index === currentVideoIndex ? 'active' : ''} ${isTransitioning ? 'transitioning' : ''}`}
          autoPlay
          muted
          loop
          playsInline
        >
          <source src={video} type="video/mp4" />
        </video>
      ))}
      <div className="video-overlay" />
    </div>
  );
};

export default VideoBackground;








