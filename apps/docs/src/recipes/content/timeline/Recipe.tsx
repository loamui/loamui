import "./recipe.css";

export default function Recipe() {
  return (
    <div className="timeline">
      <ol role="list">
        <li>
          <time dateTime="2014-04">April 2014</time>
          <h3>Three allotments and a kitchen table</h3>
          <p>
            Five growers on the Ludlow allotments pool the seed they have saved and post packets to
            friends who ask.
          </p>
        </li>
        <li>
          <time dateTime="2016-01">January 2016</time>
          <h3>The first catalogue</h3>
          <p>
            Forty varieties in a photocopied booklet, sold from a trestle table at the winter
            market.
          </p>
        </li>
        <li>
          <time dateTime="2019-03">March 2019</time>
          <h3>Registered as a co-operative</h3>
          <p>
            Hedgerow becomes a community benefit society: one member, one vote, and the surplus goes
            back into growing.
          </p>
        </li>
        <li>
          <time dateTime="2022-05">May 2022</time>
          <h3>The nursery opens at Bromfield</h3>
          <p>
            Two acres, a polytunnel and a drying barn, with trial beds any member can walk on open
            days.
          </p>
        </li>
        <li>
          <time dateTime="2025-09">September 2025</time>
          <h3>A thousand members</h3>
          <p>The thousandth member joins the week the catalogue passes four hundred varieties.</p>
        </li>
      </ol>
    </div>
  );
}
