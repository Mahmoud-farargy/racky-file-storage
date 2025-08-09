import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import ProgressBar from "@/components/ProgressBar";
import "./globals.css";
import type { Viewport } from "next";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: "Racky",
  description: "Store anything and share it!",
};

export const viewport: Viewport = {
  themeColor: "#FA7275",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} --font-poppins antialiased`}
      >
        {children}
        <ProgressBar />
      </body>
    </html>
  );
}
