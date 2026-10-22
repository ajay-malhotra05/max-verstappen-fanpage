const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const statementSection = document.querySelector(".statement-section");
const lightSections = document.querySelectorAll(
  ".statement-section, .media-section, .championship-cta, .gallery-section",
);
const topbar = document.querySelector(".topbar");

if (statementSection && topbar) {
  const updateHeaderContrast = () => {
    const headerBounds = topbar.getBoundingClientRect();
    const overlapsHeader = Array.from(lightSections).some((section) => {
      const sectionBounds = section.getBoundingClientRect();
      return sectionBounds.top < headerBounds.bottom && sectionBounds.bottom > headerBounds.top;
    });

    topbar.classList.toggle("on-light-background", overlapsHeader);
  };

  window.addEventListener("scroll", updateHeaderContrast, { passive: true });
  window.addEventListener("resize", updateHeaderContrast);
  updateHeaderContrast();
}

const statementCopy = document.querySelector(".statement-copy");
const carImage = document.querySelector(".statement-image--car");
const portraitImage = document.querySelector(".statement-image--portrait");

if (
  statementSection &&
  statementCopy &&
  carImage &&
  portraitImage &&
  !reducedMotion.matches &&
  window.gsap &&
  window.ScrollTrigger
) {
  gsap.registerPlugin(ScrollTrigger);

  const words = statementCopy.querySelectorAll(".reveal-word");
  gsap.set(carImage, { y: -56, autoAlpha: 0 });
  gsap.set(portraitImage, { y: 56, autoAlpha: 0 });
  gsap.set(words, { yPercent: 65, autoAlpha: 0 });

  const animation = gsap.timeline({
    scrollTrigger: {
      trigger: statementSection,
      start: "top 82%",
      end: "top 20%",
      scrub: 0.8,
      invalidateOnRefresh: true,
    },
  });

  animation
    .to(
      carImage,
      { y: 0, autoAlpha: 1, duration: 0.65, ease: "power2.out" },
      0,
    )
    .to(
      portraitImage,
      { y: 0, autoAlpha: 1, duration: 0.65, ease: "power2.out" },
      0.08,
    )
    .to(
      words,
      {
        yPercent: 0,
        autoAlpha: 1,
        duration: 0.38,
        stagger: 0.025,
        ease: "power2.out",
      },
      0.12,
    );

  window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}
