import { Metadata } from "next";
import React, { Suspense } from "react";
import CardClientContent from "./CardClientContent";

// --- ADD THIS LINE TO FIX THE FACEBOOK CRAWLER ---
export const dynamic = "force-dynamic"; 
// ------------------------------------------------

// --- SERVER SIDE METADATA ---
export async function generateMetadata({ 
  searchParams 
}: { 
  searchParams: { id?: string } 
}): Promise<Metadata> {
  const id = searchParams.id;
  const baseUrl = "https://deningeorge.vercel.app";
  
  // This ensures Messenger knows exactly where to go when the image is clicked
  const shareUrl = id ? `${baseUrl}/?id=${id}` : baseUrl;

  return {
    title: "A Christmas Message",
    description: "Celebrating the Birth of Christ",
    // --- THIS IS THE FIX ---
    alternates: {
      canonical: shareUrl,
    },
    // ------------------------
    openGraph: {
      title: "A Christmas Card from Denin",
      description: "A special message for you this Christmas season from Denin.",
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
      title: "A Blessed Christmas",
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