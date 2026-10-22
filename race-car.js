const raceList = document.querySelector(".race-list");
const scheduleCar = document.querySelector(".schedule-car");
const incomingSection = document.querySelector(".championship-cta");

if (raceList && scheduleCar && incomingSection && window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);

  gsap.to(scheduleCar, {
    y: () =>
      incomingSection.getBoundingClientRect().top -
      raceList.getBoundingClientRect().top,
    ease: "none",
    scrollTrigger: {
      trigger: raceList,
      start: "top top",
      endTrigger: incomingSection,
      end: "top top",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });

  if (scheduleCar.complete) {
    ScrollTrigger.refresh();
  } else {
    scheduleCar.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
  }

  window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
}
