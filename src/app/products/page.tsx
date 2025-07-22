import Footer from "@/components/footer";
import Header from "@/components/header";
import Products from "@/components/pages/products";

export const dynamic = "force-static";

async function fetchProductsData() {
  const BACKEND_DOMAIN = process.env.NEXT_PUBLIC_BACKEND_DOMAIN || "http://localhost:5001";
  const res = await fetch(`${BACKEND_DOMAIN}/api/products/data`, { next: { revalidate: 60 } });
  const apiData = await res.json();
  if (!apiData.success) throw new Error("Failed to fetch products data");
  return apiData.data || null;
}

export default async function ProductsPage() {
  let productsData = null;
  try {
    productsData = await fetchProductsData();
  } catch {
    productsData = null;
  }
  return (
    <>
      {/* Header */}
      <Header />

      {/* Products */}
      <Products productsData={productsData} />

      {/* Footer */}
      <Footer />
    </>
  );
}
