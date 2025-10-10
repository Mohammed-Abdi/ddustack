import re

STOP_WORDS: set[str] = {"a", "an", "and", "as", "at", "but", "by", "for", "in", "nor", "of", "on", "or", "so", "the", "to", "up", "yet", "is"}

WORD_RE = re.compile(r"\S+")


def normalize_capitalization(text: str) -> str:
    """
    Capitalizes words in text except stop words.
    Preserves punctuation.
    Example:
        'the lord of THE rings: a story' -> 'The Lord of the Rings: A Story'
    """
    if not text:
        return ""

    words: list[str] = WORD_RE.findall(text)
    normalized_words: list[str] = []

    for i, word in enumerate(words):
        match = re.match(r"^([A-Za-z0-9'’\-]+)(.*)$", word)
        if match:
            core, punctuate = match.groups()
            lower_core = core.lower()
            if i == 0 or lower_core not in STOP_WORDS:
                normalized_word = lower_core.capitalize()
            else:
                normalized_word = lower_core
            normalized_words.append(normalized_word + punctuate)
        else:
            normalized_words.append(word)

    return " ".join(normalized_words)
