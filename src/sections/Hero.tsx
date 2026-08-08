import {
  lazy,
  Suspense,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowDownRight,
  ArrowUpRight,
} from "lucide-react";

import HeroMarquee from "../components/hero/HeroMarquee";
import { siteConfig } from "../data/siteConfig";
import { useReducedMotion } from "../hooks/useReducedMotion";
import ParticleFallback from "../three/ParticleFallback";

gsap.registerPlugin(ScrollTrigger);

const ParticleScene = lazy(() => import("../three/ParticleScene"));

const floatingLabels = [
  { name: "Design", detail: "Business-focused", className: "label-design" },
  { name: "Build", detail: "Responsive front-end", className: "label-build" },
  { name: "Interactive", detail: "3D + motion", className: "label-interactive" },
  { name: "Convert", detail: "Clear customer actions", className: "label-convert" },
];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  const sceneProgressRef = useRef(0);
  const reducedMotion = useReducedMotion();
  const [sceneReady, setSceneReady] = useState(false);

  useEffect(() => {
    if (reducedMotion) {
      setSceneReady(false);
      return;
    }

    const frame = window.requestAnimationFrame(() => setSceneReady(true));
    return () => window.cancelAnimationFrame(frame);
  }, [reducedMotion]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const title = titleRef.current;
    const visual = visualRef.current;

    if (reducedMotion || !section || !stage || !title || !visual) return;

    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      const titleLines = gsap.utils.toArray<HTMLElement>(
        ".hero-title-line",
        title,
      );
      const labels = gsap.utils.toArray<HTMLElement>(
        ".hero-float-label",
        labelsRef.current,
      );

      media.add(
        "(min-width: 1100px) and (hover: hover) and (pointer: fine)",
        () => {
          const timeline = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () =>
                `+=${Math.round(
                  Math.min(760, Math.max(520, window.innerHeight * 0.72)),
                )}`,
              scrub: 0.8,
              pin: stage,
              pinSpacing: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                sceneProgressRef.current = self.progress;
              },
            },
          });

          timeline
            .to(
              ".hero-eyebrow",
              { y: -55, opacity: 0, duration: 0.2 },
              0.08,
            )
            .to(
              titleLines,
              {
                xPercent: (index) => [-24, 18, -28, 22][index] ?? 0,
                yPercent: (index) => [-18, -4, 8, 22][index] ?? 0,
                opacity: (index) => (index === 1 ? 0.08 : 0.16),
                duration: 0.4,
                stagger: 0.015,
              },
              0.16,
            )
            .to(
              detailsRef.current,
              { y: -54, opacity: 0, duration: 0.27 },
              0.22,
            )
            .to(
              visual,
              { scale: 1.12, rotation: 1.2, duration: 0.34 },
              0.15,
            )
            .fromTo(
              labels,
              { opacity: 0, scale: 0.94 },
              {
                opacity: 1,
                scale: 1,
                duration: 0.2,
                stagger: 0.025,
              },
              0.43,
            )
            .to(
              labels,
              {
                x: (index) => [-20, 14, -16, 18][index] ?? 0,
                y: (index) => [-10, 12, 16, -12][index] ?? 0,
                duration: 0.28,
              },
              0.53,
            )
            .to(
              visual,
              {
                xPercent: 6,
                yPercent: 2,
                scale: 1.2,
                rotation: 2.4,
                duration: 0.32,
              },
              0.52,
            )
            .to(
              labels,
              { opacity: 0, filter: "blur(7px)", duration: 0.18 },
              0.8,
            )
            .to(
              visual,
              {
                yPercent: 16,
                scale: 0.86,
                opacity: 0.18,
                filter: "blur(5px)",
                duration: 0.2,
              },
              0.82,
            )
            .to(
              ".hero-scroll-cue",
              { opacity: 0, y: -20, duration: 0.16 },
              0.1,
            )
            .fromTo(
              ".hero-transition-copy",
              { opacity: 0, y: 35 },
              { opacity: 1, y: 0, duration: 0.13 },
              0.86,
            );

          return () => {
            sceneProgressRef.current = 0;
          };
        },
      );

      media.add("(min-width: 641px) and (max-width: 1099px)", () => {
        gsap.to(visual, {
          yPercent: 9,
          scale: 1.06,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: 0.75,
            onUpdate: (self) => {
              sceneProgressRef.current = self.progress * 0.55;
            },
          },
        });

        gsap.to(titleLines, {
          yPercent: -14,
          opacity: 0.28,
          stagger: 0.02,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "32% top",
            end: "88% top",
            scrub: 0.7,
          },
        });
      });

      media.add("(max-width: 640px)", () => {
        gsap.to(visual, {
          yPercent: 6,
          scale: 1.035,
          ease: "none",
          scrollTrigger: {
            trigger: visual,
            start: "top 72%",
            end: "bottom top",
            scrub: 0.55,
            onUpdate: (self) => {
              sceneProgressRef.current = self.progress * 0.35;
            },
          },
        });
      });

    }, section);

    return () => {
      media.revert();
      context.revert();
    };
  }, [reducedMotion]);

  return (
    <section className="hero-section" id="home" ref={sectionRef}>
      <div className="hero-stage" ref={stageRef}>
        <div className="hero-atmosphere" aria-hidden="true" />

        <div className="hero-layout">
          <div className="hero-copy">
            <div className="hero-eyebrow hero-load-reveal">
              <span className="availability-dot" aria-hidden="true" />
              Web Design · Front-End · Interactive Experiences
            </div>

            <h1 ref={titleRef} aria-label="Digital experiences built to stand out">
              <span className="hero-title-line hero-load-reveal">Digital</span>
              <span className="hero-title-line hero-title-outline hero-load-reveal">
                Experiences
              </span>
              <span className="hero-title-line hero-load-reveal">Built to</span>
              <span className="hero-title-line hero-title-accent hero-load-reveal">
                Stand out.
              </span>
            </h1>

            <div className="hero-details hero-load-reveal" ref={detailsRef}>
              <div className="hero-identity">
                <span>Md Rashed</span>
                <small>Founder · Rashed Digital Studio</small>
              </div>

              <p>{siteConfig.description}</p>

              <div className="hero-actions">
                <a className="primary-cta" href="#work">
                  View Selected Work
                  <ArrowDownRight size={17} aria-hidden="true" />
                </a>

                <a
                  className="secondary-cta"
                  href={siteConfig.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Start Your Project
                  <ArrowUpRight size={17} aria-hidden="true" />
                </a>
              </div>

              <div className="hero-meta-row">
                <span>Kolkata, India</span>
                <span aria-hidden="true">/</span>
                <span>Working worldwide</span>
                {siteConfig.socialLinks.linkedin && (
                  <a
                    className="hero-linkedin"
                    href={siteConfig.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LinkedIn
                    <ArrowUpRight size={13} aria-hidden="true" />
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="hero-visual" ref={visualRef} aria-hidden="true">
            <div className="hero-visual-glow" aria-hidden="true" />
            <div className="hero-orbit hero-orbit-one" aria-hidden="true" />
            <div className="hero-orbit hero-orbit-two" aria-hidden="true" />

            {sceneReady ? (
              <Suspense fallback={<ParticleFallback />}>
                <ParticleScene scrollProgress={sceneProgressRef} />
              </Suspense>
            ) : (
              <ParticleFallback />
            )}

            <div className="hero-labels" ref={labelsRef} aria-hidden="true">
              {floatingLabels.map((label) => (
                <div
                  className={`hero-float-label ${label.className}`}
                  key={label.name}
                >
                  <span>{label.name}</span>
                  <small>{label.detail}</small>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-scroll-cue hero-load-reveal" aria-hidden="true">
            <span>Scroll to transform</span>
            <i />
          </div>

          <p className="hero-transition-copy" aria-hidden="true">
            Selected disciplines · built for ambitious businesses
          </p>
        </div>
      </div>

      <HeroMarquee />
    </section>
  );
}
