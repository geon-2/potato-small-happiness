import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
    title: "소확행 지수",
    description: "오늘 당신의 소확행 지수를 확인해보세요.",
};

export default function RootLayout({ children }) {
    return (
        <html lang="ko">
        <head>
            <link rel="manifest" href="/manifest.json" />
        </head>
        <body>{children}</body>
        </html>
    );
}

