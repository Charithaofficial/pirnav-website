import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BadgeCheck,
  Brain,
  CalendarDays,
  CalendarCheck2,
  CheckCircle2,
  Clock3,
  CreditCard,
  FileText,
  Globe,
  Layers3,
  LayoutDashboard,
  Mail,
  MessageSquareText,
  MonitorCog,
  Pencil,
  Plane,
  Share2,
  Shield,
  ShieldCheck,
  Tag,
  UserCheck2,
  Users,
  X,
  Zap,
} from "lucide-react";
import "./Products.css";
import {
  hasErrors,
  LIMITS,
  normalizeEmailInput,
  sanitizeFormPayload,
  validateDemoForm,
} from "../../utils/formValidation";
import { buildApiUrl, jsonApiHeaders } from "../../config/api";

const CONTACT_API = buildApiUrl("Contact");

const productCatalog = [
  {
    category: "EMS",
    title: "Employee Management System",
    shortLabel: "Internal Ops",
    logoText: "EMS",
    description:
      "A streamlined internal platform for attendance, employee records, workflow approvals, and day-to-day operations.",
    accent: "from-cyan",
    icon: Users,
    features: ["HR workflows", "Attendance tracking", "Role-based access"],
    screens: [
      {
        title: "Employees",
        description: "Employee list view with records, salary details, joined date, and quick admin actions.",
        icon: LayoutDashboard,
        variant: "ems-employees",
      },
      {
        title: "Payroll",
        description: "Single employee payroll screen with deduction entry, period shortcuts, and payslip generation.",
        icon: UserCheck2,
        variant: "ems-payroll",
      },
    ],
  },
  {
    category: "Booking Platform",
    title: "Pick and Book",
    shortLabel: "Reservations",
    logoText: "P&B",
    description:
      "A real-time booking experience for reservation-driven businesses, designed around availability, payments, and smooth user journeys.",
    accent: "from-orange",
    icon: CalendarCheck2,
    features: ["Live availability", "Booking workflows", "Payment-ready flow"],
    screens: [
      {
        title: "Book bolder journeys with one unified travel desk.",
        description:
          "Compare flights and buses, mix one-way or multi-city routes, and confirm tickets in seconds with transparent pricing.",
        icon: Plane,
        variant: "picknbook-hero",
        stats: [
          "3,200+ Verified Routes",
          "180+ Cities Connected",
          "24/7 Travel Assistance",
          "98.7% On-Time Confirmations",
          "1.2M+ Tickets Booked",
        ],
        chips: ["Live fares", "Instant booking confirmation", "Flexible trip combinations"],
      },
      {
        title: "Fetch Ticket",
        description:
          "Enter your booking details to open your flight or bus ticket.",
        icon: CalendarCheck2,
        variant: "picknbook-ticket",
      },
    ],
  },
  {
    category: "CA Portal",
    title: "Chartered Accounting Portal",
    shortLabel: "Accounting Workspace",
    logoText: "CA",
    description:
      "A dedicated workspace for chartered accounting teams to manage client records, compliance work, documents, and reporting.",
    accent: "from-gold",
    icon: ShieldCheck,
    features: ["Client records", "Compliance tracking", "Document workflow"],
    screens: [
      {
        title: "Intern's Dashboard",
        description:
          "Track tasks, due items, clients, and filing workflows from one central accounting workspace.",
        icon: LayoutDashboard,
        variant: "ca-dashboard",
      },
      {
        title: "Documents",
        description: "Review uploaded files, categories, dates, and verification status in one streamlined table.",
        icon: MessageSquareText,
        variant: "ca-documents",
      },
    ],
  },
  {
    category: "AI Writer",
    title: "AI Content Generator",
    shortLabel: "Content Automation",
    logoText: "AI",
    description:
      "An AI-powered platform for generating blogs, marketing copy, captions, and content drafts for digital teams.",
    accent: "from-cyan",
    icon: Brain,
    features: ["Blog writing", "Social captions", "Content drafts"],
    screens: [
      {
        title: "Generate Content In Seconds",
        description:
          "Create high-quality blog posts, social media content, ad copy, and email copy instantly with our AI-powered content generation platform.",
        icon: Brain,
        variant: "ai-hero",
        bullets: ["Human-like AI Output", "Multiple Content Types", "Fast & Accurate AI"],
        actions: ["Start Generating", "View Templates"],
      },
      {
        title: "How It Works",
        description:
          "Get from idea to published content in just four simple steps.",
        icon: MonitorCog,
        variant: "ai-ideas",
        ideas: [
          {
            tag: "01",
            title: "Choose Content Type",
            text: "Select from blogs, ads, or captions.",
            icon: FileText,
          },
          {
            tag: "02",
            title: "Enter Your Topic",
            text: "Provide a short description or keywords.",
            icon: Pencil,
          },
          {
            tag: "03",
            title: "Generate Content",
            text: "AI creates original, high-quality content.",
            icon: Zap,
          },
          {
            tag: "04",
            title: "Save & Share",
            text: "Edit and export your ready-to-publish content.",
            icon: Share2,
          },
        ],
      },
    ],
  },
  {
    category: "Inventory Suite",
    title: "Inventory Management System",
    shortLabel: "Upcoming",
    logoText: "IMS",
    description:
      "A centralized inventory platform for stock visibility, warehouse movement, reorder planning, and day-to-day inventory control.",
    accent: "from-indigo",
    icon: Layers3,
    features: ["Stock visibility", "Warehouse tracking", "Reorder alerts"],
    screens: [
      {
        title: "Inventory Overview",
        description: "Monitor available stock, low inventory items, inward movement, and category-wise totals in one place.",
        icon: LayoutDashboard,
        metrics: ["1.2K Items", "18 Low Stock", "04 Warehouses"],
      },
      {
        title: "Reorder Workflow",
        description: "Track replenishment requests, supplier follow-ups, and approval-driven procurement flow.",
        icon: MonitorCog,
        metrics: ["12 Requests", "07 Approved", "03 Pending"],
      },
    ],
  },
  {
    category: "Retail Platform",
    title: "Point of Sale",
    shortLabel: "Upcoming",
    logoText: "POS",
    description:
      "An upcoming point-of-sale solution for billing, product lookup, sales tracking, and day-to-day retail operations.",
    accent: "from-orange",
    icon: CreditCard,
    features: ["Billing workflow", "Sales tracking", "Retail operations"],
    screens: [
      {
        title: "Checkout Counter",
        description: "A fast billing view for cart handling, payment capture, and instant invoice generation.",
        icon: CreditCard,
        metrics: ["32 Bills", "05 Counters", "Live Sales"],
      },
      {
        title: "Store Dashboard",
        description: "Track daily sales, top-moving items, cashier activity, and store performance in one place.",
        icon: LayoutDashboard,
        metrics: ["Sales", "Products", "Reports"],
      },
    ],
  },
];

