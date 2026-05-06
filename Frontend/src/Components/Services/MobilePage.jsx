import ServicePageTemplate from "./ServicePageTemplate.jsx";
import { servicePageData } from "./servicePageData.js";

function MobilePage() {
  return <ServicePageTemplate service={servicePageData.mobile} />;
}

export default MobilePage;
