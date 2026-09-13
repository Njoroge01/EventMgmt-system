import Link from "next/link";
import { ArrowRight, FileText, Upload, ExternalLink } from "lucide-react";

const THEMATIC_AREAS = [
  "Advancing research, knowledge generation, innovation and technology development for bio-inputs",
  "Strengthening policy, regulatory and institutional frameworks",
  "Accelerating production and adoption through agroecology and food systems transformation",
  "Unlocking investments and financing for sector growth",
  "Promoting commercialization, markets and enterprise development",
  "Other",
];

export default function AbstractsPage() {
  return (
    <div className="page">
      {/* Hero */}
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">ABSTRACT SUBMISSION</span>

          <h1>Submit Your Abstract</h1>

          <p>
            Researchers, practitioners, policymakers, innovators and other
            stakeholders are invited to submit abstracts for the 1st East
            Africa Bio-Inputs Conference 2027.
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="section">
        <div className="container abstract-layout">

          <div className="abstract-content">
            <span className="section-label">CALL FOR ABSTRACTS</span>

            <h2>
              Share your research, knowledge and innovations
            </h2>

            <p className="large-text">
              The conference provides a platform for researchers,
              practitioners, policymakers, farmers, private sector actors,
              civil society organizations and other stakeholders to share
              knowledge, experiences and innovations related to bio-inputs
              and sustainable food systems transformation in East Africa.
            </p>

            <p>
              Contributors are invited to submit abstracts aligned with one
              or more of the conference's key thematic areas.
            </p>

            <div className="abstract-info-grid">

              <div className="info-card">
                <FileText size={24} />
                <h3>Abstract Submission</h3>
                <p>
                  Submit your abstract through the official conference
                  submission form.
                </p>
              </div>

              <div className="info-card">
                <Upload size={24} />
                <h3>Supporting Files</h3>
                <p>
                  You may upload supporting documents with your submission.
                  Each file should not exceed 10 MB.
                </p>
              </div>

            </div>
          </div>

          {/* Submission Card */}
          <aside className="abstract-submit-card">

            <div className="submit-icon">
              <FileText size={30} />
            </div>

            <h2>Submit Your Abstract</h2>

            <p>
              Complete the official abstract submission form. You will be
              asked to provide your details, abstract title, thematic area,
              abstract and supporting files.
            </p>

            <a
              href="https://forms.gle/4t3Aevko9AT8Eqg38"
              target="_blank"
              rel="noopener noreferrer"
              className="button button-primary"
            >
              Open Submission Form
              <ExternalLink size={17} />
            </a>

            <span className="submit-note">
              The form will open in a new tab.
            </span>

          </aside>

        </div>
      </section>

      {/* Thematic Areas */}
      <section className="section section-soft">
        <div className="container">

          <span className="section-label">THEMATIC AREAS</span>

          <h2>Key areas for submissions</h2>

          <div className="thematic-list">
            {THEMATIC_AREAS.map((area, index) => (
              <div className="thematic-item" key={area}>
                <span className="thematic-number">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span>{area}</span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Conference Information */}
      <section className="section">
        <div className="container narrow">

          <span className="section-label">CONFERENCE</span>

          <h2>
            1st East Africa Bio-Inputs Conference 2027
          </h2>

          <p className="large-text">
            <strong>
              Scaling bio-inputs for sustainable food systems transformation,
              climate resilience and green growth in East Africa
            </strong>
          </p>

          <div className="conference-meta">
            <div>
              <strong>Dates</strong>
              <span>10th – 11th February 2027</span>
            </div>

            <div>
              <strong>Location</strong>
              <span>Nairobi, Kenya</span>
            </div>
          </div>

          <div className="abstract-bottom-cta">
            <p>
              Ready to contribute to the conference?
            </p>

            <a
              href="https://forms.gle/4t3Aevko9AT8Eqg38"
              target="_blank"
              rel="noopener noreferrer"
              className="button button-primary"
            >
              Submit Abstract
              <ArrowRight size={17} />
            </a>
          </div>

        </div>
      </section>
    </div>
  );
}