/** @jsxImportSource @emotion/react */
import { useEffect, useRef } from "react";
import { btn, card, container, dotsStyle, overlay, sliderWrapper, tag, title, wrapperContainer } from "./StackedSliderDesktopCss";


const layers = [
  { y: 0, scale: 1, opacity: 1, z: 3 },
  { y: -25, scale: 0.9, opacity: 0.96, z: 2 },
  { y: -50, scale: 0.8, opacity: 0.9, z: 1 },
];

const images = [
  { src: "/images/1.avif", tag: "DAY 1", title: "EVENT 1" },
  { src: "/images/2.avif", tag: "DAY 2", title: "EVENT 2" },
  { src: "/images/3.avif", tag: "DAY 3", title: "EVENT 3" },
  { src: "/images/4.avif", tag: "DAY 4", title: "EVENT 4" },
  { src: "/images/5.avif", tag: "DAY 5", title: "EVENT 5" },
  { src: "/images/6.avif", tag: "DAY 6", title: "EVENT 6" },
  { src: "/images/7.avif", tag: "DAY 7", title: "EVENT 7" },
];

const SWIPE_THRESHOLD = 60;
const SWIPE_ANIM_MS = 350;

const StackedSliderMobile = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const dotsRef = useRef<HTMLDivElement>(null);

  let dragging = false;
  let startX = 0;
  let currentX = 0;
  let isAnimating = false;

  const applyStack = (instant = false) => {
    cardsRef.current.forEach((card, i) => {
      const layer = layers[i] || { y: -70, scale: 0.7, opacity: 0, z: 0 };
      card.style.transition = instant ? "none" : `transform 0.3s ease, opacity 0.3s ease`;
      card.style.transform = `translateY(${layer.y}px) scale(${layer.scale})`;
      card.style.opacity = layer.opacity.toString();
      card.style.zIndex = layer.z.toString();
      card.style.visibility = layer.opacity === 0 ? "hidden" : "visible";
      card.style.pointerEvents = layer.opacity === 0 ? "none" : "auto";
    });
    updateDots();
  };

  const createDots = () => {
    if (!dotsRef.current) return;
    dotsRef.current.innerHTML = "";

    cardsRef.current.forEach((_, i) => {
      const dot = document.createElement("div");
      dot.className = "dot";
      dot.dataset.index = i.toString();
      dotsRef.current!.appendChild(dot);

      dot.addEventListener("click", async () => {
        if (isAnimating) return;

        const targetIndex = Number(dot.dataset.index);
        const steps = (targetIndex + cardsRef.current.length - 0) % cardsRef.current.length;

        isAnimating = true;
        for (let s = 0; s < steps; s++) {
          await forwardSwipe();
        }
        isAnimating = false;
      });
    });

    updateDots();
  };

  const updateDots = () => {
    if (!dotsRef.current) return;
    Array.from(dotsRef.current.children).forEach((dot, i) => {
      const d = dot as HTMLDivElement;
      d.classList.remove("active");
      if (i === 0) d.classList.add("active");
    });
  };

  const forwardSwipe = () =>
    new Promise<void>((resolve) => {
      const top = cardsRef.current[0];
      top.style.transition = `${SWIPE_ANIM_MS}ms ease`;
      top.style.transform = `translateX(-500px) rotate(-10deg)`;
      top.style.opacity = "0";

      const second = cardsRef.current[1];
      if (second) {
        second.style.transition = `${SWIPE_ANIM_MS}ms ease`;
        second.style.transform = `translateY(${layers[0].y}px) scale(${layers[0].scale})`;
        second.style.opacity = layers[0].opacity.toString();
      }

      const third = cardsRef.current[2];
      if (third) {
        third.style.transition = `${SWIPE_ANIM_MS}ms ease`;
        third.style.transform = `translateY(${layers[1].y}px) scale(${layers[1].scale})`;
        third.style.opacity = layers[1].opacity.toString();
      }

      setTimeout(() => {
        const removed = cardsRef.current.shift()!;
        cardsRef.current.push(removed);
        removed.style.visibility = "hidden";
        removed.style.opacity = "0";
        removed.style.transform = `translateY(-70px) scale(0.7)`;
        applyStack(false);
        resolve();
      }, SWIPE_ANIM_MS);
    });

  const onDown = (e: PointerEvent | TouchEvent) => {
    if (isAnimating) return;
    dragging = true;
    startX = (e as PointerEvent).clientX || (e as TouchEvent).touches[0].clientX;
    currentX = 0;
    cardsRef.current[0].style.transition = "none";
    e.preventDefault();
  };

  const onMove = (e: PointerEvent | TouchEvent) => {
    if (!dragging || isAnimating) return;
    currentX =
      ((e as PointerEvent).clientX || (e as TouchEvent).touches[0].clientX) - startX;

    const top = cardsRef.current[0];
    const second = cardsRef.current[1];
    const third = cardsRef.current[2];

    top.style.transition = "none";
    top.style.transform = `translateX(${currentX}px) rotate(${currentX / 60}deg)`;

    const p = Math.min(1, Math.abs(currentX) / SWIPE_THRESHOLD);

    if (second) {
      second.style.transition = "none";
      second.style.transform = `translateY(${layers[1].y + p * 15}px) scale(${
        layers[1].scale + p * 0.05
      })`;
      second.style.opacity = (layers[1].opacity + p * 0.05).toString();
      second.style.zIndex = "2";
    }

    if (third) {
      third.style.transition = "none";
      third.style.transform = `translateY(${layers[2].y + p * 20}px) scale(${
        layers[2].scale + p * 0.03
      })`;
      third.style.opacity = (layers[2].opacity + p * 0.05).toString();
      third.style.zIndex = "1";
    }

    e.preventDefault();
  };

  const onUp = () => {
    if (!dragging && !isAnimating) return;
    dragging = false;

    if (Math.abs(currentX) > SWIPE_THRESHOLD) {
      isAnimating = true;
      forwardSwipe().then(() => {
        isAnimating = false;
      });
    } else {
      const top = cardsRef.current[0];
      const second = cardsRef.current[1];
      const third = cardsRef.current[2];

      top.style.transition = "0.3s ease";
      top.style.transform = `translateX(0px) rotate(0deg)`;
      if (second) {
        second.style.transition = "0.3s ease";
        second.style.transform = `translateY(${layers[1].y}px) scale(${layers[1].scale})`;
        second.style.opacity = layers[1].opacity.toString();
      }
      if (third) {
        third.style.transition = "0.3s ease";
        third.style.transform = `translateY(${layers[2].y}px) scale(${layers[2].scale})`;
        third.style.opacity = layers[2].opacity.toString();
      }
    }
  };

  useEffect(() => {
    cardsRef.current = Array.from(sliderRef.current?.children || []) as HTMLDivElement[];
    applyStack(true);
    createDots();

    const slider = sliderRef.current!;
    slider.addEventListener("pointerdown", (e) => onDown(e));
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    slider.addEventListener("touchstart", onDown, { passive: false });
    slider.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onUp);
  }, []);

  return (
    <div css={wrapperContainer}>
      <div css={container}>
        <div css={sliderWrapper} ref={sliderRef}>
          {images.map((img, idx) => (
            <div key={idx} css={card(img.src)}>
              <div css={overlay}>
                <span css={tag}>{img.tag}</span>
                <h2 css={title}>{img.title}</h2>
                <a css={btn} href="#">
                  Read More
                </a>
              </div>
            </div>
          ))}
        </div>
        <div css={dotsStyle} ref={dotsRef}></div>
      </div>
    </div>
  );
};

export default StackedSliderMobile;
