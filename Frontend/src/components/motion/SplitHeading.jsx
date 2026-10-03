import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Splits `text` into words, each masked in a .split-line span, and reveals them
 * with a staggered clip + rise. Use for hero/section headings — the one place
 * in this app where typography motion carries the visual choreography.
 */
export default function SplitHeading({
  text,
  as: Tag = "h1",
  className = "",
  delay = 0,
  trigger = "scroll", // "scroll" | "mount"
  align = "left",
}) {
  const ref = useRef(null);
  const words = text.split(" ");

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const lines = el.querySelectorAll(".word-inner");

    const ctx = gsap.context(() => {
      gsap.set(lines, { yPercent: 115, opacity: 0 });

      const tween = gsap.to(lines, {
        yPercent: 0,
        opacity: 1,
        duration: 1,
        ease: "power4.out",
        stagger: 0.055,
        delay,
      });

      if (trigger === "scroll") {
        tween.pause();
        ScrollTrigger.create({
          trigger: el,
          start: "top 88%",
          onEnter: () => tween.play(),
          once: true,
        });
      }
    }, el);

    return () => ctx.revert();
  }, [delay, trigger, text]);

  return (
    <Tag
      ref={ref}
      className={`${className} ${align === "center" ? "text-center" : ""}`}
      aria-label={text}
    >
      {words.map((word, i) => (
        <span
          key={i}
          className="split-line"
          style={{ marginRight: "0.28em" }}
        >
          <span className="word-inner inline-block will-change-transform">{word}</span>
        </span>
      ))}
    </Tag>
  );
}
