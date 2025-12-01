import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function BookingPage() {
  const router = useRouter();
  const { plu, token } = router.query;
  const [status, setStatus] = useState("Validating...");

  useEffect(() => {
    async function validate() {
      if (!plu || !token) return;

      try {
        const res = await fetch("/api/campaign/validate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plu, token }),
        });
        const data = await res.json();
        if (data.valid) setStatus("✅ Offer valid — proceed to booking!");
        else setStatus("❌ Invalid or expired token");
      } catch {
        setStatus("❌ Validation failed");
      }
    }

    validate();
  }, [plu, token]);

  return (
    <div style={{ padding: 20 }}>
      <h2>Campaign Offer</h2>
      <p>{status}</p>
    </div>
  );
}
