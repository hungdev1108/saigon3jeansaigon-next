import Footer from "@/components/footer";
import Header from "@/components/header";
import EcoFriendly from "@/components/pages/eco-friendly";

export const dynamic = "force-static";

async function fetchEcoFriendlyData() {
  const BACKEND_DOMAIN = process.env.NEXT_PUBLIC_BACKEND_DOMAIN || "http://localhost:5001";
  const res = await fetch(`${BACKEND_DOMAIN}/api/eco-friendly/data`, { next: { revalidate: 60 } });
  const apiData = await res.json();
  if (!apiData.success) throw new Error("Failed to fetch eco-friendly data");
  return apiData.data || null;
}

export default async function EcoFriendlyPage() {
  let ecoFriendlyData = null;
  try {
    ecoFriendlyData = await fetchEcoFriendlyData();
  } catch {
    ecoFriendlyData = null;
  }
  return (
    <>
      <Header />
      <EcoFriendly ecoFriendlyData={ecoFriendlyData} />
      <Footer />
    </>
  );
}