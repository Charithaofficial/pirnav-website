import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Service.css";

const servicesData = [
{
title:"Application Development",
short:"Custom business applications.",
desc:"We build custom business applications with scalable architecture, strong performance, and reliable delivery.",
icon:"/images/Application.png",
link:"/services/application-development"
},
{
title:"Testing / Automation",
short:"Quality and automation testing.",
desc:"We improve software quality with test automation, regression coverage, and dependable validation practices.",
icon:"/images/testing.png",
link:"/services/testing-automation"
},
{
title:"Maintenance & Support",
short:"Ongoing system support.",
desc:"We keep critical systems stable with monitoring, issue resolution, and continuous support services.",
icon:"/images/maintainance.png",
link:"/services/maintainance-support"
},
{
title:"Web Development",
short:"Responsive websites and portals.",
desc:"We create responsive websites and web applications built for performance, usability, and business goals.",
icon:"/images/web.jpg",
link:"/services/web-development"
},
{
title:"Mobile App Development",
short:"Android and iOS apps.",
desc:"We develop mobile apps for Android and iOS with smooth user experience and reliable performance.",
icon:"/images/Mobile.jpg",
link:"/services/mobile-app-development"
},
{
title:"SAP Solutions",
short:"Enterprise SAP services.",
desc:"We support SAP implementation, integration, and optimization for enterprise operations and workflows.",
icon:"/images/sap.png",
link:"/services/sap-solutions"
},
{
title:"Oracle Solutions",
short:"Oracle enterprise solutions.",
desc:"We deliver Oracle-based database and enterprise solutions for secure, stable business systems.",
icon:"/images/Oracle.png",
link:"/services/oracle-solutions"
},
{
title:"Microsoft Solutions",
short:"Azure & .NET technologies.",
desc:"We build Microsoft-based solutions using Azure, .NET, and cloud services for modern business needs.",
icon:"/images/Microsoft.png",
link:"/services/microsoft-solutions"
},
{
title:"Cyber Security",
short:"Application and cloud security.",
desc:"We strengthen security across applications, cloud environments, users, and enterprise operations.",
icon:"/images/cyber.png",
link:"/services/cyber-security"
},
{
title:"AI / ML Ops",
short:"AI deployment and ML operations.",
desc:"We help teams deploy, monitor, and manage AI and machine learning solutions at scale.",
icon:"/images/ai-ml.png",
link:"/services/ai-ml"
},
{
title:"Data Science",
short:"Insights from business data.",
desc:"We turn business data into useful insights, forecasting models, and decision support solutions.",
icon:"/images/data-science.png",
link:"/services/data-science"
},
{
title:"Professional Services",
short:"Consulting and staffing support.",
desc:"We provide consulting, staffing, and delivery support services to help teams scale with confidence.",
icon:"/images/service.png",
link:"/services/professional-services"
}
];

function Services(){

const navigate = useNavigate();
const [activeCard, setActiveCard] = useState(null);

useEffect(()=>{

const elements = document.querySelectorAll(".scroll");

const observer = new IntersectionObserver((entries)=>{
entries.forEach((entry)=>{
if(entry.isIntersecting){
entry.target.classList.add("show");
}
});
},{ threshold: 0.2 });

elements.forEach((el)=>observer.observe(el));

return ()=>observer.disconnect();

},[]);

const toggleCard = (index)=>{
setActiveCard(activeCard === index ? null : index);
};

return(

<div className="srv-page">

{/* HERO */}

<div className="srv-hero">

<div className="srv-overlay scroll hero-animate">

<h1 className="hero-title srv-text-reveal srv-text-delay-1">Smart Technology Solutions for Modern Business</h1>

<p className="hero-sub srv-text-reveal srv-text-delay-2">
We deliver cutting-edge digital solutions that help businesses innovate,
scale faster, and stay ahead in todayâ€™s competitive technology landscape.
</p>

<p className="hero-extra srv-text-reveal srv-text-delay-3">
From enterprise applications to cloud solutions, we ensure high performance,
security, and seamless user experience across all platforms.
</p>

</div>

</div>

{/* SECTION */}

<section className="srv-section">

<div className="srv-header scroll">
<h2 className="srv-text-reveal srv-text-delay-1">Our Services</h2>
<p className="srv-text-reveal srv-text-delay-2">
We deliver innovative and reliable IT solutions that help businesses grow,
transform digitally, and achieve long-term success.
</p>
</div>

<div className="srv-grid">

{servicesData.map((item,index)=>(

<div
className="srv-card scroll"
key={index}
onClick={()=>toggleCard(index)}
style={{ transitionDelay: `${index * 0.15}s` }}
>

<div className={`srv-inner ${activeCard===index ? "srv-flip":""}`}>

{/* FRONT */}

<div className="srv-front">
<div
className="srv-img"
style={{backgroundImage:`url(${item.icon})`}}
></div>

<div className="srv-content">
<h3>{item.title}</h3>
<p>{item.short}</p>
</div>
</div>

{/* BACK */}

<div className="srv-back">
<h3>{item.title}</h3>
<p>{item.desc}</p>

<button
className="srv-btn"
onClick={(e)=>{
e.stopPropagation();
navigate(item.link);
}}
>
View More Details
</button>

</div>

</div>

</div>

))}

</div>

</section>

</div>

);

}

export default Services;
