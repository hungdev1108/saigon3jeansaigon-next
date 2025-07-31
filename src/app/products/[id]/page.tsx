import Footer from "@/components/footer";
import Header from "@/components/header";
import ProductDetails from "@/components/pages/product_details";
import productsService from "@/services/productsService";
import { BACKEND_DOMAIN } from '@/api/config';

export const dynamic = "force-dynamic";

async function fetchProductDetail(id: string) {
  let productData = null;
  let error = null;
  try {
    let res;
    // Nếu id là ObjectId (24 ký tự hex) thì fetch theo id, ngược lại fetch theo slug
    if (id.length === 24 && /^[0-9a-fA-F]{24}$/.test(id)) {
      res = await fetch(`${BACKEND_DOMAIN}/api/products/${id}`, { cache: 'no-store' });
    } else {
      res = await fetch(`${BACKEND_DOMAIN}/api/products/slug/${id}`, { cache: 'no-store' });
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
      <ProductDetails product={productData} error={error} id={params.id} />

      {/* Footer */}
      <Footer />
    </>
  );
}
