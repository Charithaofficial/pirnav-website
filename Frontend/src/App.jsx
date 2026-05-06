import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import { useEffect } from "react";

/* Components */
import Navbar from "./Components/Navbar/Navbar.jsx";
import Dashboard from "./Components/Dashboard/Dashboard.jsx";
import Contact from "./Components/Dashboard/Contact.jsx";
import About from "./Components/Dashboard/about.jsx";
import Blogs from "./Components/Dashboard/Blogs.jsx";
import BlogPost from "./Components/Dashboard/BlogPost.jsx";
import Footer from "./Components/Dashboard/Footer.jsx";
import PublicServices from "./Components/Services/OurService.jsx";
import Products from "./Components/Products/Products.jsx";
import Careers from "./Components/Dashboard/Careers.jsx";
import JobDetails from "./Components/Dashboard/JobDetails.jsx";
import ChatWidget from "./Components/Common/ChatWidget.jsx";

/* Admin */
import AdminLayout from "./Components/Admin/AdminLayout.jsx";
import AdminLogin from "./Components/Admin/AdminLogin.jsx";
import DashboardHome from "./Components/Admin/DashboardHome.jsx";
import ContactMessages from "./Components/Admin/ContactMessages.jsx";
import AdminJobs from "./Components/Admin/AdminJobs.jsx";
import Applications from "./Components/Admin/Applications.jsx";
import AdminUsers from "./Components/Admin/AdminUsers.jsx";
import Interviews from "./Components/Admin/Interviews.jsx";
import InterviewFeedback from "./Components/Admin/InterviewFeedback.jsx";

/* Sub pages */
import WebPage from "./Components/Services/WebPage.jsx";
import MobilePage from "./Components/Services/MobilePage.jsx";
import Microsoft from "./Components/Services/Microsoft.jsx";
import Application from "./Components/Services/Applicationdevelopment.jsx";
import Testing from "./Components/Services/Testing&Automation.jsx";
import Maintainance from "./Components/Services/Maintainancesupport.jsx";
import SAP from "./Components/Services/SAP.jsx";
import Oracle from "./Components/Services/Oracle.jsx";
import ProfessionalPage from "./Components/Services/ProfessionalPage.jsx";
import Cybersecurity from "./Components/Services/Cyber.jsx";
import AiMl from "./Components/Services/AIML.jsx";
import DataScience from "./Components/Services/DataScience.jsx";



/* 🔥 GLOBAL SCROLL FIX */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // always go to top
  }, [pathname]);

  return null;
}



/* MAIN CONTENT */
function AppContent() {
  const location = useLocation();
  const hideLayout = location.pathname.startsWith("/admin");

  return (
    <div className="app-shell">
      {!hideLayout && <Navbar />}

      <main className="app-main">
        <Routes>

          {/* Public */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:slug" element={<BlogPost />} />
          <Route path="/services" element={<PublicServices />} />
          <Route path="/products" element={<Products />} />

          {/* Careers */}
          <Route path="/careers" element={<Careers />} />
          <Route path="/careers/:id" element={<JobDetails />} />

          {/* Service Pages */}
          <Route path="/services/application-development" element={<Application />} />
          <Route path="/services/testing-automation" element={<Testing />} />
          <Route path="/services/maintainance-support" element={<Maintainance />} />
          <Route path="/services/web-development" element={<WebPage />} />
          <Route path="/services/mobile-app-development" element={<MobilePage />} />
          <Route path="/services/sap-solutions" element={<SAP />} />
          <Route path="/services/oracle-solutions" element={<Oracle />} />
          <Route path="/services/microsoft-solutions" element={<Microsoft />} />
          <Route path="/services/cyber-security" element={<Cybersecurity />} />
          <Route path="/services/ai-ml" element={<AiMl />} />
          <Route path="/services/data-science" element={<DataScience />} />
          <Route path="/services/professional-services" element={<ProfessionalPage />} />

          {/* Admin Login */}
          <Route path="/admin-login" element={<AdminLogin />} />

          {/* Admin Panel */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="services" element={<Navigate to="/admin" replace />} />
            <Route path="messages" element={<ContactMessages />} />
            <Route path="jobs" element={<AdminJobs />} />
            <Route path="applications" element={<Applications />} />
            <Route path="interviews" element={<Interviews />} />
            <Route path="interview-feedback" element={<InterviewFeedback />} />
            <Route path="/admin/users" element={<AdminUsers />} />
          </Route>

        </Routes>
      </main>

      {!hideLayout && <ChatWidget />}
      {!hideLayout && <Footer />}
    </div>
  );
}



/* APP ROOT */
const App = () => {
  return (
    <Router>
      <ScrollToTop /> {/* 🔥 GLOBAL FIX */}
      <AppContent />
    </Router>
  );
};

export default App;
