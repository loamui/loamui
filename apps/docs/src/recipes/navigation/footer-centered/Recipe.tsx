import "./recipe.css";

export default function Recipe() {
  return (
    <footer className="footer-centered">
      <a className="brand" href="/">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 19c0-7 4-13 14-14-1 10-7 14-14 14z" />
          <path d="M5 19c3-5 6-8 9-10" />
        </svg>
        Hedgerow
      </a>
      <nav aria-label="Footer">
        <ul>
          <li>
            <a href="/about">About the co-op</a>
          </li>
          <li>
            <a href="/seeds">Seeds</a>
          </li>
          <li>
            <a href="/plants">Plants</a>
          </li>
          <li>
            <a href="/guides">Growing guides</a>
          </li>
          <li>
            <a href="/events">Open days</a>
          </li>
          <li>
            <a href="/contact">Contact</a>
          </li>
        </ul>
      </nav>
      <small>&copy; 2026 Hedgerow Seed Co-operative Ltd. A registered society, number 8831R.</small>
    </footer>
  );
}
