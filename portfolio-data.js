const DEFAULT_DATA = {
  profile: {
    name: "Rampam Karthik",
    title: "AI Engineer & Full-Stack Developer",
    email: "karthikroyals0529@gmail.com",
    phone: "+91 7842884543",
    location: "Bangalore, India",
    githubUrl: "https://github.com/karthik-rampam",
    linkedinUrl: "https://www.linkedin.com/in/karthik-rampam/",
    badge: "Open to Opportunities",
    tagline: "Building intelligent systems at the intersection of",
    taglineHighlight: "AI Agents · RAG Systems · Automation",
    heroBg: "hero_bg.png",
    profileImages: [
      "0cdd7bde-9daa-49e6-8803-d808f986d329 (1).png",
      "469ec785-1af2-4262-9156-053802ed1459 (1).png"
    ],
    roles: [
      "RAG Systems Builder",
      "Automation Architect",
      "Full-Stack Developer"
    ]
  },

  about: {
    lead: "I'm an <strong>Information Technology student</strong> at Christ University, Bangalore, specializing in <strong>Artificial Intelligence and Machine Learning</strong>.",
    paragraphs: [
      "I have hands-on experience building AI agents, RAG systems, and automation workflows. My work spans Python, LLM integrations, and data-driven applications — including real-time dashboards and intelligent assistants.",
      "I thrive at the intersection of software engineering and applied AI, turning complex ideas into production-ready systems."
    ]
  },

  experience: [
    {
      title: "Machine Learning Intern",
      company: "Cognifyz Technologies",
      date: "Apr 2025 – May 2025",
      bullets: [
        "Built end-to-end ML pipelines — regression, classification, and a content-based recommendation engine — achieving <strong>87% classification accuracy</strong> on a 10,000-row restaurant dataset.",
        "Engineered <strong>12+ features</strong> through preprocessing and EDA; reduced model error by ~15% via feature selection and hyperparameter tuning.",
        "Delivered visual insights via Matplotlib/Seaborn reports adopted by the team for stakeholder presentations."
      ],
      tags: ["Python", "Scikit-learn", "Pandas", "Matplotlib", "Seaborn"]
    }
  ],

  skills: [
    { category: "AI & Machine Learning", icon: "chip.png", items: ["RAG Systems", "LangChain", "Vector DBs", "LLM Fine-tuning", "Prompt Engineering"] },
    { category: "Full-Stack Development", icon: "programming-language.png", items: ["Node.js", "Express", "FastAPI", "React", "MongoDB"] },
    { category: "Automation & BI", icon: "data-visualization.png", items: ["Make.com", "Power BI", "Monday.com API", "Zapier"] },
    { category: "Cloud & DevOps", icon: "wrench.png", items: ["AWS Cloud", "Firebase", "Docker", "Git/GitHub"] }
  ],

  projects: [
    {
      id: "proj-1",
      title: "Multimodal Research Agent",
      overlay: "AI Agent",
      image: "project_multimodal_agent.png",
      images: ["project_multimodal_agent.png"],
      description: "Advanced AI agent capable of synthesizing research from text, charts, and diagrams using state-of-the-art vision models and automated retrieval workflows.",
      highlights: [
        "Dynamic tool-calling for live data retrieval",
        "Visual reasoning across complex technical diagrams"
      ],
      tags: ["Python", "Multi-Agent", "Vision LLMs"]
    },
    {
      id: "proj-2",
      title: "Production RAG Assistant",
      overlay: "NLP · Backend",
      image: "project_rag_assistant.png",
      images: ["project_rag_assistant.png"],
      description: "Enterprise-grade RAG system supporting 100+ page documents with semantic chunking, vector indexing, and context-aware LLM prompting.",
      highlights: [
        "<strong>40% reduction</strong> in hallucination vs. baseline",
        "Optimized retrieval re-ranking pipeline"
      ],
      tags: ["LangChain", "Vector DB", "FastAPI"]
    },
    {
      id: "proj-3",
      title: "BioTech AI Learning Platform",
      overlay: "EdTech · AI",
      image: "project_biotech_platform.png",
      images: ["project_biotech_platform.png"],
      description: "AI-driven biotech education portal for students with personalized learning tools, virtual labs, and automated quiz generation.",
      highlights: [
        "ChromDB + LangChain with Gemini responses",
        "Interactive virtual lab simulations"
      ],
      tags: ["FastAPI", "React", "Gemini"]
    },
    {
      id: "proj-4",
      title: "IoT Fall Detection Dashboard",
      overlay: "IoT · Dashboard",
      image: "project_fall_detection.png",
      images: ["project_fall_detection.png"],
      description: "Real-time monitoring dashboard for IoT fall detection alerts with remote device management and multi-tenant support.",
      highlights: [
        "Role-based access control (RBAC) integration",
        "Live device telemetry visualization"
      ],
      tags: ["Node.js", "Firebase", "Express"]
    }
  ],

  education: {
    degree: "B.Tech in Information Technology",
    honors: "Honors Specialization in Artificial Intelligence & Machine Learning",
    school: "Christ University, Bangalore, Karnataka",
    year: "Expected 2027",
    cgpa: "3.32 / 4.0"
  },

  certifications: [
    { logo: "Screenshot 2026-05-06 4.png", logoClass: "aws", title: "Academy Cloud Foundations", issuer: "Amazon Web Services" },
    { logo: "Screenshot 2026-05-06 5.png", logoClass: "guvi", title: "AI – Impact Summit 2026", issuer: "GUVI · HCL" },
    { logo: "BI", logoClass: "bi", title: "Power BI Mastery", issuer: "Udemy" },
    { logo: "CY", logoClass: "nptel", title: "Cyber Security & Privacy", issuer: "NPTEL" }
  ]
};

