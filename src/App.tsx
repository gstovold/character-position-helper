import { useState, useRef, useCallback, useEffect } from 'react'
import { parseCharacters, displayChar } from './utils/charUtils'
import type { CharEntry } from './utils/charUtils'
import './App.css'

type CopyState = 'idle' | 'copied' | 'error'

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
  const [hidden, setHidden] = useState(false)
  const [dark, setDark] = useState(true)
  const [copyState, setCopyState] = useState<CopyState>('idle')
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
  }, [dark])

  const entries: CharEntry[] = parseCharacters(input)
  const orderedPositions = parseOrderedPositions(positions)
  const hasChars = entries.length > 0
  const hasPositions = orderedPositions.length > 0

  const handleClear = useCallback(() => {
    setInput('')
    setPositions('')
    setCopyState('idle')
    inputRef.current?.focus()
  }, [])

  const handleCopy = useCallback(async () => {
    if (entries.length === 0) return
    const text = entries
      .map(e => `${e.position}: ${e.isSpace ? '(space)' : hidden ? '*' : e.char}`)
      .join('\n')
    try {
      await navigator.clipboard.writeText(text)
      setCopyState('copied')
      setTimeout(() => setCopyState('idle'), 2000)
    } catch {
      setCopyState('error')
      setTimeout(() => setCopyState('idle'), 2000)
    }
  }, [entries, hidden])

  const copyLabel =
    copyState === 'copied' ? '✓ Copied!' : copyState === 'error' ? 'Failed' : 'Copy positions'

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-top">
          <div className="header-inner">
            <div className="logo" aria-hidden="true">
              <span className="logo-char">A</span>
              <span className="logo-pos">1</span>
            </div>
            <div>
              <h1 className="app-title">Character Position Helper</h1>
              <p className="app-subtitle">Find any character's position — instantly</p>
            </div>
          </div>
          <div className="theme-wrap">
            <span className="theme-icon" aria-hidden="true">🌙</span>
            <label className="toggle" aria-label="Toggle light and dark mode">
              <input
                type="checkbox"
                checked={!dark}
                onChange={e => setDark(!e.target.checked)}
              />
              <div className="track"><div className="thumb"></div></div>
            </label>
            <span className="theme-icon" aria-hidden="true">☀️</span>
          </div>
        </div>
        <div className="privacy-badge" role="note">
          <span aria-hidden="true">🔒</span>
          <span>Nothing is saved, sent, or tracked. Ever.</span>
        </div>
      </header>

      <main className="app-main">
        <section className="input-section">
          <label htmlFor="char-input" className="input-label">
            Paste or type your characters
          </label>
          <p className="input-hint">
            Enter a password, code, word, or any string. It stays in your browser only.
          </p>
          <textarea
            ref={inputRef}
            id="char-input"
            className="char-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="e.g. MyP@ssw0rd or ABC123"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            rows={3}
          />

          <div className="highlight-group">
            <div className="highlight-label-row">
              <label htmlFor="pos-input" className="input-label">
                Show characters at positions
              </label>
              <span className="optional-tag">optional</span>
            </div>
            <p className="input-hint">
              Type position digits in the order asked — e.g. <strong>523</strong> shows the 5th, 2nd then 3rd character
            </p>
            <input
              id="pos-input"
              className="char-input pos-input"
              type="text"
              value={positions}
              onChange={e => setPositions(e.target.value.replace(/\D/g, ''))}
              placeholder="e.g. 523"
              autoComplete="off"
              inputMode="numeric"
            />
          </div>

          <div className="controls">
            <button className="btn" onClick={() => setHidden(h => !h)} aria-pressed={hidden}>
              <span aria-hidden="true">{hidden ? '👁' : '🙈'}</span>
              {hidden ? 'Show characters' : 'Hide characters'}
            </button>
            <button className="btn" onClick={handleCopy} disabled={!hasChars}>
              <span aria-hidden="true">📋</span>
              {copyLabel}
            </button>
            <button className="btn btn-danger" onClick={handleClear} disabled={!hasChars && !positions}>
              <span aria-hidden="true">✕</span>
              Clear
            </button>
          </div>
        </section>

        {/* Result strip — shown only when positions are typed */}
        {hasPositions && hasChars && (
          <section className="result-section" aria-label="Characters in requested order">
            <p className="result-label">Your characters in order</p>
            <div className="result-grid">
              {orderedPositions.map((pos, i) => {
                const entry = entries[pos - 1]
                if (!entry) return null
                return (
                  <div
                    key={i}
                    className="result-tile"
                    style={{ animationDelay: `${i * 60}ms` }}
                    aria-label={`Position ${pos}: ${entry.isSpace ? 'space' : hidden ? 'hidden' : entry.char}`}
                  >
                    <span className="tile-char" aria-hidden="true">{displayChar(entry, hidden)}</span>
                    <span className="tile-pos" aria-hidden="true">{pos}</span>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Full grid — shown only when no positions typed */}
        {!hasPositions && hasChars && (
          <section className="grid-section" aria-label="All character positions">
            <p className="grid-label">{entries.length} character{entries.length !== 1 ? 's' : ''}</p>
            <div className="char-grid" role="list">
              {entries.map(entry => (
                <div
                  key={entry.position}
                  className={`char-tile${entry.isSpace ? ' char-tile--space' : ''}`}
                  role="listitem"
                  aria-label={`Position ${entry.position}: ${entry.isSpace ? 'space' : hidden ? 'hidden' : entry.char}`}
                >
                  <span className="tile-char" aria-hidden="true">{displayChar(entry, hidden)}</span>
                  <span className="tile-pos" aria-hidden="true">{entry.position}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {!hasChars && (
          <div className="empty-state" aria-hidden="true">
            <div className="empty-grid-preview">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="char-tile char-tile--ghost">
                  <span className="tile-char">?</span>
                  <span className="tile-pos">{i}</span>
                </div>
              ))}
            </div>
            <p className="empty-label">Your characters will appear here</p>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p><strong>Privacy:</strong> This app runs entirely in your browser. No data leaves your device. No cookies. No analytics. Works offline.</p>
      </footer>
    </div>
  )
}Í