import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const Header = () => {
  const location = useLocation();
  const user = useSelector((state) => state.user);

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center space-x-3">
            <svg 
              className="h-8 w-8 text-yellow-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 14l9-5-9-5-9 5 9 5z" />
              <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              <path d="M12 14l-6.16-3.422a12.083 12.083 0 00-.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 016.824-2.998 12.078 12.078 0 00-.665-6.479L12 14z" />
            </svg>
            <span className="text-xl font-bold text-purple-900">Alemeno</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === "/"
                  ? "bg-yellow-100 text-yellow-700"
                  : "text-purple-700 hover:bg-purple-100"
              }`}
            >
              Courses
            </Link>
            <Link
              to="/dashboard"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === "/dashboard"
                  ? "bg-yellow-100 text-yellow-700"
                  : "text-purple-700 hover:bg-purple-100"
              }`}
            >
              Dashboard
            </Link>
          </nav>

          {/* User Profile */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-medium text-purple-900">{user?.name}</span>
              <span className="text-xs text-purple-500">{user?.email}</span>
            </div>
            <div className="h-8 w-8 rounded-full bg-yellow-600 flex items-center justify-center cursor-pointer">
              <span className="text-white text-sm font-medium">
                {user?.name?.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button className="mobile-menu-button p-2 rounded-md inline-flex items-center justify-center text-purple-400 hover:text-purple-500 hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-yellow-500">
              <span className="sr-only">Open main menu</span>
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        <div className="md:hidden hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === "/"
                  ? "bg-yellow-100 text-yellow-700"
                  : "text-purple-700 hover:bg-purple-100"
              }`}
            >
              Courses
            </Link>
            <Link
              to="/dashboard"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === "/dashboard"
                  ? "bg-yellow-100 text-yellow-700"
                  : "text-purple-700 hover:bg-purple-100"
              }`}
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 