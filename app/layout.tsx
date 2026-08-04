import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "saluton! — 用中文學 Esperanto",
  description: "以互動文法與逆翻譯練習，輕鬆掌握 Esperanto 的規律。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body className={`${geistSans.variable} antialiased`}>{children}</body>
    </html>
  );
}
