// src/app/layout.js

import "./globals.css";
import React from "react";

<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet" />

export const metadata = {
  title: "AI Project",
  description: "Talk to your AI robot powered by Google AI Studio",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
