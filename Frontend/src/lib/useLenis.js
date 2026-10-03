import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let lenisInstance = null;

export function getLenis() {
  return lenisInstance;
}

// Mounted once at the app root. Wires Lenis's raf loop into GSAP's ticker so
// ScrollTrigger and Lenis agree on scroll position (per the cinematic-web-experience
// architecture: Lenis -> GSAP ticker -> ScrollTrigger.update).
export function useLenisSetup() {
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return undefined;

    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      touchMultiplier: 1.1,
    });
    lenisInstance = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    function raf(time) {
      // gsap.ticker reports `time` in seconds; Lenis expects milliseconds
      // (like requestAnimationFrame's timestamp). Without this conversion,
      // Lenis thinks almost no time ever passes between frames, so its
      // smoothing never catches up and the page feels stuck / barely scrolls.
      lenis.raf(time * 1000);
    }
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);
}

// Scrolls to top on route change (works with or without Lenis active).
export function scrollToTop() {
  if (lenisInstance) {
    lenisInstance.scrollTo(0, { immediate: true });
  } else {
    window.scrollTo(0, 0);
  }
}
