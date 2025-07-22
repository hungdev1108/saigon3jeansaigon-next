import Footer from "@/components/footer";
import Header from "@/components/header";
import Facilities from "@/components/pages/facilities";
import facilitiesService from "@/services/facilitiesService";

export const dynamic = "force-static";

export default async function FacilitiesPage() {
  const facilitiesData = await facilitiesService.getCompleteFacilitiesData();
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
