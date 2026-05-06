import ServicePageTemplate from "./ServicePageTemplate.jsx";
import { servicePageData } from "./servicePageData.js";

function Maintainance() {
  return <ServicePageTemplate service={servicePageData.maintenance} />;
}

export default Maintainance;
