import ExhibitionForm from "@/components/ExhibitionForm";

export default function ExhibitionPage() {
  return (
    <div className="page">
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">EXHIBITION</span>
          <h1>Exhibition Registration</h1>
          <p>
            Showcase your organization, products, services and innovations at
            the 1st East Africa Bio-Inputs Conference 2027.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container form-layout">
           <div className="form-intro">
  <span className="section-label">EXHIBITOR INFORMATION</span>

  <h2>Reserve your exhibition opportunity</h2>

  <p>
    Complete the form below to register as an exhibitor.
    After registration, you will receive the official
    payment instructions and submit your payment reference
    together with proof of payment.
  </p>

  <div className="info-card">
    <strong>Exhibition fee</strong>

    <p>
      The current exhibition fee is loaded directly from
      the conference backend.
    </p>
  </div>

            <div className="info-card">
              <strong>Payment</strong>
              <p>
                Payment can be made through the official conference payment
                channels. After completing your exhibition registration,
                submit your payment reference and proof of payment.
              </p>
            </div>

            <div className="info-card">
              <strong>Conference</strong>
              <p>
                10th–11th February 2027
                <br />
                Nairobi, Kenya
              </p>
            </div>
          </div>

          <ExhibitionForm />
        </div>
      </section>
    </div>
  );
}