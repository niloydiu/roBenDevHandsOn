// import React from "react";
// import { Link } from "react-router-dom";

// const HeroSection = () => {
//   return (
//     <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
//       <div className="container mx-auto px-4 md:px-6">
//         <div className="flex flex-col justify-center space-y-6 text-center md:text-left">
//           <div className="space-y-4">
//             <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl">
//               Make an Impact in Your Community
//             </h1>
//             <p className="max-w-[600px] mx-auto md:mx-0 text-gray-500 md:text-xl">
//               Join HandsOn to discover volunteer opportunities, connect with
//               like-minded individuals, and track your social impact.
//             </p>
//           </div>
//           <div className="flex flex-col gap-2 justify-center md:justify-start sm:flex-row">
//             <Link
//               to="/signup"
//               className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-primary/90 bg-blue-500"
//             >
//               Get Started
//             </Link>
//             <Link
//               to="/events"
//               className="inline-flex h-10 items-center justify-center rounded-md border border-gray-300 bg-white px-8 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100"
//             >
//               Browse Events
//             </Link>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default HeroSection;

import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Appcontext } from "../../context/Appcontext";

const HeroSection = () => {
  const { isLoggedIn } = useContext(Appcontext);
  const navigate = useNavigate();

  // More robust function to navigate and scroll to help-requests
  const navigateToHelpRequests = () => {
    navigate("/community-help");

    // Try multiple times with increasing delays to ensure the element is rendered
    const attemptScroll = (attemptCount = 0) => {
      const helpRequestsSection = document.getElementById("help-requests");

      if (helpRequestsSection) {
        console.log(
          "Found help-requests section, scrolling to:",
          helpRequestsSection.offsetTop
        );

        // Use both approaches for maximum compatibility
        // 1. scrollIntoView for element-based scrolling
        helpRequestsSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

        // 2. scrollTo as a backup
        window.scrollTo({
          top: helpRequestsSection.offsetTop,
          behavior: "smooth",
        });

        // 3. Force scroll after a tiny delay to handle any post-render adjustments
        setTimeout(() => {
          window.scrollTo(0, helpRequestsSection.offsetTop);
        }, 50);
      } else if (attemptCount < 5) {
        // Try again with exponential backoff
        console.log(
          `Help-requests section not found, retrying... (attempt ${
            attemptCount + 1
          })`
        );
        const nextDelay = 200 * Math.pow(1.5, attemptCount);
        setTimeout(() => attemptScroll(attemptCount + 1), nextDelay);
      }
    };

    // Start first attempt after navigation has had time to complete
    setTimeout(() => attemptScroll(), 300);
  };

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col justify-center space-y-6 text-center md:text-left">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl">
              Make an Impact in Your Community
            </h1>
            <p className="max-w-[600px] mx-auto md:mx-0 text-gray-500 md:text-xl">
              Join HandsOn to discover volunteer opportunities, connect with
              like-minded individuals, and track your social impact.
            </p>
          </div>
          <div className="flex flex-col gap-2 justify-center md:justify-start sm:flex-row">
            {isLoggedIn ? (
              <button
                onClick={navigateToHelpRequests}
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-primary/90 bg-blue-500"
              >
                Help Requests
              </button>
            ) : (
              <Link
                to="/signup"
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-primary/90 bg-blue-500"
              >
                Get Started
              </Link>
            )}
            <Link
              to="/events"
              className="inline-flex h-10 items-center justify-center rounded-md border border-gray-300 bg-white px-8 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100"
            >
              Browse Events
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
