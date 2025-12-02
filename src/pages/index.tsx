/** @jsxImportSource @emotion/react */
import { useEffect, useState } from "react";

import StackedSliderDesktop from "@/components/StackedSliderDesktop";
import StackedSliderMobile from "@/components/StackedSliderMobile";

const StackedSlider = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isMobile ? <StackedSliderMobile /> : <StackedSliderDesktop />;
};

export default StackedSlider;