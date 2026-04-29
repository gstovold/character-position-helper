import './LoadingScreen.css'

export default function LoadingScreen() {
  return (
    <div className="loader" id="loader">
      <div className="loader-brand">
        <svg width="58" height="58" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="52" height="52" rx="14" fill="#C17B3F"/>
          <text x="26" y="30" fontFamily="Georgia, serif" fontSize="26" fontWeight="400" fill="white" textAnchor="middle">A</text>
          <text x="26" y="43" fontFamily="monospace" fontSize="9" fontWeight="400" fill="white" opacity="0.7" textAnchor="middle">1</text>
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
