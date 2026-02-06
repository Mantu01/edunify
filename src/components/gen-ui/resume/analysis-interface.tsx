import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { CheckCircle, AlertCircle, FileText } from "lucide-react";
import { useRoom } from "@/contexts/room-context";
import MarkdownPreview from "@/components/ui/custome-markdown-preview";

const chartColors = {
  student: ['#fbbf24', '#f59e0b', '#d97706', '#b45309'],
  teacher: ['#10b981', '#059669', '#047857', '#065f46'],
  founder: ['#f97316', '#ea580c', '#c2410c', '#9a3412'],
};

const sectionTitles = {
  ats: 'ATS Compatibility',
  content: 'Content Quality',
  skills: 'Skills Alignment',
  structure: 'Document Structure',
  toneStyle: 'Tone & Style',
};

interface AnalysisSectionProps {
  userRole: 'student' | 'teacher' | 'founder';
}

export function AnalysisSection({ userRole }: AnalysisSectionProps) {

  const {resumeAnalysis:analysis}=useRoom();
  if(!analysis) return null;

  const colors = chartColors[userRole];

  const sectionData = Object.entries(sectionTitles).map(([key, title]) => ({
    name: title,
    score: analysis[key as keyof typeof sectionTitles].score,
  }));

  const radarData = sectionData.map((item) => ({
    subject: item.name,
    score: item.score,
    fullMark: 100,
  }));

  return (
    <ScrollArea className="h-full">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Resume Analysis</h1>
            <p className="text-sm sm:text-base text-gray-500">Detailed insights and recommendations</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <Card className="overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <FileText className="h-5 w-5 shrink-0" />
                <span>Overall Score</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="relative w-full max-w-60 aspect-square">
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <span className="text-4xl sm:text-5xl font-bold">{analysis.overallScore}%</span>
                  </div>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis 
                        dataKey="subject" 
                        tick={{ fontSize: 10 }}
                        className="text-xs"
                      />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                      <Radar name="Score" dataKey="score" stroke={colors[0]} fill={colors[0]} fillOpacity={0.6} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg sm:text-xl">Section Scores</CardTitle>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="w-full h-70 sm:h-75">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={sectionData}
                    margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end" 
                      height={80}
                      interval={0}
                      tick={{ fontSize: 11 }}
                    />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                    <Tooltip 
                      contentStyle={{ fontSize: '12px' }}
                      labelStyle={{ fontWeight: 'bold' }}
                    />
                    <Bar dataKey="score" fill={colors[1]} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg sm:text-xl">Detailed Analysis by Section</CardTitle>
          </CardHeader>
          <CardContent className="pb-6">
            <div className="space-y-4 sm:space-y-6">
              {Object.entries(sectionTitles).map(([key, title]) => {
                const section = analysis[key as keyof typeof sectionTitles];
                return (
                  <div key={key} className="space-y-3 sm:space-y-4 p-3 sm:p-4 rounded-lg border bg-white">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <h3 className="text-base sm:text-lg font-semibold wrap-break-words">{title}</h3>
                      <Badge variant="outline" className="text-sm sm:text-base px-3 py-1 self-start sm:self-auto shrink-0">
                        Score: {section.score}%
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 sm:space-y-3">
                      {section.tips.map((tip, index) => (
                        <div 
                          key={index} 
                          className={`p-3 sm:p-4 rounded-md border ${
                            tip.type === 'good' 
                              ? 'bg-green-50 border-green-200' 
                              : 'bg-amber-50 border-amber-200'
                          }`}
                        >
                          <div className="flex items-start gap-2 sm:gap-3">
                            {tip.type === 'good' ? (
                              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mt-0.5 shrink-0" />
                            ) : (
                              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 mt-0.5 shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <MarkdownPreview className="font-medium text-sm sm:text-base wrap-break-words" markdown={tip.tip} />
                              <p className="text-xs sm:text-sm text-gray-600 mt-1 wrap-break-words">{tip.explanation}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}