(() => {
  const gallery = document.querySelector(".gallery-section");
  const galleryImages = gallery
    ? Array.from(gallery.querySelectorAll(".gallery-image"))
    : [];
  const previousButton = gallery?.querySelector(".gallery-previous");
  const nextButton = gallery?.querySelector(".gallery-next");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!gallery || !galleryImages.length || !previousButton || !nextButton) return;

  const imageCount = galleryImages.length;
  const playhead = { position: 0 };
  let targetPosition = 0;

  function renderGallery(position) {
    const isMobile = window.matchMedia("(max-width: 760px)").matches;
    const cardWidth = galleryImages[0].getBoundingClientRect().width;
    const sideOffset = Math.min(
      window.innerWidth * (isMobile ? 0.31 : 0.32),
      cardWidth * 0.98,
    );

    galleryImages.forEach((image, index) => {
      const rawDistance = index - position;
      const distance =
        ((rawDistance + imageCount / 2) % imageCount + imageCount) % imageCount -
        imageCount / 2;
      const sideAmount = Math.min(Math.abs(distance), 1);
      const proximity = Math.abs(distance);
      const opacity =
        proximity < 1.12 ? 1 : Math.max(0, 1 - (proximity - 1.12) / 0.3);
      const properties = {
        x: distance * sideOffset,
        y: sideAmount * (isMobile ? 7 : 12),
        rotation: Math.max(-1, Math.min(1, distance)) * (isMobile ? 8 : 10),
        scale: 1 - sideAmount * 0.29,
        filter: `grayscale(${Math.min(proximity, 1)})`,
        autoAlpha: opacity,
        zIndex: Math.round(10 - proximity * 2),
      };

      image.setAttribute("aria-hidden", String(proximity >= 0.5));
      gsap.set(image, properties);
    });
  }

  function navigate(direction) {
    targetPosition += direction;
    gsap.killTweensOf(playhead);

    if (reducedMotion.matches) {
      playhead.position = targetPosition;
      renderGallery(playhead.position);
      return;
    }

    gsap.to(playhead, {
      position: targetPosition,
      duration: 0.85,
      ease: "power2.inOut",
      overwrite: true,
      onUpdate: () => renderGallery(playhead.position),
    });
  }

  previousButton.addEventListener("click", () => navigate(-1));
  nextButton.addEventListener("click", () => navigate(1));
  window.addEventListener("resize", () => renderGallery(playhead.position));

  gsap.set(playhead, { position: 0 });
  renderGallery(playhead.position);
})();
