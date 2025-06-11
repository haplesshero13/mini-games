import React, { useState } from "react";
import "./App.css";
import { WordUp } from "./WordUp";

export const App: React.FC = () => {
  const [size, setSize] = useState(5);
  const [gachaMode, setGachaMode] = useState(true);
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="mx-auto p-2 sm:p-8 relative flex flex-col min-h-screen max-w-screen text-center bg-zinc-50">
      <header className="w-full flex flex-col justify-center items-center relative min-h-12 z-10">
        <a
          href="https://github.com/haplesshero13/mini-games/"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute hidden sm:block top-2 right-2 sm:top-4 sm:right-4 text-gray-400 hover:text-black transition-colors"
          aria-label="View source on GitHub"
        >
          <svg
            className="w-7 h-7 sm:w-8 sm:h-8"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.157-1.11-1.465-1.11-1.465-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.338 4.695-4.566 4.944.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.749 0 .268.18.579.688.481C19.138 20.2 22 16.447 22 12.02 22 6.484 17.523 2 12 2z"
              clipRule="evenodd"
            />
          </svg>
        </a>
        <div className="sm:hidden w-full flex justify-start pr-2 absolute">
          <button
            className="p-2"
            aria-label="Open navigation"
            onClick={() => setNavOpen((v) => !v)}
          >
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
          </button>
        </div>
        <h1 className="sm:text-3xl font-bold leading-tight text-gray-900">
          Nofair Games
        </h1>
      </header>
      <nav
        className={`${
          navOpen ? "block" : "hidden"
        } absolute top-14 left-0 w-full bg-white shadow-md sm:shadow-none sm:bg-transparent sm:static sm:flex sm:justify-center sm:items-center sm:gap-4 sm:my-6 z-20`}
      >
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 p-4 sm:p-0">
          {[5, 6, 7].map((n) => (
            <button
              key={n}
              className={`px-4 py-2 rounded font-semibold border ${
                size === n && !gachaMode
                  ? "bg-blue-600 text-white border-blue-700"
                  : "bg-white text-blue-700 border-blue-300"
              } transition`}
              onClick={() => {
                setSize(n);
                setGachaMode(false);
                setNavOpen(false);
              }}
            >
              WordUp {n}-Letter
            </button>
          ))}
          <button
            className={`px-4 py-2 rounded font-semibold border ${
              size === 5 && gachaMode
                ? "bg-purple-600 text-white border-purple-700"
                : "bg-white text-purple-700 border-purple-300"
            } transition`}
            onClick={() => {
              setSize(5);
              setGachaMode(true);
              setNavOpen(false);
            }}
            disabled={size !== 5 && gachaMode === false ? false : size !== 5}
          >
            WordUp With Gacha
          </button>
        </div>
      </nav>
      <main className="flex-1 flex flex-col items-center justify-center w-full">
        <WordUp
          key={size + (gachaMode ? "-gacha" : "")}
          size={size}
          maxGuesses={6}
          gacha={gachaMode}
        />
      </main>
      <footer className="w-full text-center text-xs text-gray-400 py-2 mt-4">
        <a
          href="https://github.com/haplesshero13/mini-games/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-blue-600 sm:hidden"
        >
          View source on GitHub
        </a>
      </footer>
    </div>
  );
};

export default App;
