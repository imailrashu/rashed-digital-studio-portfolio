import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { ArrowUpRight, Plus } from "lucide-react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import type { PortfolioProject } from "../../data/portfolioProjects";
import ProjectMockup from "./ProjectMockup";

type ProjectCardProps = {
  project: PortfolioProject;
  index: number;
};

const projectTotal = "06";

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const [caseStudyOpen, setCaseStudyOpen] = useState(false);
  const hasMountedRef = useRef(false);
  const displayNumber = String(index + 1).padStart(2, "0");
  const titleId = `project-title-${project.slug}`;
  const panelId = `project-case-study-${project.slug}`;
  const isConcept = project.classification.toLowerCase().includes("concept");

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    const refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 460);
    return () => window.clearTimeout(refreshTimer);
  }, [caseStudyOpen]);

  const updatePointerDepth = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (window.innerWidth < 1100 || event.pointerType !== "mouse") {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;

    event.currentTarget.style.setProperty("--work-pointer-x", x.toFixed(3));
    event.currentTarget.style.setProperty("--work-pointer-y", y.toFixed(3));
  };

  const resetPointerDepth = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty("--work-pointer-x", "0");
    event.currentTarget.style.setProperty("--work-pointer-y", "0");
  };

  return (
    <article
      className={`work-project work-theme-${index + 1}${caseStudyOpen ? " has-open-case-study" : ""}`}
      id={`project-${project.slug}`}
      data-project-index={index}
      data-project-slug={project.slug}
      aria-labelledby={titleId}
    >
      <div className="work-project-stage">
        <div className="work-project-meta">
          <span className="work-project-number">
            {displayNumber}
            <i aria-hidden="true">/</i>
            {projectTotal}
          </span>
          <span>{project.category}</span>
          <span className="work-project-classification">{project.classification}</span>
        </div>

        <div className="work-project-layout">
          <div className="work-project-identity">
            <span className="work-project-eyebrow">{project.eyebrow}</span>

            <h3 className="work-project-title" id={titleId}>
              <span>{project.name}</span>
            </h3>

            <p className="work-project-description">{project.description}</p>
          </div>

          <div
            className="work-project-visual"
            onPointerMove={updatePointerDepth}
            onPointerLeave={resetPointerDepth}
          >
            <ProjectMockup project={project} index={index} />
          </div>

          <div className="work-project-support">
            <ul className="work-project-features" aria-label={`${project.name} features`}>
              {project.features.slice(0, 4).map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>

            <div className="work-project-actions">
              {project.demoUrl ? (
                <a
                  className="work-live-link"
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {isConcept ? "View Live Concept" : "View Live Project"}
                  <ArrowUpRight size={16} aria-hidden="true" />
                </a>
              ) : null}

              <button
                className="work-case-study-toggle"
                type="button"
                aria-expanded={caseStudyOpen}
                aria-controls={panelId}
                onClick={() => setCaseStudyOpen((open) => !open)}
              >
                <span>View Case Study</span>
                <Plus size={17} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        <div
          className={`work-case-study${caseStudyOpen ? " is-open" : ""}`}
          id={panelId}
          role="region"
          aria-label={`${project.name} case study`}
          aria-hidden={!caseStudyOpen}
        >
          <div className="work-case-study-overflow">
            <div className="work-case-study-inner">
              <div className="work-case-study-grid">
                <div>
                  <span>Challenge</span>
                  <p>{project.caseStudy.challenge}</p>
                </div>

                <div>
                  <span>Approach</span>
                  <p>{project.caseStudy.approach}</p>
                </div>

                <div>
                  <span>Design direction</span>
                  <p>{project.caseStudy.designDirection}</p>
                </div>

                <div>
                  <span>Key features</span>
                  <p>{project.caseStudy.keyFeatures}</p>
                </div>

                <div>
                  <span>Responsive strategy</span>
                  <p>{project.caseStudy.responsiveStrategy}</p>
                </div>

                <div>
                  <span>{project.caseStudy.outcomeTitle}</span>
                  <p>{project.caseStudy.outcome}</p>
                </div>
              </div>

              <div className="work-case-study-footer">
                <div className="work-case-study-tags" aria-label="All project capabilities">
                  {project.features.map((feature) => (
                    <span key={feature}>{feature}</span>
                  ))}
                </div>

                <a
                  href="#contact"
                  className="work-similar-link"
                  tabIndex={caseStudyOpen ? 0 : -1}
                >
                  Build something similar
                  <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
