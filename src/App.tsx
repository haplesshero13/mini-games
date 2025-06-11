import React, { useState } from "react";
import "./App.css";
import { WordUp } from "./WordUp";

export const App: React.FC = () => {
  const [size, setSize] = useState(5);
  const [gachaMode, setGachaMode] = useState(true);
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="mx-auto p-2 sm:p-8 relative flex flex-col min-h-screen max-w-screen text-center bg-zinc-50">
      <header className="w-full flex flex-col justify-center items-center relative min-h-12">
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
          Games
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
    </div>
  );
};

export default App;
