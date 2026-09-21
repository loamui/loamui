import "./recipe.css";

export default function Recipe() {
  return (
    <figure className="embed-video">
      <iframe
        src="https://www.youtube-nocookie.com/embed/22quk7oyIQM"
        title="How to sow broad beans and save bean seeds, from Organic Edible Garden"
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        allow="fullscreen; picture-in-picture"
      />
      <figcaption>
        Sowing broad beans in autumn and keeping the best pods back for next year&rsquo;s seed, the
        way the bench does it.{" "}
        <a href="https://www.youtube.com/watch?v=22quk7oyIQM">Watch on YouTube</a>.
      </figcaption>
    </figure>
  );
}
