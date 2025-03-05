import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { FiSun, FiMoon, FiLogOut } from "react-icons/fi";

export default function Navbar({ user, setDarkMode, darkMode }) {
  const [searchQuery, setSearchQuery] = useState("");

  function handleLogout() {
    signOut(auth);
  }

  return (
    <nav className="bg-gray-900 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold">
          📖 StoryApp
        </Link>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search stories..."
          className="px-3 py-1 rounded-md text-black w-64"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Navigation Links */}
        <div className="hidden md:flex gap-6">
          <Link to="/" className="hover:text-gray-300">Home</Link>
          <Link to="/categories" className="hover:text-gray-300">Categories</Link>
          <Link to="/popular" className="hover:text-gray-300">Popular</Link>
          <Link to="/about" className="hover:text-gray-300">About</Link>
        </div>

        {/* Dark Mode Toggle */}
        <button onClick={() => setDarkMode(!darkMode)} className="ml-4">
          {darkMode ? <FiSun size={24} /> : <FiMoon size={24} />}
        </button>

        {/* Admin Controls (Only Show if Logged In) */}
        {user && (
          <div className="ml-4 flex gap-4">
            <Link to="/add-story" className="hover:text-gray-300">➕ Add Story</Link>
            <button onClick={handleLogout} className="hover:text-red-500 flex items-center gap-2">
              <FiLogOut size={20} /> Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
