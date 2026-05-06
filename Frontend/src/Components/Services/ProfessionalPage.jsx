import ServicePageTemplate from "./ServicePageTemplate.jsx";
import { servicePageData } from "./servicePageData.js";

function ProfessionalPage() {
  return <ServicePageTemplate service={servicePageData.professional} />;
}

export default ProfessionalPage;
