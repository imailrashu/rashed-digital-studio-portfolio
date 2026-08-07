import {
  useLayoutEffect,
  useRef,
  type PointerEvent as ReactPointerEvent,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";

import { aboutData } from "../data/aboutData";
import { siteConfig } from "../data/siteConfig";
import { useReducedMotion } from "../hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

const aboutFacts = [
  {
    number: "01",
    label: "Based in",
    value: "Kolkata, India",
    detail: "Working with businesses locally and remotely.",
  },
  {
    number: "02",
    label: "Focus",
    value: "Web & Front-End",
    detail: "Responsive design, development and interactive experiences.",
  },
  {
    number: "03",
    label: "Education",
    value: "B.Tech CSE",
    detail: "Cybersecurity · The Neotia University",
  },
  {
    number: "04",
    label: "Availability",
    value: "Worldwide",
    detail: "Freelance, contract and selected website projects.",
  },
] as const;

const workingPrinciples = ["Presentation", "Usability", "Action"] as const;

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section || reducedMotion) return;

    const context = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: ".about-v6-head",
            start: "top 88%",
            end: "top 37%",
            scrub: 0.8,
          },
        })
        .fromTo(
          ".about-v6-kicker",
          { x: -22, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.2, ease: "none" },
          0,
        )
        .fromTo(
          ".about-v6-title-line",
          { yPercent: 115, rotate: 2.5 },
          {
            yPercent: 0,
            rotate: 0,
            duration: 0.62,
            stagger: 0.075,
            ease: "power3.out",
          },
          0.08,
        )
        .fromTo(
          ".about-v6-founder-mark",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.3, ease: "none" },
          0.34,
        );

      gsap.fromTo(
        ".about-v6-visual",
        {
          y: 70,
          scale: 0.93,
          clipPath: "inset(8% 6% 8% 6%)",
          opacity: 0.2,
        },
        {
          y: 0,
          scale: 1,
          clipPath: "inset(0% 0% 0% 0%)",
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".about-v6-story",
            start: "top 91%",
            end: "top 43%",
            scrub: 0.88,
          },
        },
      );

      gsap.fromTo(
        ".about-v6-narrative > *",
        { y: 42, opacity: 0.12 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.07,
          ease: "none",
          scrollTrigger: {
            trigger: ".about-v6-narrative",
            start: "top 87%",
            end: "top 48%",
            scrub: 0.72,
          },
        },
      );

      const rows = gsap.utils.toArray<HTMLElement>(".about-v6-ledger-row");
      rows.forEach((row) => {
        gsap.fromTo(
          row,
          { y: 34, opacity: 0.14 },
          {
            y: 0,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: row,
              start: "top 94%",
              end: "top 72%",
              scrub: 0.58,
            },
          },
        );
      });

      gsap.fromTo(
        ".about-v6-focus",
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".about-v6-focus",
            start: "top 93%",
            end: "top 72%",
            scrub: 0.52,
          },
        },
      );
    }, section);

    return () => context.revert();
  }, [reducedMotion]);

  const updatePointerDepth = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (window.innerWidth < 1100 || event.pointerType !== "mouse") return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;

    event.currentTarget.style.setProperty("--about-v6-pointer-x", x.toFixed(3));
    event.currentTarget.style.setProperty("--about-v6-pointer-y", y.toFixed(3));
  };

  const resetPointerDepth = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty("--about-v6-pointer-x", "0");
    event.currentTarget.style.setProperty("--about-v6-pointer-y", "0");
  };

  return (
    <section
      className="about-section-v4 about-section-v6"
      id="about"
      ref={sectionRef}
    >
      <header className="about-v6-head">
        <div className="about-v6-head-meta">
          <span className="about-v6-kicker">About / Founder</span>
          <span>Independent creative practice · 2026</span>
        </div>

        <div className="about-v6-head-grid">
          <h2 aria-label="One founder. Design, code and purpose.">
            <span className="about-v6-title-mask">
              <span className="about-v6-title-line">One founder.</span>
            </span>
            <span className="about-v6-title-mask">
              <span className="about-v6-title-line about-v6-title-outline">
                Design, code
              </span>
            </span>
            <span className="about-v6-title-mask">
              <span className="about-v6-title-line about-v6-title-accent">
                and purpose.
              </span>
            </span>
          </h2>

          <div className="about-v6-founder-mark">
            <span>Founder / 001</span>
            <strong>{aboutData.name}</strong>
            <small>{aboutData.role}</small>
            <small>{aboutData.studio}</small>
          </div>
        </div>
      </header>

      <div className="about-v6-story">
        <div
          className="about-v6-visual"
          onPointerMove={updatePointerDepth}
          onPointerLeave={resetPointerDepth}
        >
          <div className="about-v6-visual-meta" aria-hidden="true">
            <span>RDS / IDENTITY FILE</span>
            <span>22.57° N / 88.36° E</span>
          </div>

          <div className="about-v6-identity-plate">
            <span className="about-v6-registration about-v6-registration-a" aria-hidden="true" />
            <span className="about-v6-registration about-v6-registration-b" aria-hidden="true" />
            <span className="about-v6-registration about-v6-registration-c" aria-hidden="true" />
            <span className="about-v6-registration about-v6-registration-d" aria-hidden="true" />
            <span className="about-v6-frame about-v6-frame-outer" aria-hidden="true" />
            <span className="about-v6-frame about-v6-frame-inner" aria-hidden="true" />
            <span className="about-v6-scan-line" aria-hidden="true" />

            <figure className="about-v6-portrait">
              <img
                src="/images/md-rashed-profile.webp"
                alt="Portrait of Md Rashed, founder of Rashed Digital Studio"
                width="1024"
                height="1024"
                loading="lazy"
                decoding="async"
                draggable="false"
              />
              <figcaption className="about-v6-portrait-id">
                <span>Founder portrait</span>
                <strong>MR / 001</strong>
              </figcaption>
            </figure>

            <strong className="about-v6-monogram" aria-hidden="true">MR</strong>
            <span className="about-v6-discipline" aria-hidden="true">DESIGN / FRONT-END</span>
            <span className="about-v6-name-rail" aria-hidden="true">RASHED DIGITAL STUDIO</span>
          </div>

          <div className="about-v6-visual-status" aria-hidden="true">
            <span><i /> Founder-led</span>
            <strong>Kolkata / Worldwide</strong>
            <small>Web design · Front-end · Interactive</small>
          </div>
        </div>

        <div className="about-v6-narrative">
          <span className="about-v6-story-label">The practice</span>
          <p className="about-v6-lead">{aboutData.introduction}</p>
          <p className="about-v6-secondary">{aboutData.secondary}</p>

          <div className="about-v6-principle">
            <span>Every project balances</span>
            <div>
              {workingPrinciples.map((principle, index) => (
                <span key={principle}>
                  <small>0{index + 1}</small>
                  {principle}
                </span>
              ))}
            </div>
          </div>

          <div className="about-v6-actions">
            <a
              href={siteConfig.calendly}
              target="_blank"
              rel="noopener noreferrer"
              className="primary-cta"
            >
              Book a Conversation
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>

            <a
              href={siteConfig.socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="secondary-cta"
            >
              LinkedIn
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>

      <div className="about-v6-ledger">
        <div className="about-v6-ledger-head">
          <span>Founder profile / verified details</span>
          <span>04 records</span>
        </div>

        {aboutFacts.map((fact) => (
          <article className="about-v6-ledger-row" key={fact.number}>
            <span>{fact.number}</span>
            <small>{fact.label}</small>
            <strong>{fact.value}</strong>
            <p>{fact.detail}</p>
          </article>
        ))}
      </div>

      <div className="about-v6-focus">
        <div>
          <span>Current focus</span>
          <small>What I design and build</small>
        </div>

        <div className="about-v6-focus-list">
          {aboutData.focus.map((item, index) => (
            <span key={item}>
              <small>{String(index + 1).padStart(2, "0")}</small>
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
