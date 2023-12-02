import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ampt + Next.js Starter Template",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="flex min-h-screen flex-col items-center p-24">
          <div className="flex place-items-center ">
            <Image src="/ampt.svg" alt="Ampt Logo" width={180} height={37} />
            <p className="m-3 text-xl">+</p>
            <Image
              src="/nextjs.svg"
              alt="Next.js Logo"
              width={180}
              height={37}
            />
          </div>
          <h1 className="text-3xl mb-8">Serverlesspresso</h1>
          <div className="m-4">{children}</div>
        </main>
      </body>
    </html>
  );
}
