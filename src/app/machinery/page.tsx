import Footer from "@/components/footer";
import Header from "@/components/header";
import Machinery from "@/components/pages/machinery";
import { BACKEND_DOMAIN } from '@/api/config';

export const dynamic = "force-dynamic";

async function fetchMachineryData() {
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
