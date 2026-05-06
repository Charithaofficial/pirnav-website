import ServicePageTemplate from "./ServicePageTemplate.jsx";
import { servicePageData } from "./servicePageData.js";

function SAP() {
  return <ServicePageTemplate service={servicePageData.sap} />;
}

export default SAP;
