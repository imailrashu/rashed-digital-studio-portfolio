const marqueeItems = [
  "Web Design",
  "Front-End Development",
  "Responsive Experiences",
  "3D Web",
  "Automation",
  "Business Websites",
];

function MarqueeSet() {
  return (
    <div className="hero-marquee-set">
      {marqueeItems.map((item) => (
        <span className="hero-marquee-item" key={item}>
          {item}
          <span className="hero-marquee-star">&#10022;</span>
        </span>
      ))}
    </div>
  );
}

function MarqueeRow({ reverse = false }: { reverse?: boolean }) {
  return (
    <div
      className={`hero-marquee-row ${reverse ? "hero-marquee-row-reverse" : ""}`}
      aria-hidden="true"
    >
      <div className="hero-marquee-track">
        <MarqueeSet />
        <MarqueeSet />
      </div>
    </div>
  );
}

export default function HeroMarquee() {
  return (
    <div className="hero-marquee" role="region" aria-label="Studio capabilities">
      <span className="sr-only">{marqueeItems.join(", ")}</span>
      <MarqueeRow />
      <MarqueeRow reverse />
    </div>
  );
}
