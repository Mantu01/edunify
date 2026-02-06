"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { FileText, History, BarChart3, Brain, User, Clock, Download, Sparkles, ChevronRight, BookOpen, CheckCircle } from "lucide-react";
import { z } from "zod";
import { roleColors } from "@/lib/constants";

export const ResumeAnalysisSchema = z.object({
  ATS: z.object({
    score: z.number(),
    tips: z.array(z.string())
  }),
  content: z.object({
    score: z.number(),
    tips: z.array(z.string())
  }),
  skills: z.object({
    score: z.number(),
    tips: z.array(z.string())
  }),
  structure: z.object({
    score: z.number(),
    tips: z.array(z.string())
  }),
  tonestyle: z.object({
    score: z.number(),
    tips: z.array(z.string())
  }),
  overallScore: z.number()
});

type ResumeAnalysis = z.infer<typeof ResumeAnalysisSchema>;
type UserRole = "student" | "teacher" | "founder";

interface AnalysisHistoryItem {
  id: string;
  date: string;
  score: number;
  role: UserRole;
}

interface SidebarProps {
  history: AnalysisHistoryItem[];
  userRole: UserRole;
  onNewAnalysis: () => void;
  onSelectHistory: (id: string) => void;
}

interface AnalyticsComponentProps {
  analysisData: ResumeAnalysis;
  userRole: UserRole;
  pdfUrl: string;
  onGenerateQuestions: () => Promise<string[]>;
}

const ANALYSIS_HISTORY: AnalysisHistoryItem[] = [
  { id: "1", date: "2024-03-15", score: 85, role: "student" },
  { id: "2", date: "2024-03-10", score: 92, role: "student" },
  { id: "3", date: "2024-03-05", score: 78, role: "student" },
  { id: "4", date: "2024-03-01", score: 88, role: "teacher" },
  { id: "5", date: "2024-02-28", score: 95, role: "founder" }
];

const CATEGORIES = [
  { key: "ATS", label: "ATS Optimization", icon: CheckCircle },
  { key: "content", label: "Content Quality", icon: FileText },
  { key: "skills", label: "Skills Match", icon: Brain },
  { key: "structure", label: "Structure", icon: BookOpen },
  { key: "tonestyle", label: "Tone & Style", icon: User }
];

