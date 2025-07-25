import Footer from "@/components/footer";
import Header from "@/components/header";
import Recruitment from "@/components/pages/recruitment";
import { BACKEND_DOMAIN } from '@/api/config';
export const dynamic = "force-dynamic";

export default async function RecruitmentPage() {
  let jobs = [];
  let contactHr = null;
  let contactInfo = null;
  
  try {
    const res = await fetch(`${BACKEND_DOMAIN}/api/careers/data`, { cache: 'no-store' });
    const apiData = await res.json();
    if (apiData.success) {
      const recruitmentData = apiData.data;
      jobs = recruitmentData.jobs || [];
      contactInfo = recruitmentData.companyInfo;
      contactHr = recruitmentData.contactHR;
    }
  } catch (error) {
    console.error('Failed to fetch recruitment data:', error);
  }
  
  return (
    <>
      {/* Header */}
      <Header />
    
      {/* Recruitment */}
      <Recruitment jobs={jobs} contactHr={contactHr} contactInfo={contactInfo} />
    
      {/* Footer */}
      <Footer />
    </>
  )
}