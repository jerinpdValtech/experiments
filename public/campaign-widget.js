(async function () {
  const scriptTag = document.currentScript;
  const pluCode = scriptTag.getAttribute("data-plu");

  if (!pluCode) {
    console.error("PLU code missing in script tag (data-plu).");
    return;
  }

  const container = document.createElement("div");
  container.style.fontFamily = "Arial, sans-serif";
  container.style.textAlign = "center";
  container.style.margin = "20px auto";
  document.body.appendChild(container);

  const btn = document.createElement("button");
  btn.innerText = "Redeem Offer";
  btn.style.cssText =
    "background:#2563eb;color:white;padding:10px 20px;border:none;border-radius:8px;cursor:pointer;font-size:16px;";
  container.appendChild(btn);

  const msg = document.createElement("div");
  msg.style.marginTop = "10px";
  container.appendChild(msg);

  try {
    // Call backend to get token + booking URL
    const res = await fetch("/api/campaign/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pluCode }),
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Failed to generate token");

    const { url } = data;

    // On click, open the booking page with PLU and token
    btn.addEventListener("click", () => {
      window.open(url, "_blank");
    });
  } catch (err) {
    msg.innerHTML = `<span style="color:red;">❌ Failed to initialize offer.</span>`;
  }
})();
