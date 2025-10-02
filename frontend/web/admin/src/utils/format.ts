export function capitalizeFirstLetter(str: string): string {
  if (!str) return '';
  return str[0].toUpperCase() + str.slice(1).toLowerCase();
}

export function getAbbreviation(name?: string | null): string {
  if (!name) return '';
  return name
    .split(' ')
    .map((word) => word[0].toUpperCase())
    .join('');
}
