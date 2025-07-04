import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Korean 3D Text SaaS",
  description: "한글 3D 텍스트 생성 플랫폼",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko">
      <body className={`${notoSansKR.variable} font-korean antialiased`}>
        {children}
      </body>
    </html>
  );
}
