import Footer from "@/components/footer";
import Header from "@/components/header";
import ProductDetails from "@/components/pages/product_details";
import productsService from "@/services/productsService";

export const dynamic = "force-static";

async function fetchProductDetail(id: string) {
  const BACKEND_DOMAIN = process.env.NEXT_PUBLIC_BACKEND_DOMAIN || "http://localhost:5001";
  let productData = null;
  let error = null;
  try {
    let res;
    // Nếu id là ObjectId (24 ký tự hex) thì fetch theo id, ngược lại fetch theo slug
    if (id.length === 24 && /^[0-9a-fA-F]{24}$/.test(id)) {
      res = await fetch(`${BACKEND_DOMAIN}/api/products/${id}`, { next: { revalidate: 60 } });
    } else {
      res = await fetch(`${BACKEND_DOMAIN}/api/products/slug/${id}`, { next: { revalidate: 60 } });
    }
    const apiData = await res.json();
    if (!apiData.success) throw new Error("Failed to fetch product detail");
    productData = productsService.processProductDetails(apiData.data);
  } catch (e) {
    error = "Không thể tải thông tin sản phẩm.";
    productData = null;
  }
  return { productData, error };
}

interface ProductDetailsPageProps {
  params: { id: string };
}

export default async function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  const { productData, error } = await fetchProductDetail(params.id);
  return (
    <>
      {/* Header */}
      <Header />

      {/* Product Details */}
      <ProductDetails product={productData} error={error} />

      {/* Footer */}
      <Footer />
    </>
  );
}
