import { AppleIcon, FacebookIcon, GithubIcon, GoogleIcon, InstagramIcon, LinkedinIcon, MicrosoftIcon, XIcon } from "@/components/auth/icons";
import { BookOpen, FileText, Briefcase, Calendar, Lightbulb, CalendarDays, ClipboardEdit, CheckSquare, TrendingUp, FolderPlus, Users, Presentation, BarChart3, Target, Mail } from "lucide-react";

export type Provider = 'google' | 'github' | 'apple' | 'microsoft' | 'facebook' | 'x' | 'linkedin' | 'instagram';

export interface ProviderProps {
  name: string;
  icon: React.FC<{ size?: number; className?: string }>;
  bgColor: string;
  borderColor: string;
}

export const socialProviders: Record<Provider, ProviderProps> = {
  google: {
    name: 'Google',
    icon: GoogleIcon,
    bgColor: 'hover:bg-blue-50',
    borderColor: 'border-gray-300 hover:border-blue-400'
  },
  github: {
    name: 'GitHub',
    icon: GithubIcon,
    bgColor: 'hover:bg-gray-50',
    borderColor: 'border-gray-300 hover:border-gray-900'
  },
  apple: {
    name: 'Apple',
    icon: AppleIcon,
    bgColor: 'hover:bg-gray-50',
    borderColor: 'border-gray-300 hover:border-gray-900'
  },
  microsoft: {
    name: 'Microsoft',
    icon: MicrosoftIcon,
    bgColor: 'hover:bg-blue-50',
    borderColor: 'border-gray-300 hover:border-blue-400'
  },
  facebook: {
    name: 'Facebook',
    icon: FacebookIcon,
    bgColor: 'hover:bg-blue-50',
    borderColor: 'border-gray-300 hover:border-blue-600'
  },
  x: {
    name: 'X',
    icon: XIcon,
    bgColor: 'hover:bg-gray-50',
    borderColor: 'border-gray-300 hover:border-gray-900'
  },
  linkedin: {
    name: 'LinkedIn',
    icon: LinkedinIcon,
    bgColor: 'hover:bg-blue-50',
    borderColor: 'border-gray-300 hover:border-blue-700'
  },
  instagram: {
    name: 'Instagram',
    icon: InstagramIcon,
    bgColor: 'hover:bg-pink-50',
    borderColor: 'border-gray-300 hover:border-pink-400'
  }
};

export const NAV_LINKS = [
  { name: 'Room', href: '/room', isProtected:true },
  {name:'Explore',href:'/explore'},
  { name: 'About', href: '/about'},
];

export const FEATURES = [
  {
    title: 'AI-Generated Dashboards',
    description: 'Personalized interfaces that adapt to your specific goals and learning style',
    icon: 'LayoutDashboard'
  },
  {
    title: 'Goal-Driven Learning',
    description: 'Set objectives and AI creates a tailored path with real-world tasks',
    icon: 'Target'
  },
  {
    title: 'Skill-Proof Profiles',
    description: 'Demonstrate expertise through verified performance, not just credentials',
    icon: 'ShieldCheck'
  },
  {
    title: 'AI-Assisted Creation',
    description: 'Teachers get intelligent tools to create and scale educational content',
    icon: 'Wand2'
  },
  {
    title: 'Real-World Practice',
    description: 'Learn through practical tasks that mirror industry challenges',
    icon: 'Briefcase'
  },
  {
    title: 'Performance Hiring',
    description: 'Companies hire based on demonstrated skills and project outcomes',
    icon: 'Users'
  }
];

export const HOW_IT_WORKS = [
  {
    step: '1',
    title: 'Choose Your Role',
    description: 'Select student, teacher, or company to get started'
  },
  {
    step: '2',
    title: 'Define Your Goals',
    description: 'Tell us what you want to achieve in plain language'
  },
  {
    step: '3',
    title: 'Get AI Workspace',
    description: 'Receive a personalized dashboard generated for your needs'
  },
  {
    step: '4',
    title: 'Engage & Achieve',
    description: 'Learn, teach, or hire through real tasks with measurable outcomes'
  }
];

