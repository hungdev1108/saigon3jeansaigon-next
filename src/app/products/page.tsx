import Footer from "@/components/footer";
import Header from "@/components/header";
import Products from "@/components/pages/products";
import { BACKEND_DOMAIN } from '@/api/config';

export const dynamic = "force-dynamic";

async function fetchProductsData() {
  const res = await fetch(`${BACKEND_DOMAIN}/api/products/data`, { cache: 'no-store' });
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
