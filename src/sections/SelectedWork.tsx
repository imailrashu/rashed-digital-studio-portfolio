import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import ProjectCard from "../components/portfolio/ProjectCard";
import { portfolioProjects } from "../data/portfolioProjects";
import { useReducedMotion } from "../hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

const projectTotal = String(portfolioProjects.length).padStart(2, "0");

export default function SelectedWork() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || window.location.hash !== "#work") return;

    const alignDeepLink = () => {
      const headerHeight =
        document.querySelector<HTMLElement>(".site-header")
          ?.getBoundingClientRect().height ?? 0;
      const targetTop =
        window.scrollY + section.getBoundingClientRect().top - headerHeight - 12;
      const root = document.documentElement;
      const previousScrollBehavior = root.style.scrollBehavior;

      root.style.scrollBehavior = "auto";
      window.scrollTo(0, Math.max(0, targetTop));
      root.style.scrollBehavior = previousScrollBehavior;
    };

    const timers = [
      window.setTimeout(alignDeepLink, 0),
      window.setTimeout(alignDeepLink, 400),
      window.setTimeout(alignDeepLink, 1200),
    ];

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, []);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      const projects = gsap.utils.toArray<HTMLElement>(".work-project");

      ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          section.style.setProperty("--work-progress", self.progress.toFixed(4));
        },
      });

      projects.forEach((project, index) => {
        ScrollTrigger.create({
          trigger: project,
          start: "top 56%",
          end: "bottom 56%",
          onEnter: () => setActiveIndex(index),
          onEnterBack: () => setActiveIndex(index),
        });
      });

      if (reducedMotion) return;

      gsap
        .timeline({
          scrollTrigger: {
            trigger: ".work-intro",
            start: "top 88%",
            end: "top 38%",
            scrub: 0.8,
          },
        })
        .fromTo(
          ".work-section-kicker",
          { x: -20, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.2, ease: "none" },
          0,
        )
        .fromTo(
          ".work-title-line",
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
          ".work-intro-copy",
          { y: 32, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.3, ease: "none" },
          0.34,
        );

      media.add("(min-width: 1100px)", () => {
        projects.forEach((project, index) => {
          const meta = project.querySelector<HTMLElement>(".work-project-meta");
          const identity = project.querySelector<HTMLElement>(".work-project-identity");
          const title = project.querySelector<HTMLElement>(".work-project-title > span");
          const description = project.querySelector<HTMLElement>(".work-project-description");
          const support = project.querySelector<HTMLElement>(".work-project-support");
          const visual = project.querySelector<HTMLElement>(".work-project-visual");
          const browser = project.querySelector<HTMLElement>(".work-browser-frame");
          const phone = project.querySelector<HTMLElement>(".work-phone-frame");

          if (!meta || !identity || !title || !description || !support || !visual || !browser || !phone) {
            return;
          }

          const direction = index % 2 === 0 ? -1 : 1;
          const entry = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: project,
              start: "top 92%",
              end: "top 28%",
              scrub: 0.9,
            },
          });

          entry
            .fromTo(meta, { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.2 }, 0)
            .fromTo(title, { yPercent: 112 }, { yPercent: 0, duration: 0.34 }, 0.06)
            .fromTo(
              visual,
              {
                y: 125,
                x: 34 * direction,
                scale: 0.95,
                rotateX: 3.5,
                rotateZ: 2.2 * direction,
                opacity: 0.16,
              },
              {
                y: 0,
                x: 0,
                scale: 1,
                rotateX: 0,
                rotateZ: 0,
                opacity: 1,
                duration: 0.62,
              },
              0.04,
            )
            .fromTo(
              phone,
              { y: 105, x: 18 * direction, opacity: 0 },
              { y: 0, x: 0, opacity: 1, duration: 0.32 },
              0.3,
            )
            .fromTo(
              description,
              { y: 30, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.27 },
              0.24,
            )
            .fromTo(
              support,
              { y: 30, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.28 },
              0.39,
            );

          if (index < projects.length - 1) {
            gsap.to([identity, support, visual], {
              y: -52,
              scale: 0.975,
              opacity: 0.28,
              ease: "none",
              scrollTrigger: {
                trigger: project,
                start: "bottom 72%",
                end: "bottom 20%",
                scrub: 0.85,
              },
            });
          }
        });
      });

      media.add("(max-width: 1099px)", () => {
        projects.forEach((project) => {
          const revealTargets = project.querySelectorAll<HTMLElement>(
            ".work-project-meta, .work-project-identity, .work-project-visual, .work-project-support",
          );

          gsap.fromTo(
            revealTargets,
            { y: 38, opacity: 0.25 },
            {
              y: 0,
              opacity: 1,
              stagger: 0.05,
              ease: "none",
              scrollTrigger: {
                trigger: project,
                start: "top 92%",
                end: "top 48%",
                scrub: 0.7,
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

  return (
    <section className="selected-work-section-v3" id="work" ref={sectionRef}>
      <div className="work-intro">
        <span className="work-section-kicker">Selected work</span>

        <div className="work-intro-grid">
          <h2 aria-label="Digital work built around business">
            <span className="work-title-mask">
              <span className="work-title-line">Digital work</span>
            </span>
            <span className="work-title-mask">
              <span className="work-title-line">built around</span>
            </span>
            <span className="work-title-mask">
              <span className="work-title-line work-title-accent">business.</span>
            </span>
          </h2>

          <p className="work-intro-copy">
            A selection of client work, personal projects and design concepts
            exploring responsive websites, stronger digital presentation and
            practical customer journeys.
          </p>
        </div>
      </div>

      <div className="work-projects-shell">
        <aside className="work-project-rail" aria-label="Selected project navigation">
          <div className="work-project-rail-sticky">
            <span className="work-rail-counter" aria-live="polite">
              {String(activeIndex + 1).padStart(2, "0")}
              <i aria-hidden="true" />
              {projectTotal}
            </span>

            <span className="work-rail-progress" aria-hidden="true">
              <i />
            </span>

            <nav aria-label="Jump to a selected project">
              {portfolioProjects.map((project, index) => (
                <a
                  className={index === activeIndex ? "is-active" : undefined}
                  href={`#project-${project.slug}`}
                  aria-current={index === activeIndex ? "step" : undefined}
                  aria-label={`${String(index + 1).padStart(2, "0")} ${project.name}`}
                  key={project.slug}
                >
                  {String(index + 1).padStart(2, "0")}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        <div className="work-projects">
          {portfolioProjects.map((project, index) => (
            <ProjectCard project={project} index={index} key={project.slug} />
          ))}
        </div>
      </div>
    </section>
  );
}
