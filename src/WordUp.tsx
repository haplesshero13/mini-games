import React, { useState } from "react";
import { randomAnswer, isValidWord, guessResults } from "./wordUpRules";
import type { WordleSizes } from "./wordUpRules";
import { singlePull, gachafyMeCapn } from "./gachafy"; // <-- Import gacha

type WordUpProps = { size: number; maxGuesses: number; gacha?: boolean };

const QWERTY_ROWS = [
  "QWERTYUIOP".split(""),
  "ASDFGHJKL".split(""),
  "ZXCVBNM".split(""),
];

const getLetterStatuses = (guesses: string[], answer: string) => {
  const status: Record<string, "correct" | "present" | "absent" | undefined> =
    {};
  for (const guess of guesses) {
    const result = guessResults(guess, answer);
    for (let i = 0; i < guess.length; ++i) {
      const l = guess[i].toUpperCase();
      if (result[i] === "correct") {
        status[l] = "correct";
      } else if (result[i] === "present" && status[l] !== "correct") {
        status[l] = "present";
      } else if (!status[l]) {
        status[l] = "absent";
      }
    }
  }
  return status;
};

export const WordUp: React.FC<WordUpProps> = ({
  size,
  maxGuesses,
  gacha = false,
}) => {
  const [answer] = useState(randomAnswer(size.toString() as WordleSizes));
  const [guesses, setGuesses] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"playing" | "won" | "lost">("playing");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [ownedLetters, setOwnedLetters] = useState<string[]>([]);
  const [pulls, setPulls] = useState(0);
  const [gachaPulling, setGachaPulling] = useState(false);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value.toLowerCase();
    if (gacha) {
      // Filter out letters not owned
      value = value
        .split("")
        .filter((l) => ownedLetters.includes(l.toUpperCase()))
        .join("");
    }
    setInput(value);
    setError(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (input.length !== size) {
      setError(`Word must be ${size} letters.`);
      return;
    }
    if (gacha) {
      // Check if all letters in input are owned
      for (const l of input.toUpperCase()) {
        if (!ownedLetters.includes(l)) {
          setError(`You do not own the letter "${l}".`);
          return;
        }
      }
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

  const handleSinglePull = async () => {
    setGachaPulling(true);
    await new Promise((resolve) => setTimeout(resolve, 5000));
    const letter = singlePull();
    setOwnedLetters((prev) =>
      prev.includes(letter) ? prev : [...prev, letter],
    );
    setPulls((p) => p + 1);
    setGachaPulling(false);
  };

  const handleTenPull = async () => {
    setGachaPulling(true);
    await new Promise((resolve) => setTimeout(resolve, 5000));
    const newLetters = gachafyMeCapn(10);
    setOwnedLetters((prev) => {
      const set = new Set(prev);
      newLetters.forEach((l) => set.add(l));
      return Array.from(set);
    });
    setPulls((p) => p + 10);
    setGachaPulling(false);
  };

  return (
    <div className="max-w-md mx-auto bg-zinc-100 text-black rounded-lg p-6 shadow-lg m-6">
      <h2 className="text-3xl font-bold mb-4">WordUp</h2>
      {gacha && (
        <div className="mb-4 flex flex-col items-center">
          <div className="flex gap-2 mb-2">
            <button
              className="bg-purple-600 px-3 py-1 rounded text-white font-bold cursor-pointer disabled:bg-zinc-200 disabled:cursor-progress"
              onClick={handleSinglePull}
              disabled={status !== "playing" || gachaPulling}
              type="button"
            >
              Single Pull
            </button>
            <button
              className="bg-orange-500 px-3 py-1 rounded text-white font-bold cursor-pointer disabled:bg-zinc-200 disabled:cursor-progress"
              onClick={handleTenPull}
              disabled={status !== "playing" || gachaPulling}
              type="button"
            >
              Ten Pull
            </button>
          </div>
          {
            <div className="text-lg text-purple-700 font-bold mb-2 animate-pulse">
              {gachaPulling
                ? "Pulling... Insert flashy animation here... Sorry, budget was low."
                : "Nothing says innovating modern game design like adding a gacha element!"}
            </div>
          }
          Owned Letters:
          <div className="text-sm text-gray-700 transition-all">
            {ownedLetters.length > 0 ? ownedLetters.join(" ") : "(none)"}
          </div>
        </div>
      )}
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
                return LetterBlock(letterIndex, color, letter);
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
            disabled={status !== "playing" || loading || gachaPulling}
            pattern={`[a-zA-Z]{${size}}`}
            autoFocus
          />
          <button
            type="submit"
            className="bg-blue-600 px-4 py-2 rounded text-white font-bold cursor-pointer"
            disabled={input.length !== size || loading || gachaPulling}
          >
            {loading ? "Checking..." : "Guess"}
          </button>
        </form>
      )}
      {error && <div className="mt-2 text-red-400">{error}</div>}
      {status === "won" && (
        <>
          <div className="mt-4 text-green-400 font-bold text-xl">
            You won! 🎉 Refresh to play again.
          </div>
          {gacha && (
            <div>
              If you assumed each pull cost $2.09, you would owe me USD
              {Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(pulls * 2.09)}
              , but of course, this is a free game lol. And no self-respecting
              gacha game would ever tell you that up front; you'd just have to
              guess all of that after your bank settles your accounts or
              whatever. Anyway, I hoped you kept track of your pulls and "spent"
              responsibly!
            </div>
          )}
        </>
      )}
      {status === "lost" && (
        <div className="mt-4 text-red-400 font-bold text-xl">
          Game over! The word was {answer.toUpperCase()}
          {gacha && <> — Pulls used: {pulls}</>}
        </div>
      )}
      <div className="my-4">
        {QWERTY_ROWS.map((row, i) => (
          <KeyboardRow
            row={row}
            key={i}
            guesses={guesses}
            answer={answer}
            ownedLetters={gacha ? ownedLetters.sort() : undefined}
          />
        ))}
      </div>
      {gacha && (
        <div className="text-sm text-zinc-300">
          Pull rates and disclosures:
          <ul>
            <li>common: Q, J, Z, X</li>
            <li>uncommon: V, K, W, Y</li>
            <li>rare: F, B, G, H, M, P, D, U, C</li>
            <li>legendary: L, S, N, T, O, I, R, A, E</li>
          </ul>
          Chances of pulling each tier: common: 50% uncommon: 40% rare: 8%
          legendary: 2%. Within each tier, the chances are evenly distributed.
        </div>
      )}
    </div>
  );
};

