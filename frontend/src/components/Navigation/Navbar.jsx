// src/components/Navigation/Navbar.jsx
import React, { useState } from "react";
import {
  BellIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

export default function Navbar({ onSignOut }) {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-white bg-opacity-80 backdrop-blur-md shadow-md border-b border-gray-200 sticky top-0 z-30">
      {/* Left Section: Logo + Brand */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-xl">
          GT
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Genetic Tracker</h1>
      </div>

      {/* Middle Section: Search Bar */}
      <div className="flex-1 max-w-xl mx-6 relative hidden sm:block">
        <input
          type="text"
          placeholder="Search patients, variants, reports..."
          className="w-full py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-gray-700 placeholder-gray-400"
        />
        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
      </div>

      {/* Right Section: Notifications + Profile */}
      <div className="flex items-center gap-6">
        {/* Notifications */}
        <button className="relative p-2 rounded-full hover:bg-gray-100 transition">
          <BellIcon className="w-6 h-6 text-gray-600" />
          <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 py-1 px-3 rounded-full bg-gray-100 hover:bg-gray-200 transition"
          >
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
              R
            </div>
            <span className="text-gray-700 font-medium hidden md:block">
              Researcher
            </span>
            <ChevronDownIcon className="w-4 h-4 text-gray-500" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-200 py-2 z-50">
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700">
                Profile
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700">
                Settings
              </button>
              <button
                onClick={() => {
                  setProfileOpen(false);
                  if (onSignOut) onSignOut();
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 font-semibold"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
