export function capitalizeFirstLetter(str: string): string {
  if (!str) return '';
  return str[0].toUpperCase() + str.slice(1).toLowerCase();
}

export function titleCase(sentence: string): string {
  if (!sentence) return '';
  return sentence
    .split(' ')
    .map((word) => word[0]?.toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function getAbbreviation(name?: string | null): string {
  if (!name) return '';
  return name
    .split(' ')
    .map((word) => word[0].toUpperCase())
    .join('');
}
