import { describe, expect, it, afterEach, beforeEach } from "bun:test";
import { isValidWord, guessResults, randomAnswer } from "./wordUpRules";

import type { WordleSizes } from "./wordUpRules";

import { mock as fetchMock, clearMocks, disableRealRequests } from "bun-bagel";

beforeEach(() => {
  disableRealRequests();
});

afterEach(() => {
  clearMocks();
});

describe("randomAnswer", () => {
  const testSizes: WordleSizes[] = ["5", "6", "7"];

  it.each(testSizes)(
    "returns an answer with length %s (100 times)",
    (length: WordleSizes) => {
      Array(100)
        .fill(length)
        .forEach(() => {
          const answer = randomAnswer(length);
          expect(answer.length).toBe(Number(length));
        });
    },
  );
});

describe("guessResults", () => {
  it("returns an empty array when there is a mismatch in length", () => {
    expect(guessResults("short", "longer")).toEqual([]);
    expect(guessResults("longer", "short")).toEqual([]);
  });

  it("returns all 'correct' when guess matches answer exactly", () => {
    expect(guessResults("apple", "apple")).toEqual([
      "correct",
      "correct",
      "correct",
      "correct",
      "correct",
    ]);
  });

  it("returns 'present' for correct letters in wrong positions", () => {
    expect(guessResults("pleap", "apple")).toEqual([
      "present",
      "present",
      "present",
      "present",
      "present",
    ]);
  });

  it("returns 'absent' for letters not in answer", () => {
    expect(guessResults("zzzzz", "apple")).toEqual([
      "absent",
      "absent",
      "absent",
      "absent",
      "absent",
    ]);
  });

  it("handles mixed correct, present, and absent", () => {
    expect(guessResults("aplex", "apple")).toEqual([
      "correct",
      "correct",
      "present",
      "present",
      "absent",
    ]);
  });
});

describe("isValidWord", () => {
  it("returns true when fetch returns a valid word array", async () => {
    fetchMock("https://api.dictionaryapi.dev/api/v2/entries/en/realword", {
      response: { data: [{ word: "realword" }] },
    });
    expect(await isValidWord("realword")).toBe(true);
  });

  it("returns false when fetch returns not ok", async () => {
    fetchMock("https://api.dictionaryapi.dev/api/v2/entries/en/notaword", {
      response: {
        data: {
          title: "No Definitions Found",
          message:
            "Sorry pal, we couldn't find definitions for the word you were looking for.",
          resolution:
            "You can try the search again at later time or head to the web instead.",
        },
        status: 404,
      },
    });
    expect(await isValidWord("notaword")).toBe(false);
  });

  it("returns false when fetch throws", async () => {
    fetchMock("https://api.dictionaryapi.dev/api/v2/entries/en/error", {
      throw: new Error("foobar"),
    });

    expect(await isValidWord("error")).toBe(false);
  });

  it("returns false when 404", async () => {
    expect(await isValidWord("404")).toBe(false);
  });
});
