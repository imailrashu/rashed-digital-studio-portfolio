import type { PortfolioProject } from "../../data/portfolioProjects";

type ProjectMockupProps = {
  project: PortfolioProject;
  index: number;
};

export default function ProjectMockup({ project, index }: ProjectMockupProps) {
  if (!project.desktopImage || !project.mobileImage) return null;

  const projectNumber = String(index + 1).padStart(2, "0");

  return (
    <figure className="work-project-mockup">
      <div className="work-project-light" aria-hidden="true" />
      <div className="work-project-orbit work-project-orbit-one" aria-hidden="true" />
      <div className="work-project-orbit work-project-orbit-two" aria-hidden="true" />

      <div className="work-browser-frame">
        <div className="work-browser-bar" aria-hidden="true">
          <span className="work-browser-dots">
            <i />
            <i />
            <i />
          </span>
          <span>{project.slug}</span>
          <span>Desktop / 1440</span>
        </div>

        <div className="work-browser-screen">
          <img
            src={project.desktopImage}
            alt={`${project.name} desktop website screenshot`}
            width="1440"
            height="900"
            loading="lazy"
            decoding="async"
            draggable="false"
          />
        </div>
      </div>

      <div className="work-phone-frame">
        <div className="work-phone-top" aria-hidden="true">
          <i />
        </div>
        <div className="work-phone-screen">
          <img
            src={project.mobileImage}
            alt={`${project.name} mobile website screenshot`}
            width="390"
            height="844"
            loading="lazy"
            decoding="async"
            draggable="false"
          />
        </div>
        <span className="work-phone-number" aria-hidden="true">{projectNumber}</span>
      </div>

      <figcaption className="work-visually-hidden">
        Responsive desktop and mobile presentation for {project.name}.
      </figcaption>
    </figure>
  );
}
