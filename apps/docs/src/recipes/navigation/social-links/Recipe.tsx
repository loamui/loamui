import "./recipe.css";

export default function Recipe() {
  return (
    <nav className="social-links" aria-label="Social">
      <ul>
        <li>
          <a href="https://www.instagram.com/hedgerowseedcoop" rel="me">
            <svg viewBox="0 0 24 24" fill="currentColor" fillRule="evenodd" aria-hidden="true">
              <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm5.5-3.75a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5z" />
            </svg>
            <span className="loam-VisuallyHidden">Instagram</span>
          </a>
        </li>
        <li>
          <a href="https://www.youtube.com/@hedgerowseedcoop" rel="me">
            <svg viewBox="0 0 24 24" fill="currentColor" fillRule="evenodd" aria-hidden="true">
              <path d="M23 12c0-2.2-.3-4.4-.3-4.4a2.8 2.8 0 0 0-2-2C19 5.2 12 5.2 12 5.2s-7 0-8.7.4a2.8 2.8 0 0 0-2 2S1 9.8 1 12s.3 4.4.3 4.4a2.8 2.8 0 0 0 2 2c1.7.4 8.7.4 8.7.4s7 0 8.7-.4a2.8 2.8 0 0 0 2-2S23 14.2 23 12zM9.8 15.2V8.8L15.5 12l-5.7 3.2z" />
            </svg>
            <span className="loam-VisuallyHidden">YouTube</span>
          </a>
        </li>
        <li>
          <a href="https://bsky.app/profile/hedgerowseedcoop.bsky.social" rel="me">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 10.8c-1.1-2.1-4-6-6.8-8C2.6 1 1.5 1.3 1.5 4.7c0 .7.4 5.7.6 6.5.8 2.8 3.7 3.8 6.3 3.5-4.6.8-5.8 3.3-3.3 5.9 4.8 4.9 6.9-1.2 7-2.8.1 1.6 2.2 7.7 7 2.8 2.5-2.6 1.3-5.1-3.3-5.9 2.6.3 5.5-.7 6.3-3.5.2-.8.6-5.8.6-6.5 0-3.4-1.1-3.7-3.7-1.9-2.8 2-5.7 5.9-6.8 8Z" />
            </svg>
            <span className="loam-VisuallyHidden">Bluesky</span>
          </a>
        </li>
        <li>
          <a href="https://mastodon.social/@hedgerowseedcoop" rel="me">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M21.3 13.6c-.3 1.6-2.8 3.4-5.7 3.7-1.5.2-3 .3-4.5.3-2.5-.1-4.5-.6-4.5-.6v.7c.4 2.4 2.4 2.6 4.4 2.7 2 .1 3.7-.5 3.7-.5l.1 1.8s-1.4.7-3.9.9c-1.4.1-3.1 0-5-.6C1.6 20.9.9 16.3.8 11.7V7.9c0-4.7 3.1-6.1 3.1-6.1C5.4.9 8.1.8 11.9.8h.1c3.8 0 6.5.1 8.1 1 0 0 3.1 1.4 3.1 6.1 0 0 0 3.5-.4 5.9ZM18 8.1v5.7h-2.3V8.3c0-1.1-.5-1.7-1.4-1.7-1 0-1.6.7-1.6 2v2.9h-2.2V8.6c0-1.3-.5-2-1.6-2-1 0-1.4.6-1.4 1.7v5.5H5.3V8.1c0-1.1.3-2 .9-2.7.6-.7 1.4-1 2.3-1 1.1 0 2 .4 2.5 1.3l.6.9.6-.9c.6-.9 1.4-1.3 2.5-1.3 1 0 1.7.3 2.3 1 .7.7 1 1.6 1 2.7Z" />
            </svg>
            <span className="loam-VisuallyHidden">Mastodon</span>
          </a>
        </li>
      </ul>
    </nav>
  );
}
