"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BookOpen, Clock, Users, Target, Layers, FileText, ListOrdered, GraduationCap, BarChart, Home, Lightbulb, AlertCircle } from "lucide-react";
import { useRoom } from "@/contexts/room-context";


const CLASS_TYPE_COLORS: Record<string, string> = { online: "bg-blue-100 text-blue-800", offline: "bg-green-100 text-green-800", hybrid: "bg-purple-100 text-purple-800" };
const STUDENT_LEVEL_COLORS: Record<string, string> = { beginner: "bg-green-100 text-green-800", intermediate: "bg-yellow-100 text-yellow-800", advanced: "bg-orange-100 text-orange-800", mixed: "bg-red-100 text-red-800" };
const PHASE_ICONS: Record<string, React.ReactNode> = { introduction: <Users className="h-4 w-4" />, warmUp: <BarChart className="h-4 w-4" />, instruction: <GraduationCap className="h-4 w-4" />, guidedPractice: <Lightbulb className="h-4 w-4" />, independentPractice: <BookOpen className="h-4 w-4" />, assessment: <Target className="h-4 w-4" />, wrapUp: <AlertCircle className="h-4 w-4" /> };
const ASSESSMENT_ICONS: Record<string, React.ReactNode> = { quiz: <FileText className="h-4 w-4" />, assignment: <ListOrdered className="h-4 w-4" />, presentation: <Users className="h-4 w-4" />, activity: <Lightbulb className="h-4 w-4" /> };

