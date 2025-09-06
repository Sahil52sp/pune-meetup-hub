import { Event } from '@/types/event';

export const mockEvents: Event[] = [
  {
    id: "react-pune-meetup-2024",
    title: "React Pune Meetup: Modern React Patterns & Next.js 14",
    description: "Join us for an exciting evening of React development! We'll cover the latest React patterns including Server Components, Suspense, and advanced hooks. Our speakers will share real-world experiences from building production applications with Next.js 14.\n\n**Agenda:**\n- 6:00 PM: Registration & Networking\n- 6:30 PM: Modern React Patterns by Arjun Sharma\n- 7:15 PM: Next.js 14 Deep Dive by Priya Patel\n- 8:00 PM: Q&A and Discussion\n- 8:30 PM: Networking & Refreshments\n\nThis event is perfect for React developers of all levels. Whether you're just starting with React or looking to level up your skills, you'll find valuable insights and connect with like-minded developers in Pune.",
    shortDescription: "Explore modern React patterns, Next.js 14 features, and connect with Pune's React developer community.",
    category: "Tech",
    date: "2024-03-15",
    time: "18:00",
    venue: {
      name: "WeWork Koregaon Park",
      address: "WeWork, 6th Floor, Cerebrum IT Park, Kalyani Nagar, Koregaon Park, Pune, Maharashtra 411014",
      googleMapsLink: "https://maps.google.com/?q=WeWork+Koregaon+Park+Pune"
    },
    organizer: {
      name: "React Pune Community",
      contact: "reactpune@gmail.com",
      website: "https://reactpune.dev"
    },
    externalLink: "https://www.meetup.com/react-pune",
    image: "/api/placeholder/800/400",
    tags: ["React", "Next.js", "JavaScript", "Frontend"],
    isFeatured: true
  },
  {
    id: "startup-networking-baner",
    title: "Startup Networking Evening: Building Tomorrow's Unicorns",
    description: "Connect with Pune's vibrant startup ecosystem! This networking event brings together founders, investors, and startup enthusiasts.\n\n**What to Expect:**\n- Meet fellow entrepreneurs and potential co-founders\n- Pitch your startup idea in our 2-minute pitch session\n- Learn from successful startup founders\n- Network with angel investors and VCs\n- Explore collaboration opportunities\n\n**Special Guests:**\n- Rajesh Kumar, Founder of TechFlow (Exit to Microsoft)\n- Sneha Desai, Angel Investor & Former Product Head at Flipkart\n- Panel discussion on 'Scaling Startups in Tier-2 Cities'\n\nBring your business cards and be ready to make meaningful connections!",
    shortDescription: "Network with entrepreneurs, investors, and startup enthusiasts in Pune's growing tech ecosystem.",
    category: "Business",
    date: "2024-03-18",
    time: "19:00",
    venue: {
      name: "91springboard Baner",
      address: "4th Floor, Cerebrum IT Park, Baner, Pune, Maharashtra 411045",
      googleMapsLink: "https://maps.google.com/?q=91springboard+Baner+Pune"
    },
    organizer: {
      name: "Pune Entrepreneurs Network",
      contact: "connect@puneentrepreneurs.com",
      website: "https://puneentrepreneurs.com"
    },
    externalLink: "https://bit.ly/startup-pune-march",
    image: "/api/placeholder/800/400",
    tags: ["Startup", "Networking", "Entrepreneurship", "Investment"],
    isFeatured: true
  },
  {
    id: "python-data-science-workshop",
    title: "Python for Data Science: Hands-on Workshop",
    description: "Learn Python for data science in this comprehensive hands-on workshop. Perfect for beginners and intermediate programmers looking to break into data science.\n\n**Workshop Curriculum:**\n- Python fundamentals for data science\n- NumPy and Pandas for data manipulation\n- Matplotlib and Seaborn for data visualization\n- Introduction to machine learning with scikit-learn\n- Real-world data science project\n\n**Prerequisites:**\n- Basic programming knowledge (any language)\n- Laptop with Python installed\n- Enthusiasm to learn!\n\n**What's Included:**\n- Workshop materials and datasets\n- Certificate of completion\n- Access to private Slack community\n- Follow-up resources and reading list\n\nLimited seats available. Lunch and refreshments included.",
    shortDescription: "Comprehensive hands-on Python workshop covering data manipulation, visualization, and machine learning basics.",
    category: "Workshop",
    date: "2024-03-20",
    time: "09:00",
    venue: {
      name: "Symbiosis Institute of Computer Studies",
      address: "Symbiosis Knowledge Village, Lavale, Pune, Maharashtra 412115",
      googleMapsLink: "https://maps.google.com/?q=Symbiosis+Lavale+Pune"
    },
    organizer: {
      name: "DataScience Pune",
      contact: "workshops@datasciencepune.org"
    },
    image: "/api/placeholder/800/400",
    tags: ["Python", "Data Science", "Machine Learning", "Workshop"],
    isFeatured: false
  },
  {
    id: "digital-art-exhibition-wakad",
    title: "Digital Art & NFT Exhibition: Future of Creative Expression",
    description: "Immerse yourself in the world of digital art and NFTs. This exhibition showcases works by local Pune artists and explores the intersection of technology and creativity.\n\n**Exhibition Highlights:**\n- 50+ digital artworks by Pune-based artists\n- Interactive NFT gallery\n- Artist talks and panel discussions\n- Live digital art creation sessions\n- Workshop on creating your first NFT\n\n**Featured Artists:**\n- Kavya Iyer - 3D sculptor and AR artist\n- Rohit Mehta - Generative art pioneer\n- Anushka Sharma - Digital illustrator\n\n**Special Events:**\n- 2:00 PM: 'Art Meets Blockchain' panel discussion\n- 4:00 PM: NFT creation workshop\n- 6:00 PM: Networking reception\n\nEntry includes exhibition catalog and welcome drink.",
    shortDescription: "Explore digital art and NFTs by local Pune artists, with interactive galleries and creation workshops.",
    category: "Arts",
    date: "2024-03-22",
    time: "14:00",
    venue: {
      name: "Pune Art Gallery",
      address: "Arts Council, Wakad, Pune, Maharashtra 411057",
      googleMapsLink: "https://maps.google.com/?q=Pune+Art+Gallery+Wakad"
    },
    organizer: {
      name: "Digital Arts Collective Pune",
      contact: "info@digitalartspune.in",
      website: "https://digitalartspune.in"
    },
    image: "/api/placeholder/800/400",
    tags: ["Digital Art", "NFT", "Blockchain", "Exhibition"],
    isFeatured: true
  },
  {
    id: "badminton-tournament-viman-nagar",
    title: "Pune Corporate Badminton Championship 2024",
    description: "The biggest corporate badminton tournament in Pune is back! Companies from across the city compete in this exciting championship.\n\n**Tournament Categories:**\n- Men's Singles & Doubles\n- Women's Singles & Doubles\n- Mixed Doubles\n- Corporate Team Events\n\n**Registration Details:**\n- Team registration: ₹2000 per team\n- Individual events: ₹300 per person\n- Early bird discount: 20% off before March 10th\n\n**Prizes:**\n- Winner: ₹25,000 + Trophy\n- Runner-up: ₹15,000 + Trophy\n- Semi-finalists: ₹5,000 + Medal\n- Participation certificates for all\n\n**Tournament Schedule:**\n- 8:00 AM: Registration & warm-up\n- 9:00 AM: Opening ceremony\n- 9:30 AM: Matches begin\n- 6:00 PM: Finals & prize distribution\n\nSponsored by Sports Authority of India and Pune Municipal Corporation.",
    shortDescription: "Pune's premier corporate badminton championship with teams from leading companies across the city.",
    category: "Sports",
    date: "2024-03-24",
    time: "08:00",
    venue: {
      name: "Balewadi Sports Complex",
      address: "Balewadi, Pune, Maharashtra 411045",
      googleMapsLink: "https://maps.google.com/?q=Balewadi+Sports+Complex+Pune"
    },
    organizer: {
      name: "Pune Sports Federation",
      contact: "tournaments@punesports.org"
    },
    externalLink: "https://punesports.org/badminton-championship",
    image: "/api/placeholder/800/400",
    tags: ["Badminton", "Sports", "Corporate", "Tournament"],
    isFeatured: false
  },
  {
    id: "devops-kubernetes-meetup",
    title: "DevOps Pune: Kubernetes in Production - Lessons Learned",
    description: "Join the DevOps Pune community for an insightful session on running Kubernetes in production environments.\n\n**Session Topics:**\n- Kubernetes cluster management at scale\n- Monitoring and observability best practices\n- Security considerations and RBAC\n- CI/CD pipeline integration\n- Cost optimization strategies\n- Disaster recovery and backup solutions\n\n**Speakers:**\n- Amit Singh, Senior DevOps Engineer at Persistent Systems\n- Sarah Johnson, Cloud Architect at Infosys\n- Hands-on demo: Setting up production-ready K8s cluster\n\n**Agenda:**\n- 6:00 PM: Networking & Snacks\n- 6:30 PM: Kubernetes Production Stories\n- 7:30 PM: Live Demo Session\n- 8:00 PM: Open Discussion & Q&A\n\nBring your laptops for the hands-on session!",
    shortDescription: "Learn Kubernetes production best practices with hands-on demos and real-world case studies.",
    category: "Tech",
    date: "2024-03-25",
    time: "18:00",
    venue: {
      name: "Persistent Systems Auditorium",
      address: "Bhageerath, 402, Senapati Bapat Rd, Pune, Maharashtra 411016",
      googleMapsLink: "https://maps.google.com/?q=Persistent+Systems+Pune"
    },
    organizer: {
      name: "DevOps Pune",
      contact: "organizers@devopspune.com"
    },
    image: "/api/placeholder/800/400",
    tags: ["DevOps", "Kubernetes", "Cloud", "Production"],
    isFeatured: false
  },
  {
    id: "women-leadership-summit",
    title: "Women in Leadership Summit: Breaking Barriers Together",
    description: "Empowering women leaders across industries. Join successful women executives, entrepreneurs, and change-makers for inspiring talks and networking.\n\n**Summit Highlights:**\n- Keynote by Dr. Priya Nair, CEO of BioTech Innovations\n- Panel: 'Women in STEM: Creating Inclusive Workplaces'\n- Workshop: 'Negotiation Skills for Career Growth'\n- Fireside chat with successful women entrepreneurs\n- Networking lunch with industry leaders\n\n**Key Topics:**\n- Leadership in the digital age\n- Work-life integration strategies\n- Building diverse and inclusive teams\n- Entrepreneurship and risk-taking\n- Mentorship and sponsorship\n\n**Special Recognition:**\n- 'Women Leader of the Year' awards\n- Startup pitch competition for women founders\n- Mentorship matching program launch\n\nThis summit is designed to inspire, educate, and connect women across all career stages.",
    shortDescription: "Inspiring summit for women leaders featuring keynotes, panels, and networking opportunities.",
    category: "Business",
    date: "2024-03-28",
    time: "09:00",
    venue: {
      name: "JW Marriott Pune",
      address: "Senapati Bapat Road, Pune, Maharashtra 411053",
      googleMapsLink: "https://maps.google.com/?q=JW+Marriott+Pune"
    },
    organizer: {
      name: "Women Leaders Network Pune",
      contact: "summit@womenleaderspune.org",
      website: "https://womenleaderspune.org"
    },
    externalLink: "https://wlsummit2024.com",
    image: "/api/placeholder/800/400",
    tags: ["Leadership", "Women", "Networking", "Career"],
    isFeatured: true
  },
  {
    id: "blockchain-workshop-basics",
    title: "Blockchain Fundamentals: From Bitcoin to Smart Contracts",
    description: "Comprehensive workshop covering blockchain technology from basics to advanced concepts. Perfect for developers and business professionals.\n\n**Workshop Modules:**\n- Introduction to distributed ledger technology\n- Bitcoin and cryptocurrency fundamentals\n- Ethereum and smart contract development\n- DeFi and Web3 applications\n- Hands-on: Deploy your first smart contract\n- Real-world blockchain use cases\n\n**What You'll Learn:**\n- How blockchain technology works\n- Difference between various blockchain platforms\n- Smart contract programming basics\n- Cryptocurrency trading and wallets\n- Career opportunities in blockchain\n\n**Prerequisites:**\n- Basic programming knowledge helpful but not required\n- Laptop with internet connection\n- MetaMask wallet (we'll help you set it up)\n\n**Bonus:**\n- Free cryptocurrency tokens for hands-on practice\n- Access to online blockchain development course\n- Certificate of completion\n- Job placement assistance for top performers",
    shortDescription: "Learn blockchain fundamentals, smart contracts, and Web3 development in this comprehensive workshop.",
    category: "Workshop",
    date: "2024-03-30",
    time: "10:00",
    venue: {
      name: "TechHub Pune",
      address: "3rd Floor, Magarpatta City, Hadapsar, Pune, Maharashtra 411028",
      googleMapsLink: "https://maps.google.com/?q=TechHub+Magarpatta+Pune"
    },
    organizer: {
      name: "Blockchain Academy Pune",
      contact: "learn@blockchainpune.edu"
    },
    image: "/api/placeholder/800/400",
    tags: ["Blockchain", "Cryptocurrency", "Smart Contracts", "Web3"],
    isFeatured: false
  },
  {
    id: "photography-meetup-monsoon",
    title: "Monsoon Photography Meetup: Capturing Pune's Beauty",
    description: "Join fellow photography enthusiasts for a monsoon-themed photo walk around Pune's most scenic locations.\n\n**Photo Walk Itinerary:**\n- 6:00 AM: Meet at Shaniwar Wada\n- 6:30 AM: Sunrise shots at Parvati Hill\n- 8:00 AM: Street photography in Old City\n- 10:00 AM: Breakfast break & photo sharing\n- 11:00 AM: Nature shots at Saras Baug\n- 1:00 PM: Lunch & photo review session\n\n**What to Bring:**\n- DSLR/Mirrorless camera (or smartphone)\n- Waterproof camera cover\n- Extra batteries and memory cards\n- Comfortable walking shoes\n- Light rain jacket\n\n**Photography Tips Covered:**\n- Monsoon photography techniques\n- Composition and lighting\n- Street photography ethics\n- Post-processing basics\n- Instagram-worthy shot tips\n\n**Special Features:**\n- Professional photographer mentorship\n- Photo contest with prizes\n- Instant photo printing station\n- Group exhibition opportunity",
    shortDescription: "Monsoon photography walk covering Pune's iconic locations with professional mentorship and photo contests.",
    category: "Arts",
    date: "2024-07-15",
    time: "06:00",
    venue: {
      name: "Shaniwar Wada (Starting Point)",
      address: "Shaniwar Peth, Pune, Maharashtra 411030",
      googleMapsLink: "https://maps.google.com/?q=Shaniwar+Wada+Pune"
    },
    organizer: {
      name: "Pune Photography Club",
      contact: "photowalks@punephotography.com"
    },
    image: "/api/placeholder/800/400",
    tags: ["Photography", "Monsoon", "Photo Walk", "Art"],
    isFeatured: false
  },
  {
    id: "ai-ml-conference-2024",
    title: "AI/ML Conference Pune 2024: The Future is Now",
    description: "Pune's premier conference on Artificial Intelligence and Machine Learning featuring industry leaders and cutting-edge research.\n\n**Conference Tracks:**\n- **Research Track:** Latest AI/ML research from academia\n- **Industry Track:** Real-world AI implementations\n- **Startup Track:** AI-powered startups and innovations\n- **Ethics Track:** Responsible AI and bias in algorithms\n\n**Keynote Speakers:**\n- Dr. Radhika Krishnan, Research Scientist at Google DeepMind\n- Vikram Patel, Head of AI at Microsoft India\n- Prof. Anjali Singh, IIT Bombay AI Research Lab\n\n**Workshop Sessions:**\n- Deep Learning with PyTorch\n- Computer Vision applications\n- Natural Language Processing\n- MLOps and model deployment\n- Generative AI and Large Language Models\n\n**Networking Opportunities:**\n- Startup expo and demo sessions\n- Job fair with top tech companies\n- AI researcher meetup\n- Industry-academia collaboration forum",
    shortDescription: "Premier AI/ML conference featuring research presentations, industry talks, and hands-on workshops.",
    category: "Tech",
    date: "2024-04-05",
    time: "09:00",
    venue: {
      name: "Pune International Centre",
      address: "Koregaon Park, Pune, Maharashtra 411001",
      googleMapsLink: "https://maps.google.com/?q=Pune+International+Centre"
    },
    organizer: {
      name: "AI/ML Pune Community",
      contact: "conference@aimlpune.org",
      website: "https://aimlconf2024.com"
    },
    externalLink: "https://aimlconf2024.com/register",
    image: "/api/placeholder/800/400",
    tags: ["AI", "Machine Learning", "Deep Learning", "Conference"],
    isFeatured: true
  }
];

// Helper functions for filtering and searching
export const getEventsByCategory = (category: string) => {
  return mockEvents.filter(event => event.category.toLowerCase() === category.toLowerCase());
};

export const getFeaturedEvents = () => {
  return mockEvents.filter(event => event.isFeatured);
};

export const searchEvents = (query: string) => {
  const lowercaseQuery = query.toLowerCase();
  return mockEvents.filter(event => 
    event.title.toLowerCase().includes(lowercaseQuery) ||
    event.description.toLowerCase().includes(lowercaseQuery) ||
    event.shortDescription.toLowerCase().includes(lowercaseQuery) ||
    event.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
    event.organizer.name.toLowerCase().includes(lowercaseQuery)
  );
};

export const getEventById = (id: string) => {
  return mockEvents.find(event => event.id === id);
};

export const categories = ['Tech', 'Business', 'Arts', 'Sports', 'Networking', 'Workshop'] as const;