import { useEffect, useState } from "react";

export type DeviceQuality = "low" | "medium" | "high";

function detectQuality(): DeviceQuality {
  if (typeof window === "undefined") return "medium";

  const width = window.innerWidth;
  const cores = navigator.hardwareConcurrency ?? 4;
  const memory =
    (navigator as Navigator & { deviceMemory?: number })
      .deviceMemory ?? 8;
  const coarsePointer = window.matchMedia(
    "(pointer: coarse)",
  ).matches;

  if (width <= 640 || cores <= 4 || memory <= 4) {
    return "low";
  }

  if (
    width <= 1100 ||
    cores <= 8 ||
    memory <= 8 ||
    coarsePointer
  ) {
    return "medium";
  }

  return "high";
}

export function useDeviceQuality() {
  const [quality, setQuality] = useState<DeviceQuality>(() => detectQuality());

  useEffect(() => {
    let frameId = 0;

    const update = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(() => {
        setQuality(detectQuality());
      });
    };

    window.addEventListener("resize", update, { passive: true });

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", update);
    };
  }, []);

  return quality;
}
