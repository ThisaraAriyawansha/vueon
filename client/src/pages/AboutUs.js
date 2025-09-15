import React from 'react';
import { Link } from 'react-router-dom';

const AboutUs = () => {
  return (
    <div className="min-h-screen mt-24 text-white bg-primary font-inter">
      {/* Header Section */}
      <header className="container px-4 py-12 mx-auto">
        <h1 className="text-4xl font-bold text-center font-orbitron">About Vueon</h1>
        <p className="mt-4 text-sm text-center text-gray-300">
          Discover who we are and what drives us to connect the world through creativity.
        </p>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-8 mx-auto">
        <section className="max-w-3xl mx-auto">
          <h2 className="mb-4 text-2xl font-semibold">Our Mission</h2>
          <p className="mb-6 text-base text-gray-200">
            At Vueon, we believe in the power of creativity to inspire and connect people. Our mission is to provide a platform where creators, innovators, and enthusiasts can share their stories, ideas, and passions with the world. We aim to foster a community that celebrates diversity, collaboration, and innovation.
          </p>

          <h2 className="mb-4 text-2xl font-semibold">Who We Are</h2>
          <p className="mb-6 text-base text-gray-200">
            Founded in 2025, Vueon is a dynamic platform dedicated to showcasing trending content, empowering creators to upload their work, and connecting users through shared interests. Our team is passionate about building tools that make creativity accessible and rewarding for everyone.
          </p>

          <h2 className="mb-4 text-2xl font-semibold">What We Do</h2>
          <p className="mb-6 text-base text-gray-200">
            Vueon offers a seamless experience for discovering, uploading, and sharing content. Whether you're here to explore trending topics, upload your creations, or connect with like-minded individuals, Vueon is your go-to platform for inspiration and engagement.
          </p>

          <h2 className="mb-4 text-2xl font-semibold">Join Us</h2>
          <p className="mb-6 text-base text-gray-200">
            Be a part of our growing community! Create an account, share your work, and explore what others have to offer. Together, let's build a vibrant space for creativity and connection.
          </p>
          <div className="flex space-x-4">
            <Link
              to="/register"
              className="px-4 py-2 text-sm text-white transition-colors bg-blue-600 rounded-lg hover:text-gray-300 hover:bg-blue-700"
            >
              Sign Up
            </Link>
            <Link
              to="/login"
              className="px-4 py-2 text-sm text-white transition-colors border border-white rounded-lg hover:text-gray-300 hover:border-gray-300"
            >
              Login
            </Link>
          </div>
        </section>
      </main>

      {/* Footer Section */}
      <footer className="container px-4 py-8 mx-auto text-center border-t border-secondary">
        <p className="text-sm text-gray-300">
          &copy; 2025 Vueon. All rights reserved.
        </p>
        <div className="flex justify-center mt-4 space-x-4">
          <Link to="/" className="text-sm text-white transition-colors hover:text-gray-300">
            Home
          </Link>
          <Link to="/trending" className="text-sm text-white transition-colors hover:text-gray-300">
            Trending
          </Link>
          <Link to="/about" className="text-sm text-white transition-colors hover:text-gray-300">
            About
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;