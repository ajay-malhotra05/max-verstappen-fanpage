const championshipSection = document.querySelector(".championship-cta");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (
  championshipSection &&
  !prefersReducedMotion.matches &&
  window.gsap &&
  window.ScrollTrigger
) {
  gsap.registerPlugin(ScrollTrigger);

  const heading = championshipSection.querySelector("h2");
  const paragraph = championshipSection.querySelector("p");
  const link = championshipSection.querySelector(".championship-link");
  const contentItems = [heading, paragraph, link];

  gsap.set(contentItems, { y: 24, autoAlpha: 0 });
  gsap
    .timeline({
      scrollTrigger: {
        trigger: championshipSection,
        start: "top 78%",
        end: "top 34%",
        scrub: 0.8,
        invalidateOnRefresh: true,
      },
    })
    .to(heading, { y: 0, autoAlpha: 1, duration: 0.4, ease: "power2.out" }, 0)
    .to(
      paragraph,
      { y: 0, autoAlpha: 1, duration: 0.35, ease: "power2.out" },
      0.22,
    )
    .to(
      link,
      { y: 0, autoAlpha: 1, duration: 0.3, ease: "power2.out" },
      0.48,
    );

  window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}
