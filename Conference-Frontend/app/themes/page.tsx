import Link from "next/link";
import { ArrowRight, Leaf } from "lucide-react";

const themes = [
  { slug: "research", title: "Research, Knowledge, Innovation & Technology", text: "Research, evidence, innovation and technologies that can strengthen bio-input systems." },
  { slug: "policy", title: "Policy, Regulatory & Institutional Frameworks", text: "Policy, regulation and institutional arrangements needed for a supportive bio-inputs ecosystem." },
  { slug: "production", title: "Production & Adoption through Agroecology and Food Systems Transformation", text: "Production, access, use and adoption within agroecological and food-systems approaches." },
  { slug: "investment", title: "Investment & Financing", text: "Investment pathways, finance and business models for scaling bio-inputs." },
  { slug: "markets", title: "Commercialization, Markets & Enterprise Development", text: "Markets, commercialization and enterprise opportunities across East Africa." },
];

export default function ThemesPage() {
  return (
    <div className="page">
      <section className="page-hero"><div className="container"><span className="eyebrow">CONFERENCE THEMES</span><h1>Thematic Areas</h1><p>Five connected areas frame the conference discussions and knowledge exchange.</p></div></section>
      <section className="section"><div className="container theme-list">
        {themes.map((theme, i) => (
          <Link className="theme-row" href={`/themes/${theme.slug}`} key={theme.slug}>
            <span className="theme-number">0{i+1}</span><Leaf /><div><h2>{theme.title}</h2><p>{theme.text}</p></div><ArrowRight />
          </Link>
        ))}
      </div></section>
    </div>
  );
}