export default function LessonPlanComponent() {
  const {lessionPlan}=useRoom();

  if (!lessionPlan) return null;

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50/30 to-yellow-50/20 p-4 md:p-8 font-serif">
      <div className="max-w-6xl mx-auto space-y-8">
        <Card className="border-2 border-amber-200/50 bg-white/95 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-3xl font-bold text-amber-900 mb-2">Lesson Plan</CardTitle>
                <CardDescription className="text-amber-700/80 text-lg">A comprehensive teaching guide</CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge className={`${CLASS_TYPE_COLORS[lessionPlan.overview.classType]} text-sm px-3 py-1`}>{lessionPlan.overview.classType}</Badge>
                <Badge className={`${STUDENT_LEVEL_COLORS[lessionPlan.overview.studentLevel]} text-sm px-3 py-1`}>{lessionPlan.overview.studentLevel}</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="flex items-center space-x-3 p-3 bg-amber-50/60 rounded-lg border border-amber-100">
                <BookOpen className="h-5 w-5 text-amber-700" />
                <div>
                  <p className="text-sm text-amber-600">Subject</p>
                  <p className="font-semibold text-amber-900">{lessionPlan.overview.subject}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-amber-50/60 rounded-lg border border-amber-100">
                <GraduationCap className="h-5 w-5 text-amber-700" />
                <div>
                  <p className="text-sm text-amber-600">Grade Level</p>
                  <p className="font-semibold text-amber-900">{lessionPlan.overview.gradeLevel}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-amber-50/60 rounded-lg border border-amber-100">
                <Clock className="h-5 w-5 text-amber-700" />
                <div>
                  <p className="text-sm text-amber-600">Duration</p>
                  <p className="font-semibold text-amber-900">{lessionPlan.overview.durationMinutes} minutes</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-amber-50/60 rounded-lg border border-amber-100">
                <Users className="h-5 w-5 text-amber-700" />
                <div>
                  <p className="text-sm text-amber-600">Student Level</p>
                  <p className="font-semibold text-amber-900">{lessionPlan.overview.studentLevel}</p>
                </div>
              </div>
            </div>
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-amber-900 mb-2 flex items-center gap-2"><FileText className="h-5 w-5" /> Lesson Summary</h3>
              <p className="text-amber-800/90 bg-amber-50/50 p-4 rounded-lg border border-amber-100">{lessionPlan.overview.lessonSummary}</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-2 border-amber-200/50 bg-white/95 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-amber-900 flex items-center gap-2"><Target className="h-5 w-5" /> Learning Objectives</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lessionPlan.learningObjectives.map((obj, idx) => (
                  <div key={idx} className="p-4 bg-amber-50/60 rounded-lg border border-amber-100">
                    <div className="flex items-start gap-3">
                      <div className="bg-amber-100 text-amber-800 rounded-full p-2"><Target className="h-4 w-4" /></div>
                      <div>
                        <h4 className="font-semibold text-amber-900 mb-1">Objective {idx + 1}</h4>
                        <p className="text-amber-800/90 mb-2">{obj.objective}</p>
                        <p className="text-sm text-amber-700/80"><span className="font-medium">Outcome:</span> {obj.outcome}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-amber-200/50 bg-white/95 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-amber-900 flex items-center gap-2"><Layers className="h-5 w-5" /> Key Topics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {lessionPlan.keyTopics.map((topic, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-amber-50/60 rounded-lg border border-amber-100">
                    <div className="bg-amber-100 text-amber-800 rounded-full p-2"><Layers className="h-4 w-4" /></div>
                    <span className="text-amber-900">{topic}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-2 border-amber-200/50 bg-white/95 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-amber-900 flex items-center gap-2"><BookOpen className="h-5 w-5" /> Materials & Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lessionPlan.materialsAndResources.map((item, idx) => (
                <div key={idx} className="p-4 bg-amber-50/60 rounded-lg border border-amber-100">
                  <div className="flex items-start gap-3">
                    <div className="bg-amber-100 text-amber-800 rounded-full p-2"><BookOpen className="h-4 w-4" /></div>
                    <div>
                      <h4 className="font-semibold text-amber-900 mb-1">{item.name}</h4>
                      <p className="text-amber-800/90">{item.purpose}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-amber-200/50 bg-white/95 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-amber-900 flex items-center gap-2"><Clock className="h-5 w-5" /> Lesson Flow</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="space-y-4">
              {lessionPlan.lessonFlow.map((phase, idx) => (
                <AccordionItem key={idx} value={`phase-${idx}`} className="border border-amber-100 rounded-lg overflow-hidden bg-amber-50/60">
                  <AccordionTrigger className="px-4 hover:bg-amber-100/50">
                    <div className="flex items-center gap-3 text-left">
                      {PHASE_ICONS[phase.phase]}
                      <div>
                        <span className="font-semibold text-amber-900 capitalize">{phase.phase.replace(/([A-Z])/g, ' $1')}</span>
                        <span className="ml-3 text-sm text-amber-700/80 bg-amber-100 px-2 py-1 rounded-full">{phase.durationMinutes} min</span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 pt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3 bg-white/80 rounded border border-amber-100">
                        <h4 className="font-semibold text-amber-900 mb-2">Teacher Activities</h4>
                        <p className="text-amber-800/90">{phase.teacherActivities}</p>
                      </div>
                      <div className="p-3 bg-white/80 rounded border border-amber-100">
                        <h4 className="font-semibold text-amber-900 mb-2">Student Activities</h4>
                        <p className="text-amber-800/90">{phase.studentActivities}</p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="border-2 border-amber-200/50 bg-white/95 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-amber-900 flex items-center gap-2"><Target className="h-5 w-5" /> Assessment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-amber-50/60 rounded-lg border border-amber-100">
                <div className="bg-amber-100 text-amber-800 rounded-full p-2">{ASSESSMENT_ICONS[lessionPlan.assessment.method]}</div>
                <div>
                  <h4 className="font-semibold text-amber-900 capitalize">{lessionPlan.assessment.method}</h4>
                  <p className="text-amber-800/90">{lessionPlan.assessment.description}</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-amber-900 mb-2">Success Criteria</h4>
                <ul className="space-y-2">
                  {lessionPlan.assessment.successCriteria.map((criterion, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <div className="h-2 w-2 bg-amber-500 rounded-full mt-2"></div>
                      <span className="text-amber-800/90">{criterion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-amber-200/50 bg-white/95 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-amber-900 flex items-center gap-2"><Home className="h-5 w-5" /> Homework</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-amber-50/60 rounded-lg border border-amber-100 h-full">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`rounded-full p-2 ${lessionPlan.homework.required ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    <Home className="h-5 w-5" />
                  </div>
                  <Badge className={lessionPlan.homework.required ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                    {lessionPlan.homework.required ? "Required" : "Optional"}
                  </Badge>
                </div>
                {lessionPlan.homework.description ? (
                  <p className="text-amber-800/90">{lessionPlan.homework.description}</p>
                ) : (
                  <p className="text-amber-700/70 italic">No homework assigned for this lesson.</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-amber-200/50 bg-white/95 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-amber-900 flex items-center gap-2"><Users className="h-5 w-5" /> Differentiation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-green-50/60 rounded border border-green-100">
                <h4 className="font-semibold text-green-900 mb-1">For Beginners</h4>
                <p className="text-green-800/90 text-sm">{lessionPlan.differentiation.forBeginners}</p>
              </div>
              <div className="p-3 bg-orange-50/60 rounded border border-orange-100">
                <h4 className="font-semibold text-orange-900 mb-1">For Advanced Students</h4>
                <p className="text-orange-800/90 text-sm">{lessionPlan.differentiation.forAdvancedStudents}</p>
              </div>
              <div className="p-3 bg-red-50/60 rounded border border-red-100">
                <h4 className="font-semibold text-red-900 mb-1">Mixed Ability Strategy</h4>
                <p className="text-red-800/90 text-sm">{lessionPlan.differentiation.mixedAbilityStrategy}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {lessionPlan.specialInstructions && (
          <Card className="border-2 border-amber-200/50 bg-white/95 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-amber-900 flex items-center gap-2"><AlertCircle className="h-5 w-5" /> Special Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-amber-50/60 rounded-lg border border-amber-100">
                <p className="text-amber-800/90">{lessionPlan.specialInstructions}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}