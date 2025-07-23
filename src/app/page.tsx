import Footer from "@/components/footer";
import Header from "@/components/header";
import Home from "@/components/pages/home";
import { BACKEND_DOMAIN } from '@/api/config';
// Type definitions (copy từ Home component)
interface HeroData {
  title: string;
  subtitle?: string;
  backgroundImage: string;
  videoUrl: string;
  isActive: boolean;
}

interface SectionData {
  title: string;
  content: string;
  mediaType: string;
  mediaUrl: string;
  buttonText: string;
  buttonLink: string;
  backgroundColor: string;
  order: number;
}

interface CustomerData {
  name: string;
  logo: string;
  website: string;
  order: number;
}

interface CertificationData {
  name: string;
  description: string;
  image: string;
  category: string;
  order: number;
  issuedDate?: string | null;
}

interface NewsData {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  publishDate: string;
  slug: string;
  tags: string[];
  author: string;
}

export const dynamic = "force-static";

async function fetchHomeData() {
  const res = await fetch(`${BACKEND_DOMAIN}/api/home/data`, { cache: 'no-store' });
  const apiData = await res.json();
  if (!apiData.success) throw new Error("Failed to fetch home data");
  const data = apiData.data;
  
  // Bỏ dòng gộp tin tức
  // const combinedNews = [ ...(data.featuredNews || []), ...(data.regularNews || []) ];
  
  return {
    hero: {
      title: data.hero?.title || "WELCOME TO SAIGON 3 JEAN",
      subtitle: data.hero?.subtitle || "Leading garment manufacturer in Vietnam",
      backgroundImage: data.hero?.backgroundImage || "/images/home_banner-section2.jpg",
      videoUrl: data.hero?.videoUrl || "",
      isActive: data.hero?.isActive !== false,
    } as HeroData,
    sections: (data.sections || []).sort((a: SectionData, b: SectionData) => (a.order || 0) - (b.order || 0)).map((section: SectionData) => ({
      title: section.title || "",
      content: section.content || "",
      mediaType: section.mediaType || "image",
      mediaUrl: section.mediaUrl || "/images/home_banner-section2.jpg",
      buttonText: section.buttonText || "LEARN MORE",
      buttonLink: section.buttonLink || "#",
      backgroundColor: section.backgroundColor || "#007bff",
      order: section.order || 0,
    })) as SectionData[],
    customers: {
      denimWoven: (data.customers?.denimWoven || []).sort((a: CustomerData, b: CustomerData) => (a.order || 0) - (b.order || 0)),
      knit: (data.customers?.knit || []).sort((a: CustomerData, b: CustomerData) => (a.order || 0) - (b.order || 0)),
    },
    certifications: (data.certifications || []).sort((a: CertificationData, b: CertificationData) => (a.order || 0) - (b.order || 0)),
    // Giữ nguyên cấu trúc tin tức từ API
    featuredNews: (data.featuredNews || []) as NewsData[],
    regularNews: (data.regularNews || []) as NewsData[],
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
