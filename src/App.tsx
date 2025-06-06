import React, { useState } from "react";
import "./App.css";
import { WordUp } from "./WordUp";

export const App: React.FC = () => {
  const [size, setSize] = useState(5);

  return (
    <div className="max-w-7xl mx-auto p-8 text-center relative z-10 min-h-screen bg-gray-100">
      <h1 className="text-5xl font-bold my-4 leading-tight text-gray-900">
        Games Games Games
      </h1>
      <div className="flex justify-center gap-4 my-6">
        {[5, 6, 7].map((n) => (
          <button
            key={n}
            className={`px-4 py-2 rounded font-semibold border ${
              size === n
                ? "bg-blue-600 text-white border-blue-700"
                : "bg-white text-blue-700 border-blue-300"
            } transition`}
            onClick={() => setSize(n)}
          >
            {n}-Letter Game
          </button>
        ))}
      </div>
      <WordUp key={size} size={size} maxGuesses={6} />
    </div>
  );
};

export default App;
