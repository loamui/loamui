import "./recipe.css";

export default function Recipe() {
  return (
    <figure className="embed-map">
      <iframe
        src="https://www.openstreetmap.org/export/embed.html?bbox=-2.80%2C52.36%2C-2.70%2C52.41&layer=mapnik&marker=52.385%2C-2.755"
        title="Map showing the Hedgerow nursery at Bromfield, north of Ludlow"
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
      />
      <figcaption>
        The nursery is on the A49 at Bromfield, two miles north of Ludlow; the entrance is beside
        the farm shop.{" "}
        <a href="https://www.openstreetmap.org/?mlat=52.385&mlon=-2.755#map=14/52.385/-2.755">
          Open in OpenStreetMap
        </a>
        .
      </figcaption>
    </figure>
  );
}
