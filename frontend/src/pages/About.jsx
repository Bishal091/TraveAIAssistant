import React from "react";
import { motion } from "framer-motion";
import { FaHeart, FaCode, FaUsers, FaLightbulb, FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Check if user is logged in
  const isLoggedIn = localStorage.getItem("token");

  // Handle "Get Started" button click
  const handleGetStarted = () => {
    if (isLoggedIn) {
      navigate("/"); // Redirect to home if logged in
    } else {
      navigate("/login"); // Redirect to login if not logged in
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex flex-col items-center justify-center p-4 sm:p-8"
    >
      <motion.h1
        variants={itemVariants}
        className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center"
      >
        About <span className="text-indigo-600">Travel AI Assistant</span>
      </motion.h1>

      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-6xl"
      >
        {/* Mission Section */}
        <motion.div
          variants={itemVariants}
          className="bg-white shadow-lg rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center"
        >
          <FaHeart className="text-indigo-600 mb-4" size={48} />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-600">
            To make travel planning effortless and personalized using AI. We aim to inspire and guide travelers to explore the world.
          </p>
        </motion.div>

        {/* Technology Section */}
        <motion.div
          variants={itemVariants}
          className="bg-white shadow-lg rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center"
        >
          <FaCode className="text-indigo-600 mb-4" size={48} />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Technology</h2>
          <p className="text-gray-600">
            Built with React, Node.js, and AI APIs, our platform delivers real-time travel recommendations and insights.
          </p>
        </motion.div>

        {/* Community Section */}
        <motion.div
          variants={itemVariants}
          className="bg-white shadow-lg rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center"
        >
          <FaUsers className="text-indigo-600 mb-4" size={48} />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Community</h2>
          <p className="text-gray-600">
            Join a global community of travelers sharing experiences, tips, and stories to make every journey memorable.
          </p>
        </motion.div>

        {/* Inspiration Section */}
        <motion.div
          variants={itemVariants}
          className="bg-white shadow-lg rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center"
        >
          <FaLightbulb className="text-indigo-600 mb-4" size={48} />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Inspiration</h2>
          <p className="text-gray-600">
            Discover hidden gems, plan your dream trips, and get inspired by AI-curated travel recommendations.
          </p>
        </motion.div>
      </motion.div>

      {/* Connect with Me Section */}
      <motion.div
        variants={itemVariants}
        className="mt-16 w-full max-w-4xl bg-white shadow-lg rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center"
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
          Connect with Me
        </h2>
        <p className="text-gray-600 mb-8">
          Let's stay connected! Follow me on social media for updates, insights, and more.
        </p>
        <div className="flex flex-wrap justify-center gap-10">
          {/* GitHub */}
          <a
            href="https://github.com/Bishal091"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center text-gray-700 hover:text-indigo-600 transition-all duration-300"
          >
            <FaGithub size={48} className="mb-2" />
            <span className="text-lg font-medium">GitHub</span>
          </a>

          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/in/bishal-singh-797129203/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center text-gray-700 hover:text-indigo-600 transition-all duration-300"
          >
            <FaLinkedin size={48} className="mb-2" />
            <span className="text-lg font-medium">LinkedIn</span>
          </a>

          {/* Twitter */}
          <a
            href="https://x.com/Bishal234113"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center text-gray-700 hover:text-indigo-600 transition-all duration-300"
          >
            <FaTwitter size={48} className="mb-2" />
            <span className="text-lg font-medium">X</span>
          </a>
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        variants={itemVariants}
        className="mt-12 w-full max-w-4xl bg-white shadow-lg rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center"
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Start Your Journey
        </h2>
        <p className="text-gray-600 mb-6">
          Whether you're planning a trip or just exploring, Travel AI Assistant is here to guide you.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-indigo-600 text-white px-6 py-3 rounded-full font-bold hover:bg-indigo-700 transition-all duration-300"
          onClick={handleGetStarted}
        >
          {isLoggedIn ? "Explore Now" : "Get Started"}
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default About;