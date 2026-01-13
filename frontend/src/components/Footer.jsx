import React from "react";
import { Link } from "react-router-dom";
import { HiOutlineMail, HiOutlineGlobeAlt } from "react-icons/hi";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-20 pb-10">
      <div className="container mx-auto px-4 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                H
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                Hands<span className="text-blue-500">On</span>
              </span>
            </Link>
            <p className="text-slate-400 leading-relaxed max-w-xs">
              Empowering communities through collective action. Join us in making a real difference in the world, one event at a time.
            </p>
            <div className="flex gap-4">
              {[
                { icon: <FaGithub />, link: "https://github.com/niloydiu/" },
                { icon: <FaLinkedin />, link: "https://www.linkedin.com/in/niloykumarmohonta000/" },
                { icon: <FaTwitter />, link: "#" }
              ].map((social, i) => (
                <a 
                  key={i} 
                  href={social.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all active:scale-90"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Platform</h4>
            <ul className="space-y-4">
              {["Events", "Browse Teams", "Community Help", "Leaderboard"].map((item) => (
                <li key={item}>
                  <Link to={`/${item.toLowerCase().replace(" ", "-")}`} className="hover:text-blue-500 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Development</h4>
            <ul className="space-y-4">
              <li>
                 <a href="https://github.com/niloydiu/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">
                  Open Source
                 </a>
              </li>
              <li>
                 <a href="https://niloykm.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">
                  Developer Portfolio
                 </a>
              </li>
              <li>
                 <a href="#" className="hover:text-blue-500 transition-colors">
                  API Documentation
                 </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Get In Touch</h4>
            <div className="space-y-4">
              <a href="mailto:niloykumarmohonta@gmail.com" className="flex items-center gap-3 hover:text-blue-500 transition-colors">
                <HiOutlineMail className="text-blue-500" size={20} />
                <span>niloykumarmohonta@gmail.com</span>
              </a>
              <div className="flex items-center gap-3">
                <HiOutlineGlobeAlt className="text-blue-500" size={20} />
                <span>Global Community</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-slate-500">
            © {currentYear} HandsOn Platform. Built with ❤️ for humans.
          </p>
          <div className="flex gap-8 text-xs text-slate-500 font-medium">
            <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="#" className="hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
