import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  FileText,
  Handshake,
  Leaf,
  MapPin,
  Presentation,
  Store,
  Users,
} from "lucide-react";

const themes = [
  ["Research, Knowledge, Innovation & Technology", "research"],
  ["Policy, Regulatory & Institutional Frameworks", "policy"],
  ["Production & Adoption through Agroecology and Food Systems Transformation", "production"],
  ["Investment & Financing", "investment"],
  ["Commercialization, Markets & Enterprise Development", "markets"],
];

export default function HomePage() {
  return (
    <>
      <section className="hero">
  <div className="hero-image">
    <Image
      src="/images/hero-agroecology.jpg"
      alt="Agroecological farming in East Africa"
      fill
      priority
      sizes="100vw"
      className="hero-image-img"
    />
  </div>

  <div className="hero-overlay" />

  <div className="container hero-content">

    

    <span className="eyebrow">
      EAST AFRICA • NAIROBI • 2027
    </span>

    <h1>
      The 1st East Africa Bio-Inputs Conference
    </h1>

    <p className="hero-theme">
      Scaling bio-inputs for sustainable food systems transformation,
      climate resilience and green growth in East Africa
    </p>

    <div className="hero-meta">
      <span>
        <CalendarDays size={18} />
        10th–11th February 2027
      </span>

      <span>
        <MapPin size={18} />
        Nairobi, Kenya
      </span>
    </div>

    <div className="hero-actions">
      <Link
        className="button button-primary"
        href="/registration"
      >
        Register Now <ArrowRight size={18} />
      </Link>

      <Link
        className="button button-light"
        href="/abstracts"
      >
        Submit Abstract <FileText size={18} />
      </Link>
    </div>

  </div>
</section>

      <section className="quick-links">
        <div className="container quick-grid">
          <Link href="/registration"><Users /> <span><strong>Participants</strong><small>Register to attend</small></span></Link>
          <Link href="/abstracts"><Presentation /> <span><strong>Call for Abstracts</strong><small>Share your research</small></span></Link>
          <Link href="/exhibition"><Store /> <span><strong>Exhibition</strong><small>Showcase your work</small></span></Link>
          <Link href="/about"><Handshake /> <span><strong>About the Conference</strong><small>Explore the programme</small></span></Link>
        </div>
      </section>

      <section className="section">
  <div className="container two-column about-home">

    <div className="about-image">
      <Image
        src="/images/agroecology-farmer.jpg"
        alt="Farmer working within an agroecological farming system"
        width={700}
        height={550}
      />
    </div>

    <div className="prose">
      <span className="section-label">
        ABOUT THE CONFERENCE
      </span>

      <h2>
        Building a stronger bio-inputs ecosystem for East Africa
      </h2>

      <p>
        The conference brings together policymakers, researchers,
        investors, manufacturers, development partners, farmer
        organizations, private sector actors and practitioners
        working around bio-inputs and sustainable food systems.
      </p>

      <p>
        It provides a platform to showcase research and innovations,
        strengthen policy dialogue, improve awareness and adoption,
        mobilize investment and create practical partnerships
        across the region.
      </p>

      <Link className="text-link" href="/about">
        Read more about the conference
        <ArrowRight size={16} />
      </Link>
    </div>

  </div>
</section>

      <section className="section section-soft">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="section-label">THEMATIC AREAS</span>
              <h2>Five areas driving the conversation</h2>
            </div>
            <Link className="text-link" href="/themes">View all themes <ArrowRight size={16} /></Link>
          </div>

          <div className="theme-grid">
            {themes.map(([title, slug], index) => (
              <Link className="theme-card" href={`/themes/${slug}`} key={slug}>
                <span className="theme-number">0{index + 1}</span>
                <Leaf size={22} />
                <h3>{title}</h3>
                <span className="card-link">Explore theme <ArrowRight size={15} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>
<section className="image-banner">
  <div className="container">
    <div className="image-banner-inner">

      <Image
        src="/images/bioinput-materials.jpg"
        alt="Bio-inputs and sustainable agriculture"
        fill
        sizes="(max-width: 850px) 100vw, 1180px"
      />

      <div className="image-banner-overlay" />

      <div className="image-banner-content">
        <span className="section-label">
          SUSTAINABLE FOOD SYSTEMS
        </span>

        <h2>
          Advancing bio-inputs for resilient agricultural systems
        </h2>
      </div>

    </div>
  </div>
</section>
      <section className="section">
        <div className="container callout">
          <div>
            <span className="section-label">CALL FOR ABSTRACTS</span>
            <h2>Contribute evidence, innovation and practical experience</h2>
            <p>
              Share work relevant to one of the conference thematic areas. The abstract submission
              requirements and deadline will be published here once approved by the conference team.
            </p>
          </div>
          <Link className="button button-primary" href="/abstracts">Abstract Information <ArrowRight size={18} /></Link>
        </div>
      </section>

      <section className="section section-dark">
        <div className="container audience">
          <div>
            <span className="section-label">WHO SHOULD ATTEND</span>
            <h2>A regional platform for knowledge, policy and investment</h2>
          </div>
          <div className="audience-list">
            {["Policymakers and government", "Researchers and academics", "Investors and development partners",
              "Bio-input manufacturers and private sector", "Farmer organizations and practitioners"].map((item) => (
              <div key={item}><CheckCircle2 size={19} /> {item}</div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container two-column venue">
          <div>
            <span className="section-label">VENUE</span>
            <h2>Nairobi, Kenya</h2>
            <p>The exact conference venue will be announced by the organizers.</p>
          </div>
          <div className="venue-placeholder">
            <MapPin size={42} />
            <span>Venue details coming soon</span>
          </div>
        </div>
      </section>
    </>
  );
}
