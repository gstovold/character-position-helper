import { useState, useRef, useCallback } from 'react'
import { parseCharacters, displayChar } from './utils/charUtils'
import type { CharEntry } from './utils/charUtils'
import './App.css'

function parseOrderedPositions(str: string): number[] {
  const digits = str.replace(/\D/g, '').split('')
  const seen = new Set<number>()
  return digits
    .map(d => parseInt(d, 10))
    .filter(n => {
      if (n === 0 || seen.has(n)) return false
      seen.add(n)
      return true
    })
}

export default function App() {
  const [input, setInput] = useState('')
  const [positions, setPositions] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const entries: CharEntry[] = parseCharacters(input)
  const orderedPositions = parseOrderedPositions(positions)
  const hasChars = entries.length > 0
  const hasPositions = orderedPositions.length > 0

  const handleClear = useCallback(() => {
    setInput('')
    setPositions('')
    inputRef.current?.focus()
  }, [])

  return (
    <div className="page">
      <nav className="nav">
        <div className="brand">
          <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="52" height="52" rx="14" fill="#C17B3F"/>
            <text x="26" y="30" fontFamily="Georgia, serif" fontSize="26" fontWeight="400" fill="white" textAnchor="middle">A</text>
            <text x="26" y="43" fontFamily="monospace" fontSize="9" fontWeight="400" fill="white" opacity="0.7" textAnchor="middle">1</text>
          </svg>
          <div className="wordmark">Letter<span>Map</span></div>
        </div>
      </nav>

      <div className="hero">
        <h1 className="hero-title">Character position finder</h1>
        <p className="hero-sub">Enter any word and instantly see every character's position. Nothing is saved or sent — ever.</p>
      </div>

      <div className="card">
        <label className="field-label" htmlFor="char-input">Your characters</label>
        <p className="field-hint">Paste a password, memorable word, or reference code</p>
        <textarea
          ref={inputRef}
          id="char-input"
          className="input"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="e.g. MyP@ssw0rd or ABC123"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          rows={2}
        />
        <div className="divider" />
        <label className="field-label" htmlFor="pos-input">
          Positions needed <span className="optional">optional</span>
        </label>
        <p className="field-hint">Type digits in the order asked — e.g. 523 shows the 5th, 2nd then 3rd character</p>
        <input
          id="pos-input"
          className="input pos-input"
          type="text"
          value={positions}
          onChange={e => setPositions(e.target.value.replace(/\D/g, ''))}
          placeholder="e.g. 523"
          autoComplete="off"
          inputMode="numeric"
        />
        <div className="controls">
          <button
            className="btn btn-danger"
            onClick={handleClear}
            disabled={!hasChars && !positions}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
            Clear
          </button>
        </div>
      </div>

      {hasPositions && hasChars && (
        <section className="result-card" aria-label="Characters in requested order">
          <span className="result-label">Your characters in order</span>
          <div className="result-grid">
            {orderedPositions.map((pos, i) => {
              const entry = entries[pos - 1]
              if (!entry) return null
              return (
                <div
                  key={i}
                  className="result-tile"
                  style={{ animationDelay: `${i * 55}ms` }}
                  aria-label={`Position ${pos}: ${entry.isSpace ? 'space' : entry.char}`}
                >
                  <span className="tc" aria-hidden="true">{displayChar(entry, false)}</span>
                  <span className="tp" aria-hidden="true">{pos}</span>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {!hasPositions && hasChars && (
        <section className="grid-section" aria-label="All character positions">
          <p className="grid-meta">{entries.length} character{entries.length !== 1 ? 's' : ''}</p>
          <div className="char-grid" role="list">
            {entries.map(entry => (
              <div
                key={entry.position}
                className={`tile${entry.isSpace ? ' sp' : ''}`}
                role="listitem"
                aria-label={`Position ${entry.position}: ${entry.isSpace ? 'space' : entry.char}`}
              >
                <span className="tc" aria-hidden="true">{displayChar(entry, false)}</span>
                <span className="tp" aria-hidden="true">{entry.position}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <footer className="footer">
        <strong>Privacy:</strong> LetterMap runs entirely in your browser. No data leaves your device. No cookies. No analytics. Works offline.
      </footer>
    </div>
  )
}
