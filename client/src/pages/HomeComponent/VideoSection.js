import React, { useRef, useEffect } from 'react';
import videoFile from '../../assets/video/videoplayback1080Compress.mp4';

const PearlStaySection = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch((error) => console.error('Video play error:', error));
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.5 } // Trigger when 50% of the section is in view
    );

    if (video) {
      observer.observe(video);
    }

    return () => {
      if (video) {
        observer.unobserve(video);
      }
    };
  }, []);

  return (
    <div className="py-4 bg-white ">
      {/* Video Background Section */}
      <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] flex items-center justify-center text-center text-white overflow-hidden  shadow-lg">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full">
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            className="object-cover w-full h-full"
          >
            <source src={videoFile} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/10"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl px-4 mx-auto text-center">
          <p className="mb-2 text-xs font-light tracking-wide uppercase sm:text-sm md:text-base md:mb-3">
              Welcome to Vueon — the platform empowering creators to upload, share, and stream videos seamlessly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PearlStaySection;