import Script from "next/script";

export default function TestCampaign() {
  return (
    <div style={{ padding: 40 }}>
      <h2>Test Campaign Widget</h2>
      <p>This is how it will appear on third-party websites.</p>

      <Script
        src="/campaign-widget.js"
        strategy="afterInteractive"
        data-plu="PLU123"
      />
    </div>
  );
}