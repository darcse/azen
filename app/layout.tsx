import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "azen",
  description: "공업용 필터 판매 회사 홈페이지",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
