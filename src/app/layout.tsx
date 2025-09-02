import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Agroforst Frank Fege",
  description: "Permdal-Produkte aus der Ostprignitz",
  icons: {
    icon: [
      {
        url: '/img/agroforst_ff_icon_bg.png',
        type: 'image/png',
      },
    ],
    shortcut: '/img/agroforst_ff_icon_bg.png',
    apple: '/img/agroforst_ff_icon_bg.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
