import ServicePageTemplate from "./ServicePageTemplate.jsx";
import { servicePageData } from "./servicePageData.js";

function Application() {
  return <ServicePageTemplate service={servicePageData.application} />;
}

export default Application;
