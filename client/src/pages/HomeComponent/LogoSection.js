import React, { useEffect, useRef, useState } from 'react';
import LogoImage from '../../assets/logo/logo.png';

const LogoSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Placeholder logo component
  const LogoPlaceholder = () => (
            <img
            src={LogoImage}
            alt="Vueon Logo"
            className="w-auto h-60 md:h-72 lg:h-80 xl:h-96"
            />

  );

  return (
    <section
      ref={sectionRef}
      className="relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100"
    >
    <div className="mb-12 mt-6mb-12 md:mt-16 md:mb-16">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute rounded-full -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-100/30 to-purple-100/30 blur-3xl animate-pulse"></div>
          <div
            className="absolute rounded-full -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-pink-100/20 to-blue-100/20 blur-3xl animate-pulse"
            style={{ animationDelay: '1s' }}
          ></div>
        </div>

        <div className="relative z-10 w-full px-4 mx-auto sm:px-6 max-w-7xl lg:px-8">
          <div className="grid items-center grid-cols-1 gap-12 sm:gap-16 lg:grid-cols-2">
            {/* Left Side: Logo */}
            <div
              className={`flex justify-center lg:justify-start transition-all duration-1000 ease-out ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-16'
              }`}
            >
              <div className="relative group">
                {/* Logo container */}
                <div className="relative mt-2 transition-all duration-500 backdrop-blur-xl">
                  <LogoPlaceholder />
                </div>
              </div>
            </div>

            {/* Right Side: Content */}
            <div
              className={`space-y-6 text-center lg:text-left transition-all duration-1000 ease-out ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-16'
              }`}
              style={{ transitionDelay: '0.2s' }}
            >
              {/* Badge */}
              <div className="inline-flex items-center px-3 py-1.5 border rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm border-blue-200/30">
                <div className="w-2 h-2 mr-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse"></div>
                <span className="text-xs font-medium text-gray-700">Next-Gen Streaming</span>
              </div>

              {/* Main heading */}
              <div className="space-y-3">
                <h1 className="text-3xl font-bold leading-tight text-transparent sm:text-4xl lg:text-4xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text">
                  Welcome to
                  <span className="block text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text">
                    Vueon
                  </span>
                </h1>
              </div>

              {/* Description */}
              <p className="max-w-2xl text-base font-light leading-relaxed text-gray-600 sm:text-lg lg:text-lg">
                A cutting-edge video streaming platform revolutionizing how you experience digital content. 
                Discover, watch, and share with{' '}
                <span className="font-medium text-gray-800">seamless streaming</span>,{' '}
                <span className="font-medium text-gray-800">personalized recommendations</span>, and an 
                intuitive interface designed for everyone.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LogoSection;