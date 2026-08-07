import {
  type MouseEvent,
  useLayoutEffect,
  useRef,
} from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUp, ArrowUpRight } from "lucide-react";

import { siteConfig } from "../data/siteConfig";
import { useReducedMotion } from "../hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const currentYear = new Date().getFullYear();

  useLayoutEffect(() => {
    if (reducedMotion || !footerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".footer-v5-reveal",
        { y: 22, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.07,
          ease: "power3.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 90%",
            once: true,
          },
        },
      );
    }, footerRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  function handleBackToTop(event: MouseEvent<HTMLAnchorElement>) {
    const home = document.querySelector<HTMLElement>("#home");
    if (!home) return;

    event.preventDefault();
    home.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
    window.history.replaceState(null, "", "#home");
  }

  return (
    <footer className="site-footer-v5" ref={footerRef}>
      <div className="footer-v5-signal" aria-hidden="true">
        <span />
        <small>RDS / END FRAME / {currentYear}</small>
      </div>

      <div className="footer-v5-top footer-v5-reveal">
        <a href="#home" className="footer-v5-brand">
          <span className="footer-v5-monogram">R</span>
          <span className="footer-v5-brand-name">
            <strong>Rashed</strong>
            <small>Digital Studio</small>
          </span>
        </a>

        <p>
          Web design, front-end development and interactive digital experiences
          for businesses in India and worldwide.
        </p>
      </div>

      <div className="footer-v5-grid">
        <nav className="footer-v5-column footer-v5-reveal" aria-label="Footer navigation">
          <span className="footer-v5-label">Navigate</span>
          <a href="#work">Work</a>
          <a href="#services">Services</a>
          <a href="#process">Process</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>

        <nav className="footer-v5-column footer-v5-reveal" aria-label="Social and email links">
          <span className="footer-v5-label">Connect</span>

          {siteConfig.socialLinks.linkedin && (
            <a
              href={siteConfig.socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn <ArrowUpRight size={13} aria-hidden="true" />
            </a>
          )}

          {siteConfig.socialLinks.instagram && (
            <a
              href={siteConfig.socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram <ArrowUpRight size={13} aria-hidden="true" />
            </a>
          )}

          {siteConfig.socialLinks.facebook && (
            <a
              href={siteConfig.socialLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook <ArrowUpRight size={13} aria-hidden="true" />
            </a>
          )}

          {siteConfig.socialLinks.github && (
            <a
              href={siteConfig.socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub <ArrowUpRight size={13} aria-hidden="true" />
            </a>
          )}

          <a href={siteConfig.emailLink}>
            Email <ArrowUpRight size={13} aria-hidden="true" />
          </a>
        </nav>

        <div className="footer-v5-column footer-v5-reveal">
          <span className="footer-v5-label">Location</span>
          <p>
            Kolkata
            <br />
            West Bengal
            <br />
            India
          </p>
        </div>

        <div className="footer-v5-column footer-v5-reveal">
          <span className="footer-v5-label">Availability</span>
          <p>
            Selected projects
            <br />
            India
            <br />
            Worldwide
          </p>
        </div>
      </div>

      <div className="footer-v5-bottom footer-v5-reveal">
        <span>© {currentYear} Rashed Digital Studio</span>
        <span>Designed with strategy. Built for trust.</span>
        <a href="#home" onClick={handleBackToTop}>
          Back to top <ArrowUp size={13} aria-hidden="true" />
        </a>
      </div>
    </footer>
  );
}
