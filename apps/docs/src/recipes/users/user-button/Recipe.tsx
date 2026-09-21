import { Avatar, Button } from "@loamui/core";
import "./recipe.css";

export default function Recipe() {
  return (
    <div className="user-button">
      <Button>
        <Avatar.Root aria-hidden>
          <Avatar.Image src="https://picsum.photos/id/823/96/96" alt="" />
          <Avatar.Fallback>IH</Avatar.Fallback>
        </Avatar.Root>
        <span className="text">
          <strong>Imogen Hartley</strong>
          <span>imogen@hedgerow.example</span>
        </span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m9 6 6 6-6 6" />
        </svg>
      </Button>
    </div>
  );
}
