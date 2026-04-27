export interface CharacterEntry {
  char: string;
  position: number;
  isSpace: boolean;
}

/**
 * Parses a string into an array of CharacterEntry objects.
 * Positions are 1-indexed.
 */
export function parseCharacters(input: string): CharacterEntry[] {
  return Array.from(input).map((char, index) => ({
    char,
    position: index + 1,
    isSpace: char === ' ',
  }));
}

/**
 * Formats the character list as plain text for clipboard copying.
 */
export function formatForClipboard(entries: CharacterEntry[]): string {
  return entries
    .map(({ position, char, isSpace }) => `${position}: ${isSpace ? '[space]' : char}`)
    .join('\n');
}

/**
 * Returns the display label for a character tile.
 * Spaces are shown as ␣ symbol.
 */
export function getDisplayChar(char: string, isSpace: boolean): string {
  return isSpace ? '␣' : char;
}
