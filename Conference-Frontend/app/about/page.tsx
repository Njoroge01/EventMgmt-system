import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const objectives = [
  "Showcase research, innovations and technologies in bio-inputs.",
  "Stimulate policy and regulatory reforms that support bio-inputs.",
  "Strengthen awareness and adoption of bio-inputs through practical exchange.",
  "Facilitate investments and financing across the bio-inputs ecosystem.",
  "Foster partnerships among public, private, research and farmer actors.",
];

export default function AboutPage() {
  return (
    <div className="page">
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">THE CONFERENCE</span>
          <h1>About the Conference</h1>
          <p>Understanding the purpose, focus and people behind the 1st East Africa Bio-Inputs Conference.</p>
        </div>
      </section>

      <section className="section">
        <div className="container two-column">
          <div><span className="section-label">GOAL</span><h2>Catalyzing a vibrant bio-inputs ecosystem</h2></div>
          <div className="prose">
            <p>
              The conference aims to catalyze a vibrant and enabling bio-inputs ecosystem that
              supports food systems transformation and green economic development in East Africa.
            </p>
            <p>
              It creates space for regional exchange between policy, research, enterprise,
              investment, development and farming communities.
            </p>
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <span className="section-label">OBJECTIVES</span>
          <h2>What the conference will achieve</h2>
          <div className="objective-list">
            {objectives.map((objective) => <div key={objective}><CheckCircle2 /> <span>{objective}</span></div>)}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container callout">
          <div><span className="section-label">NEXT STEP</span><h2>Join the regional conversation</h2><p>Register as a participant or explore exhibition opportunities.</p></div>
          <div className="inline-actions">
            <Link className="button button-primary" href="/registration">Register <ArrowRight size={17} /></Link>
            <Link className="button button-outline" href="/exhibition">Exhibit <ArrowRight size={17} /></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
