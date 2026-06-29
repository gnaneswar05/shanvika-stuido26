import dbConnect from "@/lib/db";
import Product from "@/lib/models/Product";
import Category from "@/lib/models/Category";

export default async function sitemap() {
  const baseUrl = "https://shanvikastudio.com";

  // Static routes
  const routes = [
    "",
    "/about",
    "/contact",
    "/faq",
    "/policies",
    "/categories",
    "/products",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "daily",
    priority: route === "" ? 1.0 : 0.8,
  }));

  try {
    await dbConnect();

    // Fetch dynamic products
    const products = await Product.find().select("slug updatedAt");
    const productRoutes = products.map((prod) => ({
      url: `${baseUrl}/products/${prod.slug}`,
      lastModified: prod.updatedAt ? new Date(prod.updatedAt).toISOString() : new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 0.6,
    }));

    // Fetch dynamic categories
    const categories = await Category.find().select("slug updatedAt");
    const categoryRoutes = categories.map((cat) => ({
      url: `${baseUrl}/products?category=${cat.slug}`,
      lastModified: cat.updatedAt ? new Date(cat.updatedAt).toISOString() : new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 0.5,
    }));

    return [...routes, ...productRoutes, ...categoryRoutes];
  } catch (error) {
    console.error("Error generating dynamic sitemap:", error);
    return routes;
  }
}
