export default function ParticleFallback() {
  return (
    <div className="webgl-fallback" aria-hidden="true">
      <div className="fallback-core" />
      <div className="fallback-ring fallback-ring-one" />
      <div className="fallback-ring fallback-ring-two" />
    </div>
  );
}
