import React, { useState } from "react";
import { randomAnswer, isValidWord, guessResults } from "./wordUpRules";
import type { WordleSizes } from "./wordUpRules";

type WordUpProps = { size: number; maxGuesses: number };

export const WordUp: React.FC<WordUpProps> = ({ size, maxGuesses }) => {
  const [answer] = useState(randomAnswer(size.toString() as WordleSizes));
  const [guesses, setGuesses] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"playing" | "won" | "lost">("playing");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value.toLowerCase());
    setError(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (input.length !== size) {
      setError(`Word must be ${size} letters.`);
      return;
    }
    setLoading(true);
    const valid = await isValidWord(input);
    setLoading(false);
    if (!valid) {
      setError("Not a valid English word.");
      return;
    }
    const newGuesses = [...guesses, input];
    setGuesses(newGuesses);
    setInput("");

    const result = guessResults(input, answer);
    if (result.length === 0) {
      setError(
        `There was an error checking your guess '${input}'. The answer was ${answer}! Sorry for the bug`,
      );
      setStatus("lost");
      return;
    }

    if (input === answer) {
      setStatus("won");
    } else if (newGuesses.length >= maxGuesses) {
      setStatus("lost");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-zinc-100 text-black rounded-lg p-6 shadow-lg m-6">
      <h2 className="text-3xl font-bold mb-4">WordUp</h2>
      <div className="space-y-2 mb-4">
        {Array.from({ length: maxGuesses }).map((_, guessIndex) => {
          const guess = guesses[guessIndex] || "";
          const result = guess ? guessResults(guess, answer) : [];
          return (
            <div className="flex gap-2 justify-center" key={guessIndex}>
              {Array.from({ length: size }).map((_, letterIndex) => {
                const letter = guess[letterIndex] || "";
                const color =
                  result[letterIndex] === "correct"
                    ? "bg-green-600"
                    : result[letterIndex] === "present"
                      ? "bg-yellow-500"
                      : guess[letterIndex]
                        ? "bg-gray-400"
                        : "bg-gray-200";
                return (
                  <span
                    key={letterIndex}
                    className={`border border-zinc-300 w-10 h-10 flex items-center justify-center rounded text-xl font-bold uppercase text-white ${color}`}
                  >
                    {letter}
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>
      {status === "playing" && (
        <form onSubmit={handleSubmit} className="flex gap-2 justify-center">
          <input
            type="text"
            maxLength={size}
            value={input}
            onChange={handleInput}
            className="w-32 p-2 rounded bg-white text-black text-xl text-center"
            disabled={status !== "playing" || loading}
            pattern={`[a-zA-Z]{${size}}`}
            autoFocus
          />
          <button
            type="submit"
            className="bg-blue-600 px-4 py-2 rounded text-white font-bold"
            disabled={input.length !== size || loading}
          >
            {loading ? "Checking..." : "Guess"}
          </button>
        </form>
      )}
      {error && <div className="mt-2 text-red-400">{error}</div>}
      {status === "won" && (
        <div className="mt-4 text-green-400 font-bold text-xl">
          You won! 🎉 Refresh to play again.
        </div>
      )}
      {status === "lost" && (
        <div className="mt-4 text-red-400 font-bold text-xl">
          Game over! The word was <span className="uppercase">{answer}</span>
        </div>
      )}
    </div>
  );
};

export default WordUp;
