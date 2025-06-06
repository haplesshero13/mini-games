import json
import requests
import nltk
from nltk.stem import WordNetLemmatizer
from collections import defaultdict

# Ensure NLTK data is downloaded.
# Uncomment it to run it the first time.
#
# try:
#     nltk.data.find('corpora/wordnet')
# except nltk.downloader.DownloadError:
#     print("Downloading NLTK 'wordnet' corpus...")
#     nltk.download('wordnet')
# try:
#     nltk.data.find('corpora/omw-1.4')
# except nltk.downloader.DownloadError:
#     print("Downloading NLTK 'omw-1.4' corpus...")
#     nltk.download('omw-1.4')

def generate_word_game_list(words_by_length_json_str: str, min_len: int = 5, max_len: int = 7) -> dict:
    """
    Generates a word game list by filtering words by length, lemmatizing them,
    and sorting by frequency.

    Args:
        words_by_length_json_str: A JSON string where keys are word lengths (str)
                                  and values are lists of words.
                                  Example: '{"1": ["e", "x"], "5": ["apple", "grape"], "6": ["banana", "orange"]}'
        min_len: Minimum word length to include.
        max_len: Maximum word length to include.

    Returns:
        A dictionary where keys are word lengths and values are lists of
        lemmatized words, sorted by frequency (most frequent first).
        Returns an empty dictionary if an error occurs or no words are found.
    """
    try:
        words_by_length = json.loads(words_by_length_json_str)
    except json.JSONDecodeError as e:
        print(f"Error parsing input JSON: {e}")
        return {}

    frequency_list_url = "https://raw.githubusercontent.com/hermitdave/FrequencyWords/refs/heads/master/content/2018/en/en_50k.txt"
    word_frequencies = {}
    try:
        response = requests.get(frequency_list_url, stream=True)
        response.raise_for_status()  # Raise HTTPError for bad responses (4xx or 5xx)
        for line in response.iter_lines(decode_unicode=True):
            if line:
                try:
                    parts = line.split(' ', 1)
                    if len(parts) == 2:
                        word = parts[0].strip()
                        count = int(parts[1])
                        word_frequencies[word] = count
                except ValueError:
                    # Skip lines that don't fit the expected 'count word' format
                    continue
    except requests.exceptions.RequestException as e:
        print(f"Error fetching word frequency list: {e}")
        return {}

    # Initialize the lemmatizer
    lemmatizer = WordNetLemmatizer()

    # Dictionary to store lemmatized words, grouped by their final length,
    # and then sorted by frequency.
    final_word_game_list = defaultdict(list)
    unique_lemmas_processed = set()  # To avoid duplicate lemmas globally

    for length_str, words in words_by_length.items():
        try:
            current_length = int(length_str)
        except ValueError:
            continue

        if 5 <= current_length <= 10:
            for word in words:
                lemma_noun = lemmatizer.lemmatize(word.lower(), pos='n')
                lemma_verb = lemmatizer.lemmatize(word.lower(), pos='v')

                chosen_lemma = lemma_noun
                if lemma_verb in word_frequencies and (lemma_noun not in word_frequencies or word_frequencies[lemma_verb] > word_frequencies[lemma_noun]):
                    chosen_lemma = lemma_verb

                freq = word_frequencies.get(chosen_lemma, 0)
                lemma_length = len(chosen_lemma)
                if (
                    min_len <= lemma_length <= max_len
                    and chosen_lemma not in unique_lemmas_processed
                    and freq >= 800
                ):
                    final_word_game_list[str(lemma_length)].append((chosen_lemma, freq))
                    unique_lemmas_processed.add(chosen_lemma)

    for length in final_word_game_list:
        final_word_game_list[length].sort(key=lambda x: x[1], reverse=True)
        final_word_game_list[length] = [lemma for lemma, freq in final_word_game_list[length]]


    # Convert defaultdict to regular dict for output consistency
    return dict(final_word_game_list)

if __name__ == "__main__":
    try:
        with open("words.json", "r", encoding="utf-8") as f:
            input_json = f.read()
            processed_list = generate_word_game_list(input_json, min_len=5, max_len=7)

        if processed_list:
            print(json.dumps(processed_list, indent=2, ensure_ascii=False))
        else:
            print("\nCould not generate the word game list. Please check the input JSON and network connection.")

    except FileNotFoundError:
        print("Error: 'words.json' file not found.")
    except Exception as e:
        print(f"Error reading 'words.json': {e}")
