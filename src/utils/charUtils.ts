export interface CharEntry {
  char: string
  position: number
  isSpace: boolean
}

/**
 * Splits a string into character entries with 1-based positions.
 * Spaces are flagged for special visual treatment.
 * No data is stored, logged, or transmitted.
 */
export function parseCharacters(input: string): CharEntry[] {
  return Array.from(input).map((char, index) => ({
    char,
    position: index + 1,
    isSpace: char === ' ',
  }))
}

/**
 * Builds a plain-text "position: char" list for clipboard copy.
 */
export function buildCopyText(entries: CharEntry[], hidden: boolean): string {
  return entries
    .map(({ position, char, isSpace }) => {
      const display = isSpace ? '(space)' : hidden ? '*' : char
      return `${position}: ${display}`
    })
    .join('\n')
}

/**
 * Returns the display label for a character tile.
 * Spaces become the ␣ symbol; hidden chars become ●.
 */
export function displayChar(entry: CharEntry, hidden: boolean): string {
  if (entry.isSpace) return '␣'
  if (hidden) return '●'
  return entry.char
}
