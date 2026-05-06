import ServicePageTemplate from "./ServicePageTemplate.jsx";
import { servicePageData } from "./servicePageData.js";

function Microsoft() {
  return <ServicePageTemplate service={servicePageData.microsoft} />;
}

export default Microsoft;
