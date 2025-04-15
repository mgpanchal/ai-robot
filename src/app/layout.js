// src/app/layout.js

import "./globals.css";
import React from "react";

<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet" />

export const metadata = {
  title: "Atlas mgP AI Model V1 - Mangesh Panchal",
  description: "Advanced Humanoid voice AI Model Project by Mangesh Panchal",
  icons: {
    icon: "/favicon.png",
  },
};  

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
