import { Metadata } from "next";
import React, { Suspense } from "react";
import CardClientContent from "./CardClientContent";

export const dynamic = "force-dynamic"; 

export async function generateMetadata({ 
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}): Promise<Metadata> {
  // 1. AWAIT the searchParams (Crucial for Next.js 15)
  const params = await searchParams;
  const id = typeof params.id === 'string' ? params.id : undefined;
  
  const baseUrl = "https://deningeorge.vercel.app";
  const SHEETDB_URL = "https://sheetdb.io/api/v1/tgo9mz1m8qunj";
  
  let displayName = "";

  // 2. Fetch the real name from SheetDB for the preview
  if (id) {
    try {
      // Use a shorter timeout or limit for metadata fetch to keep it fast
      const response = await fetch(`${SHEETDB_URL}/search?id=${id}`, {
        next: { revalidate: 3600 } // Cache for 1 hour to stay fast
      });
      const data = await response.json();
      if (data && data.length > 0) {
        displayName = data[0].name;
      }
    } catch (error) {
      console.error("Metadata Fetch Error:", error);
    }
  }

  // 3. Fallback to capitalized ID if the database fetch fails
  const personName = displayName || (id ? id.charAt(0).toUpperCase() + id.slice(1) : "");
  
  const dynamicTitle = id ? `A Christmas Message for ${personName}` : "A Christmas Message";
  const dynamicDesc = id 
    ? `Denin has sent a special Christmas card to ${personName}. Open to view.` 
    : "Celebrating the Birth of Christ with a special message.";

  const shareUrl = id ? `${baseUrl}/?id=${id}` : baseUrl;

  return {
    title: dynamicTitle,
    description: dynamicDesc,
    alternates: {
      canonical: shareUrl,
    },
    openGraph: {
      title: dynamicTitle,
      description: dynamicDesc,
      url: shareUrl, 
      siteName: "Christmas Card",
      images: [
        {
          url: `${baseUrl}/thumbnail.jpg`,
          width: 1200,
          height: 630,
          alt: `Christmas Card for ${personName}`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: dynamicTitle,
      description: dynamicDesc,
      images: [`${baseUrl}/thumbnail.jpg`],
    },
  };
}

export default function ChristmasCardPage() {
  return (
    <Suspense fallback={<div className="h-screen w-full bg-holy-blue flex items-center justify-center">Loading...</div>}>
      <CardClientContent />
    </Suspense>
  );
}