import { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import { motion } from "framer-motion";
import { Cabana } from "@/utils/types";

interface CabanaDetailBoxProps {
  selectedCabana: Cabana | null;
  setSelectedCabana: (cabana: Cabana | null) => void;
}

export default function CabanaDetailBox({
  selectedCabana,
  setSelectedCabana,
}: CabanaDetailBoxProps) {
  
  const map = useMap();
  const [position, setPosition] = useState<{ x: number; y: number } | null>(
    null
  );

  const updatePosition = () => {
    if (!selectedCabana) return;
    const point = map.latLngToContainerPoint(selectedCabana.position);
    setPosition({ x: point.x, y: point.y });
  };

  useEffect(() => {
    if (!selectedCabana) return;
    updatePosition();
    map.on("move", updatePosition);
    map.on("zoom", updatePosition);

    return () => {
      map.off("move", updatePosition);
      map.off("zoom", updatePosition);
    };
  }, [selectedCabana]);

  if (!selectedCabana || !position) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        position: "absolute",
        top: position.y - 100,
        left: position.x + 20,
        background: "white",
        boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
        borderRadius: 16,
        padding: 16,
        width: 220,
        zIndex: 1000,
      }}
    >
      <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
        {selectedCabana.name}
      </h3>
      <p style={{ margin: "8px 0 0" }}>
        Capacity: {selectedCabana.capacity ?? "N/A"}
      </p>
      <p style={{ margin: "4px 0 0" }}>
        Price: ₹{selectedCabana.price ?? "N/A"}
      </p>
      <button
        style={{
          marginTop: 12,
          background: "#2563eb",
          color: "white",
          padding: "6px 10px",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
        }}
        onClick={() => setSelectedCabana(null)}
      >
        Close
      </button>
    </motion.div>
  );
}
