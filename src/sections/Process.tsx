import {
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import ProcessVisual from "../components/process/ProcessVisual";
import { processSteps } from "../data/processSteps";
import { useReducedMotion } from "../hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section || reducedMotion) return;

    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: ".process-v4-heading",
            start: "top 88%",
            end: "top 38%",
            scrub: 0.8,
          },
        })
        .fromTo(
          ".process-v4-kicker",
          { x: -20, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.2, ease: "none" },
          0,
        )
        .fromTo(
          ".process-v4-title-line",
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
          ".process-v4-heading-copy",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.3, ease: "none" },
          0.32,
        );

      const steps = gsap.utils.toArray<HTMLElement>(".process-v4-step");

      media.add("(min-width: 1100px)", () => {
        gsap.fromTo(
          ".process-v4-visual",
          { y: 70, scale: 0.92, opacity: 0.15 },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: ".process-v4-layout",
              start: "top 84%",
              end: "top 43%",
              scrub: 0.8,
            },
          },
        );

        steps.forEach((step, index) => {
          gsap.fromTo(
            step,
            { y: 42, opacity: index === 0 ? 1 : 0.24 },
            {
              y: 0,
              opacity: 1,
              ease: "none",
              scrollTrigger: {
                trigger: step,
                start: "top 90%",
                end: "top 58%",
                scrub: 0.65,
              },
            },
          );

          ScrollTrigger.create({
            trigger: step,
            start: "top 57%",
            end: "bottom 43%",
            onEnter: () => setActiveIndex(index),
            onEnterBack: () => setActiveIndex(index),
          });
        });
      });

      media.add("(max-width: 1099px)", () => {
        steps.forEach((step, index) => {
          gsap.fromTo(
            step,
            { y: 42, opacity: 0.22 },
            {
              y: 0,
              opacity: 1,
              ease: "none",
              scrollTrigger: {
                trigger: step,
                start: "top 92%",
                end: "top 61%",
                scrub: 0.65,
                onEnter: () => setActiveIndex(index),
                onEnterBack: () => setActiveIndex(index),
              },
            },
          );
        });
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());
    }, section);

    return () => {
      media.revert();
      context.revert();
    };
  }, [reducedMotion]);

  const activeStep = processSteps[activeIndex];

  return (
    <section className="process-section-v4" id="process" ref={sectionRef}>
      <div className="process-v4-heading">
        <span className="process-v4-kicker">How I work</span>

        <div className="process-v4-heading-grid">
          <h2 aria-label="From idea to launch">
            <span className="process-v4-title-mask">
              <span className="process-v4-title-line">From idea</span>
            </span>
            <span className="process-v4-title-mask">
              <span className="process-v4-title-line process-v4-title-accent">to launch.</span>
            </span>
          </h2>

          <p className="process-v4-heading-copy">
            A clear, practical process keeps each project focused on the business
            goal while moving from strategy to a production-ready website.
          </p>
        </div>
      </div>

      <div className="process-v4-layout">
        <div className="process-v4-steps" aria-label="Website project process">
          {processSteps.map((step, index) => (
            <button
              className={`process-v4-step${activeIndex === index ? " is-active" : ""}`}
              type="button"
              aria-pressed={activeIndex === index}
              onFocus={() => setActiveIndex(index)}
              onPointerEnter={() => setActiveIndex(index)}
              key={step.number}
            >
              <span className="process-v4-step-number">{step.number}</span>

              <span className="process-v4-step-copy">
                <strong>{step.title}</strong>
                <span>{step.description}</span>
              </span>

              <span className={`process-v4-mini process-v4-mini-${index + 1}`} aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
              </span>
            </button>
          ))}
        </div>

        <ProcessVisual
          activeIndex={activeIndex}
          activeStep={activeStep}
          total={processSteps.length}
        />
      </div>
    </section>
  );
}
