import { useState, useRef, useCallback, useEffect } from 'react'
import { parseCharacters, buildCopyText, displayChar } from './utils/charUtils'
import type { CharEntry } from './utils/charUtils'
import './App.css'

type CopyState = 'idle' | 'copied' | 'error'

export default function App() {
  const [input, setInput] = useState('')
  const [hidden, setHidden] = useState(false)
  const [copyState, setCopyState] = useState<CopyState>('idle')
  const [dark, setDark] = useState(true)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const entries: CharEntry[] = parseCharacters(input)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
  }, [dark])

  const handleClear = useCallback(() => {
    setInput('')
    setCopyState('idle')
    inputRef.current?.focus()
  }, [])

  const handleCopy = useCallback(async () => {
    if (entries.length === 0) return
    try {
      await navigator.clipboard.writeText(buildCopyText(entries, hidden))
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
        <section className="input-section" aria-labelledby="input-label">
          <label id="input-label" htmlFor="char-input" className="input-label">
            Paste or type your characters
          </label>
          <p className="input-hint" id="input-hint">
            Enter a password, code, word, or any string. It stays in your browser only.
          </p>
          <textarea
            ref={inputRef}
            id="char-input"
            className="char-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="e.g. MyP@ssw0rd or ABC123"
            aria-describedby="input-hint"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            rows={3}
          />
          <div className="controls">
            <button className="btn btn-ghost" onClick={() => setHidden(h => !h)} aria-pressed={hidden}>
              <span aria-hidden="true">{hidden ? '👁' : '🙈'}</span>
              {hidden ? 'Show characters' : 'Hide characters'}
            </button>
            <button className="btn btn-ghost" onClick={handleCopy} disabled={entries.length === 0}>
              <span aria-hidden="true">📋</span>
              {copyLabel}
            </button>
            <button className="btn btn-danger" onClick={handleClear} disabled={input.length === 0}>
              <span aria-hidden="true">✕</span>
              Clear
            </button>
          </div>
        </section>

        {entries.length > 0 && (
          <section className="grid-section" aria-labelledby="grid-label">
            <h2 id="grid-label" className="grid-label">
              {entries.length} character{entries.length !== 1 ? 's' : ''}
            </h2>
            <div className="char-grid" role="list" aria-label="Character positions">
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

        {entries.length === 0 && (
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
}