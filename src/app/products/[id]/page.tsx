import Footer from "@/components/footer";
import Header from "@/components/header";
import ProductDetails from "@/components/pages/product_details";

interface ProductDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductDetailsPage({
  params,
}: ProductDetailsPageProps) {
  const resolvedParams = await params;

  return (
    <>
      {/* Header */}
      <Header />

      {/* Product Details */}
      <ProductDetails params={resolvedParams} />

      {/* Footer */}
      <Footer />
    </>
  );
}
