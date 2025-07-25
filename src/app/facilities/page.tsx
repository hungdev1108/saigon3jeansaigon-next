import Footer from "@/components/footer";
import Header from "@/components/header";
import Facilities from "@/components/pages/facilities";
import facilitiesService from "@/services/facilitiesService";
import { BACKEND_DOMAIN } from '@/api/config';

export const dynamic = "force-dynamic";

export default async function FacilitiesPage() {
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
