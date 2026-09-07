"use client";

import { useEffect } from "react";

/**
 * Catches errors thrown by the root layout itself. Renders its own document
 * and no global styles, so everything here is inline.
 */
export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f8fafc",
          fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif",
          color: "#1f2937",
          padding: "24px",
        }}
      >
        <title>Something went wrong — YEEP Somalia</title>
        <div style={{ maxWidth: 380, textAlign: "center" }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#2D8FCE" }}>YEEP Somalia</div>
          <h1 style={{ fontSize: 22, margin: "16px 0 8px" }}>Something went wrong</h1>
          <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.6, margin: 0 }}>
            The application hit an unexpected error. Please try again.
          </p>
          {error.digest && (
            <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 8 }}>
              Reference: {error.digest}
            </p>
          )}
          <button
            onClick={() => retry()}
            style={{
              marginTop: 24,
              padding: "12px 28px",
              fontSize: 14,
              fontWeight: 700,
              color: "#fff",
              background: "#2D8FCE",
              border: "none",
              borderRadius: 12,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
