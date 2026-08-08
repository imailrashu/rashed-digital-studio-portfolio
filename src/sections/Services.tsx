import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";

import {
  ServiceCapability,
  ServicePreview,
} from "../components/services/ServiceVisuals";
import { services } from "../data/services";
import { useReducedMotion } from "../hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const serviceFocusRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || window.location.hash !== "#services") return;

    const alignDeepLink = () => {
      const headerHeight =
        document.querySelector<HTMLElement>(".site-header")
          ?.getBoundingClientRect().height ?? 0;
      const targetTop =
        window.scrollY +
        section.getBoundingClientRect().top -
        headerHeight -
        12;
      const root = document.documentElement;
      const previousScrollBehavior = root.style.scrollBehavior;

      root.style.scrollBehavior = "auto";
      window.scrollTo(0, Math.max(0, targetTop));
      root.style.scrollBehavior = previousScrollBehavior;
    };

    const timers = [
      window.setTimeout(alignDeepLink, 0),
      window.setTimeout(alignDeepLink, 350),
      window.setTimeout(alignDeepLink, 1100),
    ];

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, []);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (reducedMotion || !section) return;

    const context = gsap.context(() => {
      const headingTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".services-heading",
          start: "top 88%",
          end: "top 43%",
          scrub: 0.8,
        },
      });

      headingTimeline
        .fromTo(
          ".services-heading .section-kicker",
          { x: -20, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.2, ease: "none" },
          0,
        )
        .fromTo(
          ".services-title-line",
          { yPercent: 112, rotate: 2.5 },
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
          ".services-intro-copy",
          { y: 32, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.3, ease: "none" },
          0.35,
        );

      const rows = gsap.utils.toArray<HTMLElement>(".service-row");
      const useScrollActivation = window.matchMedia("(min-width: 641px)").matches;
      const activateFromScroll = (index: number) => {
        if (serviceFocusRef.current) return;

        setActiveIndex(index);
      };

      rows.forEach((row, index) => {
        gsap.fromTo(
          row,
          { y: 48, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: row,
              start: "top 92%",
              end: "top 69%",
              scrub: 0.6,
            },
          },
        );

        if (useScrollActivation) {
          ScrollTrigger.create({
            trigger: row,
            start: "top 58%",
            end: "bottom 42%",
            onEnter: () => activateFromScroll(index),
            onEnterBack: () => activateFromScroll(index),
          });
        }
      });

      gsap.fromTo(
        ".services-preview",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".services-layout",
            start: "top 82%",
            end: "top 51%",
            scrub: 0.75,
          },
        },
      );

      gsap.fromTo(
        ".service-capability-copy > *, .capability-canvas",
        { y: 56, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          ease: "none",
          scrollTrigger: {
            trigger: ".service-capability",
            start: "top 88%",
            end: "top 48%",
            scrub: 0.8,
          },
        },
      );

    }, section);

    return () => context.revert();
  }, [reducedMotion]);

  const updateParallax = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (reducedMotion || window.innerWidth < 1100) return;

    const x = (event.clientX / window.innerWidth - 0.5) * 18;
    const y = (event.clientY / window.innerHeight - 0.5) * 12;
    sectionRef.current?.style.setProperty("--services-pointer-x", `${x.toFixed(2)}px`);
    sectionRef.current?.style.setProperty("--services-pointer-y", `${y.toFixed(2)}px`);
  };

  const resetParallax = () => {
    sectionRef.current?.style.setProperty("--services-pointer-x", "0px");
    sectionRef.current?.style.setProperty("--services-pointer-y", "0px");
  };

  const activeService = services[activeIndex];

  return (
    <section className="services-section" id="services" ref={sectionRef}>
      <div className="services-heading">
        <span className="section-kicker">What I build</span>

        <div className="services-heading-grid">
          <h2 aria-label="Websites designed to move businesses forward">
            <span className="services-title-mask">
              <span className="services-title-line">Websites designed</span>
            </span>
            <span className="services-title-mask">
              <span className="services-title-line">to move businesses</span>
            </span>
            <span className="services-title-mask">
              <span className="services-title-line services-title-accent">forward.</span>
            </span>
          </h2>

          <p className="services-intro-copy">
            From professional business websites to interactive digital experiences,
            every project is structured around presentation, usability and practical
            customer actions.
          </p>
        </div>
      </div>

      <div
        className="services-layout"
        onPointerMove={updateParallax}
        onPointerLeave={resetParallax}
      >
        <div className="services-list" aria-label="Services">
          {services.map((service, index) => {
            const active = activeIndex === index;
            const detailsId = `service-details-${service.number}`;

            return (
              <button
                className={`service-row ${active ? "service-row-active" : ""}`}
                key={service.number}
                type="button"
                aria-expanded={active}
                aria-controls={detailsId}
                onMouseEnter={() => {
                  if (
                    window.matchMedia("(hover: hover) and (pointer: fine)").matches
                  ) {
                    setActiveIndex(index);
                  }
                }}
                onFocus={() => {
                  serviceFocusRef.current = true;
                  setActiveIndex(index);
                }}
                onBlur={() => {
                  requestAnimationFrame(() => {
                    const focusedElement = document.activeElement;
                    serviceFocusRef.current =
                      focusedElement instanceof HTMLElement &&
                      focusedElement.classList.contains("service-row");
                  });
                }}
                onClick={() => setActiveIndex(index)}
              >
                <span className="service-row-sweep" aria-hidden="true" />
                <span className="service-number">{service.number}</span>

                <span className="service-row-content">
                  <span className="service-row-summary">
                    <span className="service-title-wrap">
                      <span className="service-title-ghost" aria-hidden="true">
                        {service.title}
                      </span>
                      <span className="service-title">{service.title}</span>
                    </span>
                    <span className="service-description">{service.description}</span>
                  </span>

                  <span
                    className="service-row-details"
                    id={detailsId}
                    aria-hidden={!active}
                  >
                    <span>
                      {service.previewLines.map((line) => (
                        <span key={line}>
                          <i aria-hidden="true">→</i>
                          {line}
                        </span>
                      ))}
                    </span>
                  </span>
                </span>

                <span className="service-arrow-wrap" aria-hidden="true">
                  <ArrowUpRight className="service-arrow" size={20} />
                </span>
              </button>
            );
          })}
        </div>

        <ServicePreview service={activeService} index={activeIndex} />
      </div>

      <ServiceCapability />
    </section>
  );
}
