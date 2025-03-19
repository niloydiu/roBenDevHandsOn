function Footer() {
  return (
    <footer className="bg-gray-100 border-t py-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-6 px-4 md:px-6">
        {/* Logo and Branding */}
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <span className="text-xl font-bold text-gray-800">HandsOn</span>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-wrap justify-center gap-4">
          <a
            href="https://github.com/niloydiu/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-500 hover:text-blue-600 hover:underline underline-offset-4 transition-colors"
          >
            Github
          </a>
          <a
            href="https://niloykm.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-500 hover:text-blue-600 hover:underline underline-offset-4 transition-colors"
          >
            Portfolio
          </a>
          <a
            href="https://www.linkedin.com/in/niloykumarmohonta000/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-500 hover:text-blue-600 hover:underline underline-offset-4 transition-colors"
          >
            LinkedIn
          </a>
        </nav>

        {/* Copyright */}
        <p className="text-sm text-gray-500 text-center md:text-right">
          <a
            href="https://niloykm.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 hover:underline"
          >
            niloykumarmohonta@gmail.com
          </a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
