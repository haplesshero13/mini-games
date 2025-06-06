import json
import os

def group_words_by_length(file_path):
    """
    Reads words from a text file, groups them by length, and returns the result as a JSON string.
    We recommend downloading https://github.com/wordnik/wordlist

    Args:
        file_path (str): The path to the input text file.
                         Each word should be double-quoted and on a new line (e.g., "hello").

    Returns:
        str: A JSON string where keys are word lengths (as strings) and values are lists of words
             of that length. Returns None if the file cannot be read or is empty.
    """
    grouped_words = {}

    if not os.path.exists(file_path):
        print(f"Error: File not found at '{file_path}'")
        return None

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            for line in f:
                # Remove leading/trailing whitespace and double quotes
                word = line.strip().strip('"')
                if word:  # Ensure the word is not empty after stripping
                    length = len(word)
                    # Add the word to the list corresponding to its length
                    if length not in grouped_words:
                        grouped_words[length] = []
                    grouped_words[length].append(word)

        # Sort the dictionary keys (lengths) for consistent JSON output
        # Convert integer keys to strings as JSON keys must be strings
        sorted_grouped_words = {str(k): v for k, v in sorted(grouped_words.items())}

        # Convert the dictionary to a JSON formatted string
        # 'indent=4' makes the JSON output pretty-printed
        return json.dumps(sorted_grouped_words, indent=2)

    except Exception as e:
        print(f"An error occurred while reading the file: {e}")
        return None

if __name__ == "__main__":
    # Example usage:
    # 1. Create a dummy text file for demonstration
    dummy_file_name = "words.txt"
    dummy_content = """
"apple"
"banana"
"cat"
"dog"
"""
    try:
        with open(dummy_file_name, 'w', encoding='utf-8') as f:
            f.write(dummy_content.strip())
        print(f"Created a dummy file '{dummy_file_name}' for testing.")

        # Get file path from user, or use the dummy file for testing
        file_path_input = input(f"Enter the path to your text file (e.g., '{dummy_file_name}'): ")
        if not file_path_input: # If user just presses enter, use the dummy file
            file_path_input = dummy_file_name

        json_output = group_words_by_length(file_path_input)

        if json_output:
            with open("words.json", "w", encoding="utf-8") as json_file:
                json_file.write(json_output)
            print("JSON output written to 'words.json'.")
        else:
            print("\nFailed to generate JSON output.")

    except Exception as e:
        print(f"An error occurred during script execution: {e}")
    finally:
        # Clean up the dummy file
        if os.path.exists(dummy_file_name):
            os.remove(dummy_file_name)
            print(f"Cleaned up dummy file '{dummy_file_name}'.")
