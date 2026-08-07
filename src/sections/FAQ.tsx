import { useLayoutEffect, useRef, useState } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Minus, Plus } from "lucide-react";

import { faqItems } from "../data/faqData";
import { useReducedMotion } from "../hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export default function FAQ() {
  const sectionRef = useRef<HTMLElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    if (reducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".faq-v5-kicker, .faq-v5-intro",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".faq-v5-heading",
            start: "top 82%",
            once: true,
          },
        },
      );

      gsap.fromTo(
        ".faq-v5-title-line > span",
        { yPercent: 115 },
        {
          yPercent: 0,
          duration: 0.85,
          stagger: 0.09,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".faq-v5-heading",
            start: "top 80%",
            once: true,
          },
        },
      );

      gsap.fromTo(
        ".faq-v5-item",
        { y: 26, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.65,
          stagger: 0.055,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".faq-v5-list",
            start: "top 86%",
            once: true,
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section className="faq-section-v5" id="faq" ref={sectionRef}>
      <header className="faq-v5-heading">
        <span className="section-kicker faq-v5-kicker">
          Frequently asked
        </span>

        <div className="faq-v5-heading-grid">
          <h2>
            <span className="faq-v5-title-line">
              <span>Before we</span>
            </span>
            <span className="faq-v5-title-line">
              <span>start.</span>
            </span>
          </h2>

          <p className="faq-v5-intro">
            A few common questions about websites, timelines, integrations and
            working together.
          </p>
        </div>
      </header>

      <div className="faq-v5-list">
        {faqItems.map((item, index) => {
          const isOpen = openIndex === index;
          const buttonId = `faq-button-${index}`;
          const panelId = `faq-panel-${index}`;

          return (
            <article
              className={`faq-v5-item${isOpen ? " is-open" : ""}`}
              key={item.question}
            >
              <button
                className="faq-v5-trigger"
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                <span className="faq-v5-number">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="faq-v5-question">{item.question}</span>

                <span className="faq-v5-control" aria-hidden="true">
                  <Plus className="faq-v5-plus" size={18} />
                  <Minus className="faq-v5-minus" size={18} />
                </span>
              </button>

              <div
                className="faq-v5-panel"
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                aria-hidden={!isOpen}
              >
                <div className="faq-v5-panel-inner">
                  <p>{item.answer}</p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
