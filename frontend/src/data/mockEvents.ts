import { Event } from '@/types/event';
import grafanaImg from '@/assets/Thumbnails/grafana.png';
import elasticImg from '@/assets/Thumbnails/elastic.png';
import talentquotientImg from '@/assets/Thumbnails/talentquotient.png';

export const mockEvents: Event[] = [
  {
    id: "react-pune-meetup-2024",
    title: "Grafana & Friends x Kubernetes Pune Happy Hours",
    description: `Agenda

10:00 AM
Intro and Welcome

10:30 AM - 11:00 AM
Behind the Dashboard: How to Select Prometheus Exporters Wisely
Behind every great dashboard is the right Prometheus exporter. Choosing the wrong exporter can lead to noisy metrics, missing signals, or unnecessary complexity.
In this session, I will walk through the different types of Prometheus exporters — official, vendor-specific, community-driven, and custom-built. I’ll explain the trade-offs, how to evaluate them, and common pitfalls. The talk will also include a practical demo of popular exporters (like Node Exporter, Blackbox Exporter, and a database exporter), along with a quick look at how to build a simple custom exporter.
Speaker: Kuldeep Pilaji (Observability Engineer at SailPoint)

11:10 AM - 11:40 AM
Halyard: How Confluent Seamlessly Deploys Hundreds of Microservices Across Kubernetes Fleets
Halyard is Confluent’s internal deployment platform, purpose-built to make rolling out hundreds of microservices across fleets of Kubernetes clusters effortless. Platform and product teams use Halyard to skip the hassle of complex pipelines and endless YAML, automating reliable, compliant deployments at any scale or region. Join this session to discover how Confluent streamlines fleet-wide microservice delivery with Halyard.
Speaker: Pankaj Dwivedi (Senior Software Engineer II at Confluent)

11:50 AM - 12:20 PM
Building Enterprise-Grade Alerting for Multi Cluster Kubernetes at Scale
When working with complex distributed systems, alerting may seem a very small portion of the monitoring infrastructure when compared to the more significant Metric ingestion and TSDB components. But what if you have to configure and manage an alerting system which has to operate hand in hand to cater multiple clusters and environments? It should be capable of accommodating numerous hundreds of checks in multiple environments of our Kubernetes Infrastructure without introducing any additional friction, even if it involves onboarding a hundred checks simultaneously.
This session covers the system design and thought process that went in implementing a modern alerting system built completely with modern and cloud native standards in mind.
Speaker: Uddhabendra Maity (DevOps SDE II at Helpshift)

12:20 PM - 12:50 PM
Lightning talks: share your Cloud Native journey!
We’re accepting 5-10-minute casual lightning-talk submissions where community members can share their journey adopting cloud native tech, the lessons they’ve learned, and useful resources to help newcomers get started.
Submit your lightning talk here.`,
    shortDescription: "Get ready for an exciting event with Grafana & Friends Pune: Happy Hours! Grafana Labs is all set to host its next happy hour in Pune",
    category: "Tech",
    date: "2025-10-11",
    time: "10:00",
    venue: {
      name: "Caizin",
      address: "Tower 2, Phoenix Fountain Head, 1301/1302, Pune, Maharashtra 411014, India · Pune",
      googleMapsLink: ""
    },
    organizer: {
      name: "By Grafana Labs",
      contact: "reactpune@gmail.com",
      website: ""
    },
    externalLink: "https://www.meetup.com/react-pune",
    image: grafanaImg,
    tags: [],
    isFeatured: true
  },
  {
    id: "startup-networking-baner",
    title: "Elastic Meetup: Real-World Use Cases of the Elastic Stack",
    description: `What You’ll Learn:

​⚡ How Elasticsearch powers search, analytics & data management
​🤖 GenAI + Elastic: RAG pipelines, semantic search, and grounding LLMs with enterprise data
​📊 Observability with logs, metrics, and traces
​🔐 Elastic for Security Analytics & SIEM
​🌍 Scaling Elastic in production environments
​Who Should Join:
Anyone curious about Elasticsearch & Elastic use cases—and more! Whether you’re:

Completely new to Elasticsearch and want a friendly starting point
Clueless about engineering but eager to learn how data really works
Someone who just enjoys random conversations about datastores, search, and engineering
Or already hands-on with Elastic and keen to swap notes with peers. This is the place to start. Everyone’s welcome! 🎉
​Speaker:

Shobhit Verma - “You Can’t Improve What You Can’t Observe: Observability Lessons with Elastic”`,
    shortDescription: " Join us for an exciting Elastic Community Meetup where we’ll explore the power of the Elastic Stack beyond search.",
    category: "Business",
    date: "2025-10-12",
    time: "10:00",
    venue: {
      name: "Entain India",
      address: "Entain India,3rd Floor, Tablespace, Tower B, Panchsheel Business Park, Phase 2, Baner, Pune, Maharashtra 411045 · Pune",
      googleMapsLink: ""
    },
    organizer: {
      name: "By Elastic Pune",
      contact: "connect@puneentrepreneurs.com",
      website: ""
    },
    externalLink: "https://bit.ly/startup-pune-march",
    image: elasticImg,
    tags: [],
    isFeatured: true
  },
  // {
  //   id: "python-data-science-workshop",
  //   title: "Python for Data Science: Hands-on Workshop",
  //   description: "Learn Python fundamentals for data science with hands-on exercises. Perfect for beginners and intermediate learners.",
  //   shortDescription: "Master Python for data science with practical exercises and real-world projects.",
  //   category: "Workshop",
  //   date: "2024-03-20",
  //   time: "14:00",
  //   venue: {
  //     name: "Symbiosis Institute",
  //     address: "Symbiosis Knowledge Village, Lavale, Pune",
  //     googleMapsLink: ""
  //   },
  //   organizer: {
  //     name: "DataScience Pune",
  //     contact: "workshops@datasciencepune.org",
  //     website: ""
  //   },
  //   externalLink: "",
  //   image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop&crop=center",
  //   tags: ["Python", "Data Science", "Machine Learning", "Workshop"],
  //   isFeatured: false
  // },
//   {
//     id: "digital-art-exhibition-wakad",
//     title: "AI Career & Community Day",
//     description: `Dear Community Members,

// Join us on 11th October 2025 at MCCIA (SB Road) Pune for a bespoke gathering of AI/ML professionals, DevOps engineers, MLOps specialists, and Cloud practitioners.

// What’s in it for you?

// Attend tech talks & meetups with industry leaders and tech communities leaders
// ⁠Explore career pathways across AI/ML, MLOps, DevOps & Cloud
// ⁠Learn, network, and connect with peers shaping Pune’s AI ecosystem
// Registration is mandatory

// 📍 MCCIA, SB Road, Pune - 11th October 2025 | 11 AM – 4 PM
// Register now and secure your spot!
// https://www.puneaijobs.com/campaign-landing`,
//     shortDescription: "Join us on 11th October 2025 at MCCIA (SB Road) Pune for a bespoke gathering of AI/ML professionals, DevOps engineers, MLOps specialists, and Cloud practitioners.",
//     category: "Arts",
//     date: "2025-10-11",
//     time: "11:00",
//     venue: {
//       name: "MCCIA Trade Tower",
//       address: "Shekhar Natu Training Hall, No. 3 505 A Wing, 5th floor,, Senapati Bapat Road · Pune",
//       googleMapsLink: ""
//     },
//     organizer: {
//       name: "By Talent Quotient Partners",
//       contact: "info@puneaijobs.com",
//       website: ""
//     },
//     externalLink: "",
//     image: talentquotientImg,
//     tags: [],
//     isFeatured: true
//   },
  // {
  //   id: "badminton-tournament-viman-nagar",
  //   title: "Pune Corporate Badminton Championship 2024",
  //   description: "Join the biggest corporate badminton tournament in Pune. Teams from top companies compete for the championship title.",
  //   shortDescription: "Compete in Pune's premier corporate badminton tournament with teams from top companies.",
  //   category: "Sports",
  //   date: "2024-03-25",
  //   time: "08:00",
  //   venue: {
  //     name: "Pune Sports Complex",
  //     address: "Viman Nagar, Pune",
  //     googleMapsLink: ""
  //   },
  //   organizer: {
  //     name: "Pune Sports Club",
  //     contact: "sports@punesportsclub.com",
  //     website: ""
  //   },
  //   externalLink: "",
  //   image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=400&fit=crop&crop=center",
  //   tags: ["Badminton", "Sports", "Corporate", "Tournament"],
  //   isFeatured: false
  // },
  {
    id: "ai-ml-conference-pune",
    title: "AI & Machine Learning Conference 2024",
    description: "Discover the latest trends in AI and ML. Industry experts share insights on practical applications and future developments.",
    shortDescription: "Learn about the latest AI and ML trends from industry experts and practitioners.",
    category: "Tech",
    date: "2024-03-28",
    time: "09:00",
    venue: {
      name: "Pune Convention Centre",
      address: "Bund Garden, Pune",
      googleMapsLink: ""
    },
    organizer: {
      name: "AI Pune Community",
      contact: "info@aipune.org",
      website: ""
    },
    externalLink: "",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=400&fit=crop&crop=center",
    tags: ["AI", "Machine Learning", "Technology", "Conference"],
    isFeatured: false
  }
];