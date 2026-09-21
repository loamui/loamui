import "./recipe.css";

export default function Recipe() {
  return (
    <address className="contact-details">
      <dl>
        <div className="pair">
          <dt>Phone</dt>
          <dd>
            <a href="tel:+441588640210" dir="ltr">
              01588 640210
            </a>
          </dd>
        </div>
        <div className="pair">
          <dt>Email</dt>
          <dd>
            <a href="mailto:hello@hedgerow.coop">hello@hedgerow.coop</a>
          </dd>
        </div>
        <div className="pair">
          <dt>Nursery</dt>
          <dd>
            Hedgerow Nursery
            <br />
            Bury Ditches Lane
            <br />
            Clun, Shropshire
            <br />
            SY7 8JQ
          </dd>
        </div>
        <div className="pair">
          <dt>Open</dt>
          <dd>Wednesday to Sunday, 10am to 4pm</dd>
          <dd>Closed Monday, Tuesday and the week of Christmas</dd>
        </div>
      </dl>
    </address>
  );
}
