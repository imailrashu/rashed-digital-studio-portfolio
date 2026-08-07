import {
  useLayoutEffect,
  useRef,
  type PointerEvent as ReactPointerEvent,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { valuePillars } from "../data/aboutData";
import { useReducedMotion } from "../hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export default function WhyWorkWithMe() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section || reducedMotion) return;

    const context = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: ".why-v4-heading",
            start: "top 89%",
            end: "top 40%",
            scrub: 0.8,
          },
        })
        .fromTo(
          ".why-v4-kicker",
          { x: -20, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.2, ease: "none" },
          0,
        )
        .fromTo(
          ".why-v4-title-line",
          { yPercent: 112, rotate: 2 },
          {
            yPercent: 0,
            rotate: 0,
            duration: 0.58,
            stagger: 0.075,
            ease: "power3.out",
          },
          0.08,
        )
        .fromTo(
          ".why-v4-heading-copy",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.3, ease: "none" },
          0.34,
        );

      const cards = gsap.utils.toArray<HTMLElement>(".why-v4-card");
      cards.forEach((card, index) => {
        gsap.fromTo(
          card,
          { y: 55, opacity: 0.14 },
          {
            y: 0,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top 94%",
              end: "top 65%",
              scrub: 0.68,
            },
            delay: index * 0.02,
          },
        );
      });
    }, section);

    return () => context.revert();
  }, [reducedMotion]);

  const updateCardLight = (event: ReactPointerEvent<HTMLElement>) => {
    if (window.innerWidth < 1100 || event.pointerType !== "mouse") return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;

    event.currentTarget.style.setProperty("--why-light-x", `${x.toFixed(1)}%`);
    event.currentTarget.style.setProperty("--why-light-y", `${y.toFixed(1)}%`);
  };

  return (
    <section className="why-section-v4" ref={sectionRef}>
      <div className="why-v4-heading">
        <span className="why-v4-kicker">Why work with me</span>

        <div className="why-v4-heading-grid">
          <h2 aria-label="Good websites should do more than look good">
            <span className="why-v4-title-mask">
              <span className="why-v4-title-line">Good websites should</span>
            </span>
            <span className="why-v4-title-mask">
              <span className="why-v4-title-line why-v4-title-accent">
                do more than look good.
              </span>
            </span>
          </h2>

          <p className="why-v4-heading-copy">
            The goal is a digital experience that feels professional, works
            properly across devices and helps visitors understand what your
            business offers.
          </p>
        </div>
      </div>

      <div className="why-v4-grid">
        {valuePillars.map((pillar) => (
          <article
            className="why-v4-card"
            tabIndex={0}
            onPointerMove={updateCardLight}
            key={pillar.number}
          >
            <span className="why-v4-light" aria-hidden="true" />

            <div className="why-v4-card-top">
              <span>{pillar.number}</span>
              <i aria-hidden="true" />
              <small>RDS / VALUE</small>
            </div>

            <div className="why-v4-card-copy">
              <h3>{pillar.title}</h3>
              <p>{pillar.description}</p>
            </div>

            <span className="why-v4-card-line" aria-hidden="true" />
          </article>
        ))}
      </div>
    </section>
  );
}
