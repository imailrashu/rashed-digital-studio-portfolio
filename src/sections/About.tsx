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
            trigger: ".about-v4-heading",
            start: "top 89%",
            end: "top 40%",
            scrub: 0.8,
          },
        })
        .fromTo(
          ".about-v4-kicker",
          { x: -20, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.2, ease: "none" },
          0,
        )
        .fromTo(
          ".about-v4-title-line",
          { yPercent: 112, rotate: 2 },
          {
            yPercent: 0,
            rotate: 0,
            duration: 0.58,
            stagger: 0.08,
            ease: "power3.out",
          },
          0.08,
        )
        .fromTo(
          ".about-v4-person",
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.28, ease: "none" },
          0.32,
        );

      gsap.fromTo(
        ".about-v4-intro",
        { y: 58, opacity: 0.18 },
        {
          y: 0,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".about-v4-main",
            start: "top 88%",
            end: "top 52%",
            scrub: 0.75,
          },
        },
      );

      gsap.fromTo(
        ".about-v4-visual",
        { y: 80, scale: 0.88, rotate: -2.5, opacity: 0.15 },
        {
          y: 0,
          scale: 1,
          rotate: 0,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".about-v4-main",
            start: "top 91%",
            end: "top 43%",
            scrub: 0.9,
          },
        },
      );

      const facts = gsap.utils.toArray<HTMLElement>(".about-v4-fact");
      facts.forEach((fact, index) => {
        gsap.fromTo(
          fact,
          { y: 42, opacity: 0.18 },
          {
            y: 0,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: fact,
              start: "top 93%",
              end: "top 67%",
              scrub: 0.62,
            },
            delay: index * 0.025,
          },
        );
      });

      gsap.fromTo(
        ".about-v4-focus",
        { y: 32, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".about-v4-focus",
            start: "top 92%",
            end: "top 70%",
            scrub: 0.55,
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

    event.currentTarget.style.setProperty("--about-pointer-x", x.toFixed(3));
    event.currentTarget.style.setProperty("--about-pointer-y", y.toFixed(3));
  };

  const resetPointerDepth = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty("--about-pointer-x", "0");
    event.currentTarget.style.setProperty("--about-pointer-y", "0");
  };

  return (
    <section className="about-section-v4" id="about" ref={sectionRef}>
      <div className="about-v4-heading">
        <span className="about-v4-kicker">Behind the work</span>

        <div className="about-v4-heading-grid">
          <h2 aria-label="Design with purpose behind it">
            <span className="about-v4-title-mask">
              <span className="about-v4-title-line">Design with</span>
            </span>
            <span className="about-v4-title-mask">
              <span className="about-v4-title-line about-v4-title-accent">
                purpose behind it.
              </span>
            </span>
          </h2>

          <div className="about-v4-person">
            <span>{aboutData.name}</span>
            <small>{aboutData.role}</small>
            <small>{aboutData.studio}</small>
          </div>
        </div>
      </div>

      <div className="about-v4-main">
        <div className="about-v4-intro">
          <p className="about-v4-lead">{aboutData.introduction}</p>
          <p>{aboutData.secondary}</p>

          <div className="about-v4-actions">
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

        <div
          className="about-v4-visual"
          onPointerMove={updatePointerDepth}
          onPointerLeave={resetPointerDepth}
          aria-label="Abstract founder identity for Md Rashed"
          role="img"
        >
          <div className="about-v4-visual-top" aria-hidden="true">
            <span>FOUNDER ID / 001</span>
            <span>KOL / WORLDWIDE</span>
          </div>

          <div className="about-v4-identity-system" aria-hidden="true">
            <span className="about-v4-crosshair about-v4-crosshair-x" />
            <span className="about-v4-crosshair about-v4-crosshair-y" />
            <span className="about-v4-orbit about-v4-orbit-a" />
            <span className="about-v4-orbit about-v4-orbit-b" />
            <span className="about-v4-orbit about-v4-orbit-c" />
            <span className="about-v4-node about-v4-node-a" />
            <span className="about-v4-node about-v4-node-b" />
            <span className="about-v4-node about-v4-node-c" />
            <span className="about-v4-node about-v4-node-d" />

            <span className="about-v4-core">
              <strong>MR</strong>
              <small>DESIGN / BUILD</small>
            </span>

            <span className="about-v4-system-label about-v4-label-a">
              WEB / FRONT-END
            </span>
            <span className="about-v4-system-label about-v4-label-b">
              KOLKATA / INDIA
            </span>
          </div>

          <div className="about-v4-visual-footer">
            <span>Founder</span>
            <strong>Rashed Digital Studio</strong>
            <small>Kolkata · Working worldwide</small>
          </div>
        </div>
      </div>

      <div className="about-v4-facts">
        {aboutFacts.map((fact) => (
          <article className="about-v4-fact" key={fact.number}>
            <span>{fact.number} / {fact.label}</span>
            <strong>{fact.value}</strong>
            <p>{fact.detail}</p>
          </article>
        ))}
      </div>

      <div className="about-v4-focus">
        <span>Current focus</span>
        <div>
          {aboutData.focus.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
