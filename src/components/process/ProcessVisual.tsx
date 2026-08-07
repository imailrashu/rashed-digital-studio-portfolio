import type { ProcessStep } from "../../data/processSteps";

type ProcessVisualProps = {
  activeIndex: number;
  activeStep: ProcessStep;
  total: number;
};

export default function ProcessVisual({
  activeIndex,
  activeStep,
  total,
}: ProcessVisualProps) {
  return (
    <aside
      className="process-v4-visual"
      aria-label={`Current process stage: ${activeStep.title}`}
    >
      <div className="process-v4-visual-top" aria-hidden="true">
        <span>RDS / PROCESS SYSTEM</span>
        <span>{String(activeIndex + 1).padStart(2, "0")} / 05</span>
      </div>

      <div
        className="process-v4-system"
        data-process-stage={activeIndex + 1}
        aria-hidden="true"
      >
        <span className="process-v4-system-grid" />
        <span className="process-v4-scan-line" />

        <span className="process-v4-orbit process-v4-orbit-a" />
        <span className="process-v4-orbit process-v4-orbit-b" />
        <span className="process-v4-orbit process-v4-orbit-c" />

        <span className="process-v4-node process-v4-node-a" />
        <span className="process-v4-node process-v4-node-b" />
        <span className="process-v4-node process-v4-node-c" />
        <span className="process-v4-node process-v4-node-d" />
        <span className="process-v4-node process-v4-node-e" />

        <span className="process-v4-connector process-v4-connector-a" />
        <span className="process-v4-connector process-v4-connector-b" />
        <span className="process-v4-connector process-v4-connector-c" />

        <span className="process-v4-design-grid">
          {Array.from({ length: 9 }, (_, index) => (
            <i key={index} />
          ))}
        </span>

        <span className="process-v4-code-layer">
          <i />
          <i />
          <i />
          <i />
        </span>

        <span className="process-v4-launch-frame">
          <i>READY</i>
        </span>

        <span className="process-v4-core">
          <strong>{activeStep.number}</strong>
          <small>{activeStep.title}</small>
        </span>

        <span className="process-v4-coordinate process-v4-coordinate-a">
          INPUT / DIRECTION
        </span>
        <span className="process-v4-coordinate process-v4-coordinate-b">
          BUILD / RELEASE
        </span>
      </div>

      <div className="process-v4-active-copy" key={activeStep.number}>
        <span>Current stage</span>
        <strong>{activeStep.title}</strong>
        <p>{activeStep.detail}</p>
      </div>

      <div
        className="process-v4-progress"
        role="progressbar"
        aria-label="Process progress"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={activeIndex + 1}
      >
        {Array.from({ length: total }, (_, index) => (
          <span className={index <= activeIndex ? "is-active" : undefined} key={index}>
            <i />
          </span>
        ))}
      </div>
    </aside>
  );
}
