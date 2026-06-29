import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { Suspense } from "react";

import dbConnect from "@/lib/db";
import Setting from "@/lib/models/Setting";

export async function generateMetadata() {
  try {
    await dbConnect();
    const settings = await Setting.findOne();
    const brandName = settings?.brandName || "Shanvika Studio";
    const slogan = settings?.slogan || "Confidence in Every Outfit";
    const logoUrl = settings?.logoUrl || "/favicon.ico";

    return {
      title: `${brandName} | Luxury Ethnic Wear & Designer Outfits`,
      description: `${slogan}. Experience handcrafted royal sarees, hand-embroidered Anarkali suits, designer bridal lehengas, and premium co-ords.`,
      keywords: "luxury ethnic wear, sarees, anarkalis, lehengas, silk, zari, designer collection, indian fashion, bridal wear, Shanvika Studio",
      icons: {
        icon: logoUrl,
        apple: logoUrl,
      },
      openGraph: {
        title: `${brandName} | Handcrafted Luxury Ethnic Wear`,
        description: slogan,
        url: "https://shanvikastudio.com",
        siteName: brandName,
        images: [
          {
            url: logoUrl || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800",
            width: 800,
            height: 600,
            alt: `${brandName} Luxury Wear`,
          },
        ],
        locale: "en_IN",
        type: "website",
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  } catch (e) {
    return {
      title: "Shanvika Studio | Luxury Ethnic Wear & Designer Outfits",
      description: "Confidence in every outfit. Experience handcrafted royal sarees, hand-embroidered Anarkali suits, designer bridal lehengas, and premium co-ords.",
    };
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full bg-black text-white antialiased">
      <body className="min-h-full flex flex-col bg-black text-white font-sans selection:bg-[#D4AF37] selection:text-black">
        {/* Header wrapped in Suspense for search parameters tracking */}
        <Suspense fallback={<div className="h-20 bg-black border-b border-neutral-900"></div>}>
          <Header />
        </Suspense>
        
        {/* Main Content Pages */}
        <main className="flex-grow">
          {children}
        </main>
        
        {/* Footer */}
        <Footer />
        
        {/* WhatsApp Float */}
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
