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

// --- UPDATED METADATA ---
export const metadata: Metadata = {
  title: "A Christmas Message",
  description: "Celebrating the Birth of Christ",
  openGraph: {
    title: "A Christmas Card from Denin",
    description: "A special message for you this Christmas season from Denin.",
    url: "https://deningeorge.vercel.app",
    siteName: "Christmas Card from Denin",
    images: [
      {
        url: "https://deningeorge.vercel.app/thumbnail.jpg",
        width: 1200,
        height: 630,
        alt: "A Blessed Christmas",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "A Blessed Christmas",
    description: "A special message for you.",
    images: ["https://deningeorge.vercel.app/thumbnail.jpg"],
  },
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