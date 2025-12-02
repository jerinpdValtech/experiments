// ----------------------
// Emotion Styles

import { css } from "@emotion/react";
import { em } from "framer-motion/client";


// ----------------------

export const wrapperContainer = css`
  background: #e7519d;

`;

export const container = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 95%;
  max-width: 1100px;
  margin: 0 auto;
  perspective: 1200px;
  height: 700px;
  justify-content: center;
`;

export const sliderWrapper = css`
  position: relative;
  width: 100%;
  height: 450px;
`;

export const card = (bg: string) => css`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${bg});
  background-size: cover;
  background-position: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
  cursor: grab;
  touch-action: none;
  overflow: hidden;
  &:active {
    cursor: grabbing;
  }
`;

export const overlay = css`
  position: absolute;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  width: 100%;
  padding: 0 20px;
  color: white;
`;

export const tag = css`
  background: rgba(255, 255, 255, 0.25);
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.8rem;
  letter-spacing: 1px;
`;

export const title = css`
  margin-top: 18px;
  font-size: 2rem;
  font-weight: 800;
  text-transform: uppercase;
`;

export const btn = css`
  margin-top: 25px;
  padding: 12px 28px;
  background: #fff;
  border-radius: 30px;
  font-weight: 600;
  text-decoration: none;
  color: #000;
  display: inline-block;
  &:hover {
    background: #ff008c;
    color: white;
  }
`;

export const dotsStyle = css`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 30px;
  align-items: center;
  .dot {
    width: 8px;
    height: 8px;
    background: transparent;
    border: 1px solid white;
    border-radius: 50%;
    transition: all 0.35s ease;
    box-sizing: border-box;
    cursor: pointer;
  }

  .dot.active {
    width: 32px; /* expand smoothly */
    height: 2px; /* shrink smoothly */
    background: white;
    border: none;
    border-radius: 6px; /* keep it rounded */
  }
`;