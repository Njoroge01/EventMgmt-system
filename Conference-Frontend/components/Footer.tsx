import Link from "next/link";

const contactDetails = {
  email: "info@biba-kenya.org",
  phone: "+254725510576",
  address:
    "OAU Road, Section 9 House 59, Opposite Thika Town CDF Office, Thika, Kenya",
};

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">

        {/* Conference */}
        <div>
          <Link className="brand footer-brand" href="/">
            <span className="brand-mark">EA</span>
            <span>
              <strong>East Africa</strong>
              <small>Bio-Inputs Conference</small>
            </span>
          </Link>

          <p>
            10th–11th February 2027
            <br />
            Nairobi, Kenya
          </p>
        </div>

        {/* Conference Links */}
        <div>
          <h4>Conference</h4>
          <Link href="/about">About</Link>
          <Link href="/themes">Themes</Link>
          <Link href="/abstracts">Abstracts</Link>
        </div>

        {/* Participation */}
        <div>
          <h4>Participate</h4>
          <Link href="/registration">Registration</Link>
          <Link href="/exhibition">Exhibition</Link>
          <Link href="/payment">Payment</Link>
        </div>

        {/* Contact */}
        <div>
          <h4>Contact</h4>

          <Link href="/contact">Contact the organizers</Link>

          <a href={`mailto:${contactDetails.email}`}>
            {contactDetails.email}
          </a>

          <a href={`tel:${contactDetails.phone}`}>
            {contactDetails.phone}
          </a>

          <p className="footer-address">
            {contactDetails.address}
          </p>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>
          © 2027 East Africa Bio-Inputs Conference
        </span>

        <span>
          Organized by BIBA Kenya
        </span>
      </div>
    </footer>
  );
}
