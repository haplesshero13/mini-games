import React, { useState } from "react";
import { randomAnswer, isValidWord, guessResults } from "./wordUpRules";
import type { WordleSizes } from "./wordUpRules";
import { singlePull, gachafyMeCapn, beginnerTenPull } from "./gachafy";

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

  // only for gacha
  const [ownedLetters, setOwnedLetters] = useState<string[]>([]);
  const [pulls, setPulls] = useState(0);
  const [gachaPulling, setGachaPulling] = useState(false);
  const [justPulledLetters, setJustPulledLetters] = useState<string[]>([]);
  const [pullAnimationLetters, setPullAnimationLetters] = useState<string[]>(
    [],
  );
  const [pullAnimationIndex, setPullAnimationIndex] = useState<number>(-1);
  const [beginnerTenPullUsed, setBeginnerTenPullUsed] = useState(false);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value.toLowerCase();
    if (gacha) {
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

  const animatePulledLetters = async (letters: string[]) => {
    setPullAnimationLetters(letters);
    setPullAnimationIndex(0);
    for (let i = 1; i <= letters.length; ++i) {
      setPullAnimationIndex(i);

      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    setPullAnimationLetters([]);
    setPullAnimationIndex(-1);
  };

  const updateOwnedLetters = (prev: string[], newLetters: string[]) => {
    const set = new Set(prev);
    newLetters.forEach((l) => set.add(l));
    return Array.from(set).sort();
  };

  const handleGachaPull = async (
    pullFn: () => string | string[],
    setOwnedLetters: React.Dispatch<React.SetStateAction<string[]>>,
    setPulls: React.Dispatch<React.SetStateAction<number>>,
    animatePulledLetters: (letters: string[]) => Promise<void>,
    setJustPulledLetters: React.Dispatch<React.SetStateAction<string[]>>,
    setGachaPulling: React.Dispatch<React.SetStateAction<boolean>>,
    pullsToAdd: number,
    afterPull?: () => void,
  ) => {
    setGachaPulling(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    const result = pullFn();
    const newLetters = Array.isArray(result) ? result : [result];
    setOwnedLetters((prev) => updateOwnedLetters(prev, newLetters));
    setPulls((p) => p + pullsToAdd);
    await animatePulledLetters(newLetters);
    setJustPulledLetters(newLetters);
    setGachaPulling(false);
    setTimeout(() => setJustPulledLetters([]), 1000);
    if (afterPull) afterPull();
  };

  const handleSinglePull = () =>
    handleGachaPull(
      singlePull,
      setOwnedLetters,
      setPulls,
      animatePulledLetters,
      setJustPulledLetters,
      setGachaPulling,
      1,
    );

  const handleTenPull = () =>
    handleGachaPull(
      () => gachafyMeCapn(10),
      setOwnedLetters,
      setPulls,
      animatePulledLetters,
      setJustPulledLetters,
      setGachaPulling,
      10,
    );

  const handleBeginnerTenPull = () =>
    handleGachaPull(
      beginnerTenPull,
      setOwnedLetters,
      setPulls,
      animatePulledLetters,
      setJustPulledLetters,
      setGachaPulling,
      10,
      () => setBeginnerTenPullUsed(true),
    );

  const OwnedLetter = ({
    justPulled,
    letter,
  }: {
    justPulled: boolean;
    letter: string;
  }) => (
    <span
      className={`inline-block mx-0.5 font-mono ${justPulled ? "animate-pop-in text-purple-600 scale-125" : ""}`}
      style={{
        transition: "transform 0.3s, color 0.3s",
      }}
    >
      {letter}
    </span>
  );

  return (
    <div className="w-full max-w-md sm:mx-auto bg-zinc-100 text-black rounded-lg p-2 sm:p-6 shadow-lg m-0 sm:m-6 flex flex-col justify-center">
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
            <button
              className="bg-blue-500 px-3 py-1 rounded text-white font-bold cursor-pointer disabled:bg-zinc-200 disabled:cursor-not-allowed relative"
              onClick={handleBeginnerTenPull}
              disabled={
                status !== "playing" || gachaPulling || beginnerTenPullUsed
              }
              type="button"
              title="Can only be used once! Guarantees a vowel among the first ten pulls."
            >
              Beginner Ten Pull
            </button>
          </div>
          <div className="text-lg text-purple-700 font-bold mb-2 min-h-[2.5rem] flex items-center justify-center">
            {gachaPulling && pullAnimationLetters.length > 0 ? (
              pullAnimationLetters.slice(0, pullAnimationIndex).map((l, i) => (
                <span
                  key={l + i}
                  className="inline-block mx-1 animate-pop-in text-purple-600 text-2xl font-mono"
                  style={{
                    animation: "pop-in 0.5s",
                  }}
                >
                  {l}
                </span>
              ))
            ) : gachaPulling ? (
              <span className="animate-pulse">Pulling...</span>
            ) : (
              <span>Pull for letters, guess the word!</span>
            )}
          </div>
          Owned Letters:
          <div className="text-sm text-gray-700">
            {ownedLetters.map((l) => {
              const justPulled = justPulledLetters.includes(l);
              return <OwnedLetter key={l} letter={l} justPulled={justPulled} />;
            })}
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
            className="bg-blue-600 px-4 py-2 rounded text-white font-bold cursor-pointer disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-disabled"
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
        </>
      )}
      {status === "lost" && (
        <div className="mt-4 text-red-400 font-bold text-xl">
          Game over! The word was {answer.toUpperCase()}
        </div>
      )}
      {gacha && status !== "playing" && (
        <div>
          If you assumed each pull cost $2.09, you would owe me USD
          {Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(pulls * 2.09)}
          , but of course, this is a free game lol. And no self-respecting gacha
          game would ever tell you that up front; you'd just have to guess all
          of that after your bank settles your accounts or whatever. Anyway, I
          hoped you kept track of your pulls and "spent" responsibly!
        </div>
      )}
      <div className="my-4">
        {QWERTY_ROWS.map((row, i) => (
          <KeyboardRow
            row={row}
            key={i}
            guesses={guesses}
            answer={answer}
            ownedLetters={gacha ? ownedLetters : undefined}
          />
        ))}
      </div>
      {gacha && (
        <div className="text-sm text-zinc-300">
          Nothing says innovative, modern game design like adding a gacha
          element! Pull rates and disclosures:
          <ul>
            <li>useless: Q, J, Z, X, V</li>
            <li>uncommon:K, W, Y, F, B, G, H</li>
            <li>epic: M, P, D, U, C, L, S, N </li>
            <li>legendary: T, O, I, R, A, E</li>
          </ul>
          Chances of pulling each tier: useless: 40%, uncommon: 50%, epic: 8%,
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
            className={`w-8 h-10 flex items-center justify-center rounded text-lg font-bold uppercase text-white ${color} select-none ${notOwned ? "line-through bg-red-300 opacity-40" : ""}`}
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
