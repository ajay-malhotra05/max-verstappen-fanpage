const mediaTrack = document.querySelector(".media-track");
const previousArticles = document.querySelector(".media-arrow--previous");
const nextArticles = document.querySelector(".media-arrow--next");

if (mediaTrack && previousArticles && nextArticles) {
  mediaTrack.scrollLeft = 0;

  const updateCarouselControls = () => {
    const maxScroll = mediaTrack.scrollWidth - mediaTrack.clientWidth;
    previousArticles.disabled = mediaTrack.scrollLeft <= 1;
    nextArticles.disabled = mediaTrack.scrollLeft >= maxScroll - 1;
  };

  const scrollCarousel = (direction) => {
    const card = mediaTrack.querySelector(".media-card");
    if (!card) return;

    const trackStyles = getComputedStyle(mediaTrack);
    const gap = parseFloat(trackStyles.columnGap) || 0;
    mediaTrack.scrollBy({
      left: direction * (card.getBoundingClientRect().width + gap),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  };

  previousArticles.addEventListener("click", () => scrollCarousel(-1));
  nextArticles.addEventListener("click", () => scrollCarousel(1));
  mediaTrack.addEventListener("scroll", updateCarouselControls, { passive: true });
  window.addEventListener("resize", updateCarouselControls);
  window.addEventListener("load", updateCarouselControls, { once: true });
  updateCarouselControls();
}