export default WordUp;

// --- KeyboardRow updated for gacha ---
const KeyboardRow = ({
  row,
  guesses,
  answer,
  ownedLetters,
}: {
  row: string[];
  guesses: string[];
  answer: string;
  ownedLetters?: string[];
}) => {
  const letterStatuses = getLetterStatuses(guesses, answer);

  return (
    <div className="flex justify-center gap-1 mb-1">
      {row.map((key) => {
        const status = letterStatuses[key];
        const color =
          status === "correct"
            ? "bg-green-600"
            : status === "present"
              ? "bg-yellow-500"
              : status === "absent"
                ? "bg-gray-400"
                : "bg-gray-200";
        const notOwned = ownedLetters && !ownedLetters.includes(key);
        return (
          <span
            key={key}
            className={`w-8 h-10 flex items-center justify-center rounded text-lg font-bold uppercase text-white ${color} select-none ${notOwned ? "line-through opacity-40" : ""}`}
            style={notOwned ? { textDecoration: "line-through" } : {}}
          >
            {key}
          </span>
        );
      })}
    </div>
  );
};

const LetterBlock = (letterIndex: number, color: string, letter: string) => {
  return (
    <span
      key={letterIndex}
      className={`border border-zinc-300 w-10 h-10 flex items-center justify-center rounded text-xl font-bold uppercase text-white ${color}`}
    >
      {letter}
    </span>
  );
};
