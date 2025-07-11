import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Outlet } from "react-router-dom";

const HamburgerIcon = () => (
  <svg
    className="w-8 h-8 text-gray-700"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);

const CloseIcon = () => (
  <svg
    className="w-8 h-8 text-gray-700"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

export const Layout: React.FC = () => {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="mx-auto relative flex flex-col min-h-screen w-screen min-w-screen text-center bg-white-50">
      <header className="w-full border-b flex items-center relative min-h-12 max-h-12 z-10">
        <button
          className="p-2 cursor-pointer"
          aria-label={navOpen ? "Close navigation" : "Open navigation"}
          onClick={() => setNavOpen((v) => !v)}
        >
          {navOpen ? <CloseIcon /> : <HamburgerIcon />}
        </button>
        <Link
          to="/"
          className="sm:text-3xl font-bold leading-tight text-gray-900"
        >
          Nofair Games
        </Link>
      </header>
      <nav
        className={`fixed top-12 left-0 h-[calc(100vh-3rem)] w-64 bg-white shadow-md z-20 transition-transform duration-300 ease-in-out transform
          ${navOpen ? "translate-x-0 pointer-events-auto" : "-translate-x-full pointer-events-none"}
        `}
      >
        <div className="flex flex-col gap-2 p-4 h-full">
          {[5, 6, 7].map((n) => (
            <NavLink
              key={n}
              className={({ isActive }) =>
                `px-4 py-2 rounded font-semibold border button text-white ${isActive ? "active disabled" : ""} bg-blue-500`
              }
              to={`/word-up-${n}`}
              onClick={() => {
                setNavOpen(false);
              }}
            >
              WordUp {n}-Letter
            </NavLink>
          ))}
          <NavLink
            className={({ isActive }) =>
              `px-4 py-2 rounded font-semibold border button bg-orange-400 text-white ${isActive ? "active disabled" : ""}`
            }
            to="/word-up-gacha"
            onClick={() => {
              setNavOpen(false);
            }}
          >
            WordUp With Gacha
          </NavLink>
        </div>
      </nav>
      <main className="flex-1 flex flex-col items-center justify-center w-full bg-white">
        <Outlet />
      </main>
      <footer className="w-full flex flex-col text-center text-xs text-gray-400 py-2 mt-4">
        <a
          href="https://forms.gle/H4dfgFe9d6XCU2B49"
          target="_blank"
          rel="noopener noreferrer"
          className="underline sm:fixed sm:bottom-6 sm:right-6 sm:z-50 sm:bg-blue-600 sm:hover:bg-blue-700 sm:text-white font-semibold sm:px-5 sm:py-3 sm:rounded-full sm:shadow-xl transition-colors p-2"
          aria-label="Feedback Form"
        >
          Feedback Form
        </a>
        <a
          href="https://github.com/haplesshero13/mini-games/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-blue-600 p-2"
        >
          View source on GitHub
        </a>
      </footer>
    </div>
  );
};
