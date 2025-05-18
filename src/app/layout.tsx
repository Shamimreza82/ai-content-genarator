// src/app/layout.tsx
import type { ReactNode } from "react";
import { Roboto } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navber";
import { CardFooter } from "@/components/ui/card";

// these calls are pure — they’ll render the same on server and client
// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });
const roboto = Roboto({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html
      lang="en"
      // move all font CSS-variable classes onto <html> so they’re identical
      className={` ${roboto.variable}`}
      // suppressHydrationWarning silences React if there’s still some tiny diff
      suppressHydrationWarning
    >
      <head>
        {/* if you need any extra <meta> or <link>, put it here */}
      </head>
      <body className="antialiased">
        <Navbar/>
        {children}
        <CardFooter></CardFooter>
      </body>
    </html>
  );
}
