import { useState, useRef, useCallback, useEffect } from 'react'
import { parseCharacters, displayChar } from './utils/charUtils'
import type { CharEntry } from './utils/charUtils'
import './App.css'

const RECENTS_KEY = 'lettermap_recents'
const MAX_RECENTS = 4

interface Recent {
  word: string
  timestamp: number
}

function parseOrderedPositions(str: string): number[] {
  if (!str.trim()) return []
  const seen = new Set<number>()
  return str
    .split(/[\s,]+/)
    .map(s => parseInt(s, 10))
    .filter(n => {
      if (isNaN(n) || n === 0 || seen.has(n)) return false
      seen.add(n)
      return true
    })
}

function loadRecents(): Recent[] {
  try {
    const raw = localStorage.getItem(RECENTS_KEY)
    if (!raw) return []
    return JSON.parse(raw)
  } catch { return [] }
}

function saveRecents(items: Recent[]) {
  try { localStorage.setItem(RECENTS_KEY, JSON.stringify(items)) } catch {}
}

function LoadingScreen({ visible }: { visible: boolean }) {
  return (
    <div className={`loader${visible ? '' : ' loader-hidden'}`}>
      <div className="loader-brand">
        <svg width="58" height="58" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="48" height="48" rx="11" fill="#C17B3F"/>
          <line x1="16" y1="10" x2="13" y2="38" stroke="white" strokeWidth="3.8" strokeLinecap="round"/>
          <line x1="27" y1="10" x2="24" y2="38" stroke="white" strokeWidth="3.8" strokeLinecap="round"/>
          <line x1="9" y1="20" x2="39" y2="20" stroke="white" strokeWidth="3.2" strokeLinecap="round"/>
          <line x1="9" y1="29" x2="39" y2="29" stroke="white" strokeWidth="3.2" strokeLinecap="round"/>
        </svg>
        <div className="loader-wordmark">Letter<span>Map</span></div>
      </div>
      <p className="loader-tagline">Character Position Finder</p>
      <p className="loader-sub">No more counting on fingers!</p>
      <div className="loader-dots">
        <span></span><span></span><span></span>
      </div>
    </div>
  )
}

export default function App() {
  const [input, setInput] = useState('')
  const [positions, setPositions] = useState('')
  const [recents, setRecents] = useState<Recent[]>([])
  const [loading, setLoading] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setRecents(loadRecents())
    const timer = setTimeout(() => setLoading(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  const addRecent = useCallback((word: string) => {
    if (!word.trim() || word.trim().length < 2) return
    let items = loadRecents()
    items = items.filter(r => r.word !== word)
    items.unshift({ word, timestamp: Date.now() })
    items = items.slice(0, MAX_RECENTS)
    saveRecents(items)
    setRecents(items)
  }, [])

  const handleInputChange = useCallback((val: string) => {
    setInput(val)
  }, [])

  const handleInputBlur = useCallback(() => {
    if (input.trim().length > 1) {
      addRecent(input.trim())
    }
  }, [input, addRecent])

  const handleInputKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && input.trim().length > 1) {
      addRecent(input.trim())
    }
  }, [input, addRecent])

  const handleClearRecents = useCallback(() => {
    localStorage.removeItem(RECENTS_KEY)
    setRecents([])
  }, [])

  const handleClear = useCallback(() => {
    setInput('')
    setPositions('')
    inputRef.current?.focus()
  }, [])

  const handlePositionsChange = useCallback((val: string) => {
    setPositions(val.replace(/[^0-9,\s]/g, ''))
  }, [])

  const entries: CharEntry[] = parseCharacters(input)
  const orderedPositions = parseOrderedPositions(positions)
  const hasChars = entries.length > 0
  const hasPositions = orderedPositions.length > 0

  return (
    <>
      <LoadingScreen visible={loading} />
      <div className={`page${loading ? ' page-hidden' : ''}`}>
        <nav className="nav">
          <div className="brand">
            <svg width="52" height="52" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="48" height="48" rx="11" fill="#C17B3F"/>
              <line x1="16" y1="10" x2="13" y2="38" stroke="white" strokeWidth="3.8" strokeLinecap="round"/>
              <line x1="27" y1="10" x2="24" y2="38" stroke="white" strokeWidth="3.8" strokeLinecap="round"/>
              <line x1="9" y1="20" x2="39" y2="20" stroke="white" strokeWidth="3.2" strokeLinecap="round"/>
              <line x1="9" y1="29" x2="39" y2="29" stroke="white" strokeWidth="3.2" strokeLinecap="round"/>
            </svg>
            <div className="wordmark">Letter<span>Map</span></div>
          </div>
        </nav>

        <div className="hero">
          <h1 className="hero-title">Character Position Finder</h1>
          <p className="hero-sub">
            <span>No more counting on fingers!</span>
            <span>Enter any word and instantly see every character's numerical position.</span>
          </p>
        </div>

        <div className="card">
          <label className="field-label" htmlFor="char-input">Your characters</label>
          <input
            ref={inputRef}
            id="char-input"
            className="input"
            type="text"
            value={input}
            onChange={e => handleInputChange(e.target.value)}
            onBlur={handleInputBlur}
            onKeyDown={handleInputKeyDown}
            placeholder="e.g. MyP@ssw0rd or ABC123"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />

          {recents.length > 0 && (
            <div className="recents">
              <div className="recents-header">
                <span className="recents-label">Recent</span>
                <button className="recents-clear" onClick={handleClearRecents}>
                  Clear recents
                </button>
              </div>
              <div className="recents-chips">
                {recents.map((r, i) => (
                  <button
                    key={i}
                    className="chip"
                    onClick={() => { setInput(r.word); inputRef.current?.focus() }}
                  >
                    <span>{r.word}</span>
                  </button>
                ))}
              </div>
              <p className="recents-note">Stored on this device only — never sent anywhere.</p>
            </div>
          )}

          <label className="field-label" htmlFor="pos-input">
            Positions needed <span className="optional">optional</span>
          </label>
          <input
            id="pos-input"
            className="input pos-input"
            type="text"
            value={positions}
            onChange={e => handlePositionsChange(e.target.value)}
            placeholder="e.g. 1,3,6"
            autoComplete="off"
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
          <strong>Privacy:</strong> LetterMap runs entirely in your browser. No data leaves your device. Recent words are saved on this device only and never sent anywhere. No cookies. Works offline.
        </footer>
      </div>
    </>
  )
}
