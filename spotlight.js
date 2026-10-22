const hero = document.querySelector(".hero");
const colorImage = document.querySelector(".photograph--color");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

if (hero && colorImage && finePointer.matches) {
  let currentX = 0;
  let currentY = 0;
  let targetX = 0;
  let targetY = 0;
  let animationFrame = 0;

  const followPointer = () => {
    currentX += (targetX - currentX) * 0.2;
    currentY += (targetY - currentY) * 0.2;
    colorImage.style.setProperty("--spot-x", `${currentX}px`);
    colorImage.style.setProperty("--spot-y", `${currentY}px`);

    if (Math.abs(targetX - currentX) > 0.5 || Math.abs(targetY - currentY) > 0.5) {
      animationFrame = requestAnimationFrame(followPointer);
    } else {
      animationFrame = 0;
    }
  };

  hero.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch") return;

    const bounds = hero.getBoundingClientRect();
    targetX = event.clientX - bounds.left;
    targetY = event.clientY - bounds.top;
    hero.classList.add("spotlight-active");

    if (!animationFrame) {
      animationFrame = requestAnimationFrame(followPointer);
    }
  });

  hero.addEventListener("pointerleave", () => {
    hero.classList.remove("spotlight-active");
    if (animationFrame) cancelAnimationFrame(animationFrame);
    animationFrame = 0;
    colorImage.style.setProperty("--spot-x", "-1000px");
    colorImage.style.setProperty("--spot-y", "-1000px");
  });
}
