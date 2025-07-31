import Footer from "@/components/footer";
import Header from "@/components/header";
import Overview from "@/components/pages/overview";
import ScrollToTop from "@/components/ScrollToTop";
import HeaderScrollEffect from "@/components/HeaderScrollEffect";
import { BACKEND_DOMAIN } from '@/api/config';

export const dynamic = "force-dynamic";

export default async function OverviewPage() {
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
