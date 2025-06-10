import Footer from "@/components/footer";
import Header from "@/components/header";
import Overview from "@/components/pages/overview";
import ScrollToTop from "@/components/ScrollToTop";
import HeaderScrollEffect from "@/components/HeaderScrollEffect";

export default function OverviewPage() {
  return (
    <>
      {/* Header Scroll Effect */}
      <HeaderScrollEffect />

      {/* Header */}
      <Header />

      {/* Overview */}
      <Overview />

      {/* Footer */}
      <Footer />

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </>
  );
}
