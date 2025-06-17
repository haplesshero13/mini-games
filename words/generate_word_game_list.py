import json
import requests
import nltk
import nltk.downloader
from nltk.stem import WordNetLemmatizer
from collections import defaultdict
import geonamescache

gc = geonamescache.GeonamesCache()
# Ensure NLTK data is downloaded.
# Uncomment it to run it the first time.
#
# nltk.download('wordnet')
# nltk.download('omw-1.4')
# nltk.download('words')
# nltk.download('averaged_perceptron_tagger_eng')
#
# Prepare geonamescache place and country names (lowercase for matching)
country_names = set([c['name'].lower() for c in gc.get_countries().values()])
# Also add alternate country names if available
for c in gc.get_countries().values():
    if 'names' in c:
        for alt in c['names']:
            country_names.add(alt.lower())

city_names = set([c['name'].lower() for c in gc.get_cities().values()])
# Also add alternate city names if available
for c in gc.get_cities().values():
    if 'names' in c:
        for alt in c['names']:
            city_names.add(alt.lower())

def is_proper_noun(word):
    # NLTK's pos_tag expects a list of tokens
    tagged = nltk.pos_tag([word])
    isProper = tagged[0][1] in ("NNP", "NNPS")
    if isProper:
      print(f"{word} is a proper noun.")
    return isProper

def is_english_word(word, english_vocab):
    return word.lower() in english_vocab

def generate_word_game_list(words_by_length_json_str: str, min_len: int = 5, max_len: int = 7) -> dict:
    """
    Generates a word game list by filtering words by length, lemmatizing them,
    and sorting by frequency. Excludes proper nouns, foreign words, and place/country names.

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

    place_names = country_names

    # For length 5, use wordle.txt entries
    wordle_five_list = []
    try:
        with open("wordle.txt", "r", encoding="utf-8") as wordle_file:
            wordle_five_list = [line.strip().lower() for line in wordle_file if len(line.strip()) == 5]
    except Exception as e:
        print(f"Error reading wordle.txt: {e}")
        wordle_five_list = []

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
                    continue
    except requests.exceptions.RequestException as e:
        print(f"Error fetching word frequency list: {e}")
        return {}

    lemmatizer = WordNetLemmatizer()
    english_vocab = set(w.lower() for w in nltk.corpus.words.words())

    final_word_game_list = defaultdict(list)
    unique_lemmas_processed = set()  # To avoid duplicate lemmas globally

    final_word_game_list["5"] = wordle_five_list

    # Only process 6 and 7 letter words algorithmically
    for length_str, words in words_by_length.items():
        try:
            current_length = int(length_str)
        except ValueError:
            continue

        if 5 <= current_length <= 10:
            for word in words:
                if is_proper_noun(word):
                    continue
                lemma_noun = lemmatizer.lemmatize(word.lower(), pos='n')
                lemma_verb = lemmatizer.lemmatize(word.lower(), pos='v')
                lemma_adj = lemmatizer.lemmatize(word.lower(), pos='a')
                lemma_adv = lemmatizer.lemmatize(word.lower(), pos='r')

                # Choose the shortest lemma among noun, verb, adjective, adverb
                lemmas = [lemma_noun, lemma_verb, lemma_adj, lemma_adv]
                chosen_lemma = min(lemmas, key=len)

                # Filter out place/country/nonenglish names
                if chosen_lemma in place_names or chosen_lemma in city_names or not is_english_word(chosen_lemma, english_vocab):
                    continue

                freq = word_frequencies.get(chosen_lemma, 0)
                lemma_length = len(chosen_lemma)
                if (
                    6 <= lemma_length <= 7
                    and chosen_lemma not in unique_lemmas_processed
                    and freq >= 800
                ):
                    final_word_game_list[str(lemma_length)].append((chosen_lemma, freq))
                    unique_lemmas_processed.add(chosen_lemma)

    # Sort 6 and 7 letter lists by frequency
    for length in ["6", "7"]:
        if length in final_word_game_list:
            final_word_game_list[length].sort(key=lambda x: x[1], reverse=True)
            final_word_game_list[length] = [lemma for lemma, freq in final_word_game_list[length]]

    return dict(final_word_game_list)

if __name__ == "__main__":
    try:
        with open("words.json", "r", encoding="utf-8") as f:
            input_json = f.read()
            processed_list = generate_word_game_list(input_json, min_len=5, max_len=7)

        if processed_list:
            with open("answers.json", "w", encoding="utf-8") as out_f:
                out_f.write(json.dumps(processed_list, indent=2, ensure_ascii=False))
            print("Processed word game list written to 'answers.json'.")
        else:
            print("\nCould not generate the word game list. Please check the input JSON and network connection.")

    except FileNotFoundError:
        print("Error: 'words.json' file not found.")
    except Exception as e:
        print(f"Error reading 'words.json': {e}")
