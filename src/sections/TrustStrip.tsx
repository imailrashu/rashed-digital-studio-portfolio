import {
  useLayoutEffect,
  useRef,
} from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useReducedMotion } from "../hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

const items = [
  {
    number: "01",
    title: "Strategy-led design",
    copy: "Every page starts with the business goal.",
  },
  {
    number: "02",
    title: "Mobile-first development",
    copy: "Designed intentionally for every screen.",
  },
  {
    number: "03",
    title: "Clear communication",
    copy: "Straightforward project updates and decisions.",
  },
  {
    number: "04",
    title: "Conversion-focused structure",
    copy: "Clear journeys towards enquiries and bookings.",
  },
  {
    number: "05",
    title: "Launch & integration support",
    copy: "Practical help getting the website live.",
  },
];

export default function TrustStrip() {
  const sectionRef = useRef<HTMLElement>(null);

  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    if (
      reducedMotion ||
      !sectionRef.current
    ) {
      return;
    }

    const ctx = gsap.context(() => {
      const cards =
        gsap.utils.toArray<HTMLElement>(
          ".trust-item",
        );

      cards.forEach((card, index) => {
        const number =
          card.querySelector(".trust-number");

        const title =
          card.querySelector("h2");

        const copy =
          card.querySelector("p");

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: "top 92%",
            end: "top 54%",
            scrub: 0.7,
          },
        });

        timeline
          .fromTo(
            card,
            {
              y: 70,
              opacity: 0.12,
            },
            {
              y: 0,
              opacity: 1,
              ease: "none",
            },
            0,
          )

          .fromTo(
            number,
            {
              opacity: 0.15,
              x: -12,
            },
            {
              opacity: 1,
              x: 0,
              ease: "none",
            },
            0,
          )

          .fromTo(
            title,
            {
              y: 20,
              opacity: 0,
            },
            {
              y: 0,
              opacity: 1,
              ease: "none",
            },
            0.12,
          )

          .fromTo(
            copy,
            {
              y: 18,
              opacity: 0,
            },
            {
              y: 0,
              opacity: 1,
              ease: "none",
            },
            0.22,
          );

        if (index < cards.length - 1) {
          gsap.fromTo(
            card,
            {
              borderColor:
                "rgba(255,255,255,0.04)",
            },
            {
              borderColor:
                "rgba(105,229,255,0.11)",

              scrollTrigger: {
                trigger: card,
                start: "top 70%",
                end: "top 48%",
                scrub: true,
              },
            },
          );
        }
      });
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, [reducedMotion]);

  return (
    <section
      className="trust-section"
      aria-label="How I work"
      ref={sectionRef}
    >
      <div className="trust-grid">
        {items.map((item) => (
          <article
            className="trust-item"
            key={item.number}
          >
            <span className="trust-number">
              {item.number}
            </span>

            <h2>{item.title}</h2>

            <p>{item.copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
