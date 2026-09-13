import RegistrationForm from "@/components/RegistrationForm";

export default function RegistrationPage() {
  return (
    <main className="page">
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">PARTICIPANT REGISTRATION</span>
          <h1>Register for the Conference</h1>
          <p>
            Register to participate in the 1st East Africa Bio-Inputs
            Conference 2027.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container form-layout">
          <div className="form-intro">
            <span className="section-label">HOW IT WORKS</span>

            <h2>A simple registration process</h2>

            <ol className="steps">
              <li>
                <strong>1. Your details</strong>
                <span>
                  Provide your personal and organization information.
                </span>
              </li>

              <li>
                <strong>2. Category & fee</strong>
                <span>
                  Select your participant category and view the applicable
                  registration fee.
                </span>
              </li>

              <li>
                <strong>3. Payment</strong>
                <span>
                  Pay using the official conference payment instructions
                  provided by BIBA Kenya.
                </span>
              </li>

              <li>
                <strong>4. Verification</strong>
                <span>
                  Keep your registration ID and payment reference for
                  verification.
                </span>
              </li>
            </ol>

            <div className="warning">
              Official payment details will be published once confirmed by
              the BIBA Kenya finance team.
            </div>
          </div>

          <RegistrationForm />
        </div>
      </section>
    </main>
  );
}
