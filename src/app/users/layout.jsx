"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Header from "@/components/header";
import { MetadataContext, metadata } from "./metadataContext";
import "./globals.css";

export default function RootLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
    } else {
      const currentPath = window.location.pathname;

      if (currentPath === "/login" || currentPath === "/register") {
        router.push("/users");
      } else {
        router.push(currentPath);
      }
    }
  }, []);

  return (
    <MetadataContext.Provider value={metadata}>
      <html lang="en">
        <head>
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap"
            rel="stylesheet"
          />
          <title>{metadata.title}</title>
        </head>
        <body className="font-inter">
          <div>
            <Header />
          </div>
          <div>{children}</div>
        </body>
      </html>
    </MetadataContext.Provider>
  );
}
