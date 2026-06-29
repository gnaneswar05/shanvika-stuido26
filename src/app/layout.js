import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { Suspense } from "react";

export const metadata = {
  title: "Shanvika Studio | Luxury Ethnic Wear & Designer Outfits",
  description: "Experience handcrafted royal sarees, hand-embroidered Anarkali suits, designer bridal lehengas, and premium co-ords. Confidence in every outfit.",
  keywords: "luxury ethnic wear, sarees, anarkalis, lehengas, silk, zari, designer collection, indian fashion, bridal wear, Shanvika Studio",
  openGraph: {
    title: "Shanvika Studio | Handcrafted Luxury Ethnic Wear",
    description: "Discover exclusive heritage pieces and modern luxury silhouettes. Confidence in every outfit.",
    url: "https://shanvikastudio.com",
    siteName: "Shanvika Studio",
    images: [
      {
        url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800",
        width: 800,
        height: 600,
        alt: "Shanvika Studio Luxury Wear",
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
