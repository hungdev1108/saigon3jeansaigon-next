import Footer from "@/components/footer";
import Header from "@/components/header";
import Contact from "@/components/pages/contact";

export const dynamic = "force-static";

async function fetchContactInfo() {
  const BACKEND_DOMAIN = process.env.NEXT_PUBLIC_BACKEND_DOMAIN || "http://localhost:5001";
  const res = await fetch(`${BACKEND_DOMAIN}/api/contact/data`, { next: { revalidate: 60 } });
  const apiData = await res.json();
  if (!apiData.success) throw new Error("Failed to fetch contact data");
  // Lấy contactInfo từ response
  return apiData.contactInfo || null;
}

export default async function ContactPage() {
  let contactInfo = null;
  try {
    contactInfo = await fetchContactInfo();
  } catch {
    contactInfo = null;
  }
  return (
    <>
      {/* Header */}
      <Header />
    
      {/* Contact */}
      <Contact contactInfo={contactInfo} />
    
      {/* Footer */}
      <Footer />
    </>
  );
}