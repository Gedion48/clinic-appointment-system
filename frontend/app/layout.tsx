import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "ClinicFlow — Appointment Management",
  description: "Modern clinic appointment scheduling system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              fontFamily: "DM Sans, sans-serif",
              fontSize: "14px",
              fontWeight: "500",
              borderRadius: "12px",
              padding: "12px 16px",
            },
            success: {
              style: {
                background: "#f0fdfa",
                color: "#0f766e",
                border: "1px solid #99f6e4",
              },
            },
            error: {
              style: {
                background: "#fef2f2",
                color: "#b91c1c",
                border: "1px solid #fecaca",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
