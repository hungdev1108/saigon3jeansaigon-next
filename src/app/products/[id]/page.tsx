import Footer from "@/components/footer";
import Header from "@/components/header";
import ProductDetails from "@/components/pages/product_details";

interface ProductDetailsPageProps {
  params: {
    id: string;
  };
}

export default function ProductDetailsPage({
  params,
}: ProductDetailsPageProps) {
  return (
    <>
      {/* Header */}
      <Header />

      {/* Product Details */}
      <ProductDetails params={params} />

      {/* Footer */}
      <Footer />
    </>
  );
}
