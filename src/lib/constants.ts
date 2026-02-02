import { AppleIcon, FacebookIcon, GithubIcon, GoogleIcon, InstagramIcon, LinkedinIcon, MicrosoftIcon, XIcon } from "@/components/auth/icons";

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

export const AUTH_TYPES = {
  LOGIN: "login",
  SIGNUP: "signup"
};

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
    border: 'border-orange-300',
    bg: 'bg-orange-50/50',
    text: 'text-orange-700',
    button: 'bg-orange-500 hover:bg-orange-600',
    darkBorder: 'dark:border-orange-800',
    darkBg: 'dark:bg-orange-950/20'
  },
  founder: {
    border: 'border-green-300',
    bg: 'bg-green-50/50',
    text: 'text-green-700',
    button: 'bg-green-500 hover:bg-green-600',
    darkBorder: 'dark:border-green-800',
    darkBg: 'dark:bg-green-950/20'
  }
};

export const ROLE_DATA = {
  student: {
    title: "Student Dashboard",
    description: "Enhance your learning journey with AI-powered tools",
    primaryColor: "bg-yellow-100 dark:bg-yellow-900/20",
    accentColor: "text-yellow-600 dark:text-yellow-400",
    actions: [
      {
        title: "Start Learning with AI",
        description: "Personalized learning paths and explanations",
        icon: "Brain",
        content: "ai-learning"
      },
      {
        title: "Practice MCQs",
        description: "Test your knowledge with AI-generated questions",
        icon: "FileQuestion",
        content: "mcq"
      },
      {
        title: "Build Your Resume",
        description: "AI-assisted resume builder with templates",
        icon: "FileText",
        content: "resume-builder"
      }
    ],
    greeting: "Ready to level up your skills?"
  },
  teacher: {
    title: "Teacher Dashboard",
    description: "Create engaging content and manage your classes",
    primaryColor: "bg-green-100 dark:bg-green-900/20",
    accentColor: "text-green-600 dark:text-green-400",
    actions: [
      {
        title: "Create Test",
        description: "Generate customized tests and assessments",
        icon: "ClipboardList",
        content: "mcq"
      },
      {
        title: "Lesson Planning",
        description: "AI-powered lesson plan generator",
        icon: "CalendarDays",
        content: "lesson-plan"
      },
      {
        title: "Grade Assignments",
        description: "Review and grade student submissions",
        icon: "CheckSquare",
        content: "assignments"
      }
    ],
    greeting: "Shape the future of education"
  },
  founder: {
    title: "Founder Dashboard",
    description: "Manage hiring and team development",
    primaryColor: "bg-orange-100 dark:bg-orange-900/20",
    accentColor: "text-orange-600 dark:text-orange-400",
    actions: [
      {
        title: "Create Interview Assignments",
        description: "Design technical interviews and tasks",
        icon: "Briefcase",
        content: "assignments"
      },
      {
        title: "Team Assessments",
        description: "Evaluate team performance and skills",
        icon: "Users",
        content: "assessments"
      },
      {
        title: "Project Planning",
        description: "Strategic planning with AI insights",
        icon: "Target",
        content: "project-plan"
      }
    ],
    greeting: "Build your dream team"
  }
};

export type UserRole = keyof typeof ROLE_DATA;
export type ContentType = "default" | "mcq" | "ai-learning" | "resume-builder" | "lesson-plan" | "assignments" | "assessments" | "project-plan";