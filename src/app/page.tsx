import Footer from "@/components/footer";
import Header from "@/components/header";
import Home from "@/components/pages/home";

export const dynamic = "force-static";

async function fetchHomeData() {
  const BACKEND_DOMAIN = process.env.NEXT_PUBLIC_BACKEND_DOMAIN || "http://localhost:5001";
  const res = await fetch(`${BACKEND_DOMAIN}/api/home/data`, { next: { revalidate: 60 } });
  const apiData = await res.json();
  if (!apiData.success) throw new Error("Failed to fetch home data");
  const data = apiData.data;
  // Xử lý dữ liệu tương tự homeService
  const combinedNews = [ ...(data.featuredNews || []), ...(data.regularNews || []) ];
  return {
    hero: {
      title: data.hero?.title || "WELCOME TO SAIGON 3 JEAN",
      subtitle: data.hero?.subtitle || "Leading garment manufacturer in Vietnam",
      backgroundImage: data.hero?.backgroundImage || "/images/home_banner-section2.jpg",
      videoUrl: data.hero?.videoUrl || "",
      isActive: data.hero?.isActive !== false,
    },
    sections: (data.sections || []).sort((a: any, b: any) => (a.order || 0) - (b.order || 0)).map((section: any) => ({
      title: section.title || "",
      content: section.content || "",
      mediaType: section.mediaType || "image",
      mediaUrl: section.mediaUrl || "/images/home_banner-section2.jpg",
      buttonText: section.buttonText || "LEARN MORE",
      buttonLink: section.buttonLink || "#",
      backgroundColor: section.backgroundColor || "#007bff",
      order: section.order || 0,
    })),
    customers: {
      denimWoven: (data.customers?.denimWoven || []).sort((a: any, b: any) => (a.order || 0) - (b.order || 0)),
      knit: (data.customers?.knit || []).sort((a: any, b: any) => (a.order || 0) - (b.order || 0)),
    },
    certifications: (data.certifications || []).sort((a: any, b: any) => (a.order || 0) - (b.order || 0)),
    featuredNews: combinedNews,
  };
}

export default async function HomePage() {
  let homeData = null;
  try {
    homeData = await fetchHomeData();
  } catch {
    // fallback nếu API lỗi
    homeData = null;
  }
  return (
    <>
      {/* Header */}
      <Header />

      {/* Home */}
      <Home homeData={homeData} />

      {/* Footer */}
      <Footer />
    </>
  );
}
