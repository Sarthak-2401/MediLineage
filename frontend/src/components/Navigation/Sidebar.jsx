// src/components/Navigation/Sidebar.jsx
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const NavItem = ({ to, label, emoji, onClick }) => {
  const loc = useLocation();
  const isActive = loc.pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`block px-6 py-3 rounded-lg mb-2 transition-colors duration-200
        ${
          isActive
            ? "bg-blue-600 text-white font-semibold"
            : "text-gray-300 hover:bg-white hover:bg-opacity-10 hover:text-black"
        }`}
    >
      <span className="mr-3">{emoji}</span>
      {label}
    </Link>
  );
};

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      {/* Top Bar with Burger Button (Mobile Only) */}
      <div className="flex items-center justify-between bg-black bg-opacity-60 px-4 py-3 text-white sticky top-0 z-40 md:hidden">
        <div className="text-xl font-bold">Genetic Tracker</div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md hover:bg-white hover:bg-opacity-10"
        >
          {isOpen ? (
            <XMarkIcon className="h-6 w-6 text-white" />
          ) : (
            <Bars3Icon className="h-6 w-6 text-white" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 h-full w-64 p-6 bg-black bg-opacity-60 text-white transform transition-transform duration-300 z-30
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Sidebar Header */}
        <div className="mb-6 hidden md:block">
          <div className="text-2xl font-bold text-blue-200">Genetic Tracker</div>
          <div className="text-xs text-gray-300 mt-1">
            Patient records & pedigree
          </div>
        </div>

        {/* Nav Items */}
        <nav className="mt-4">
          <NavItem
            to="/"
            label="Dashboard"
            emoji="📊"
            onClick={() => setIsOpen(false)}
          />
          <NavItem
            to="/patients"
            label="Patients"
            emoji="👨‍⚕️"
            onClick={() => setIsOpen(false)}
          />
          <NavItem
            to="/variants"
            label="Variants"
            emoji="🧬"
            onClick={() => setIsOpen(false)}
          />
          <NavItem
            to="/family"
            label="Family Tree"
            emoji="🌳"
            onClick={() => setIsOpen(false)}
          />
          <NavItem
            to="/analytics"
            label="Analytics"
            emoji="📈"
            onClick={() => setIsOpen(false)}
          />
        </nav>
      </div>
    </>
  );
}
