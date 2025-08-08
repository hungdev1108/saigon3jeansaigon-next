import { Suspense } from 'react';
import Header from "@/components/header";
import Footer from "@/components/footer";
import Home from "@/components/pages/home";
import ScrollToTop from "@/components/ScrollToTop";
import HeaderScrollEffect from "@/components/HeaderScrollEffect";
import { BACKEND_DOMAIN } from "@/api/config";

export const dynamic = "force-dynamic";
export const revalidate = 0; // Disable cache for immediate updates

// Hàm lấy dữ liệu trang chủ từ API
async function getHomeData() {
  try {
    const response = await fetch(`${BACKEND_DOMAIN}/api/home/data`, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error("Error fetching home data:", error);
    return null;
  }
}

export default async function HomePage() {
  // Lấy dữ liệu trang chủ
  const homeData = await getHomeData();
  
  return (
    <>
      {/* Header Scroll Effect */}
      <HeaderScrollEffect />

      {/* Header */}
      <Header />

      {/* Home */}
      <Home homeData={homeData} />

      {/* Footer */}
      <Footer />

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </>
  );
} 