function titleCaseToken(token: string) {
  const lowered = token.toLocaleLowerCase('tr-TR');
  const firstLetterIndex = lowered.search(/\p{L}/u);

  if (firstLetterIndex < 0) {
    return lowered;
  }

  return `${lowered.slice(0, firstLetterIndex)}${lowered
    .charAt(firstLetterIndex)
    .toLocaleUpperCase('tr-TR')}${lowered.slice(firstLetterIndex + 1)}`;
}

export function formatSongTitle(title: string) {
  return title
    .split(/(\s+)/)
    .map((part) => (part.trim() ? titleCaseToken(part) : part))
    .join('')
    .trim();
}
