import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollEffects() {
  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion) {
      return;
    }

    const useSmoothScroll = window.matchMedia(
      "(min-width: 1021px) and (hover: hover) and (pointer: fine)",
    ).matches;

    const lenis = useSmoothScroll
      ? new Lenis({
          lerp: 0.08,
          smoothWheel: true,
          wheelMultiplier: 0.9,
        })
      : null;

    lenis?.on("scroll", ScrollTrigger.update);

    const updateLenis = (time: number) => {
      lenis?.raf(time * 1000);
    };

    if (lenis) {
      gsap.ticker.add(updateLenis);
      gsap.ticker.lagSmoothing(0);
    }

    const ctx = gsap.context(() => {
      if (window.innerWidth > 640) {
        gsap.to(".site-grid", {
          backgroundPositionY: 180,
          ease: "none",
          scrollTrigger: {
            trigger: document.documentElement,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
          },
        });
      }
    });

    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => {
      ctx.revert();
      if (lenis) {
        gsap.ticker.remove(updateLenis);
        lenis.destroy();
      }
    };
  }, []);

  return null;
}

