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
  
  // 2. Logic for unique content
  const personName = id ? id.charAt(0).toUpperCase() + id.slice(1) : "";
  const dynamicTitle = id ? `A Christmas Message for ${personName}` : "A Christmas Message";
  const dynamicDesc = id 
    ? `Denin has sent a special Christmas card to ${personName}.` 
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
          alt: "A Blessed Christmas",
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