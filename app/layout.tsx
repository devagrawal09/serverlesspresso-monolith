import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Serverlespresso Cafe",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="flex flex-col items-center p-16">
          <Link href="/">
            <h1 className="text-3xl mb-8">Serverlesspresso</h1>
          </Link>
          <div className="m-4">{children}</div>
        </main>
      </body>
    </html>
  );
}
