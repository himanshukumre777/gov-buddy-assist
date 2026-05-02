export type Scheme = {
  id: string;
  name: string;
  ministry: string;
  category: "Agriculture" | "Education" | "Health" | "Employment" | "Housing" | "Women & Child" | "Finance";
  summary: string;
  benefit: string;
  eligibility: {
    minAge?: number;
    maxAge?: number;
    gender?: "any" | "female" | "male";
    occupation?: string[];
    maxIncome?: number; // annual INR
    state?: string[];
  };
  documents: string[];
  deadline: string; // ISO date
  applyUrl: string;
};

const inDays = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

export const SCHEMES: Scheme[] = [
  {
    id: "pm-kisan",
    name: "PM-KISAN Samman Nidhi",
    ministry: "Ministry of Agriculture",
    category: "Agriculture",
    summary: "Income support of ₹6,000/year to small & marginal farmer families.",
    benefit: "₹6,000 per year (3 instalments of ₹2,000)",
    eligibility: { minAge: 18, occupation: ["farmer"], maxIncome: 200000 },
    documents: ["Aadhaar", "Land records", "Bank passbook"],
    deadline: inDays(21),
    applyUrl: "https://pmkisan.gov.in",
  },
  {
    id: "pmay-g",
    name: "Pradhan Mantri Awas Yojana (Gramin)",
    ministry: "Ministry of Rural Development",
    category: "Housing",
    summary: "Financial assistance to build a pucca house for rural BPL families.",
    benefit: "Up to ₹1.30 lakh financial assistance",
    eligibility: { minAge: 18, maxIncome: 300000 },
    documents: ["Aadhaar", "BPL certificate", "Bank account", "Job Card"],
    deadline: inDays(45),
    applyUrl: "https://pmayg.nic.in",
  },
  {
    id: "ayushman-bharat",
    name: "Ayushman Bharat (PM-JAY)",
    ministry: "Ministry of Health & Family Welfare",
    category: "Health",
    summary: "Health cover of ₹5 lakh per family per year for hospitalisation.",
    benefit: "₹5,00,000 cashless hospitalisation",
    eligibility: { maxIncome: 250000 },
    documents: ["Aadhaar", "Ration card", "SECC verification"],
    deadline: inDays(60),
    applyUrl: "https://pmjay.gov.in",
  },
  {
    id: "sukanya-samriddhi",
    name: "Sukanya Samriddhi Yojana",
    ministry: "Ministry of Finance",
    category: "Women & Child",
    summary: "Small savings scheme for the girl child with high interest.",
    benefit: "8.2% p.a. tax-free returns",
    eligibility: { gender: "female", maxAge: 10 },
    documents: ["Birth certificate of girl", "Parent Aadhaar", "Address proof"],
    deadline: inDays(7),
    applyUrl: "https://www.indiapost.gov.in",
  },
  {
    id: "skill-india",
    name: "PMKVY – Skill India",
    ministry: "Ministry of Skill Development",
    category: "Employment",
    summary: "Free short-term skill training & certification for youth.",
    benefit: "Free training + ₹8,000 reward + certification",
    eligibility: { minAge: 18, maxAge: 35 },
    documents: ["Aadhaar", "Qualification certificate", "Bank account"],
    deadline: inDays(14),
    applyUrl: "https://www.pmkvyofficial.org",
  },
  {
    id: "nsp-scholarship",
    name: "National Scholarship (Post-Matric)",
    ministry: "Ministry of Education",
    category: "Education",
    summary: "Financial assistance to SC/ST/OBC/Minority students post class 10.",
    benefit: "Tuition fee + maintenance allowance",
    eligibility: { minAge: 15, maxAge: 30, maxIncome: 250000 },
    documents: ["Aadhaar", "Income certificate", "Caste certificate", "Marksheet"],
    deadline: inDays(3),
    applyUrl: "https://scholarships.gov.in",
  },
  {
    id: "mudra-loan",
    name: "PM MUDRA Yojana",
    ministry: "Ministry of Finance",
    category: "Finance",
    summary: "Collateral-free loans up to ₹10 lakh for micro enterprises.",
    benefit: "Loan up to ₹10,00,000",
    eligibility: { minAge: 18 },
    documents: ["Aadhaar", "PAN", "Business plan", "Bank statement"],
    deadline: inDays(90),
    applyUrl: "https://www.mudra.org.in",
  },
  {
    id: "ujjwala",
    name: "PM Ujjwala Yojana 2.0",
    ministry: "Ministry of Petroleum",
    category: "Women & Child",
    summary: "Free LPG connection to women from BPL households.",
    benefit: "Free LPG connection + first refill",
    eligibility: { gender: "female", minAge: 18, maxIncome: 200000 },
    documents: ["Aadhaar", "BPL certificate", "Bank passbook"],
    deadline: inDays(30),
    applyUrl: "https://pmuy.gov.in",
  },
];

export const CATEGORIES = [
  "All",
  "Agriculture",
  "Education",
  "Health",
  "Employment",
  "Housing",
  "Women & Child",
  "Finance",
] as const;