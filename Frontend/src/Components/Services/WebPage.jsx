import ServicePageTemplate from "./ServicePageTemplate.jsx";
import { servicePageData } from "./servicePageData.js";

function WebPage() {
  return <ServicePageTemplate service={servicePageData.web} />;
}

export default WebPage;
