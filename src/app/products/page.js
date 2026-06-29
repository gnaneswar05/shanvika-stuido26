import React, { Suspense } from "react";
import ProductsList from "./ProductsList";

export const metadata = {
  title: "Shanvika Studio | Royal Garments Catalog",
  description: "Browse our hand-finished luxury ethnic outfits, including sarees, Anarkalis, lehengas, and co-ords.",
};

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-20 text-center text-neutral-400">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-10 w-48 bg-neutral-900 rounded mb-4"></div>
            <div className="h-5 w-64 bg-neutral-900 rounded mb-10"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full mt-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-neutral-950 border border-neutral-900 rounded aspect-[3/4] p-4 flex flex-col justify-between">
                  <div className="bg-neutral-900 w-full h-[65%] rounded"></div>
                  <div className="bg-neutral-900 w-16 h-3 rounded mt-2"></div>
                  <div className="bg-neutral-900 w-full h-4 rounded mt-1"></div>
                  <div className="bg-neutral-900 w-24 h-4 rounded mt-1"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <ProductsList />
    </Suspense>
  );
}
