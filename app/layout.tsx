import { ThemeProvider } from "@/components/theme-provider";
import { SmoothScroll } from "@/components/smooth-scroll";
import type { Metadata } from "next";
import { GeistPixelGrid } from "geist/font/pixel";
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
    <html lang="en" suppressHydrationWarning className={GeistPixelGrid.variable}>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          <SmoothScroll>{children}</SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
