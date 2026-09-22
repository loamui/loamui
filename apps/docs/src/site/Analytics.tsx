import Script from "next/script";

export function Analytics() {
  const id = process.env.NEXT_PUBLIC_GTM_ID;
  if (!id) return null;
  return (
    <>
      <Script id="gtm" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });`}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(id)}`}
        strategy="afterInteractive"
      />
    </>
  );
}
