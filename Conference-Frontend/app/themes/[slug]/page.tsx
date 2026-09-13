import Link from "next/link";
import { ArrowLeft, ArrowRight, Leaf } from "lucide-react";

const data: Record<string, { title: string; text: string }> = {
  research: { title: "Research, Knowledge, Innovation & Technology", text: "This thematic area focuses on research, knowledge generation, innovation and technology relevant to bio-inputs and sustainable food systems." },
  policy: { title: "Policy, Regulatory & Institutional Frameworks", text: "This thematic area explores policy, regulatory and institutional frameworks that can enable responsible development, production, use and scaling of bio-inputs." },
  production: { title: "Production & Adoption through Agroecology and Food Systems Transformation", text: "This thematic area focuses on production, access, awareness and adoption of bio-inputs within agroecological approaches and wider food systems transformation." },
  investment: { title: "Investment & Financing", text: "This thematic area examines investment opportunities, financing mechanisms and enabling conditions for growing the bio-inputs ecosystem." },
  markets: { title: "Commercialization, Markets & Enterprise Development", text: "This thematic area looks at market development, commercialization, enterprise opportunities and regional value chains for bio-inputs." },
};

export default async function ThemePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const theme = data[slug] ?? data.research;

  return (
    <div className="page">
      <section className="page-hero"><div className="container"><span className="eyebrow">THEMATIC AREA</span><h1>{theme.title}</h1></div></section>
      <section className="section"><div className="container narrow">
        <Leaf className="theme-icon" size={44} />
        <h2>Focus of this thematic area</h2>
        <p className="large-text">{theme.text}</p>
        <div className="inline-actions"><Link className="button button-outline" href="/themes"><ArrowLeft size={17} /> All themes</Link><Link className="button button-primary" href="/abstracts">Submit an abstract <ArrowRight size={17} /></Link></div>
      </div></section>
    </div>
  );
}
