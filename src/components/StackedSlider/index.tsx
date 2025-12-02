/** @jsxImportSource @emotion/react */
import { useEffect, useRef } from "react";
import {
  btn,
  card,
  container,
  dotsStyle,
  overlay,
  sliderWrapper,
  tag,
  title,
  wrapperContainer,
} from "./StackedSliderCss";

const layers = [
  { y: 0, scale: 1, opacity: 1, z: 3 },
  { y: -40, scale: 0.9, opacity: 0.96, z: 2 },
  { y: -80, scale: 0.8, opacity: 0.9, z: 1 },
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

export const StackedSlider = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const dotsRef = useRef<HTMLDivElement>(null);

  let dragging = false;
  let startX = 0;
  let currentX = 0;
  let isAnimating = false;

  const SWIPE_THRESHOLD = 90;
  const SWIPE_ANIM_MS = 450;

  const applyStack = (instant = false) => {
    cardsRef.current.forEach((card, i) => {
      const layer = layers[i] || { y: -90, scale: 0.8, opacity: 0, z: -1 };

      if (!instant && i === 2) {
        const smallLift = 45;
        card.style.transition = "none";
        card.style.transform = `translateY(${layer.y - smallLift}px) scale(${
          layer.scale - 0.04
        })`;
        card.style.opacity = "0.4";
        requestAnimationFrame(() => {
          // setTimeout(() => {
            card.style.transition =
              "transform 0.35s ease-out, opacity 0.35s ease-out";
            card.style.transform = `translateY(${layer.y}px) scale(${layer.scale})`;
            card.style.opacity = layer.opacity.toString();
          // }, 40);
        });
      } else {
        card.style.transition = instant
          ? "none"
          : "transform 0.3s ease, opacity 0.3s ease";
        card.style.transform = `translateY(${layer.y}px) scale(${layer.scale})`;
        card.style.opacity = layer.opacity.toString();
      }

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

      // ---------------------------
      // NEW FIXED DOT CLICK HANDLER
      // ---------------------------
      dot.addEventListener("click", async () => {
        if (isAnimating) return;

        const targetIndex = Number(dot.dataset.index);
        const topIndex = Number(cardsRef.current[0].dataset.index);

        if (targetIndex === topIndex) return;

        isAnimating = true;
        disablePointerEvents(true);

        // Calculate circular distance
        const steps =
          (targetIndex - topIndex + cardsRef.current.length) %
          cardsRef.current.length;

        for (let s = 0; s < steps; s++) {
          await forwardSwipe(); // Always moves only 1 card forward
        }

        disablePointerEvents(false);
        isAnimating = false;
      });
    });

    updateDots();
  };

  const updateDots = () => {
  if (!dotsRef.current) return;

  const activeIndex = Number(cardsRef.current[0]?.dataset.index);

  Array.from(dotsRef.current.children).forEach((dot, i) => {
    const d = dot as HTMLDivElement;

    if (i === activeIndex) {
      // ───────────────────────────────
      // ACTIVE DOT → circle to line
      // ───────────────────────────────
      // d.classList.add("active");

      // Stage 1: circle → thin bar
      // d.style.transition = "height 0.35s ease, border-radius 0.35s ease";
      // d.style.height = "2px";
      d.style.borderRadius = "4px";
      d.style.background = "white";
      // d.style.border = "none";

      // Stage 2: expand width outward (parallel timing)
      // requestAnimationFrame(() => {
      //   d.style.transition = "width 0.35s ease";
      //   d.style.width = "32px";
      // });

    } else {
      // ───────────────────────────────
      // PREVIOUS ACTIVE DOT → line to circle
      // reverse animation running SAME TIME
      // ───────────────────────────────
      // d.classList.remove("active");

      // Stage 1: shrink width
      // d.style.transition = "width 0.35s ease";
      // d.style.width = "8px";

      // Stage 2: AFTER width shrink begins, bring height back
      requestAnimationFrame(() => {
        // d.style.transition = "height 0.35s ease, border-radius 0.35s ease";
        // d.style.height = "8px";
        d.style.borderRadius = "50%";
        d.style.background = "transparent";
        // d.style.border = "1px solid white";
      });
    }
  });
};




  const disablePointerEvents = (state: boolean) => {
    if (!sliderRef.current || !dotsRef.current) return;
    sliderRef.current.style.pointerEvents = state ? "none" : "";
    dotsRef.current.style.pointerEvents = state ? "none" : "";
  };

  const forwardSwipe = () =>
    new Promise<void>((resolve) => {
      const top = cardsRef.current[0];
      const direction = currentX > 0 ? 1 : -1;
      const xMove = direction * 500;
      const rot = direction * 10;

      top.style.transition = `${SWIPE_ANIM_MS}ms ease`;
      top.style.transform = `translateX(${xMove}px) rotate(${rot}deg)`;
      top.style.opacity = "0";

      const second = cardsRef.current[1];
      if (second) {
        second.style.transition = `${SWIPE_ANIM_MS}ms ease`;
        second.style.transform = "translateY(0px) scale(1)";
        second.style.opacity = "1";
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
        removed.style.transform = "translateY(-90px) scale(0.9)";
        applyStack(false);
        resolve();
      }, SWIPE_ANIM_MS);
    });

  const onDown = (e: PointerEvent | TouchEvent) => {
    if (isAnimating) return;
    dragging = true;
    startX =
      (e as PointerEvent).clientX || (e as TouchEvent).touches[0].clientX;
    currentX = 0;
    cardsRef.current[0].style.transition = "none";
    document.body.style.overflow = "hidden";
    e.preventDefault();
  };

  const onMove = (e: PointerEvent | TouchEvent) => {
    if (!dragging || isAnimating) return;
    currentX =
      ((e as PointerEvent).clientX || (e as TouchEvent).touches[0].clientX) -
      startX;

    const top = cardsRef.current[0];
    const second = cardsRef.current[1];
    const third = cardsRef.current[2];

    top.style.transition = "none";
    top.style.transform = `translateX(${currentX}px) rotate(${
      currentX / 80
    }deg)`;

    const p = Math.min(1, Math.abs(currentX) / SWIPE_THRESHOLD);

    if (second) {
      second.style.transition = "none";
      second.style.transform = `translateY(${layers[1].y + p * 20}px) scale(${
        layers[1].scale + p * 0.06
      })`;
      second.style.opacity = (layers[1].opacity + p * 0.06).toString();
      second.style.zIndex = "2";
    }

    if (third) {
      third.style.transition = "none";
      third.style.transform = `translateY(${layers[2].y + p * 25}px) scale(${
        layers[2].scale + p * 0.05
      })`;
      third.style.opacity = (layers[2].opacity + p * 0.06).toString();
      third.style.zIndex = "1";
    }

    // Animate dots dynamically while dragging
    if (dotsRef.current) {
      const dots = dotsRef.current.children;

      const total = dots.length;
      if (total > 0) {
        const topIndex = Number(cardsRef.current[0].dataset.index);
        const nextIndex = (topIndex + 1) % total;
        const thirdIndex = (topIndex + 2) % total;

        Array.from(dots).forEach((dot, i) => {
          const d = dot as HTMLDivElement;
          d.style.transition = "none";

          if (i === topIndex) {
            // d.style.transform = `scale(${1.8 - p * 0.8})`;
            // d.style.opacity = `${1 - p * 0.5}`;
          } else if (i === nextIndex) {
            // d.style.transform = `scale(${1 + p * 0.8})`;
            // d.style.opacity = `${0.5 + p * 0.5}`;
          } else if (i === thirdIndex) {
            // d.style.transform = `scale(${0.6 + p * 0.4})`;
            // d.style.opacity = `${0.3 + p * 0.2}`;
          } else {
            // d.style.transform = "scale(1)";
            // d.style.opacity = "0.4";
          }
        });
      }
    }

    e.preventDefault();
  };

  const onUp = () => {
    if (!dragging && !isAnimating) return;
    dragging = false;

    if (Math.abs(currentX) > SWIPE_THRESHOLD) {
      isAnimating = true;
      disablePointerEvents(true);
      forwardSwipe().then(() => {
        disablePointerEvents(false);
        isAnimating = false;
      });
    } else {
      const top = cardsRef.current[0];
      const second = cardsRef.current[1];
      const third = cardsRef.current[2];

      top.style.transition = "0.3s ease";
      top.style.transform = "translateX(0px) rotate(0deg)";
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
      setTimeout(updateDots, 50);
    }
  };

  useEffect(() => {
    cardsRef.current = Array.from(
      sliderRef.current?.children || []
    ) as HTMLDivElement[];
    cardsRef.current.forEach((c, i) => (c.dataset.index = i.toString()));

    applyStack(true);
    createDots();

    const slider = sliderRef.current!;
    slider.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;
      onDown(e);
    });
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    slider.addEventListener("touchstart", onDown, { passive: false });
    slider.addEventListener(
      "touchmove",
      (e) => {
        if (dragging) e.preventDefault();
        onMove(e);
      },
      { passive: false }
    );
    window.addEventListener("touchend", onUp);
    window.addEventListener("resize", () => applyStack(true));

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("touchend", onUp);
      window.removeEventListener("resize", () => applyStack(true));
    };
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

