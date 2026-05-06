import ServicePageTemplate from "./ServicePageTemplate.jsx";
import { servicePageData } from "./servicePageData.js";

function Oracle() {
  return <ServicePageTemplate service={servicePageData.oracle} />;
}

export default Oracle;
