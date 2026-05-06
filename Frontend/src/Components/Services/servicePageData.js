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
      "Angular",
      ".NET",
      "Spring Boot",
      "Node.js",
      "PostgreSQL",
      "Docker",
      "Kubernetes",
    ],
  },
  testing: {
    title: "Testing & Automation Services",
    breadcrumbLabel: "Testing & Automation",
    description:
      "Ensure software quality with automation frameworks, continuous testing, and performance validation aligned to modern enterprise delivery.",
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
      "Cypress",
      "Playwright",
      "Postman",
      "JMeter",
      "JUnit",
      "Azure DevOps",
      "TestNG",
    ],
  },
  maintenance: {
    title: "Maintenance & Support Services",
    breadcrumbLabel: "Maintenance & Support",
    description:
      "We keep long-running enterprise systems healthy with structured support operations, proactive monitoring, and targeted enhancement work.",
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
      "AWS CloudWatch",
      "Jira",
      "Grafana",
      "Kibana",
      "SQL Server",
      "Linux",
    ],
  },
  web: {
    title: "Web Development Services",
    breadcrumbLabel: "Web Development",
    description:
      "Create responsive digital products and enterprise web platforms with modern frontend architecture, strong UX, and scalable integrations.",
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
      "Node.js",
      "REST APIs",
      "Tailwind CSS",
      "Figma",
      "WordPress",
    ],
  },
  mobile: {
    title: "Mobile App Development Services",
    breadcrumbLabel: "Mobile App Development",
    description:
      "Build polished mobile experiences that connect users, business operations, and backend systems through secure, API-first product delivery.",
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
      "Firebase",
      "SQLite",
      "REST APIs",
      "App Center",
    ],
  },
  sap: {
    title: "SAP Solutions",
    breadcrumbLabel: "SAP Solutions",
    eyebrow: "Enterprise Platform Service",
    description:
      "Support enterprise operations with SAP implementation, enhancement, and integration services grounded in process efficiency and business alignment.",
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
      "SAP Basis",
      "SAP Integration Suite",
      "SAP BW/4HANA",
      "Power BI",
    ],
  },
  oracle: {
    title: "Oracle Solutions",
    breadcrumbLabel: "Oracle Solutions",
    eyebrow: "Enterprise Platform Service",
    description:
      "Modernize Oracle platforms with services spanning enterprise applications, databases, performance optimization, and transformation planning.",
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
      "Oracle EBS",
      "Oracle APEX",
      "Oracle Fusion",
      "Oracle RAC",
      "Oracle Data Integrator",
    ],
  },
  microsoft: {
    title: "Microsoft Solutions",
    breadcrumbLabel: "Microsoft Solutions",
    eyebrow: "Enterprise Platform Service",
    description:
      "Deliver Microsoft ecosystem solutions across cloud, collaboration, productivity, and enterprise modernization initiatives.",
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
      "SharePoint",
      "Entra ID",
      "Teams",
      "Azure DevOps",
    ],
  },
  cyber: {
    title: "Cybersecurity Services",
    breadcrumbLabel: "Cybersecurity",
    description:
      "Protect critical platforms with cybersecurity services that strengthen applications, cloud environments, identities, and operational controls.",
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
      "AWS Security Hub",
      "Microsoft Sentinel",
      "Splunk",
      "Palo Alto Prisma Cloud",
      "IAM",
    ],
  },
  aiml: {
    title: "AI / MLOps Services",
    breadcrumbLabel: "AI / MLOps",
    description:
      "Operationalize AI initiatives with MLOps practices that support scalable deployment, monitoring, governance, and measurable impact.",
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
      "Docker",
      "Kubernetes",
      "Databricks",
      "AWS SageMaker",
      "Azure Machine Learning",
    ],
  },
  dataScience: {
    title: "Data Science Services",
    breadcrumbLabel: "Data Science",
    description:
      "Use data science to uncover insights, improve forecasting, and build analytical models for business decisions.",
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
      "NumPy",
      "Scikit-learn",
      "Jupyter",
      "SQL",
      "Power BI",
      "Apache Spark",
    ],
  },
  professional: {
    title: "Professional Services",
    breadcrumbLabel: "Professional Services",
    eyebrow: "Delivery Enablement Service",
    description:
      "Scale execution with consulting, staff augmentation, and leadership hiring models aligned to enterprise delivery needs and growth priorities.",
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
      "Solution Architecture",
      "Project Management",
      "Business Analysis",
      "AWS",
      "Azure",
      "SAP",
      "Oracle",
      "Data Platforms",
    ],
  },
};
