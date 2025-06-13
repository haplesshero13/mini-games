import ANSWERS_LIST from "./answers.json";

export type WordleSizes = keyof typeof ANSWERS_LIST;

type LetterStatus = "correct" | "present" | "absent";

export const randomAnswer = (length: WordleSizes): string => {
  const answers = ANSWERS_LIST[length];
  return answers[Math.floor(Math.random() * answers.length)];
};

export const guessResults = (guess: string, answer: string): LetterStatus[] => {
  if (guess.length != answer.length) {
    return [];
  }

  const answerCharacters = answer.split("");
  const guessCharacters = guess.split("");

  const result = guessCharacters.map((character, index) => {
    if (character === answerCharacters[index]) {
      answerCharacters[index] = "_"; // Mark as used
      guessCharacters[index] = "."; // Mark as matched
      return "correct" as LetterStatus;
    }
    return "absent" as LetterStatus;
  });

  return result.map((status, index) => {
    if (status === "correct") return status;
    const presentIndex = answerCharacters.indexOf(guessCharacters[index]);
    if (presentIndex !== -1 && guessCharacters[index] !== ".") {
      answerCharacters[presentIndex] = "_";
      return "present" as LetterStatus;
    }
    return status;
  });
};

export const isValidWord = async (word: string): Promise<boolean> => {
  const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

  try {
    const response = await fetch(url);
    if (!response.ok) return false;
    const data = await response.json();
    return Array.isArray(data) && data.length > 0;
  } catch {
    return false;
  }
};
