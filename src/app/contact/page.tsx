import Footer from "@/components/footer";
import Header from "@/components/header";
import Contact from "@/components/pages/contact";
import { BACKEND_DOMAIN } from '@/api/config';

export const dynamic = "force-dynamic";

async function fetchContactInfo() {
  const res = await fetch(`${BACKEND_DOMAIN}/api/contact/data`, { cache: 'no-store' });
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