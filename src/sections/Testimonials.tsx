import {
  useLayoutEffect,
  useRef,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  verifiedTestimonials,
  type Testimonial,
} from "../data/testimonials";
import { useReducedMotion } from "../hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

type ProofVisualType =
  | "screenshot"
  | "devices"
  | "process"
  | "founder"
  | "integrations"
  | "deployment";

const proofSignals: Array<{
  number: string;
  title: string;
  description: string;
  label: string;
  visual: ProofVisualType;
}> = [
  {
    number: "01",
    title: "Real project screenshots",
    description:
      "Selected work is presented through rendered desktop and mobile experiences rather than invented results.",
    label: "Captured interface evidence",
    visual: "screenshot",
  },
  {
    number: "02",
    title: "Responsive implementation",
    description:
      "Layouts are built and checked across phone, tablet and desktop breakpoints.",
    label: "320px → 1920px",
    visual: "devices",
  },
  {
    number: "03",
    title: "Clear project process",
    description:
      "Discovery, direction, build and launch steps remain visible from the start.",
    label: "Five-stage workflow",
    visual: "process",
  },
  {
    number: "04",
    title: "Direct founder communication",
    description:
      "Project conversations stay direct, practical and close to the work itself.",
    label: "Founder-led delivery",
    visual: "founder",
  },
  {
    number: "05",
    title: "WhatsApp / booking integrations",
    description:
      "Customer actions can connect to familiar enquiry and scheduling tools.",
    label: "Practical customer actions",
    visual: "integrations",
  },
  {
    number: "06",
    title: "Production deployment support",
    description:
      "The final handoff can include deployment, domain connection and launch support.",
    label: "Production-ready handoff",
    visual: "deployment",
  },
];

function ProofSignalVisual({ type }: { type: ProofVisualType }) {
  if (type === "screenshot") {
    return (
      <div className="proof-v4-screenshot" aria-hidden="true">
        <span>
          <i />
          <i />
          <i />
        </span>
        <div className="proof-v4-screenshot-stage">
          <img
            src="/projects/atoz-interior/desktop.png"
            alt=""
            width="1440"
            height="900"
            loading="lazy"
            decoding="async"
            draggable="false"
          />
          <span className="proof-v4-screenshot-phone">
            <img
              src="/projects/atoz-interior/mobile.png"
              alt=""
              width="390"
              height="844"
              loading="lazy"
              decoding="async"
              draggable="false"
            />
          </span>
        </div>
      </div>
    );
  }

  if (type === "devices") {
    return (
      <div className="proof-v4-devices" aria-hidden="true">
        <i className="device-desktop" />
        <i className="device-tablet" />
        <i className="device-mobile" />
      </div>
    );
  }

  if (type === "process") {
    return (
      <div className="proof-v4-process" aria-hidden="true">
        {Array.from({ length: 5 }, (_, index) => (
          <span key={index}><i /></span>
        ))}
      </div>
    );
  }

  if (type === "founder") {
    return (
      <div className="proof-v4-founder" aria-hidden="true">
        <span>MR</span>
        <i />
        <small>DIRECT / FOUNDER</small>
      </div>
    );
  }

  if (type === "integrations") {
    return (
      <div className="proof-v4-integrations" aria-hidden="true">
        <span>WhatsApp</span>
        <i />
        <span>Booking</span>
      </div>
    );
  }

  return (
    <div className="proof-v4-deployment" aria-hidden="true">
      <span><i />BUILD COMPLETE</span>
      <span><i />DOMAIN CONNECTED</span>
      <span><i />READY TO LAUNCH</span>
    </div>
  );
}

function VerifiedTestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <article className="testimonial-v4-card" data-verified="true">
      <blockquote>“{testimonial.quote}”</blockquote>

      <footer>
        <div className="testimonial-v4-photo">
          <img
            src={testimonial.photo}
            alt={`${testimonial.name}, ${testimonial.role}`}
            width="76"
            height="76"
            loading="lazy"
            decoding="async"
          />
        </div>

        <div>
          <strong>{testimonial.name}</strong>
          <span>{testimonial.role} · {testimonial.company}</span>
        </div>

        <small>Verified project</small>
      </footer>
    </article>
  );
}

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section || reducedMotion) return;

    const context = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: ".proof-v4-heading",
            start: "top 89%",
            end: "top 40%",
            scrub: 0.8,
          },
        })
        .fromTo(
          ".proof-v4-kicker",
          { x: -20, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.2, ease: "none" },
          0,
        )
        .fromTo(
          ".proof-v4-title-line",
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
          ".proof-v4-heading-copy",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.3, ease: "none" },
          0.34,
        );

      const evidence = gsap.utils.toArray<HTMLElement>(
        ".proof-v4-card, .testimonial-v4-card",
      );

      evidence.forEach((card, index) => {
        gsap.fromTo(
          card,
          { y: 58, opacity: 0.14 },
          {
            y: 0,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top 94%",
              end: "top 64%",
              scrub: 0.68,
            },
            delay: index * 0.02,
          },
        );
      });
    }, section);

    return () => context.revert();
  }, [reducedMotion]);

  return (
    <section
      className="proof-section-v4"
      aria-labelledby="proof-heading"
      data-verified-count={verifiedTestimonials.length}
      ref={sectionRef}
    >
      <div className="proof-v4-heading">
        <span className="proof-v4-kicker">Trust, without invented reviews</span>

        <div className="proof-v4-heading-grid">
          <h2 id="proof-heading" aria-label="Proof in the work">
            <span className="proof-v4-title-mask">
              <span className="proof-v4-title-line">Proof in</span>
            </span>
            <span className="proof-v4-title-mask">
              <span className="proof-v4-title-line proof-v4-title-accent">
                the work.
              </span>
            </span>
          </h2>

          <p className="proof-v4-heading-copy">
            Verified client testimonials can live here when they are available.
            Until then, the work and the way it is delivered are the evidence.
          </p>
        </div>
      </div>

      {verifiedTestimonials.length > 0 ? (
        <div className="testimonial-v4-grid">
          {verifiedTestimonials.map((testimonial) => (
            <VerifiedTestimonialCard
              testimonial={testimonial}
              key={`${testimonial.company}-${testimonial.name}`}
            />
          ))}
        </div>
      ) : (
        <div className="proof-v4-grid" aria-label="Project delivery evidence">
          {proofSignals.map((signal) => (
            <article className="proof-v4-card" key={signal.number}>
              <div className="proof-v4-card-meta">
                <span>{signal.number}</span>
                <i aria-hidden="true" />
                <small>{signal.label}</small>
              </div>

              <div className="proof-v4-card-copy">
                <h3>{signal.title}</h3>
                <p>{signal.description}</p>
              </div>

              <ProofSignalVisual type={signal.visual} />
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