export const ROLES = [
  {
    title: 'For Students',
    description: 'Learn marketable skills through real-world projects and get hired based on proven performance',
    cta: 'Start Learning',
    role: 'student',
    color: 'yellow'
  },
  {
    title: 'For Teachers',
    description: 'Create, scale, and track educational impact with AI-assisted content and analytics',
    cta: 'Start Teaching',
    role: 'teacher',
    color: 'orange'
  },
  {
    title: 'For Companies',
    description: 'Hire talent based on verified skills and real project performance, not just resumes',
    cta: 'Start Hiring',
    role: 'founder',
    color: 'green'
  }
];
export const USER_TYPE = [
  { value: "student", label: "Student" },
  { value: "teacher", label: "Teacher" },
  { value: "founder", label: "Founder" }
];

export const COLORS = {
  primary: "rgba(255, 193, 7, 0.1)",
  yellow: "#FFC107",
  green: "#4CAF50",
  orange: "#FF9800",
  red: "#F44336",
  text: "#2C1810",
  background: "#FFF8E1",
  border: "#D7CCC8"
};


export const roleColors = {
  student: {
    border: 'border-yellow-300',
    bg: 'bg-yellow-50/50',
    text: 'text-yellow-700',
    button: 'bg-yellow-500 hover:bg-yellow-600',
    darkBorder: 'dark:border-yellow-800',
    darkBg: 'dark:bg-yellow-950/20'
  },
  teacher: {
    border: 'border-green-300',
    bg: 'bg-green-50/50',
    text: 'text-green-700',
    button: 'bg-green-500 hover:bg-green-600',
    darkBorder: 'dark:border-green-800',
    darkBg: 'dark:bg-green-950/20'
  },
  founder: {
    border: 'border-orange-300',
    bg: 'bg-orange-50/50',
    text: 'text-orange-700',
    button: 'bg-orange-500 hover:bg-orange-600',
    darkBorder: 'dark:border-orange-800',
    darkBg: 'dark:bg-orange-950/20'
  },
};

export const ROLE_DATA = {
  student: {
    title: "Student",
    color: "rgba(205, 184, 0, 0.1)",
    accent: "#FFCC00",
    features: [
      { title: "Start Your Learning Journey", desc: "AI-powered personalized learning path", icon: BookOpen },
      { title: "Generate MCQ Practice Sheets", desc: "Automated question generation for revision", icon: FileText },
      { title: "Build Your Resume", desc: "AI-crafted professional resumes", icon: Briefcase},
      { title: "Study Plan Generator", desc: "Custom weekly learning schedules", icon: Calendar },
      { title: "Concept Explainer", desc: "Simplify complex topics instantly", icon: Lightbulb }
    ]
  },
  teacher: {
    title: "Teacher",
    color: "rgba(34, 197, 94, 0.1)",
    accent: "#22C55E",
    features: [
      { title: "Lesson Planning", desc: "AI-assisted curriculum design", icon: CalendarDays },
      { title: "Create Assignments", desc: "Generate tailored exercises", icon: ClipboardEdit },
      { title: "Assessment Builder", desc: "Create tests with answer keys", icon: CheckSquare },
      { title: "Student Progress Tracker", desc: "Monitor class performance", icon: TrendingUp },
      { title: "Resource Generator", desc: "Teaching materials creation", icon: FolderPlus }
    ]
  },
  founder: {
    title: "Founder",
    color: "rgba(249, 115, 22, 0.1)",
    accent: "#F97316",
    features: [
      { title: "Interview Questions", desc: "Prepare technical interviews", icon: Users },
      { title: "Pitch Deck Builder", desc: "Create investor presentations", icon: Presentation },
      { title: "Market Research", desc: "AI-powered industry analysis", icon: BarChart3 },
      { title: "Business Plan Generator", desc: "Structured planning documents", icon: Target },
      { title: "Investor Outreach", desc: "Craft compelling communications", icon: Mail }
    ]
  }
} as const;

export type RoleType = keyof typeof ROLE_DATA;

export const DIFFICULTY_CONFIG = {
  easy: { label: 'Easy', color: 'bg-green-100 text-green-800 border-green-200' },
  medium: { label: 'Medium', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  hard: { label: 'Hard', color: 'bg-red-100 text-red-800 border-red-200' }
};

export const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

export const OPTION_COLORS = [
  'bg-amber-50/80 border-amber-300 hover:border-amber-400',
  'bg-emerald-50/80 border-emerald-300 hover:border-emerald-400',
  'bg-orange-50/80 border-orange-300 hover:border-orange-400',
  'bg-red-50/80 border-red-300 hover:border-red-400'
];

export const RETRO_COLORS = {
  primary: 'bg-amber-50/10',
  accent: 'text-amber-800',
  border: 'border-amber-300',
  lightBg: 'bg-amber-50/50',
  cardBg: 'bg-white/95'
};