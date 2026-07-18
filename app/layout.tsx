import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import PwaRegister from "@/components/PwaRegister";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://psalm-morning.vercel.app"),
  title: {
    default: "Psalm Morning",
    template: "%s | Psalm Morning",
  },
  description: "매일 아침 시편 말씀과 묵상, 기도로 하루를 시작하세요.",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "/",
    siteName: "Psalm Morning",
    title: "Psalm Morning",
    description: "매일 아침 시편 말씀과 묵상, 기도로 하루를 시작하세요.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Psalm Morning",
    description: "매일 아침 시편 말씀과 묵상, 기도로 하루를 시작하세요.",
  },
  applicationName: "Psalm Morning",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Psalm Morning",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#facc15",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <PwaRegister />
      </body>
    </html>
  );
}
