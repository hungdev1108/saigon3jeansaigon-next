import Footer from "@/components/footer";
import Header from "@/components/header";
import Recruitment from "@/components/pages/recruitment";
import recruitmentService from "@/services/recruitmentService";

export const dynamic = "force-static";

export default async function RecruitmentPage() {
  let jobs = [];
  let contactHr = null;
  let contactInfo = null;
  try {
    const data = await recruitmentService.getCompleteRecruitmentData();
    const recruitmentData = data.data;
    jobs = recruitmentData.jobs || [];
    contactInfo = recruitmentData.companyInfo;
    contactHr = recruitmentData.contactHR;
  } catch {
    // fallback từng phần nếu API lỗi
    try {
      const jobsRes = await recruitmentService.getAllJobs();
      jobs = Array.isArray(jobsRes.data) ? jobsRes.data : [];
    } catch {}
    try {
      const hrRes = await recruitmentService.getContactHR();
      contactHr = hrRes.data;
    } catch {}
    try {
      const infoRes = await recruitmentService.getCompanyInfo();
      contactInfo = infoRes.data;
    } catch {}
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