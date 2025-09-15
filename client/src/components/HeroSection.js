import React from 'react';
import bgImage from "../assets/images/360_F_1371820258_sX7EVDEKwtqsMD4uC93V8rubwKXqaAYx.jpg";

const HeroSection = () => {
  return (
    <section
      className="relative h-screen bg-center bg-cover font-inter"
        style={{
            backgroundImage: `url(${bgImage})`,
        }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-start justify-center h-full px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <h1 className="mb-4 text-4xl font-extrabold text-white md:text-5xl lg:text-6xl">
          Stream Your World with Vueon
        </h1>
        <p className="max-w-2xl mb-6 text-lg text-gray-200 md:text-xl">
          Upload, share, and stream your videos seamlessly with Vueon, the ultimate platform for creators and viewers.
        </p>
        <button className="px-6 py-3 font-semibold text-white transition border border-white rounded-lg">
        Start Streaming
        </button>

      </div>

      {/* Blinking Scroll Icon */}
      <div className="absolute transform -translate-x-1/2 bottom-8 left-1/2">
        <svg
          className="w-8 h-8 text-white opacity-75 animate-bounce"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          ></path>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;