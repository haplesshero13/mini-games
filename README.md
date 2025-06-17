# Nofair Games
Mini Games that tickle the humor bone and make you think! Currently hosted at https://nofair.games/

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/X8X2PD3JW)

## WordUp
A clone of a popular guessing game for words of a certain length. Extended to provide an extra challenge for those willing to accept it.

### Possible answers
A note on the possible answers; the 5-word game answers are all previous answers from the original game itself, since this is public knowledge and is tracked by many websites for your consumption. So I consumed it.

For 6 and 7-word answers, these are automatically generated using the scripts found in `word/` which you can peruse, but the gist of it is, we use the wordnik word list at https://github.com/wordnik/wordlist/blob/main/wordlist-20210729.txt and cross reference it with the frequency list at https://raw.githubusercontent.com/hermitdave/FrequencyWords/refs/heads/master/content/2018/en/en_50k.txt and take the ones with frequency of at least 800, which gives us a roughly ordered list of useable words. Then we lemmatize it using nltk and dedupe; finally we strike any place names off the list using `geonamescache`.

An attempt is made at removing proper nouns using `nltk` but in our cursory attempts there are actually no removed words this way. It appears to be taken care of by place names and the other lists. *However* you may still find some funky words in there every now and again. For instance, it seems like "johnny" and "johnnie" are possible words due to them being used colloquially enough to be found in regular dictionaries.

This algorithm is admittedly very flawed. I'm not a natural language or Python expert by any means so these scripts are very barebones. All attempts to make the game more playable and more entertaining are welcome, short of me going in there and massaging the data by hand because that will not allow me to regenerate the word list and keep the manual edits.

## Coming Soon...
- Bad Memory
