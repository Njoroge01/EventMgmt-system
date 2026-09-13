import { Mail, MapPin, Phone, Globe } from "lucide-react";

const contactDetails = {
  organization: "BIBA Kenya",
  address:
    "OAU Road, Section 9 House 59, Opposite Thika Town CDF Office, Thika, Kenya",
  email: "info@bibakenya.org",
  phone: "+254725510576",
  website: "https://www.bibakenya.org",
};

export default function ContactPage() {
  return (
    <div className="page">
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">GET IN TOUCH</span>
          <h1>Contact the Organizers</h1>
          <p>
            Get in touch with BIBA Kenya for enquiries about the East Africa
            Bio-Inputs Conference 2027.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="contact-intro">
            <span className="section-label">CONFERENCE CONTACT</span>
            <h2>We are here to help</h2>
            <p className="large-text">
              For registration, exhibition, abstract submission, partnership,
              or general conference enquiries, please contact the organizing
              team using the details below.
            </p>
          </div>

          <div className="contact-grid">
            <div className="contact-card">
              <Mail size={28} />
              <h2>Email</h2>
              <p>For general conference enquiries:</p>
              <a href={`mailto:${contactDetails.email}`}>
                {contactDetails.email}
              </a>
            </div>

            <div className="contact-card">
              <Phone size={28} />
              <h2>Phone</h2>
              <p>Contact the organizing team:</p>
              <a href={`tel:${contactDetails.phone}`}>
                {contactDetails.phone}
              </a>
            </div>

            <div className="contact-card">
              <MapPin size={28} />
              <h2>Office Location</h2>
              <p>{contactDetails.organization}</p>
              <address>{contactDetails.address}</address>
            </div>

            <div className="contact-card">
              <Globe size={28} />
              <h2>Website</h2>
              <p>Learn more about the organizing organization:</p>
              <a
                href={contactDetails.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit BIBA Kenya
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container contact-conference">
          <div>
            <span className="section-label">CONFERENCE DETAILS</span>
            <h2>East Africa Bio-Inputs Conference 2027</h2>
            <p>
              <strong>Dates:</strong> 10th–11th February 2027
            </p>
            <p>
              <strong>Location:</strong> Nairobi, Kenya
            </p>
            <p>
              <strong>Theme:</strong> Scaling bio-inputs for sustainable food
              systems transformation, climate resilience and green growth in
              East Africa.
            </p>
          </div>

          <div className="contact-cta">
            <h3>Ready to participate?</h3>
            <p>
              Register as a participant, submit your abstract, or explore
              exhibition opportunities.
            </p>
            <div className="cta-buttons">
              <a href="/registration" className="button button-primary">
                Register Now
              </a>
              <a href="/abstracts" className="button button-secondary">
                Submit Abstract
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}