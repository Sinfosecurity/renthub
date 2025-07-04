import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
// import { AuthProvider } from "@/components/auth-provider"
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RentHub - Rent Anything You Need",
  description:
    "The trusted marketplace for renting anything you need. From professional equipment to everyday essentials.",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <main>{children}</main>
        {/* <AuthProvider>{children}</AuthProvider> */}
      </body>
    </html>
  );
}
