import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  variable: "--font-playfair" 
});

const lato = Lato({ 
  weight: ["300", "400"], 
  subsets: ["latin"], 
  variable: "--font-lato" 
});

// We keep only the very basic title here as a fallback
export const metadata: Metadata = {
  title: "A Christmas Message",
  description: "Celebrating the Birth of Christ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${lato.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}