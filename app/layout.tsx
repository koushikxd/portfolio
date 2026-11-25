import { GeistMono } from "geist/font/mono";
import { GeistPixelGrid } from "geist/font/pixel";
import { GeistSans } from "geist/font/sans";
import { ReactLenis } from "lenis/react";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { HANDLES } from "@/lib/data";
import "./globals.css";

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
    creator: `@${HANDLES.x}`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable} ${GeistPixelGrid.variable}`}
    >
      <body
        suppressHydrationWarning
        className="antialiased selection:bg-foreground selection:text-background"
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          <ReactLenis root options={{ duration: 0.8 }}>
            {children}
          </ReactLenis>
        </ThemeProvider>
      </body>
    </html>
  );
}