const SidebarComponent = ({ history, userRole, onNewAnalysis, onSelectHistory }: SidebarProps) => {
  const colors = roleColors[userRole];

  return (
    <Card className="h-full border-r rounded-r-none flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <History className="h-5 w-5" />
          Analysis History
        </CardTitle>
        <CardDescription>Recent resume analyses</CardDescription>
      </CardHeader>
      <div className="px-4 pb-4">
        <Button onClick={onNewAnalysis} className={`w-full ${colors.button} text-white`}>
          <Sparkles className="mr-2 h-4 w-4" />
          New Analysis
        </Button>
      </div>
      <Separator />
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-3 py-4">
          {history.map((item) => (
            <Card key={item.id} className={`cursor-pointer transition-all hover:shadow-md ${roleColors[item.role].border} border-2`} onClick={() => onSelectHistory(item.id)}>
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-md ${roleColors[item.role].bg}`}>
                      <FileText className={`h-4 w-4 ${roleColors[item.role].text}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Resume Analysis</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {item.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={roleColors[item.role].text}>
                      {item.score}%
                    </Badge>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};

const AnalyticsComponent = ({ analysisData, userRole, pdfUrl, onGenerateQuestions }: AnalyticsComponentProps) => {
  const [questions, setQuestions] = useState<string[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const colors = roleColors[userRole];

  const handleGenerateQuestions = async () => {
    setLoadingQuestions(true);
    try {
      const generatedQuestions = await onGenerateQuestions();
      setQuestions(generatedQuestions);
    } catch (error) {
      console.error("Failed to generate questions:", error);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6 h-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className={`col-span-2 ${colors.border} border-2`}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6" />
              Resume Analysis Dashboard
            </CardTitle>
            <CardDescription>Comprehensive breakdown of your resume performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Overall Score</h3>
                  <Badge className={`text-lg px-3 py-1 ${getScoreColor(analysisData.overallScore)}`}>
                    {analysisData.overallScore}%
                  </Badge>
                </div>
                <Progress value={analysisData.overallScore} className="h-3" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {CATEGORIES.map((category) => {
                  const Icon = category.icon;
                  const score = analysisData[category.key as keyof ResumeAnalysis]?.score || 0;
                  return (
                    <Card key={category.key} className={`${colors.bg} border`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            <span className="text-sm font-medium">{category.label}</span>
                          </div>
                          <Badge variant="secondary">{score}%</Badge>
                        </div>
                        <Progress value={score} className="h-2" />
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`${colors.border} border-2`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Resume Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-[3/4] rounded-md overflow-hidden border">
              <iframe src={pdfUrl} className="w-full h-full" title="Resume PDF" />
            </div>
            <Button variant="outline" className="w-full" onClick={() => window.open(pdfUrl, "_blank")}>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Improvement Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="ATS">
              <TabsList className="grid grid-cols-5">
                {CATEGORIES.map((category) => (
                  <TabsTrigger key={category.key} value={category.key}>
                    {category.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              {CATEGORIES.map((category) => (
                <TabsContent key={category.key} value={category.key} className="space-y-2">
                  <ScrollArea className="h-48">
                    <ul className="space-y-2 p-2">
                      {analysisData[category.key as keyof ResumeAnalysis]?.tips.map((tip, index) => (
                        <li key={index} className="flex items-start gap-2 p-2 rounded-md hover:bg-muted">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Interview Questions</span>
              <Button onClick={handleGenerateQuestions} disabled={loadingQuestions} size="sm">
                <Brain className="mr-2 h-4 w-4" />
                {loadingQuestions ? "Generating..." : "Generate"}
              </Button>
            </CardTitle>
            <CardDescription>AI-generated questions based on your resume</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-3 p-2">
                {questions.length > 0 ? (
                  questions.map((question, index) => (
                    <Card key={index} className="border">
                      <CardContent className="p-3">
                        <p className="text-sm">{question}</p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Brain className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>Generate interview questions to start practicing</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const MainComponent = () => {
  const [userRole, setUserRole] = useState<UserRole>("student");
  const [analysisData, setAnalysisData] = useState<ResumeAnalysis>({
    ATS: { score: 85, tips: ["Optimize keywords for ATS scanning", "Use standard section headers", "Remove graphics that ATS can't read"] },
    content: { score: 78, tips: ["Quantify achievements with metrics", "Add more action verbs", "Include relevant projects"] },
    skills: { score: 92, tips: ["Excellent technical skills listing", "Good soft skills representation", "Consider adding certifications"] },
    structure: { score: 80, tips: ["Maintain consistent formatting", "Improve white space balance", "Check font consistency"] },
    tonestyle: { score: 75, tips: ["Use more professional tone", "Avoid casual language", "Maintain consistent tense"] },
    overallScore: 82
  });
  const [pdfUrl] = useState("https://example.com/resume.pdf");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleNewAnalysis = () => {
    console.log("Starting new analysis...");
  };

  const handleSelectHistory = (id: string) => {
    console.log("Selected history item:", id);
  };

  const handleGenerateQuestions = async (): Promise<string[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          "Can you walk me through your experience with React and TypeScript?",
          "How do you approach optimizing application performance?",
          "Describe a challenging project and how you overcame obstacles?",
          "What's your experience with backend integration?",
          "How do you stay updated with the latest frontend technologies?"
        ]);
      }, 1500);
    });
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 font-sans antialiased p-4 md:p-6">
      <div className="h-full flex flex-col">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Resume Analysis</h1>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className={roleColors[userRole].text}>
                  {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                </Badge>
                <span className="text-sm text-muted-foreground">Role-based analytics</span>
              </div>
            </div>
            <div className="flex gap-2">
              {(["student", "teacher", "founder"] as UserRole[]).map((role) => (
                <Button key={role} variant={userRole === role ? "default" : "outline"} size="sm" onClick={() => setUserRole(role)}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          {isMobile ? (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="mb-4">
                  <History className="mr-2 h-4 w-4" />
                  Show History
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <SidebarComponent
                  history={ANALYSIS_HISTORY.filter(item => item.role === userRole)}
                  userRole={userRole}
                  onNewAnalysis={handleNewAnalysis}
                  onSelectHistory={handleSelectHistory}
                />
              </SheetContent>
              <ScrollArea className="h-[calc(100vh-12rem)]">
                <AnalyticsComponent
                  analysisData={analysisData}
                  userRole={userRole}
                  pdfUrl={pdfUrl}
                  onGenerateQuestions={handleGenerateQuestions}
                />
              </ScrollArea>
            </Sheet>
          ) : (
            <div className="grid grid-cols-4 h-full gap-6">
              <div className="col-span-1">
                <SidebarComponent
                  history={ANALYSIS_HISTORY.filter(item => item.role === userRole)}
                  userRole={userRole}
                  onNewAnalysis={handleNewAnalysis}
                  onSelectHistory={handleSelectHistory}
                />
              </div>
              <div className="col-span-3">
                <ScrollArea className="h-full pr-4">
                  <AnalyticsComponent
                    analysisData={analysisData}
                    userRole={userRole}
                    pdfUrl={pdfUrl}
                    onGenerateQuestions={handleGenerateQuestions}
                  />
                </ScrollArea>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainComponent;