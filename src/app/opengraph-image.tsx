import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Kalshi Signals — Largest Prediction Market Trades in Real Time";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "10px",
              background: "#3b82f6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
            }}
          >
            📊
          </div>
          <span
            style={{
              fontSize: "32px",
              color: "#94a3b8",
              fontWeight: 600,
            }}
          >
            Kalshi Signals
          </span>
        </div>
        <div
          style={{
            fontSize: "56px",
            fontWeight: 700,
            color: "#ffffff",
            textAlign: "center",
            lineHeight: 1.2,
            marginBottom: "24px",
          }}
        >
          Largest Prediction Market
          <br />
          Trades in Real Time
        </div>
        <div
          style={{
            fontSize: "24px",
            color: "#94a3b8",
            textAlign: "center",
            maxWidth: "800px",
          }}
        >
          Track the biggest single trades across politics, crypto, sports, and more
        </div>
        <div
          style={{
            display: "flex",
            gap: "32px",
            marginTop: "48px",
          }}
        >
          {["Politics", "Crypto", "Sports", "Economics"].map((cat) => (
            <div
              key={cat}
              style={{
                padding: "10px 24px",
                borderRadius: "9999px",
                border: "1px solid #334155",
                color: "#cbd5e1",
                fontSize: "18px",
              }}
            >
              {cat}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
