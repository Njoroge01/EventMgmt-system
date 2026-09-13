"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);
  const links = [
    ["About", "/about"], ["Themes", "/themes"], ["Abstracts", "/abstracts"],
    ["Exhibition", "/exhibition"], ["Contact", "/contact"]
  ];

  return (
    <header className="site-header">
      <div className="container nav">
        <Link className="brand" href="/" onClick={() => setOpen(false)}>
          <span className="brand-mark">EA</span>
          <span><strong>East Africa</strong><small>Bio-Inputs Conference</small></span>
        </Link>
        <button className="mobile-menu" onClick={() => setOpen(!open)} aria-label="Toggle navigation">{open ? <X /> : <Menu />}</button>
        <nav className={open ? "nav-links open" : "nav-links"}>
          {links.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)}>{label}</Link>)}
          <Link className="nav-cta" href="/registration" onClick={() => setOpen(false)}>Register</Link>
        </nav>
      </div>
    </header>
  );
}