const deliveryPoints = [
  {
    icon: Layers3,
    title: "Designed Around Workflows",
    text: "Each product is structured to reduce repetitive tasks and give teams a cleaner operational rhythm.",
  },
  {
    icon: MonitorCog,
    title: "Ready For Customization",
    text: "We adapt modules, interfaces, and integrations so the product fits your process instead of forcing a generic setup.",
  },
  {
    icon: Clock3,
    title: "Built For Faster Rollout",
    text: "Our approach combines product foundations with implementation support to shorten the time to launch.",
  },
];

function Products() {
  const navigate = useNavigate();
  const [demoProduct, setDemoProduct] = useState(null);
  const [activeScreenProduct, setActiveScreenProduct] = useState(productCatalog[0].title);
  const [demoForm, setDemoForm] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoStatus, setDemoStatus] = useState("");
  const [demoErrors, setDemoErrors] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [demoTouched, setDemoTouched] = useState({});

  useEffect(() => {
    const elements = document.querySelectorAll(".products-reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -30px 0px" }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [activeScreenProduct]);

  useEffect(() => {
    if (!demoProduct) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setDemoProduct(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [demoProduct]);

  useEffect(() => {
    if (demoStatus !== "success") {
      return undefined;
    }

    const timeoutId = setTimeout(() => {
      setDemoStatus("");
    }, 2500);

    return () => clearTimeout(timeoutId);
  }, [demoStatus]);

  const activeProduct =
    productCatalog.find((product) => product.title === activeScreenProduct) || productCatalog[0];

  const renderProductScreenContent = (screen, accentClass) => {
    if (screen.variant === "ems-employees") {
      const employees = [
        ["Vijitha", "P259", "vijitha@gmail.com", "IT", "3,00,000", "Admin", "Active", "2026-04-07"],
        ["PUTLURU VIJITHA", "P250", "vijithaputluru2003@gmail.com", "IT", "3,00,000", "Employe", "Active", "2026-04-03"],
        ["bunny prasad", "P4", "prasadmpk45@gmail.com", "IT", "3,00,000", "Employe", "Active", "2026-04-09"],
        ["K.veera HarshaVardhan Reddy", "P234", "harsha630175@gmail.com", "IT", "3,00,000", "Employe", "Active", "2025-06-02"],
        ["saithi", "P254", "gopidisaithi@gmail.com", "IT", "4,00,000", "Employe", "Active", "2026-04-09"],
      ];

      const navItems = [
        "Dashboard",
        "Employees",
        "My Holidays",
        "Company",
        "Masters",
        "Payroll",
        "Payslip",
        "Reports",
        "Offer Letters",
        "Attendance",
        "My Attendance",
        "Leave",
        "Employee Leave",
      ];

      return (
        <div className="product-screen-frame product-screen-frame-ems">
          <div className="product-screen-ems product-screen-ems-employees">
            <aside className="product-screen-ems-sidebar">
              {navItems.map((item) => (
                <span
                  key={item}
                  className={item === "Employees" ? "active" : ""}
                >
                  <span className="product-screen-ems-nav-icon" />
                  {item}
                </span>
              ))}
            </aside>

            <main className="product-screen-ems-main">
              <div className="product-screen-ems-topline" />
              <div className="product-screen-ems-employees-head">
                <div>
                  <strong>Employees</strong>
                  <small>14 employees total</small>
                </div>
                <button type="button">+ Add Employee</button>
              </div>

              <div className="product-screen-ems-search">Search by name...</div>

              <div className="product-screen-ems-table-wrap">
                <table className="product-screen-ems-table">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Email</th>
                      <th>Department</th>
                      <th>Ctc</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Joined</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((employee) => (
                      <tr key={`${employee[0]}-${employee[1]}`}>
                        <td>
                          <strong>{employee[0]}</strong>
                          <small>{employee[1]}</small>
                        </td>
                        <td>{employee[2]}</td>
                        <td>{employee[3]}</td>
                        <td>{employee[4]}</td>
                        <td>{employee[5]}</td>
                        <td>{employee[6]}</td>
                        <td>{employee[7]}</td>
                        <td>
                          <span className="product-screen-ems-actions">
                            <button type="button">Edit</button>
                            <button type="button">Delete</button>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </main>
          </div>
        </div>
      );
    }

    if (screen.variant === "ems-payroll") {
      const payrollEmployees = [
        ["Vijitha", "P259", true],
        ["PUTLURU VIJITHA", "P250", false],
        ["bunny prasad", "P4", false],
        ["K.veera HarshaVardhan Reddy", "P234", false],
        ["saithi", "P254", false],
      ];

      return (
        <div className="product-screen-frame product-screen-frame-ems">
          <div className="product-screen-ems product-screen-ems-payroll">
            <aside className="product-screen-payroll-list">
              <strong>Payroll</strong>
              <div className="product-screen-payroll-search">Search ID or Name...</div>
              <label className="product-screen-payroll-select-all">
                <span />
                Select All (14)
              </label>
              <div className="product-screen-payroll-people">
                {payrollEmployees.map(([name, id, active]) => (
                  <label
                    key={id}
                    className={active ? "active" : ""}
                  >
                    <span />
                    <strong>{name}</strong>
                    <small>{id}</small>
                    <em>IT</em>
                  </label>
                ))}
              </div>
            </aside>

            <main className="product-screen-payroll-main">
              <section className="product-screen-payroll-profile">
                <div className="product-screen-payroll-avatar">V</div>
                <div>
                  <strong>Vijitha</strong>
                  <small>P259 - IT - CTC ₹3,00,000 - Joined Apr 2026</small>
                </div>
                <label>
                  <span>Payslip Mode</span>
                  <select defaultValue="auto" aria-label="Payslip mode">
                    <option value="auto">Auto Payslip</option>
                  </select>
                </label>
              </section>

              <section className="product-screen-payroll-deduction">
                <label>
                  <span>DEDUCTION (₹)</span>
                  <input type="text" placeholder="Enter Deduction" readOnly />
                </label>
                <small>Current Deduction: ₹0</small>
              </section>

              <section className="product-screen-payroll-generate">
                <div className="product-screen-payroll-generate-head">
                  <strong>Generate Payslip</strong>
                  <span>Single Employee</span>
                </div>

                <div className="product-screen-payroll-period-row">
                  <div>
                    <small>STANDARD PERIODS</small>
                    <div className="product-screen-payroll-periods">
                      <button type="button">1m</button>
                      <button type="button">3m</button>
                      <button type="button">6m</button>
                      <button type="button">12m</button>
                    </div>
                  </div>

                  <div>
                    <small>SPECIFIC PERIOD</small>
                    <div className="product-screen-payroll-specific">
                      <select defaultValue="2026" aria-label="Payroll year">
                        <option>2026</option>
                      </select>
                      <select defaultValue="April" aria-label="Payroll month">
                        <option>April</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button type="button" className="product-screen-payroll-submit">
                  Generate April Payslip
                </button>
              </section>
            </main>
          </div>
        </div>
      );
    }

    if (screen.variant === "ai-hero") {
      return (
        <div className={`product-screen-frame product-screen-frame-ai ${accentClass}`}>
          <div className="product-screen-ai product-screen-ai-hero">
            <div className="product-screen-ai-nav">
              <div className="product-screen-ai-brand">
                <span className="product-screen-ai-brand-icon" aria-hidden="true" />
                <strong>AI Content Generator</strong>
              </div>
              <div className="product-screen-ai-menu">
                <span>Dashboard</span>
                <span>Content Generator</span>
                <span>Templates</span>
                <span>Content History</span>
                <span>Pricing</span>
              </div>
              <button type="button">Login</button>
            </div>

            <div className="product-screen-ai-hero-layout">
              <div className="product-screen-ai-copy">
                <strong>{screen.title}</strong>
                <p>{screen.description}</p>
                <ul className="product-screen-ai-bullets">
                  {screen.bullets.map((bullet) => (
                    <li key={bullet}>
                      <CheckCircle2 size={15} aria-hidden="true" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
                <div className="product-screen-ai-actions">
                  <span>{screen.actions[0]}</span>
                  <span>{screen.actions[1]}</span>
                </div>
              </div>

              <div className="product-screen-ai-illustration">
                <div className="product-screen-ai-doc">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="product-screen-ai-monitor">
                  <div className="product-screen-ai-monitor-top">
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className="product-screen-ai-monitor-body">
                    <div className="product-screen-ai-chart" />
                    <div className="product-screen-ai-check">
                      <CheckCircle2 size={34} aria-hidden="true" />
                    </div>
                  </div>
                </div>
                <div className="product-screen-ai-person product-screen-ai-person-left" />
                <div className="product-screen-ai-person product-screen-ai-person-right" />
                <div className="product-screen-ai-floating product-screen-ai-floating-mail">
                  <Mail size={16} aria-hidden="true" />
                </div>
                <div className="product-screen-ai-floating product-screen-ai-floating-chat">
                  <MessageSquareText size={16} aria-hidden="true" />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (screen.variant === "ai-ideas") {
      return (
        <div className={`product-screen-frame product-screen-frame-ai ${accentClass}`}>
          <div className="product-screen-ai product-screen-ai-ideas">
            <div className="product-screen-ai-nav">
              <div className="product-screen-ai-brand">
                <span className="product-screen-ai-brand-icon" aria-hidden="true" />
                <strong>AI Content Generator</strong>
              </div>
              <div className="product-screen-ai-menu">
                <span>Dashboard</span>
                <span>Content Generator</span>
                <span>Templates</span>
                <span>Content History</span>
                <span>Pricing</span>
                <span>Settings</span>
              </div>
              <span className="product-screen-ai-account">Accd</span>
            </div>

            <div className="product-screen-ai-ideas-head">
              <strong>{screen.title}</strong>
              <p>{screen.description}</p>
            </div>

            <div className="product-screen-ai-ideas-grid">
              {screen.ideas.map((idea) => {
                const IdeaIcon = idea.icon;
                return (
                  <article key={idea.title} className="product-screen-ai-idea-card">
                    <small>{idea.tag}</small>
                    <span className="product-screen-ai-idea-icon">
                      <IdeaIcon size={16} aria-hidden="true" />
                    </span>
                    <strong>{idea.title}</strong>
                    <p>{idea.text}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    if (screen.variant === "picknbook-hero") {
      return (
        <div className={`product-screen-frame product-screen-frame-booking ${accentClass}`}>
          <div className="product-screen-bar">
            <span />
            <span />
            <span />
          </div>

          <div className="product-screen-booking product-screen-booking-hero">
            <div className="product-screen-booking-topbar">
              <div className="product-screen-booking-brand">
                <span className="product-screen-booking-brand-icon">
                  <CalendarCheck2 size={16} aria-hidden="true" />
                </span>
                <div>
                  <strong>Travel</strong>
                  <small>Flights and Buses</small>
                </div>
              </div>

              <div className="product-screen-booking-nav">
                <span className="active">
                  <Plane size={14} aria-hidden="true" />
                  Flights
                </span>
                <span>
                  <CalendarDays size={14} aria-hidden="true" />
                  Buses
                </span>
                <span>Web Check-in</span>
                <span>Print Ticket</span>
              </div>
            </div>

            <div className="product-screen-booking-hero-body">
              <span className="product-screen-booking-kicker">Smart Travel Studio</span>
              <strong>{screen.title}</strong>
              <p>{screen.description}</p>

              <div className="product-screen-booking-stats">
                {screen.stats.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>

              <div className="product-screen-booking-tags">
                {screen.chips.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (screen.variant === "picknbook-ticket") {
      return (
        <div className={`product-screen-frame product-screen-frame-booking ${accentClass}`}>
          <div className="product-screen-booking product-screen-bus-ticket">
            <div className="product-screen-bus-ticket-main">
              <div className="product-screen-bus-ticket-top">
                <div>
                  <small>GO TRAVELS - BUS TICKET</small>
                  <strong>Bus Orange Travels - PNB-B1004</strong>
                </div>
                <span>BOOKED</span>
              </div>

              <div className="product-screen-bus-ticket-route">
                <strong>Hyderabad</strong>
                <span>
                  <em>8h : 30m</em>
                </span>
                <strong>Bengaluru</strong>
              </div>

              <div className="product-screen-bus-ticket-times">
                <div>
                  <small>DEPARTURE</small>
                  <strong>45:00</strong>
                </div>
                <div>
                  <small>DATE</small>
                  <strong>Wed, 22 Apr, 2026</strong>
                </div>
                <div>
                  <small>ARRIVAL (NEXT DAY)</small>
                  <strong>15:00</strong>
                </div>
              </div>

              <div className="product-screen-bus-ticket-info">
                <div>
                  <small>BUS TYPE</small>
                  <strong>-</strong>
                </div>
                <div>
                  <small>BOARDING</small>
                  <strong>Hyderabad</strong>
                </div>
                <div>
                  <small>TOTAL FARE</small>
                  <strong>INR 1,160</strong>
                </div>
              </div>

              <div className="product-screen-bus-ticket-passenger">
                <small>PASSENGERS & SEATS</small>
                <div>
                  <span>1</span>
                  <strong>Sudheer Kumar (Adult)</strong>
                  <em>Seat L1</em>
                </div>
              </div>
            </div>

            <div className="product-screen-bus-ticket-side">
              <span className="product-screen-bus-ticket-vertical">BUS TICKET</span>
              <div>
                <small>PNR</small>
                <strong>BS-20260421110702-520</strong>
              </div>
              <div>
                <small>FARE</small>
                <strong>INR 1,160</strong>
              </div>
              <div className="product-screen-bus-ticket-qr" aria-hidden="true">
                {Array.from({ length: 49 }).map((_, index) => (
                  <span key={index} />
                ))}
              </div>
              <small>Show to conductor</small>
            </div>
          </div>
        </div>
      );
    }

    if (screen.variant === "ca-dashboard") {
      return (
        <div className={`product-screen-frame product-screen-frame-ca ${accentClass}`}>
          <div className="product-screen-bar">
            <span />
            <span />
            <span />
          </div>

          <div className="product-screen-ca product-screen-ca-dashboard">
            <aside className="product-screen-ca-sidebar">
              <div className="product-screen-ca-sidebar-brand">CA Portal</div>
              <div className="product-screen-ca-sidebar-links">
                <span className="active">Dashboard</span>
                <span>Clients</span>
                <span>Compliance Calendar</span>
                <span>Document</span>
                <span>Filing Tracker</span>
                <span>Time Tracking</span>
                <span>Team Directory</span>
              </div>
              <button type="button">Logout</button>
            </aside>

            <div className="product-screen-ca-main">
              <div className="product-screen-ca-topbar">
                <div className="product-screen-ca-search">Search...</div>
                <div className="product-screen-ca-profile">N</div>
              </div>

              <div className="product-screen-ca-headline">
                <strong>{screen.title}</strong>
                <button type="button">Go to Clients</button>
              </div>

              <div className="product-screen-ca-stat-grid">
                <article><small>Active Tasks</small><strong>0</strong><span>Active ongoing tasks</span></article>
                <article><small>Due Today</small><strong>0</strong><span>Calendar dues</span></article>
                <article><small>Clients</small><strong>0</strong><span>All active clients</span></article>
                <article><small>Documents Processing</small><strong>0</strong><span>Active processing tasks</span></article>
              </div>

              <div className="product-screen-ca-panel-row">
                <div className="product-screen-ca-panel">
                  <h4>Recent Activities (0)</h4>
                  <div className="product-screen-ca-panel-search">Search activities...</div>
                  <button type="button">View Activity Log</button>
                </div>
                <div className="product-screen-ca-panel">
                  <h4>Upcoming Deadlines</h4>
                  <p>No upcoming deadlines</p>
                  <button type="button">View All Deadlines</button>
                </div>
              </div>

              <div className="product-screen-ca-mini-grid">
                <article><small>New Clients Added</small><strong>0</strong></article>
                <article><small>Pending Invoices</small><strong>0</strong></article>
                <article><small>Filing Tracker</small><strong>0</strong></article>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (screen.variant === "ca-documents") {
      return (
        <div className={`product-screen-frame product-screen-frame-ca ${accentClass}`}>
          <div className="product-screen-bar">
            <span />
            <span />
            <span />
          </div>

          <div className="product-screen-ca product-screen-ca-documents">
            <div className="product-screen-ca-documents-head">
              <strong>Documents (6)</strong>
            </div>

            <div className="product-screen-ca-table-wrap">
              <table className="product-screen-ca-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Document</th>
                    <th>Client</th>
                    <th>Category</th>
                    <th>Size</th>
                    <th>Upload Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["77", "unknown.file", "Rahul", "GST Documents", "1.7 MB", "2025-12-12", "verified"],
                    ["73", "unknown.file", "Elite Garments", "Invoices", "18.5 KB", "2025-11-17", "verified"],
                    ["72", "unknown.file", "Sunrise Hospitality", "Tax Returns", "1.7 MB", "2025-11-17", "verified"],
                    ["71", "unknown.file", "Coral Tech Solutions", "Financial Documents", "82.1 KB", "2025-11-17", "verified"],
                    ["70", "unknown.file", "Ayaan Traders", "Identity Documents", "35.7 KB", "2025-11-17", "verified"],
                    ["69", "unknown.file", "Morph", "GST Documents", "18.4 KB", "2025-11-17", "processing"],
                  ].map((row) => (
                    <tr key={row[0]}>
                      <td>{row[0]}</td>
                      <td>{row[1]}</td>
                      <td>{row[2]}</td>
                      <td><span className="product-screen-ca-chip">{row[3]}</span></td>
                      <td>{row[4]}</td>
                      <td>{row[5]}</td>
                      <td>
                        <span className={`product-screen-ca-status product-screen-ca-status-${row[6]}`}>
                          {row[6]}
                        </span>
                      </td>
                      <td>
                        <span className="product-screen-ca-actions">o o o o</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }

    const ScreenIcon = screen.icon;

    return (
      <div className={`product-screen-frame ${accentClass}`}>
        <div className="product-screen-bar">
          <span />
          <span />
          <span />
        </div>

        <div className="product-screen-body">
          <div className="product-screen-icon">
            <ScreenIcon size={22} aria-hidden="true" />
          </div>
          <strong>{screen.title}</strong>
          <p>{screen.description}</p>
          <div className="product-screen-metrics">
            {screen.metrics.map((metric) => (
              <span key={metric}>{metric}</span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const openDemoModal = (product) => {
    setDemoProduct(product);
    setDemoStatus("");
    setDemoErrors({ name: "", email: "", company: "", message: "" });
    setDemoTouched({});
    setDemoForm({
      name: "",
      email: "",
      company: "",
      message: "",
    });
  };

  const closeDemoModal = () => {
    setDemoProduct(null);
    setDemoStatus("");
    setDemoLoading(false);
  };

  const handleDemoChange = (event) => {
    const { name, value } = event.target;
    setDemoForm((prev) => {
      const nextValue = name === "email" ? normalizeEmailInput(value) : value;
      const nextValues = { ...prev, [name]: nextValue };
      setDemoErrors(validateDemoForm(nextValues));
      return nextValues;
    });
  };

  const handleDemoBlur = (event) => {
    const { name } = event.target;
    setDemoTouched((current) => ({ ...current, [name]: true }));
    setDemoErrors(validateDemoForm(demoForm));
  };

  const handleDemoSubmit = async (event) => {
    event.preventDefault();

    if (!demoProduct) {
      return;
    }

    const nextErrors = validateDemoForm(demoForm);
    setDemoTouched({
      name: true,
      email: true,
      company: true,
      message: true,
    });
    setDemoErrors(nextErrors);

    if (hasErrors(nextErrors)) {
      setDemoStatus("");
      return;
    }

    setDemoLoading(true);
    setDemoStatus("");

    try {
      const payload = sanitizeFormPayload(demoForm);
      const response = await fetch(CONTACT_API, {
        method: "POST",
        headers: jsonApiHeaders,
        body: JSON.stringify({
          name: payload.name,
          email: payload.email,
          subject: `Product Demo Request - ${demoProduct.title}`,
          message: `Company: ${payload.company || "Not provided"}\n\nProduct: ${demoProduct.title}\n\nRequirement: ${payload.message}`,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed");
      }

      await response.json();
      setDemoStatus("success");
      setDemoForm({
        name: "",
        email: "",
        company: "",
        message: "",
      });
      setDemoErrors({ name: "", email: "", company: "", message: "" });
      setDemoTouched({});
    } catch {
      setDemoStatus("error");
    } finally {
      setDemoLoading(false);
    }
  };

  const handleBookDemoNavigation = () => {
    navigate("/contact#get-in-touch");
  };

  return (
    <div className="products-page">
      <section className="products-hero">
        <div className="products-hero-overlay" />
        <div className="products-hero-glow products-hero-glow-one" />
        <div className="products-hero-glow products-hero-glow-two" />

        <div className="products-hero-content">
          <div className="products-hero-copy products-reveal">
            <h1>Business-ready products for modern teams.</h1>
            <p>
              Explore Pirnav product offerings built to support operations,
              collaboration, booking experiences, and modern business delivery.
            </p>

            <div className="products-hero-actions">
              <button
                type="button"
                className="products-primary-btn"
                onClick={handleBookDemoNavigation}
              >
                Book a Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="products-intro products-reveal">
        <span className="products-section-label">What We Offer</span>
        <h2>Simple products built for daily business needs.</h2>
        <p>
          These products are made to support daily work, team tasks, and simple business operations.
        </p>
      </section>

      <section className="products-grid-section">
        <div className="products-grid">
          {productCatalog.map((product, index) => {
            const Icon = product.icon;

            return (
              <article
                key={product.title}
                className="product-card products-reveal"
                style={{ transitionDelay: `${index * 0.08}s` }}
              >
                <div className={`product-card-media ${product.accent}`}>
                    <div className="product-card-overlay" />
                    <div className="product-card-topline">
                      <span className="product-card-chip">{product.category}</span>
                    <span
                      className={`product-card-mini-tag ${
                        product.shortLabel.toLowerCase() === "upcoming"
                          ? "product-card-mini-tag-upcoming"
                          : ""
                      }`}
                    >
                      {product.shortLabel}
                    </span>
                    </div>

                  <div className="product-card-logo-shell">
                    <span className="product-card-logo-icon">
                      <Icon size={30} aria-hidden="true" />
                    </span>
                    <div className="product-card-logo-copy">
                      <strong>{product.logoText}</strong>
                      <span>{product.category}</span>
                    </div>
                  </div>
                </div>

                <div className="product-card-body">
                  <div className="product-card-heading">
                    <span className="product-card-icon">
                      <Icon size={18} aria-hidden="true" />
                    </span>
                    <div className="product-card-title-block">
                      <span className="product-card-label">Product Solution</span>
                      <h3>{product.title}</h3>
                    </div>
                  </div>

                  <p>{product.description}</p>

                  <div className="product-feature-list">
                    {product.features.map((feature) => (
                      <span key={feature}>{feature}</span>
                    ))}
                  </div>

                  <div className="product-card-actions">
                    <button
                      type="button"
                      className="product-demo-btn"
                      onClick={handleBookDemoNavigation}
                    >
                      Book a Demo
                    </button>
                    <button
                      type="button"
                      className="product-explore-btn"
                      onClick={() => {
                        setActiveScreenProduct(product.title);
                        const target = document.getElementById("product-screens");
                        target?.scrollIntoView({ behavior: "smooth", block: "start" });
                      }}
                    >
                      Explore
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section id="product-screens" className="products-screens-section">
        <div className="products-screens-header products-reveal">
          <span className="products-section-label">Project Screens</span>
          <h2>Preview screens inspired by how these products work in practice.</h2>
          <p>
            Explore concept screens for dashboards, workflows, and booking journeys related
            to each product line.
          </p>
        </div>

        <div className="products-screen-tabs products-reveal">
          {productCatalog.map((product) => (
            <button
              key={product.title}
              type="button"
              className={`products-screen-tab ${
                activeScreenProduct === product.title ? "active" : ""
              }`}
              onClick={() => setActiveScreenProduct(product.title)}
            >
              {product.title}
            </button>
          ))}
        </div>

        <div className="products-screen-grid">
          {activeProduct.screens.map((screen, index) => {
            return (
              <article
                key={screen.title}
                className="product-screen-card products-reveal"
                style={{ transitionDelay: `${index * 0.08}s` }}
              >
                {renderProductScreenContent(screen, activeProduct.accent)}
              </article>
            );
          })}
        </div>
      </section>

      <section id="product-fit" className="products-fit-section">
        <div className="products-fit-copy products-reveal">
          <span className="products-section-label">Why These Products</span>
          <h2>Products that can fit the way your business works.</h2>
          <p>
            Whether you need an internal system, a portal, a web app, or a booking tool,
            we can adjust the product to fit your work.
          </p>
        </div>

        <div className="products-fit-grid">
          {deliveryPoints.map((item, index) => {
            const Icon = item.icon;

            return (
              <article
                key={item.title}
                className="products-fit-card products-reveal"
                style={{ transitionDelay: `${index * 0.08}s` }}
              >
                <span className="products-fit-icon">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      {demoProduct && (
        <div
          className="products-modal-overlay"
          onClick={closeDemoModal}
        >
          <div
            className="products-demo-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="products-modal-close"
              onClick={closeDemoModal}
              aria-label="Close demo popup"
            >
              <X size={18} />
            </button>

            <span className="products-section-label">Book A Demo</span>
            <h3>{demoProduct.title}</h3>
            <p>
              Share your interest in this product and our team will connect with a relevant
              walkthrough and next steps.
            </p>

            <form className="products-demo-form" onSubmit={handleDemoSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Your name"
                value={demoForm.name}
                onChange={handleDemoChange}
                onBlur={handleDemoBlur}
                aria-invalid={Boolean(demoTouched.name && demoErrors.name)}
              />
              {demoTouched.name && demoErrors.name ? (
                <p className="products-demo-inline-error">{demoErrors.name}</p>
              ) : null}
              <input
                type="email"
                name="email"
                placeholder="Work email"
                maxLength={LIMITS.emailMax}
                value={demoForm.email}
                onChange={handleDemoChange}
                onBlur={handleDemoBlur}
                aria-invalid={Boolean(demoTouched.email && demoErrors.email)}
              />
              {demoTouched.email && demoErrors.email ? (
                <p className="products-demo-inline-error">{demoErrors.email}</p>
              ) : null}
              <input
                type="text"
                name="company"
                placeholder="Company name"
                value={demoForm.company}
                onChange={handleDemoChange}
                onBlur={handleDemoBlur}
                aria-invalid={Boolean(demoTouched.company && demoErrors.company)}
              />
              {demoTouched.company && demoErrors.company ? (
                <p className="products-demo-inline-error">{demoErrors.company}</p>
              ) : null}
              <textarea
                rows="4"
                name="message"
                placeholder={`Tell us what you need from ${demoProduct.title}`}
                value={demoForm.message}
                onChange={handleDemoChange}
                onBlur={handleDemoBlur}
                aria-invalid={Boolean(demoTouched.message && demoErrors.message)}
              />
              {demoTouched.message && demoErrors.message ? (
                <p className="products-demo-inline-error">{demoErrors.message}</p>
              ) : null}
              <button type="submit" className="products-demo-submit" disabled={demoLoading || Boolean(demoErrors.email)}>
                {demoLoading ? "Sending..." : "Request Demo"}
              </button>

              {demoStatus === "error" && (
                <p className="products-demo-status error">Something went wrong. Please try again.</p>
              )}

              {demoStatus === "success" && (
                <p className="products-demo-status success">Demo request sent successfully.</p>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;
