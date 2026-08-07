import { ArrowUpRight } from "lucide-react";

import type { ServiceItem } from "../../data/services";
import { siteConfig } from "../../data/siteConfig";

const visualNames = [
  "business",
  "landing",
  "redesign",
  "responsive",
  "booking",
  "automation",
  "interactive",
] as const;

function BusinessArt() {
  return (
    <div className="service-art art-business">
      <div className="art-site-hero">
        <span />
        <strong />
        <i />
      </div>
      <div className="art-site-cards"><span /><span /><span /></div>
    </div>
  );
}

function LandingArt() {
  return (
    <div className="service-art art-landing">
      <div className="art-landing-copy"><span /><strong /><i /><i /></div>
      <div className="art-landing-action">Customer action <ArrowUpRight size={13} /></div>
      <div className="art-conversion-path"><span /><span /><span /></div>
    </div>
  );
}

function RedesignArt() {
  return (
    <div className="service-art art-redesign">
      <div className="art-before"><small>Before</small><span /><span /><span /></div>
      <div className="art-after"><small>Refined</small><strong /><span /><i /></div>
      <div className="art-redesign-divider"><span /></div>
    </div>
  );
}

function ResponsiveArt() {
  return (
    <div className="service-art art-responsive">
      <div className="device-frame device-desktop"><span /><strong /><i /></div>
      <div className="device-frame device-tablet"><span /><strong /></div>
      <div className="device-frame device-mobile"><span /><strong /></div>
      <small>One system · every screen</small>
    </div>
  );
}

function BookingArt() {
  return (
    <div className="service-art art-booking">
      <div className="art-calendar">
        <strong>Choose a time</strong>
        <div>{Array.from({ length: 12 }, (_, index) => <span key={index} />)}</div>
      </div>
      <div className="art-message"><i /> WhatsApp enquiry</div>
      <div className="art-booked">Booking confirmed <span>✓</span></div>
    </div>
  );
}

function AutomationArt() {
  return (
    <div className="service-art art-automation">
      <div className="workflow-lines"><i /><i /><i /></div>
      <span className="workflow-node node-one">Form</span>
      <span className="workflow-node node-two">Lead</span>
      <span className="workflow-node node-three">Route</span>
      <span className="workflow-node node-four">Notify</span>
      <small>Structured enquiry flow</small>
    </div>
  );
}

function InteractiveArt() {
  return (
    <div className="service-art art-interactive">
      <div className="interactive-ring ring-a" />
      <div className="interactive-ring ring-b" />
      <div className="interactive-ring ring-c" />
      <div className="interactive-core">3D</div>
      <span className="interactive-node node-a" />
      <span className="interactive-node node-b" />
      <span className="interactive-node node-c" />
      <small>Pointer · scroll · depth</small>
    </div>
  );
}

function VisualArt({ index }: { index: number }) {
  switch (index) {
    case 1: return <LandingArt />;
    case 2: return <RedesignArt />;
    case 3: return <ResponsiveArt />;
    case 4: return <BookingArt />;
    case 5: return <AutomationArt />;
    case 6: return <InteractiveArt />;
    default: return <BusinessArt />;
  }
}

export function ServicePreview({
  service,
  index,
}: {
  service: ServiceItem;
  index: number;
}) {
  return (
    <aside className="services-preview">
      <div className="service-preview-header">
        <span>{service.number} / 07</span>
        <span>Capability illustration</span>
      </div>

      <div
        className="service-preview-browser"
        key={service.number}
        data-visual={visualNames[index]}
        aria-hidden="true"
      >
        <div className="service-browser-top">
          <div><span /><span /><span /></div>
          <small>rasheddigital.studio / capability</small>
        </div>

        <div className="service-browser-body">
          <span className="preview-eyebrow">{service.title}</span>
          <h3>{service.previewTitle}</h3>
          <VisualArt index={index} />
        </div>
      </div>

      <p className="service-preview-announcement" aria-live="polite">
        Showing {service.title}: {service.previewLines.join(", ")}.
      </p>

      <div className="service-preview-footer">
        <p>{service.value}</p>
        <a
          href={siteConfig.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="service-project-link"
        >
          Discuss this service
          <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      </div>
    </aside>
  );
}

export function ServiceCapability() {
  return (
    <div className="service-capability">
      <div className="service-capability-copy">
        <span className="section-kicker">Capability demonstration</span>
        <h3>
          <span>From static pages</span>
          <span>to digital experiences.</span>
        </h3>
        <p>
          Interaction is added with purpose—guiding attention, clarifying hierarchy
          and making a responsive website feel considered on every screen.
        </p>
        <div className="capability-signals">
          <span>Mouse response</span>
          <span>Layered depth</span>
          <span>Scroll-linked motion</span>
          <span>Responsive implementation</span>
        </div>
      </div>

      <div className="capability-canvas" aria-hidden="true">
        <div className="capability-browser">
          <div className="capability-browser-top"><i /><i /><i /><span>Interactive system / live study</span></div>
          <div className="capability-browser-body">
            <span className="capability-axis axis-x" />
            <span className="capability-axis axis-y" />
            <div className="capability-depth depth-one">Responsive</div>
            <div className="capability-depth depth-two">Motion</div>
            <div className="capability-depth depth-three">Depth</div>
            <div className="capability-orbit orbit-one" />
            <div className="capability-orbit orbit-two" />
            <div className="capability-core"><strong>RDS</strong><small>Interactive layer</small></div>
            <span className="capability-cursor">Pointer response</span>
          </div>
        </div>
        <div className="capability-status"><span>System active</span><span>CSS · GSAP · WebGL ready</span></div>
      </div>
    </div>
  );
}
