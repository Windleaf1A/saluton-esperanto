import type { Metadata } from "next";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
