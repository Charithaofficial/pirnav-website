import {
  FaBolt,
  FaBrain,
  FaBug,
  FaChartBar,
  FaChartLine,
  FaCheckCircle,
  FaClipboardCheck,
  FaCloud,
  FaCogs,
  FaCode,
  FaCubes,
  FaDatabase,
  FaEye,
  FaFlask,
  FaGlobe,
  FaHandshake,
  FaLightbulb,
  FaLock,
  FaMobileAlt,
  FaNetworkWired,
  FaProjectDiagram,
  FaRocket,
  FaRobot,
  FaServer,
  FaShieldAlt,
  FaSyncAlt,
  FaTools,
  FaUserLock,
  FaUsers,
  FaUserTie,
} from "react-icons/fa";
import {
  MdBuild,
  MdOutlineAccessTime,
  MdSecurity,
  MdSpeed,
  MdSync,
} from "react-icons/md";

export const servicePageData = {
  application: {
    title: "Application Development Services",
    breadcrumbLabel: "Application Development",
    description:
      "Design, build, and modernize secure business applications with architectures that support scale, integration, and long-term maintainability.",
    descriptionParagraphs: [
      "Our application development services help organizations transform operational requirements into reliable digital platforms. We plan each solution around business workflows, user needs, integration points, and measurable outcomes so the final product is practical, maintainable, and ready for enterprise use.",
      "We deliver custom web applications, cloud-native platforms, API-driven systems, workflow automation, and modernization programs using technologies such as React, Angular, .NET, Spring Boot, Node.js, PostgreSQL, Docker, and Kubernetes. Every build is shaped with clean architecture, secure data handling, performance tuning, and release practices that support continuous improvement.",
      "Whether you need a new product, an internal business system, or modernization of a legacy application, our teams focus on scalability, security, and long-term value. The result is software that improves productivity, connects systems more effectively, and gives your business a dependable foundation for growth.",
    ],
    image: {
      src: "/images/Application.png",
      alt: "Application development services",
    },
    overviewCards: [
      {
        title: "Key Capabilities",
        items: [
          { text: "Application architecture and platform design", icon: FaCubes },
          { text: "Cloud-native product engineering", icon: FaCloud },
          { text: "API design and systems integration", icon: FaProjectDiagram },
          { text: "Microservices and modular application delivery", icon: FaCogs },
          { text: "DevOps-enabled release management", icon: FaRocket },
        ],
      },
      {
        title: "Business Benefits",
        items: [
          { text: "Improved scalability and performance", icon: MdSpeed },
          { text: "Faster time-to-market", icon: MdOutlineAccessTime },
          { text: "High system reliability", icon: MdSecurity },
          { text: "Better integration across platforms", icon: MdSync },
          { text: "Long-term maintainability", icon: MdBuild },
        ],
      },
    ],
    technologies: [
      "React",
      ".NET",
      "Node.js",
      "PostgreSQL",
    ],
  },
  testing: {
    title: "Testing & Automation Services",
    breadcrumbLabel: "Testing & Automation",
    description:
      "Ensure software quality with automation frameworks, continuous testing, and performance validation aligned to modern enterprise delivery.",
    descriptionParagraphs: [
      "Our testing and automation services are designed to improve release confidence while reducing the cost and risk of manual validation. We build quality strategies that align with product complexity, delivery cadence, compliance needs, and the business impact of defects.",
      "We cover functional testing, regression automation, API validation, performance testing, load testing, and CI/CD quality gates using tools such as Selenium, Cypress, Playwright, Postman, JMeter, JUnit, Azure DevOps, and TestNG. Test suites are structured for maintainability, reliable reporting, and fast feedback across development and release cycles.",
      "By combining automation engineering with clear quality governance, we help teams detect issues earlier, accelerate releases, and protect customer experience. This creates a stronger delivery pipeline where software changes can move faster without sacrificing stability, reliability, or production readiness.",
    ],
    image: {
      src: "/images/team-work.jpg",
      alt: "Testing and automation team collaboration",
    },
    overviewCards: [
      {
        title: "Key Capabilities",
        items: [
          { text: "UI, API, and regression test automation", icon: FaProjectDiagram },
          { text: "Continuous testing in CI/CD pipelines", icon: FaCloud },
          { text: "API validation and contract testing", icon: FaCode },
          { text: "Performance, load, and reliability testing", icon: FaCogs },
          { text: "Test reporting and release readiness support", icon: FaRocket },
        ],
      },
      {
        title: "Business Benefits",
        items: [
          { text: "Better release confidence", icon: FaChartLine },
          { text: "Faster feedback cycles", icon: MdOutlineAccessTime },
          { text: "Higher product reliability", icon: FaShieldAlt },
          { text: "Lower regression risk", icon: FaSyncAlt },
          { text: "Repeatable quality processes", icon: FaTools },
        ],
      },
    ],
    technologies: [
      "Selenium",
      "Playwright",
      "Postman",
      "JMeter",
    ],
  },
  maintenance: {
    title: "Maintenance & Support Services",
    breadcrumbLabel: "Maintenance & Support",
    description:
      "We keep long-running enterprise systems healthy with structured support operations, proactive monitoring, and targeted enhancement work.",
    descriptionParagraphs: [
      "Our maintenance and support services help businesses keep critical applications available, secure, and responsive after launch. We provide structured operational support that reduces disruption, improves issue visibility, and keeps systems aligned with changing business needs.",
      "Support coverage includes L2 and L3 troubleshooting, incident management, monitoring, performance tuning, minor enhancements, SLA reporting, release support, and production health reviews. We work with platforms such as ServiceNow, Jira, Azure Monitor, AWS CloudWatch, Grafana, Kibana, SQL Server, and Linux to maintain strong operational control.",
      "The goal is to extend the life and value of your technology investments. With proactive monitoring, disciplined support processes, and continuous improvement, we help organizations improve uptime, reduce recurring issues, and deliver a smoother experience for users and stakeholders.",
    ],
    image: {
      src: "/images/maintainance.png",
      alt: "Maintenance and support services",
    },
    overviewCards: [
      {
        title: "Key Capabilities",
        items: [
          { text: "L2 and L3 application support", icon: FaTools },
          { text: "Monitoring and incident management", icon: FaBug },
          { text: "Performance tuning and optimization", icon: FaChartLine },
          { text: "Enhancement backlog execution", icon: FaServer },
          { text: "Operational reporting and SLA tracking", icon: FaShieldAlt },
        ],
      },
      {
        title: "Business Benefits",
        items: [
          { text: "Improved uptime and service continuity", icon: FaRocket },
          { text: "Lower operational disruption", icon: FaShieldAlt },
          { text: "Better user satisfaction", icon: FaUsers },
          { text: "Reduced support response time", icon: MdOutlineAccessTime },
          { text: "Healthier cloud and infrastructure operations", icon: FaCloud },
        ],
      },
    ],
    technologiesTitle: "Platforms and technologies we use in delivery.",
    technologiesDescription:
      "Technology choices are aligned to operational resilience, integration needs, and long-term supportability.",
    technologies: [
      "ServiceNow",
      "Azure Monitor",
      "Jira",
      "Grafana",
    ],
  },
  web: {
    title: "Web Development Services",
    breadcrumbLabel: "Web Development",
    description:
      "Create responsive digital products and enterprise web platforms with modern frontend architecture, strong UX, and scalable integrations.",
    descriptionParagraphs: [
      "Our web development services help companies build fast, accessible, and business-ready digital experiences. We focus on websites, portals, dashboards, and web applications that are easy to use, simple to manage, and designed around real customer or employee journeys.",
      "We create responsive frontends, design-system based interfaces, CMS integrations, API-connected applications, and performance-optimized web platforms using React, TypeScript, Next.js, Node.js, REST APIs, Tailwind CSS, Figma, and WordPress. Every implementation is reviewed for usability, browser behavior, mobile responsiveness, and long-term maintainability.",
      "A strong web platform improves brand credibility, conversion, internal efficiency, and customer engagement. Our approach balances visual polish with technical quality so your web presence stays scalable, secure, and ready to support new content, workflows, and digital services.",
    ],
    image: {
      src: "/images/web.jpg",
      alt: "Web development services",
    },
    overviewCards: [
      {
        title: "Key Capabilities",
        items: [
          { text: "Frontend architecture and design systems", icon: FaCode },
          { text: "Responsive enterprise web applications", icon: FaMobileAlt },
          { text: "CMS and API integrations", icon: FaCogs },
          { text: "Performance optimization across devices", icon: FaRocket },
          { text: "Accessibility and usability improvements", icon: FaShieldAlt },
        ],
      },
      {
        title: "Business Benefits",
        items: [
          { text: "Stronger digital user experiences", icon: FaChartLine },
          { text: "Better frontend performance", icon: FaRocket },
          { text: "Scalable web platform foundations", icon: FaCogs },
          { text: "Improved conversion and usability", icon: FaMobileAlt },
        ],
      },
    ],
    technologiesDescription:
      "Technology choices aligned to business needs, integration, and long-term scalability.",
    technologies: [
      "React",
      "TypeScript",
      "Next.js",
      "Tailwind CSS",
    ],
  },
  mobile: {
    title: "Mobile App Development Services",
    breadcrumbLabel: "Mobile App Development",
    description:
      "Build polished mobile experiences that connect users, business operations, and backend systems through secure, API-first product delivery.",
    descriptionParagraphs: [
      "Our mobile app development services help businesses deliver reliable digital experiences directly to customers, field teams, partners, and employees. We design mobile solutions around speed, usability, secure access, and real-world workflows so users can complete tasks with less friction.",
      "We build cross-platform and native applications using React Native, Flutter, Swift, Kotlin, Firebase, SQLite, REST APIs, and App Center. Our delivery includes mobile UI development, backend integration, authentication, analytics instrumentation, performance optimization, testing, release support, and lifecycle enhancements.",
      "From customer-facing apps to enterprise mobility tools, we prioritize stability, data protection, and consistent performance across devices. The result is a mobile product that increases engagement, improves operational connectivity, and supports future feature growth without reworking the foundation.",
    ],
    image: {
      src: "/images/Mobile.jpg",
      alt: "Mobile app development services",
    },
    overviewCards: [
      {
        title: "Key Capabilities",
        items: [
          { text: "Cross-platform and native mobile delivery", icon: FaMobileAlt },
          { text: "Mobile backend and authentication integration", icon: FaServer },
          { text: "Analytics and performance instrumentation", icon: FaChartLine },
          { text: "App lifecycle support and enhancement", icon: FaTools },
          { text: "UX optimization for mobile workflows", icon: FaUsers },
        ],
      },
      {
        title: "Business Benefits",
        items: [
          { text: "Higher user adoption", icon: FaRocket },
          { text: "Reliable mobile release pipelines", icon: FaSyncAlt },
          { text: "Consistent cross-platform experiences", icon: FaMobileAlt },
          { text: "Improved operational connectivity", icon: FaNetworkWired },
        ],
      },
    ],
    technologies: [
      "React Native",
      "Flutter",
      "Swift",
      "Kotlin",
    ],
  },
  sap: {
    title: "SAP Solutions",
    breadcrumbLabel: "SAP Solutions",
    eyebrow: "Enterprise Platform Service",
    description:
      "Support enterprise operations with SAP implementation, enhancement, and integration services grounded in process efficiency and business alignment.",
    descriptionParagraphs: [
      "Our SAP solutions help enterprises improve process consistency, system adoption, and operational visibility across core business functions. We support SAP initiatives with a practical understanding of enterprise workflows, change management, integration needs, and long-term platform governance.",
      "Services include implementation support, rollout assistance, module enhancement, ABAP development, SAP Fiori experiences, SAP Basis support, SAP BTP enablement, integration planning, analytics alignment, and operational improvements across SAP S/4HANA, SAP Integration Suite, SAP BW/4HANA, and connected reporting platforms.",
      "We help clients reduce implementation risk, streamline business processes, and make SAP environments easier to operate and evolve. Each engagement is focused on measurable business outcomes, from faster transaction cycles and better reporting to improved compliance and stronger enterprise scalability.",
    ],
    image: {
      src: "/images/sap.png",
      alt: "SAP solutions",
    },
    overviewCards: [
      {
        title: "Key Capabilities",
        items: [
          { text: "SAP implementation and rollout support", icon: FaCogs },
          { text: "Module customization and enhancement", icon: FaTools },
          { text: "Process analysis and optimization", icon: FaChartLine },
          { text: "Enterprise integration planning", icon: FaProjectDiagram },
          { text: "Operational support and improvement", icon: FaDatabase },
        ],
      },
      {
        title: "Business Benefits",
        items: [
          { text: "Improved process consistency", icon: FaCheckCircle },
          { text: "Better system adoption", icon: FaRocket },
          { text: "Operational efficiency gains", icon: FaChartLine },
          { text: "Lower implementation risk", icon: FaShieldAlt },
        ],
      },
    ],
    technologies: [
      "SAP S/4HANA",
      "SAP Fiori",
      "ABAP",
      "SAP BTP",
    ],
  },
  oracle: {
    title: "Oracle Solutions",
    breadcrumbLabel: "Oracle Solutions",
    eyebrow: "Enterprise Platform Service",
    description:
      "Modernize Oracle platforms with services spanning enterprise applications, databases, performance optimization, and transformation planning.",
    descriptionParagraphs: [
      "Our Oracle solutions support businesses that depend on Oracle applications, databases, and data platforms for mission-critical operations. We help stabilize, optimize, and modernize Oracle environments while keeping business continuity and data integrity at the center of every engagement.",
      "Our capabilities include Oracle application support, database administration, PL/SQL development, performance tuning, Oracle Cloud Infrastructure planning, Oracle EBS support, Oracle APEX development, Fusion support, RAC reliability improvements, and enterprise integration using Oracle Data Integrator and related tools.",
      "With a focus on performance, governance, and modernization readiness, we help organizations reduce operational risk and improve platform value. Clients gain clearer roadmaps, stronger data reliability, faster systems, and a more scalable foundation for enterprise transformation.",
    ],
    image: {
      src: "/images/Oracle.png",
      alt: "Oracle solutions",
    },
    overviewCards: [
      {
        title: "Key Capabilities",
        items: [
          { text: "Oracle application support and enhancement", icon: FaTools },
          { text: "Database administration and tuning", icon: FaDatabase },
          { text: "Modernization and migration planning", icon: FaChartLine },
          { text: "Governance and reliability improvements", icon: FaProjectDiagram },
          { text: "Integration across enterprise systems", icon: FaCogs },
        ],
      },
      {
        title: "Business Benefits",
        items: [
          { text: "Better data performance", icon: FaCheckCircle },
          { text: "Lower operational risk", icon: FaShieldAlt },
          { text: "Improved system reliability", icon: FaChartLine },
          { text: "Clear modernization roadmaps", icon: FaRocket },
        ],
      },
    ],
    technologies: [
      "Oracle Database",
      "PL/SQL",
      "Oracle Cloud Infrastructure",
      "Oracle APEX",
    ],
  },
  microsoft: {
    title: "Microsoft Solutions",
    breadcrumbLabel: "Microsoft Solutions",
    eyebrow: "Enterprise Platform Service",
    description:
      "Deliver Microsoft ecosystem solutions across cloud, collaboration, productivity, and enterprise modernization initiatives.",
    descriptionParagraphs: [
      "Our Microsoft solutions help organizations modernize technology operations through secure cloud platforms, collaboration tools, productivity systems, and enterprise applications. We align Microsoft capabilities with business priorities so teams can work smarter, scale faster, and govern technology more effectively.",
      "We support Azure architecture, migration planning, Microsoft 365 enablement, SharePoint solutions, Teams collaboration, Power Platform automation, Dynamics 365 initiatives, Entra ID identity management, and Azure DevOps delivery practices. Implementations are planned with security, compliance, integration, and adoption in mind.",
      "By combining cloud engineering with practical business enablement, we help clients improve collaboration, reduce manual work, and strengthen platform reliability. The outcome is a Microsoft environment that supports modern operations, secure access, and continued digital growth.",
    ],
    image: {
      src: "/images/Microsoft.png",
      alt: "Microsoft solutions",
    },
    overviewCards: [
      {
        title: "Key Capabilities",
        items: [
          { text: "Azure architecture and migration support", icon: FaCloud },
          { text: "Collaboration and productivity solutions", icon: FaUsers },
          { text: "Integration across Microsoft platforms", icon: FaProjectDiagram },
          { text: "Cloud operations and governance", icon: FaCogs },
          { text: "Platform modernization programs", icon: FaRocket },
        ],
      },
      {
        title: "Business Benefits",
        items: [
          { text: "Improved cloud maturity", icon: FaCheckCircle },
          { text: "Stronger team collaboration", icon: FaUsers },
          { text: "Operational consistency", icon: FaChartLine },
          { text: "Better platform scalability", icon: FaShieldAlt },
        ],
      },
    ],
    technologies: [
      "Azure",
      "Microsoft 365",
      "Power Platform",
      "Dynamics 365",
    ],
  },
  cyber: {
    title: "Cybersecurity Services",
    breadcrumbLabel: "Cybersecurity",
    description:
      "Protect critical platforms with cybersecurity services that strengthen applications, cloud environments, identities, and operational controls.",
    descriptionParagraphs: [
      "Our cybersecurity services help organizations identify risk, strengthen defenses, and protect critical business systems from evolving threats. We approach security as an operating discipline that connects people, processes, applications, infrastructure, and cloud platforms.",
      "Services include security posture assessments, identity and access design, cloud security governance, application security reviews, threat monitoring, compliance readiness, and operational control improvements. We work with technologies such as Microsoft Defender, CrowdStrike, Okta, AWS Security Hub, Microsoft Sentinel, Splunk, Palo Alto Prisma Cloud, and IAM platforms.",
      "The business value is stronger resilience, better visibility, and reduced exposure across digital environments. Our client-focused approach helps teams prioritize practical security improvements that support compliance, protect sensitive data, and maintain trust with customers and partners.",
    ],
    image: {
      src: "/images/cyber.png",
      alt: "Cybersecurity services",
    },
    overviewCards: [
      {
        title: "Key Capabilities",
        items: [
          { text: "Security posture assessments", icon: FaShieldAlt },
          { text: "Identity and access design", icon: FaUserLock },
          { text: "Threat monitoring", icon: FaBug },
          { text: "Cloud security governance", icon: FaCloud },
          { text: "Compliance readiness", icon: FaClipboardCheck },
        ],
      },
      {
        title: "Business Benefits",
        items: [
          { text: "Reduced security risk", icon: FaLock },
          { text: "Stronger protection", icon: FaGlobe },
          { text: "Compliance readiness", icon: FaCheckCircle },
          { text: "Better visibility", icon: FaEye },
        ],
      },
    ],
    technologiesDescription:
      "Technology choices aligned to business context and long-term maintainability.",
    technologies: [
      "Microsoft Defender",
      "CrowdStrike",
      "Okta",
      "Microsoft Sentinel",
    ],
  },
  aiml: {
    title: "AI / MLOps Services",
    breadcrumbLabel: "AI / MLOps",
    description:
      "Operationalize AI initiatives with MLOps practices that support scalable deployment, monitoring, governance, and measurable impact.",
    descriptionParagraphs: [
      "Our AI and MLOps services help organizations move from experimental models to governed, production-ready AI solutions. We focus on practical use cases, reliable data pipelines, model lifecycle management, and measurable business outcomes rather than isolated prototypes.",
      "We support model training workflows, feature engineering, deployment pipelines, data integration, performance monitoring, reproducibility, and governance using Python, MLflow, Kubeflow, Docker, Kubernetes, Databricks, AWS SageMaker, and Azure Machine Learning. Solutions are designed to operate consistently across environments with clear monitoring and rollback paths.",
      "With scalable AI operations, businesses can improve decision-making, automate complex workflows, and turn data assets into repeatable value. Our approach balances innovation with security, observability, and responsible delivery so AI initiatives remain trustworthy and sustainable.",
    ],
    image: {
      src: "/images/ai-ml.png",
      alt: "AI and MLOps services",
    },
    overviewCards: [
      {
        title: "Key Capabilities",
        items: [
          { text: "Model training and deployment workflows", icon: FaBrain },
          { text: "Feature engineering pipelines", icon: FaRobot },
          { text: "Performance monitoring", icon: FaChartLine },
          { text: "Data pipeline integration", icon: FaDatabase },
          { text: "Governance and reproducibility", icon: FaCogs },
        ],
      },
      {
        title: "Business Benefits",
        items: [
          { text: "Faster production deployment", icon: FaBolt },
          { text: "Better model confidence", icon: FaLightbulb },
          { text: "Improved observability", icon: FaProjectDiagram },
          { text: "Scalable AI operations", icon: FaEye },
        ],
      },
    ],
    technologiesDescription:
      "Technology choices aligned to business context, integration needs, and long-term maintainability.",
    technologies: [
      "Python",
      "MLflow",
      "Kubeflow",
      "AWS SageMaker",
    ],
  },
  dataScience: {
    title: "Data Science Services",
    breadcrumbLabel: "Data Science",
    description:
      "Use data science to uncover insights, improve forecasting, and build analytical models for business decisions.",
    descriptionParagraphs: [
      "Our data science services help organizations convert raw data into actionable intelligence for strategy, operations, customer experience, and forecasting. We work with business teams to define the right questions, prepare usable datasets, and build analytical models that support better decisions.",
      "Capabilities include exploratory data analysis, statistical modeling, forecasting, predictive analytics, segmentation, dashboard storytelling, and analytical framework design using Python, Pandas, NumPy, Scikit-learn, Jupyter, SQL, Power BI, and Apache Spark. We focus on transparent, explainable outputs that business stakeholders can trust.",
      "Strong data science improves planning accuracy, identifies opportunities, reduces uncertainty, and helps teams act faster. Our solutions are designed for scalability, repeatability, and clear communication so insights can move beyond reports and become part of day-to-day decision-making.",
    ],
    image: {
      src: "/images/data-science.png",
      alt: "Data science services",
    },
    overviewCards: [
      {
        title: "Key Capabilities",
        items: [
          { text: "Exploratory data analysis", icon: FaChartLine },
          { text: "Forecasting and statistical modeling", icon: FaFlask },
          { text: "Predictive modeling", icon: FaBrain },
          { text: "Data storytelling dashboards", icon: FaDatabase },
          { text: "Analytical frameworks", icon: FaProjectDiagram },
        ],
      },
      {
        title: "Business Benefits",
        items: [
          { text: "Actionable insights", icon: FaLightbulb },
          { text: "Better forecasting", icon: FaChartBar },
          { text: "Strong decision support", icon: FaUsers },
          { text: "Efficient data usage", icon: FaServer },
        ],
      },
    ],
    technologiesDescription:
      "Technology choices aligned to business context and scalability.",
    technologies: [
      "Python",
      "Pandas",
      "Scikit-learn",
      "Power BI",
    ],
  },
  professional: {
    title: "Professional Services",
    breadcrumbLabel: "Professional Services",
    eyebrow: "Delivery Enablement Service",
    description:
      "Scale execution with consulting, staff augmentation, and leadership hiring models aligned to enterprise delivery needs and growth priorities.",
    descriptionParagraphs: [
      "Our professional services help organizations access the expertise, delivery capacity, and advisory support needed to move technology programs forward. We work as a flexible partner for businesses that need specialized talent, structured consulting, or stronger execution capability.",
      "Services include technology consulting, solution architecture guidance, project management, business analysis, staff augmentation, leadership hiring, capability planning, and flexible engagement models across cloud, SAP, Oracle, data platforms, application development, and enterprise delivery programs.",
      "By aligning people, process, and technology needs, we help clients reduce hiring delays, increase delivery speed, and improve program outcomes. Our approach is practical, transparent, and client-focused, giving teams the right support at the right time without adding unnecessary complexity.",
    ],
    image: {
      src: "/images/Service.jpg",
      alt: "Professional services",
    },
    overviewCards: [
      {
        title: "Key Capabilities",
        items: [
          { text: "Technology consulting and advisory support", icon: FaUserTie },
          { text: "Staff augmentation for delivery programs", icon: FaUsers },
          { text: "Leadership hiring and talent solutions", icon: FaLightbulb },
          { text: "Flexible engagement models", icon: FaProjectDiagram },
          { text: "Capability planning around business demand", icon: FaChartLine },
        ],
      },
      {
        title: "Business Benefits",
        items: [
          { text: "Faster access to specialized talent", icon: FaCheckCircle },
          { text: "Greater delivery flexibility", icon: FaRocket },
          { text: "Improved execution capacity", icon: FaChartLine },
          { text: "Better alignment across teams", icon: FaHandshake },
        ],
      },
    ],
    technologies: [
      "Jira",
      "Azure DevOps",
      "ServiceNow",
      "Microsoft Project",
    ],
  },
};
