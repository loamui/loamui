import "./recipe.css";

export default function Recipe() {
  return (
    <div className="banner-warning">
      <svg
        className="icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 3 2 20h20L12 3Z" />
        <path d="M12 9v5" />
        <path d="M12 17h.01" />
      </svg>
      <p>
        <span className="loam-VisuallyHidden">Warning: </span>
        Postal strikes are delaying seed orders by three to five days. Plants and tools are
        unaffected.
      </p>
      <a href="/orders">Track your order</a>
    </div>
  );
}
