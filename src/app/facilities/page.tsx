import Footer from "@/components/footer";
import Header from "@/components/header";
import Facilities from "@/components/pages/facilities";
import facilitiesService from "@/services/facilitiesService";

export const dynamic = "force-static";

export default async function FacilitiesPage() {
  const BACKEND_DOMAIN = process.env.NEXT_PUBLIC_BACKEND_DOMAIN || "http://localhost:5001";
  const res = await fetch(`${BACKEND_DOMAIN}/api/facilities/data`, { cache: 'no-store' });
  const apiData = await res.json();
  const facilitiesData = apiData.success ? apiData.data : null;
  return (
    <>
      {/* Header */}
      <Header />

      {/* Facilities */}
      <Facilities facilitiesData={facilitiesData} />

      {/* Footer */}
      <Footer />
    </>
  );
}
