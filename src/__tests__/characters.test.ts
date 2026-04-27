import { describe, it, expect } from 'vitest'
import { parseCharacters, formatForClipboard, getDisplayChar } from '../utils/characters'

describe('parseCharacters', () => {
  it('returns an empty array for an empty string', () => {
    expect(parseCharacters('')).toEqual([])
  })

  it('assigns 1-based positions', () => {
    const result = parseCharacters('ABC')
    expect(result[0].position).toBe(1)
    expect(result[1].position).toBe(2)
    expect(result[2].position).toBe(3)
  })

  it('correctly identifies spaces', () => {
    const result = parseCharacters('A B')
    expect(result[0].isSpace).toBe(false)
    expect(result[1].isSpace).toBe(true)
    expect(result[2].isSpace).toBe(false)
  })

  it('preserves all characters including special chars', () => {
    const input = 'aB3!@'
    const result = parseCharacters(input)
    expect(result.map(e => e.char)).toEqual(['a', 'B', '3', '!', '@'])
  })

  it('handles a single character', () => {
    const result = parseCharacters('X')
    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({ char: 'X', position: 1, isSpace: false })
  })

  it('handles unicode characters', () => {
    const result = parseCharacters('héllo')
    expect(result).toHaveLength(5)
    expect(result[1].char).toBe('é')
    expect(result[1].position).toBe(2)
  })

  it('handles multiple consecutive spaces', () => {
    const result = parseCharacters('A  B')
    expect(result[1].isSpace).toBe(true)
    expect(result[2].isSpace).toBe(true)
    expect(result[1].position).toBe(2)
    expect(result[2].position).toBe(3)
  })
})

describe('formatForClipboard', () => {
  it('formats entries with 1-based positions', () => {
    const entries = parseCharacters('AB')
    expect(formatForClipboard(entries)).toBe('1: A\n2: B')
  })

  it('represents spaces as [space]', () => {
    const entries = parseCharacters('A B')
    expect(formatForClipboard(entries)).toBe('1: A\n2: [space]\n3: B')
  })

  it('returns an empty string for empty input', () => {
    expect(formatForClipboard([])).toBe('')
  })

  it('formats a single character correctly', () => {
    const entries = parseCharacters('Z')
    expect(formatForClipboard(entries)).toBe('1: Z')
  })

  it('handles numeric and special characters', () => {
    const entries = parseCharacters('9!')
    expect(formatForClipboard(entries)).toBe('1: 9\n2: !')
  })
})

describe('getDisplayChar', () => {
  it('returns ␣ for space characters', () => {
    expect(getDisplayChar(' ', true)).toBe('␣')
  })

  it('returns the character itself for non-spaces', () => {
    expect(getDisplayChar('A', false)).toBe('A')
    expect(getDisplayChar('7', false)).toBe('7')
    expect(getDisplayChar('!', false)).toBe('!')
  })
})
