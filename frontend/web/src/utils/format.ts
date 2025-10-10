import { STOP_WORDS } from '@/data/stopWords';

const WORD_RE = /\S+/g;

export function normalizeCapitalization(text: string): string {
  if (!text) return '';

  const words = text.match(WORD_RE) ?? [];
  const normalizedWords: string[] = [];

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const match = /^([A-Za-z0-9'-]+)(.*)$/.exec(word);

    if (match) {
      const [, core, punctuate] = match;
      const lowerCore = core.toLowerCase();

      const normalizedWord =
        i === 0 || !STOP_WORDS.has(lowerCore)
          ? lowerCore.charAt(0).toUpperCase() + lowerCore.slice(1)
          : lowerCore;

      normalizedWords.push(normalizedWord + (punctuate ?? ''));
    } else {
      normalizedWords.push(word);
    }
  }

  return normalizedWords.join(' ');
}

export function getAbbreviation(name?: string | null): string {
  if (!name) return '';
  return name
    .split(' ')
    .map((word) => word[0].toUpperCase())
    .join('');
}
