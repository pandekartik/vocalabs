import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "./providers";

import { IBM_Plex_Sans } from "next/font/google";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex-sans",
});

export const metadata: Metadata = {
  title: {
    template: "Voca Labs | %s",
    default: "Voca Labs",
  },
  description: "Voca Labs Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${ibmPlexSans.variable} font-sans`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
