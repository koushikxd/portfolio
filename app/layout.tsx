import type { Metadata } from "next";
import { Doto } from "next/font/google";
import "./globals.css";

const doto = Doto({
  subsets: ["latin"],
  variable: "--font-doto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Koushik - Portfolio",
  description: "literally my portfolio, that's it",
  keywords: [
    "Koushik",
    "Software Developer",
    "TypeScript",
    "React",
    "Neovim",
    "btw",
    "Portfolio",
  ],
  authors: [{ name: "Koushik" }],
  creator: "Koushik",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Koushik - Portfolio",
    description: "literally my portfolio, that's it",
    siteName: "Koushik",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Koushik - Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Koushik - Portfolio",
    description: "literally my portfolio, that's it",
    creator: "@koushik_xd",
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${doto.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