// ── Helpers ──────────────────────────────────────────────────────────────────
function loadPortfolioData() {
  try {
    const s = localStorage.getItem('portfolioData');
    return s ? JSON.parse(s) : JSON.parse(JSON.stringify(DEFAULT_DATA));
  } catch (e) {
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
  }
}

function savePortfolioData(data) {
  try {
    localStorage.setItem('portfolioData', JSON.stringify(data));
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      alert("❌ Storage Limit Exceeded!\n\nYour portfolio data (mostly images) is too large to save in the browser. \n\nPlease try to:\n1. Remove some images.\n2. Use smaller image files.\n3. Use image URLs instead of uploading files.");
    }
    console.error("Save failed:", e);
  }
}

// ── FIRESTORE SYNC ──────────────────────────────────────────────────────────
let db = null;

async function initFirestore() {
  if (typeof firebase === 'undefined') return;
  if (!firebase.apps.length) {
    firebase.initializeApp(window.firebaseConfig);
  }
  db = firebase.firestore();
}

async function fetchPortfolioData() {
  await initFirestore();
  if (!db) return loadLocalData();
  
  try {
    const doc = await db.collection('portfolios').doc('main').get();
    if (doc.exists) {
      console.log("✅ Data loaded from Firestore");
      return doc.data();
    }
  } catch (e) {
    console.warn("Firestore fetch failed, using local/db data:", e);
  }
  return null;
}

async function savePortfolioData(data) {
  // 1. Save to local storage for instant feedback
  saveLocalData(data);

  // 2. Save to Firestore
  await initFirestore();
  if (!db) return;

  try {
    await db.collection('portfolios').doc('main').set(data);
    console.log("✅ Data synced with Firestore");
  } catch (e) {
    console.error("❌ Firestore sync failed:", e);
    alert("Warning: Could not sync with Cloud Database.");
  }
}

// ── INITIALIZATION ────────────────────────────────────────────────────────────
async function initPortfolioData() {
  // Try Cloud first
  const cloudData = await fetchPortfolioData();
  if (cloudData) {
    window.portfolioData = cloudData;
    if (window.renderPortfolio) window.renderPortfolio();
    return cloudData;
  }

  // Fallback 1: localStorage
  let data = loadLocalData();

  // Fallback 2: data.db
  if (JSON.stringify(data) === JSON.stringify(DEFAULT_DATA)) {
    try {
      const res = await fetch('data.db');
      if (res.ok) {
        const dbData = await res.json();
        data = dbData;
        window.portfolioData = data;
        if (window.renderPortfolio) window.renderPortfolio();
      }
    } catch (e) {}
  }
  return data;
}

// ── Local Storage Fallbacks ──────────────────────────────────────────────────
function loadLocalData() {
  try {
    const s = localStorage.getItem('portfolioData');
    return s ? JSON.parse(s) : JSON.parse(JSON.stringify(DEFAULT_DATA));
  } catch (e) {
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
  }
}

function saveLocalData(data) {
  try {
    localStorage.setItem('portfolioData', JSON.stringify(data));
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      alert("❌ Storage Limit Exceeded! Please use smaller images.");
    }
    console.error("Local save failed:", e);
  }
}

function resetPortfolioData() {
  localStorage.removeItem('portfolioData');
  return JSON.parse(JSON.stringify(DEFAULT_DATA));
}

// Global Exports
window.portfolioData = loadLocalData();
window.defaultData = DEFAULT_DATA;
window.savePortfolioData = savePortfolioData;
window.resetPortfolioData = resetPortfolioData;

// Run Sync
initPortfolioData();
