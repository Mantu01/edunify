"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Clock, BookOpen, Target, Brain, FileText, CheckCircle, AlertCircle, Eye, EyeOff, Share2 } from "lucide-react";
import { roleColors } from "@/lib/constants";
import { useAuth } from "@clerk/nextjs";
import { useRoom } from "@/contexts/room-context";

export function Assignment() {
  const [timeRemaining, setTimeRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [showAnswers, setShowAnswers] = useState<Record<string, boolean>>({});
  const { sessionClaims } = useAuth();
  const { assignment } = useRoom();

  const role = sessionClaims?.role as keyof typeof roleColors;
  const colors = roleColors[role ?? 'student'];

  useEffect(() => {
    if (!assignment?.createdAt || !assignment?.lastSubmissionHours) return;

    const calculateTime = () => {
      const createdDate = new Date(assignment.createdAt ?? new Date()).getTime();
      const deadlineMs = createdDate + (assignment.lastSubmissionHours * 60 * 60 * 1000);
      const now = new Date().getTime();
      const diff = deadlineMs - now;

      if (diff <= 0) {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeRemaining({ days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [assignment]);

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case "easy": return "bg-green-100 text-green-800 border-green-300";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "hard": return "bg-red-100 text-red-800 border-red-300";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getQuestionIcon = (type: string) => {
    switch (type) {
      case "multiple_choice": return <CheckCircle className="h-3.5 w-3.5" />;
      case "short_answer": return <FileText className="h-3.5 w-3.5" />;
      case "long_answer": return <FileText className="h-3.5 w-3.5" />;
      case "true_false": return <AlertCircle className="h-3.5 w-3.5" />;
      case "fill_in_the_blanks": return <FileText className="h-3.5 w-3.5" />;
      default: return <FileText className="h-3.5 w-3.5" />;
    }
  };

  const toggleAnswer = (questionId: string) => {
    setShowAnswers(prev => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  const handleShare = () => {
    console.log("Share assignment");
  };

  if (!assignment) return null;
  const { subject, gradeLevel, topic, learningObjectives, difficultyLevel, questions, lastSubmissionHours } = assignment;

  const totalSeconds = lastSubmissionHours * 3600;
  const currentRemainingSeconds = (timeRemaining.days * 86400) + (timeRemaining.hours * 3600) + (timeRemaining.minutes * 60) + timeRemaining.seconds;
  const progressValue = Math.min(100, Math.max(0, ((totalSeconds - currentRemainingSeconds) / totalSeconds) * 100));

  return (
    <div className={`flex flex-col h-175 lg:flex-row gap-6 max-w-7xl mx-auto p-4 bg-linear-to-br from-${colors.bg} to-${colors.darkBg}`}>
      <div className="lg:w-1/3 lg:sticky lg:top-6">
        <Card className={`h-full ${colors.border} ${colors.bg}`}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className={`text-2xl font-bold ${colors.text}`}>{subject}</CardTitle>
              <Badge className={`text-xs px-2.5 py-0.5 ${getDifficultyColor(difficultyLevel)} border`}>
                {difficultyLevel.toUpperCase()}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="outline" className={`text-xs ${colors.text} ${colors.border} ${colors.bg}`}>
                <BookOpen className="h-2.5 w-2.5 mr-1" />
                Grade {gradeLevel}
              </Badge>
              <Badge variant="outline" className={`text-xs ${colors.text} ${colors.border} ${colors.bg}`}>
                <Target className="h-2.5 w-2.5 mr-1" />
                {questions.length} Questions
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 overflow-y-auto">
            <div>
              <h3 className={`font-semibold ${colors.text} mb-1`}>Topic</h3>
              <p className={`text-sm ${colors.text}`}>{topic}</p>
            </div>

            <Separator className={colors.border} />

            <div>
              <h3 className={`font-semibold ${colors.text} mb-2 flex items-center gap-1.5`}>
                <Brain className="h-4 w-4" />
                Learning Objectives
              </h3>
              <ul className="space-y-1.5">
                {learningObjectives.map((obj, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className={`h-1.5 w-1.5 rounded-full ${colors.button.split(' ')[0]} mt-1.5`} />
                    <span className={`text-sm ${colors.text}`}>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Separator className={colors.border} />

            <Card className={`${colors.border} bg-linear-to-br ${colors.bg} to-red-50/20`}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className={`h-4 w-4 ${colors.text}`} />
                  <h3 className={`font-semibold ${colors.text}`}>Submission Deadline</h3>
                </div>

                <div className="text-center">
                  <div className="flex justify-center items-baseline gap-1 mb-1">
                    <div className="flex flex-col items-center">
                      <span className="text-2xl font-bold text-red-600 leading-none">{timeRemaining.days}</span>
                      <span className={`text-[10px] uppercase font-medium ${colors.text}`}>days</span>
                    </div>
                    <span className="text-xl font-light text-red-300 mx-0.5">:</span>
                    <div className="flex flex-col items-center">
                      <span className="text-2xl font-bold text-red-600 leading-none">{String(timeRemaining.hours).padStart(2, '0')}</span>
                      <span className={`text-[10px] uppercase font-medium ${colors.text}`}>hrs</span>
                    </div>
                    <span className="text-xl font-light text-red-300 mx-0.5">:</span>
                    <div className="flex flex-col items-center">
                      <span className="text-2xl font-bold text-red-600 leading-none">{String(timeRemaining.minutes).padStart(2, '0')}</span>
                      <span className={`text-[10px] uppercase font-medium ${colors.text}`}>min</span>
                    </div>
                    <span className="text-xl font-light text-red-300 mx-0.5">:</span>
                    <div className="flex flex-col items-center">
                      <span className="text-2xl font-bold text-red-600 leading-none">{String(timeRemaining.seconds).padStart(2, '0')}</span>
                      <span className={`text-[10px] uppercase font-medium ${colors.text}`}>sec</span>
                    </div>
                  </div>
                  <p className={`text-xs ${colors.text} mt-1`}>Time remaining : {100-Math.round(progressValue)} %</p>
                </div>

                <Progress value={progressValue} className="h-3 rounded-full bg-red-100 overflow-hidden [&>div]:bg-linear-to-r [&>div]:from-red-500 [&>div]:via-orange-500 [&>div]:to-yellow-500 [&>div]:transition-all [&>div]:duration-500" />

                <div className={`text-xs ${colors.text} space-y-1`}>
                  <p>Total Duration: {lastSubmissionHours} hours</p>
                </div>
              </CardContent>
            </Card>

            {(role === 'teacher' || role === 'founder') && (
              <Button
                onClick={handleShare}
                className={`w-full ${colors.button} text-white`}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share with Students
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="lg:w-2/3">
        <Card className={`${colors.border} bg-linear-to-br ${colors.bg} ${colors.darkBg} h-full`}>
          <CardHeader className="pb-3">
            <CardTitle className={`text-xl font-bold ${colors.text}`}>Assignment Questions</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="space-y-4 max-h-[calc(100vh-12rem)] overflow-y-auto smooth-scroll pb-5">
              {questions.map((question, index) => (
                <div key={question.id} className={`p-3 rounded-lg border ${colors.border} bg-linear-to-r from-white/50 ${colors.bg}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`flex items-center justify-center h-6 w-6 rounded-full bg-linear-to-br ${colors.button} text-white text-xs font-bold`}>
                        {index + 1}
                      </div>
                      <div className="flex items-center gap-1.5">
                        {getQuestionIcon(question.questionType)}
                        <Badge variant="outline" className={`text-xs ${colors.border} ${colors.bg} px-1.5 py-0`}>
                          {question.questionType.replace(/_/g, ' ')}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleAnswer(question.id)}
                        className={`h-7 px-2 text-xs ${colors.text} hover:${colors.text} hover:${colors.bg}`}
                      >
                        {showAnswers[question.id] ? (
                          <>
                            <EyeOff className="h-3 w-3 mr-1" />
                            Hide Answer
                          </>
                        ) : (
                          <>
                            <Eye className="h-3 w-3 mr-1" />
                            Show Answer
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  <p className={`text-sm ${colors.text} font-medium mb-2`}>{question.prompt}</p>

                  {question.questionType === "multiple_choice" && (
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-3">
                        {question.options.map((option, optIndex) => (
                          <div key={optIndex} className="flex items-start gap-2">
                            <span className={`font-semibold text-sm ${colors.text} min-w-fit`}>
                              {String.fromCharCode(65 + optIndex)}.
                            </span>
                            <span className={`text-sm ${colors.text}`}>{option}</span>
                          </div>
                        ))}
                      </div>

                      {showAnswers[question.id] && (
                        <div className={`mt-3 pt-3 border-t ${colors.border}`}>
                          <p className="text-sm text-emerald-700">
                            <span className="font-semibold">Correct Answer:</span> {String.fromCharCode(65 + question.options.indexOf(question.correctAnswer))}. {question.correctAnswer}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {question.questionType === "true_false" && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold text-sm ${colors.text}`}>A.</span>
                          <span className={`text-sm ${colors.text}`}>True</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold text-sm ${colors.text}`}>B.</span>
                          <span className={`text-sm ${colors.text}`}>False</span>
                        </div>
                      </div>

                      {showAnswers[question.id] && (
                        <div className={`mt-3 pt-3 border-t ${colors.border}`}>
                          <p className="text-sm text-emerald-700">
                            <span className="font-semibold">Correct Answer:</span> {question.correctAnswer ? 'A. True' : 'B. False'}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {question.questionType === "short_answer" && (
                    <div className="space-y-2">
                      <p className={`text-sm ${colors.text} italic`}>User input required</p>
                      {showAnswers[question.id] && (
                        <div className={`mt-3 pt-3 border-t ${colors.border}`}>
                          <p className="text-sm text-emerald-700">
                            <span className="font-semibold">Answer:</span> {question.correctAnswer}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {question.questionType === "fill_in_the_blanks" && (
                    <div className="space-y-2">
                      <p className={`text-sm ${colors.text} italic`}>Fill in the blanks</p>
                      {showAnswers[question.id] && (
                        <div className={`mt-3 pt-3 border-t ${colors.border}`}>
                          <p className="text-sm font-medium text-emerald-800 mb-2">Correct Answers:</p>
                          <div className="flex flex-wrap gap-1">
                            {question.correctAnswers.map((answer, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs bg-emerald-50/50 text-emerald-700 border-emerald-300 px-1.5 py-0">
                                {answer}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {question.questionType === "long_answer" && (
                    <div className="space-y-2">
                      <p className={`text-sm ${colors.text} italic`}>User input required</p>
                      {showAnswers[question.id] && (
                        <div className={`mt-3 pt-3 border-t ${colors.border}`}>
                          <div className="p-2 rounded border border-emerald-200 bg-emerald-50/30">
                            <p className="text-xs font-medium text-emerald-800 mb-1">Evaluation Guidelines:</p>
                            <p className="text-xs text-emerald-700">{question.evaluationGuidelines}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <style jsx global>{`
        .smooth-scroll {
          scroll-behavior: smooth;
        }
        .smooth-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .smooth-scroll::-webkit-scrollbar-track {
          background: rgba(254, 243, 199, 0.3);
          border-radius: 3px;
        }
        .smooth-scroll::-webkit-scrollbar-thumb {
          background: rgba(245, 158, 11, 0.4);
          border-radius: 3px;
        }
        .smooth-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(245, 158, 11, 0.6);
        }
      `}</style>
    </div>
  );
}