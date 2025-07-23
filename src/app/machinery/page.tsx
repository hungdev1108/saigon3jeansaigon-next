import Footer from "@/components/footer";
import Header from "@/components/header";
import Machinery from "@/components/pages/machinery";

export const dynamic = "force-static";

async function fetchMachineryData() {
  const BACKEND_DOMAIN = process.env.NEXT_PUBLIC_BACKEND_DOMAIN;
  const res = await fetch(`${BACKEND_DOMAIN}/api/machinery/data`, { cache: 'no-store' });
  const apiData = await res.json();
  if (!apiData.success) throw new Error("Failed to fetch machinery data");
  return apiData.data || null;
}

export default async function MachineryPage() {
  let machineryData = null;
  try {
    machineryData = await fetchMachineryData();
  } catch {
    machineryData = null;
  }
  return (
    <>
      {/* Header */}
      <Header />

      {/* Machinery */}
      <Machinery machineryData={machineryData} />

      {/* Footer */}
      <Footer />
    </>
  );
}
