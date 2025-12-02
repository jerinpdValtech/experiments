/** @jsxImportSource @emotion/react */
import { useEffect, useRef } from "react";
import {
 wrapperContainer,
 container,
 sliderWrapper,
 card,
 overlay,
 tag,
 title,
 btn,
 dotsStyle,
} from "./StackedSliderMobileCss";
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
const SWIPE_THRESHOLD = 90;
const SWIPE_ANIM_MS = 450;
const StackedSliderMobile = () => {
 const sliderRef = useRef<HTMLDivElement>(null);
 const dotsRef = useRef<HTMLDivElement>(null);
 const cardsRef = useRef<HTMLDivElement[]>([]);
 const draggingRef = useRef(false);
 const startXRef = useRef(0);
 const currentXRef = useRef(0);
 const isAnimatingRef = useRef(false);
 // --------------------- APPLY STACK POSITION ---------------------
 const applyStack = (instant = false) => {
  cardsRef.current.forEach((card, i) => {
   const layer = layers[i] || { y: -90, scale: 0.8, opacity: 0, z: -1 };
   if (!instant && i === 2) {
    const smallLift = 35;
    card.style.transition = "none";
    card.style.transform = `translateY(${layer.y - smallLift}px) scale(${layer.scale - 0.04})`;
    card.style.opacity = "0.4";
    requestAnimationFrame(() => {
      card.style.transition = "transform 0.35s ease-out, opacity 0.35s ease-out";
      card.style.transform = `translateY(${layer.y}px) scale(${layer.scale})`;
      card.style.opacity = layer.opacity.toString();
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
  // updateDots();
 };
 // --------------------- DOTS ---------------------
 const createDots = () => {
  if (!dotsRef.current) return;
  dotsRef.current.innerHTML = "";
  images.forEach((_, i) => {
   const dot = document.createElement("div");
   dot.className = "dot";
   dot.dataset.index = i.toString();
   dot.addEventListener("click", () => {
    if (isAnimatingRef.current) return;
    const targetIndex = Number(dot.dataset.index);
    const currentTopIndex = Number(cardsRef.current[0].dataset.index);
    if (targetIndex === currentTopIndex) return;
    const steps =
     (targetIndex - currentTopIndex + images.length) % images.length;
    swipe(1, steps);
   });
   dotsRef.current!.appendChild(dot);
  });
  updateDots();
 };
 const updateDots = () => {
  if (!dotsRef.current) return;
  const topCard = cardsRef.current[0];
  if (!topCard) return;
  const activeIndex = Number(topCard.dataset.index);
  Array.from(dotsRef.current.children).forEach((dot, i) => {
   const d = dot as HTMLDivElement;
   if (i === activeIndex) {
    // d.classList.add("active");
    // d.style.transition = "all 0.35s ease";
    // d.style.width = "32px";
    // d.style.height = "2px";
    d.style.borderRadius = "4px";
    d.style.background = "white";
    // d.style.border = "none";
   } else {
    // d.classList.remove("active");
    // d.style.transition = "all 0.35s ease";
    // d.style.width = "8px";
    // d.style.height = "8px";
    d.style.borderRadius = "50%";
    d.style.background = "transparent";
    // d.style.border = "1px solid white";
   }
  });
 };
 const swipe = (direction: 1 | -1, steps = 1) => {
  if (isAnimatingRef.current) return;
  isAnimatingRef.current = true;

  const top = cardsRef.current[0];
  const second = cardsRef.current[1];
  const third = cardsRef.current[2];

  // 🔥 Remove all swipe animations (for debugging)
  top.style.transition = "none";
  second && (second.style.transition = "none");
  third && (third.style.transition = "none");

  // Instantly move top card off-screen
  const screenWidth = window.innerWidth;
  const xMove = direction * (screenWidth * 1.2);
  top.style.transform = `translateX(${xMove}px)`;
  top.style.opacity = "0";

  setTimeout(() => {
    // 🔥 Reorder without animation
    for (let i = 0; i < steps; i++) {
      const removed = cardsRef.current.shift()!;
      cardsRef.current.push(removed);
    }

    // Reset back card instantly
    const newBack = cardsRef.current[2];
    if (newBack) {
      newBack.style.visibility = "visible";
      newBack.style.opacity = "0";
      newBack.style.transform =
        `translateY(${layers[2].y}px) scale(${layers[2].scale})`;
    }

    // 🔥 Reapply stack WITH NO animation
    applyStack(true);

    // 🔥 Update dots without animation
    updateDots();

    isAnimatingRef.current = false;
  }, 10);
};

 // --------------------- DRAG HANDLERS ---------------------
 const onDown = (e: PointerEvent | TouchEvent) => {
  if (isAnimatingRef.current) return;
  draggingRef.current = true;
  startXRef.current =
   (e as PointerEvent).clientX || (e as TouchEvent).touches[0].clientX;
  currentXRef.current = 0;
  document.body.style.overflow = "hidden";
  e.preventDefault();
 };
 const onMove = (e: PointerEvent | TouchEvent) => {
  if (!draggingRef.current || isAnimatingRef.current) return;
  currentXRef.current =
   ((e as PointerEvent).clientX || (e as TouchEvent).touches[0].clientX) -
   startXRef.current;
  const top = cardsRef.current[0];
  const second = cardsRef.current[1];
  const third = cardsRef.current[2];
  top.style.transition = "none";
  top.style.transform = `translateX(${currentXRef.current}px) rotate(${
   currentXRef.current / 80
  }deg)`;
  const p = Math.min(1, Math.abs(currentXRef.current) / SWIPE_THRESHOLD);
  if (second) {
   second.style.transition = "none";
   second.style.transform = `translateY(${layers[1].y + p * 20}px) scale(${
    layers[1].scale + p * 0.06
   })`;
   second.style.opacity = (layers[1].opacity + p * 0.06).toString();
  }
  if (third) {
   third.style.transition = "none";
   third.style.transform = `translateY(${layers[2].y + p * 25}px) scale(${
    layers[2].scale + p * 0.05
   })`;
   third.style.opacity = (layers[2].opacity + p * 0.06).toString();
  }
 };
 const onUp = () => {
  if (!draggingRef.current) return;
  draggingRef.current = false;
  if (Math.abs(currentXRef.current) > SWIPE_THRESHOLD) {
   swipe(currentXRef.current > 0 ? 1 : -1);
  } else {
   applyStack(false);
  }
 };
 // --------------------- EFFECT ---------------------
 useEffect(() => {
  cardsRef.current = Array.from(sliderRef.current?.children || []) as HTMLDivElement[];
  cardsRef.current.forEach((card, i) => (card.dataset.index = i.toString()));
  applyStack(true);
  createDots();
  const slider = sliderRef.current!;
  slider.addEventListener("pointerdown", onDown);
  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerup", onUp);
  slider.addEventListener("touchstart", onDown, { passive: false });
  slider.addEventListener("touchmove", onMove, { passive: false });
  window.addEventListener("touchend", onUp);
  window.addEventListener("resize", () => applyStack(true));
  return () => {
   window.removeEventListener("pointermove", onMove);
   window.removeEventListener("pointerup", onUp);
   window.removeEventListener("touchend", onUp);
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
export default StackedSliderMobile;