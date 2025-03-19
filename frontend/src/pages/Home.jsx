import React from "react";
import { Link } from "react-router-dom";
import CommunityRequests from "../components/home/CommunityRequests";
import FeaturedEvents from "../components/home/FeaturedEvents";
import HeroSection from "../components/home/HeroSection";

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <HeroSection />

      {/* Upcoming Events Section */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Upcoming Events
              </h2>
              <p className="text-gray-500 mt-2">
                Find and join volunteer events in your community
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-2">
              <Link
                to="/events"
                className="inline-flex h-9 items-center justify-center text-sm font-medium text-primary"
              >
                View all
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Link>
            </div>
          </div>
          <FeaturedEvents />
        </div>
      </section>

      {/* Community Help Requests Section */}
      <section className="py-12 md:py-16 lg:py-20 bg-gray-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Community Help Requests
              </h2>
              <p className="text-gray-500 mt-2">
                Respond to requests for help from your community
              </p>
            </div>
            <Link
              to="/community-help"
              className="mt-4 md:mt-0 inline-flex h-9 items-center justify-center text-sm font-medium text-primary"
            >
              View all
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </Link>
          </div>
          <CommunityRequests />
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 md:py-20 lg:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-4xl font-extrabold tracking-tight text-gray-800 mb-6">
            Make a Difference Together
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-10">
            Join teams of passionate volunteers to tackle bigger challenges,
            create lasting impact, and build a stronger community. Together, we
            can make a difference.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Card 1 */}
            <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Form Teams
              </h3>
              <p className="text-gray-600 text-sm">
                Create or join teams for long-term initiatives and impactful
                projects.
              </p>
            </div>

            {/* Card 2 */}
            <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Track Events
              </h3>
              <p className="text-gray-600 text-sm">
                Organize and manage team events and volunteer opportunities with
                ease.
              </p>
            </div>

            {/* Card 3 */}
            <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Log Impact
              </h3>
              <p className="text-gray-600 text-sm">
                Record volunteer hours and track your team's collective impact.
              </p>
            </div>
          </div>
          <Link
            to="/teams"
            className="inline-flex h-12 items-center justify-center rounded-md bg-blue-600 px-10 py-3 text-lg font-medium text-white shadow-lg transition-transform hover:bg-blue-700 hover:scale-105 mt-10"
          >
            Create or Join a Team
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
