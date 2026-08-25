import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "@/styles/globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rvenvale — GitHub CDN Image Hosting",
  description:
    "Open-source GitHub CDN image hosting platform. Upload, manage, and serve images via GitHub Pages. Built with Go and Next.js.",
  keywords: ["github cdn", "image hosting", "open source", "rvenvale", "github pages"],
  openGraph: {
    title: "rvenvale — GitHub CDN Image Hosting",
    description: "Open-source GitHub CDN image hosting platform powered by GitHub Pages.",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function() {
              try {
                if (localStorage.getItem("darkmode") === "active") {
                  document.documentElement.classList.add("darkmode");
                }
              } catch (e) {}
            })();`,
          }}
        />
      </head>
      <body className={`${inter.className} body-color`}>{children}</body>
    </html>
  );
}