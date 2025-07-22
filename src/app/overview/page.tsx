import Footer from "@/components/footer";
import Header from "@/components/header";
import Overview from "@/components/pages/overview";
import ScrollToTop from "@/components/ScrollToTop";
import HeaderScrollEffect from "@/components/HeaderScrollEffect";
import overviewService from "@/services/overviewService";

export const dynamic = "force-static";

export default async function OverviewPage() {
  const overviewData = await overviewService.getCompleteOverviewData();
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
