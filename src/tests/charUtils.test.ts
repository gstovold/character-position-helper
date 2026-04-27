import { describe, it, expect } from 'vitest'
import { parseCharacters, buildCopyText, displayChar } from '../utils/charUtils'

describe('parseCharacters', () => {
  it('returns empty array for empty string', () => {
    expect(parseCharacters('')).toEqual([])
  })

  it('positions start at 1, not 0', () => {
    const result = parseCharacters('A')
    expect(result[0].position).toBe(1)
  })

  it('correctly assigns positions for multiple chars', () => {
    const result = parseCharacters('ABC')
    expect(result.map(e => e.position)).toEqual([1, 2, 3])
  })

  it('flags spaces correctly', () => {
    const result = parseCharacters('A B')
    expect(result[0].isSpace).toBe(false)
    expect(result[1].isSpace).toBe(true)
    expect(result[2].isSpace).toBe(false)
  })

  it('handles special characters', () => {
    const result = parseCharacters('!@#')
    expect(result.map(e => e.char)).toEqual(['!', '@', '#'])
  })

  it('handles unicode characters', () => {
    const result = parseCharacters('héllo')
    expect(result.length).toBe(5)
    expect(result[1].char).toBe('é')
  })

  it('handles numbers', () => {
    const result = parseCharacters('12345')
    expect(result[4].char).toBe('5')
    expect(result[4].position).toBe(5)
  })
})

describe('buildCopyText', () => {
  it('formats as "position: char" lines', () => {
    const entries = parseCharacters('AB')
    const text = buildCopyText(entries, false)
    expect(text).toBe('1: A\n2: B')
  })

  it('shows (space) for space characters', () => {
    const entries = parseCharacters('A B')
    const text = buildCopyText(entries, false)
    expect(text).toContain('2: (space)')
  })

  it('shows asterisks when hidden', () => {
    const entries = parseCharacters('AB')
    const text = buildCopyText(entries, true)
    expect(text).toBe('1: *\n2: *')
  })

  it('spaces still show as (space) when hidden', () => {
    const entries = parseCharacters('A B')
    const text = buildCopyText(entries, true)
    expect(text).toContain('2: (space)')
  })
})

describe('displayChar', () => {
  it('shows character when not hidden', () => {
    const entry = { char: 'X', position: 1, isSpace: false }
    expect(displayChar(entry, false)).toBe('X')
  })

  it('shows bullet when hidden', () => {
    const entry = { char: 'X', position: 1, isSpace: false }
    expect(displayChar(entry, true)).toBe('●')
  })

  it('shows space symbol regardless of hidden state', () => {
    const spaceEntry = { char: ' ', position: 2, isSpace: true }
    expect(displayChar(spaceEntry, false)).toBe('␣')
    expect(displayChar(spaceEntry, true)).toBe('␣')
  })
})
