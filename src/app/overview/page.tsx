import Footer from "@/components/footer";
import Header from "@/components/header";
import Overview from "@/components/pages/overview";
import ScrollToTop from "@/components/ScrollToTop";
import HeaderScrollEffect from "@/components/HeaderScrollEffect";
import overviewService from "@/services/overviewService";

export const dynamic = "force-static";

export default async function OverviewPage() {
  const BACKEND_DOMAIN = process.env.NEXT_PUBLIC_BACKEND_DOMAIN || "http://localhost:5001";
  const res = await fetch(`${BACKEND_DOMAIN}/api/overview/data`, { cache: 'no-store' });
  const apiData = await res.json();
  const overviewData = apiData.success ? apiData.data : null;
  return (
    <>
      {/* Header Scroll Effect */}
      <HeaderScrollEffect />

      {/* Header */}
      <Header />

      {/* Overview */}
      <Overview overviewData={overviewData} />

      {/* Footer */}
      <Footer />

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </>
  );
}
