import { useId } from "react";
import { Avatar, Card, SignpostLink } from "@loamui/core";
import "./recipe.css";

export default function Recipe() {
  const name = useId();
  return (
    <Card render={<article className="profile-card" aria-labelledby={name} />}>
      <div className="body">
        <Avatar.Root aria-hidden>
          <Avatar.Fallback>IH</Avatar.Fallback>
        </Avatar.Root>
        <h2 id={name}>Imogen Hartley</h2>
        <p className="role">Steward, Lower Field plot</p>
        <dl className="stats">
          <div>
            <dt>Varieties saved</dt>
            <dd>38</dd>
          </div>
          <div>
            <dt>Seasons</dt>
            <dd>7</dd>
          </div>
          <div>
            <dt>Followers</dt>
            <dd>212</dd>
          </div>
        </dl>
        <div className="actions">
          <SignpostLink href="/growers/imogen-hartley">Meet Imogen</SignpostLink>
        </div>
      </div>
    </Card>
  );
}
