import { useId } from "react";
import "./recipe.css";

export default function Recipe() {
  const instanceId = useId();
  return (
    <section className="faq" aria-labelledby={`${instanceId}-faq-title`}>
      <div className="inner">
        <header>
          <h2 id={`${instanceId}-faq-title`}>Questions about the nursery</h2>
          <p>
            Ordering, membership and growing for the co-op. For anything else,{" "}
            <a href="/contact">contact the nursery</a>.
          </p>
        </header>
        <ul className="questions" role="list">
          <li>
            <h3>Where do you deliver?</h3>
            <p>
              Enter your delivery address at the basket to see the options and cost for your order.
              Plants and bare-root fruit have different delivery options from seed packets;
              collection from the nursery is also available.
            </p>
          </li>
          <li>
            <h3>What if a packet does not come up?</h3>
            <p>
              Tell us the variety and the harvest year on the packet and we send a replacement from
              a different batch, or refund it. Germination is tested before listing, but a cold
              spring can still beat a good batch.
            </p>
          </li>
          <li>
            <h3>Can a school or allotment society join?</h3>
            <p>
              Yes, as a group member. A group pays the household rate, receives the twelve packets
              as one parcel and can send up to four people to each workshop.
            </p>
          </li>
          <li>
            <h3>How do I grow something for the bench?</h3>
            <p>
              Ask at the nursery or write to the bench. A grower takes on one variety, keeps it the
              required distance from its relatives, and brings the cleaned seed in after harvest for
              testing.
            </p>
          </li>
        </ul>
      </div>
    </section>
  );
}
