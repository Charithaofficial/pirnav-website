import ServicePageTemplate from "./ServicePageTemplate.jsx";
import { servicePageData } from "./servicePageData.js";

function DataScience() {
  return <ServicePageTemplate service={servicePageData.dataScience} />;
}

export default DataScience;
