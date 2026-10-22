const timelineScenes = gsap.utils.toArray(".timeline-scene");
const timelineProgress = document.querySelector(".timeline-progress span");
const timelineContainer = document.querySelector(".career-timeline");
const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

if (timelineScenes.length && timelineProgress && timelineContainer) {
  let currentIndex = -1;

  function setActiveScene(index, direction = 1) {
    if (currentIndex === index) return;
    currentIndex = index;

    // Update bottom-right progress indicator: 1/5, 2/5, 3/5, 4/5, 5/5
    if (timelineProgress) {
      timelineProgress.textContent = `${index + 1}/5`;
      if (!motionPreference.matches) {
        gsap.fromTo(
          timelineProgress,
          { scale: 1.15, color: "#f5df00" },
          { scale: 1, color: "#f7f7f4", duration: 0.35, ease: "power2.out" },
        );
      }
    }

    // Animate the incoming scene without hiding the scenes stacked beneath it.
    timelineScenes.forEach((scene, i) => {
      const isTarget = i === index;
      scene.classList.toggle("is-active", isTarget);

      if (motionPreference.matches) {
        if (isTarget) {
          const elements = scene.querySelectorAll(
            ".timeline-copy h2, .timeline-image, .timeline-description, .timeline-preview",
          );
          gsap.set(elements, { autoAlpha: 1, y: 0, scale: 1 });
        }
        return;
      }

      if (!isTarget) return;

      const heading = scene.querySelector(".timeline-copy h2");
      const image = scene.querySelector(".timeline-image");
      const description = scene.querySelector(".timeline-description");
      const preview = scene.querySelector(".timeline-preview");

      gsap.killTweensOf([heading, image, description, preview]);

      gsap.fromTo(
        heading,
        { autoAlpha: 0, y: direction >= 0 ? 36 : -36 },
        { autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.out" },
      );

      gsap.fromTo(
        image,
        { autoAlpha: 0.25, scale: 1.07, y: direction >= 0 ? 20 : -20 },
        {
          autoAlpha: 1,
          scale: 1,
          y: 0,
          duration: 0.9,
          delay: 0.04,
          ease: "power2.out",
        },
      );

      gsap.fromTo(
        description,
        { autoAlpha: 0, y: direction >= 0 ? 26 : -26 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.78,
          delay: 0.12,
          ease: "power2.out",
        },
      );

      gsap.fromTo(
        preview,
        { autoAlpha: 0, y: direction >= 0 ? 20 : -20 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.68,
          delay: 0.2,
          ease: "power2.out",
        },
      );
    });
  }

  // Pre-initialize scene visual states if not reduced motion
  if (!motionPreference.matches) {
    timelineScenes.forEach((scene) => {
      const heading = scene.querySelector(".timeline-copy h2");
      const image = scene.querySelector(".timeline-image");
      const description = scene.querySelector(".timeline-description");
      const preview = scene.querySelector(".timeline-preview");
      gsap.set([heading, description, preview], { autoAlpha: 0, y: 24 });
      gsap.set(image, { autoAlpha: 0.2, scale: 0.96 });
    });
  }

  // Set up click handlers for skip buttons and preview cards
  timelineScenes.forEach((scene, index) => {
    const skip = scene.querySelector(".timeline-skip");
    const preview = scene.querySelector(".timeline-preview");

    const navigateNext = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const nextIndex = (index + 1) % timelineScenes.length;
      timelineScenes[nextIndex].scrollIntoView({
        behavior: motionPreference.matches ? "instant" : "smooth",
        block: "start",
      });
    };

    if (skip) skip.addEventListener("click", navigateNext);
    if (preview) preview.addEventListener("click", navigateNext);
  });

  function updateActiveScene() {
    const viewportCenter = window.innerHeight / 2;
    const containerBounds = timelineContainer.getBoundingClientRect();
    const isTimelineVisible =
      containerBounds.top < window.innerHeight * 0.55 &&
      containerBounds.bottom > window.innerHeight * 0.45;
    document.body.classList.toggle("timeline-active", isTimelineVisible);

    const containerTop = containerBounds.top + window.scrollY;
    const documentCenter = window.scrollY + viewportCenter;
    let sceneEnd = containerTop;
    const index = timelineScenes.findIndex((scene) => {
      sceneEnd += scene.offsetHeight;
      return documentCenter < sceneEnd;
    });
    const activeIndex = index === -1 ? timelineScenes.length - 1 : index;
    const direction = currentIndex === -1 || activeIndex >= currentIndex ? 1 : -1;
    setActiveScene(activeIndex, direction);
  }

  window.addEventListener("scroll", updateActiveScene, { passive: true });
  window.addEventListener("resize", updateActiveScene);

  // Keyboard navigation support: ArrowDown, PageDown, ArrowUp, PageUp
  window.addEventListener("keydown", (e) => {
    if (["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) return;
    if (!document.body.classList.contains("timeline-active")) return;

    if (e.key === "ArrowDown" || e.key === "PageDown") {
      if (currentIndex >= 0 && currentIndex < timelineScenes.length - 1) {
        e.preventDefault();
        timelineScenes[currentIndex + 1].scrollIntoView({
          behavior: motionPreference.matches ? "instant" : "smooth",
          block: "start",
        });
      }
    } else if (e.key === "ArrowUp" || e.key === "PageUp") {
      if (currentIndex > 0) {
        e.preventDefault();
        timelineScenes[currentIndex - 1].scrollIntoView({
          behavior: motionPreference.matches ? "instant" : "smooth",
          block: "start",
        });
      }
    }
  });

  updateActiveScene();

  window.addEventListener(
    "load",
    () => {
      ScrollTrigger.refresh();
      updateActiveScene();
    },
    { once: true },
  );

  document.fonts?.ready.then(() => {
    ScrollTrigger.refresh();
    updateActiveScene();
  });
}
