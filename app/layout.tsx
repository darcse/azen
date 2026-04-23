import { Suspense } from "react";
import type { Metadata } from "next";
import { ConditionalFooter } from "@/components/layout/ConditionalFooter";
import { ConditionalHeader } from "@/components/layout/ConditionalHeader";
import { ThemeClassBridge } from "@/components/layout/ThemeClassBridge";
import "./globals.css";
import "./prose.css";

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
    <html lang="ko" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full bg-background text-foreground">
        <ThemeClassBridge />
        <div className="flex min-h-screen flex-col">
          <Suspense fallback={null}>
            <ConditionalHeader />
          </Suspense>
          <main className="flex-1">{children}</main>
          <ConditionalFooter />
        </div>
      </body>
    </html>
  );
}
