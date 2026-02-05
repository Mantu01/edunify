"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Clock, BookOpen, Target, Brain, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { AssignmentType } from "@/lib/schema";

export function Assignment({ data}: {data:AssignmentType}) {
  const {subject, gradeLevel, topic, learningObjectives, difficultyLevel, questions, lastSubmissionAt }=data;
  const [timeRemaining, setTimeRemaining] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const deadline = new Date(lastSubmissionAt);
      const diff = deadline.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeRemaining({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeRemaining({ hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [lastSubmissionAt]);

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
      case "multiple_choice": return <CheckCircle className="h-4 w-4" />;
      case "short_answer": return <FileText className="h-4 w-4" />;
      case "long_answer": return <FileText className="h-4 w-4" />;
      case "true_false": return <AlertCircle className="h-4 w-4" />;
      case "fill_in_the_blanks": return <FileText className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 bg-gradient-to-br from-amber-50/50 to-orange-50/30 rounded-xl border border-amber-200/40 shadow-lg">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-amber-200/60 bg-yellow-50/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-3xl font-bold tracking-tight text-amber-900">{subject} Assignment</CardTitle>
              <Badge className={`text-sm px-3 py-1 ${getDifficultyColor(difficultyLevel)} border`}>
                {difficultyLevel.toUpperCase()}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-amber-700 border-amber-300 bg-amber-50/50">
                <BookOpen className="h-3 w-3 mr-1" />
                Grade {gradeLevel}
              </Badge>
              <Badge variant="outline" className="text-emerald-700 border-emerald-300 bg-emerald-50/50">
                <Target className="h-3 w-3 mr-1" />
                {questions.length} Questions
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium text-amber-800 mb-4">Topic: {topic}</p>
            <Separator className="my-4 bg-amber-200/40" />
            <div className="space-y-3">
              <h3 className="font-semibold text-amber-900 flex items-center gap-2"><Brain className="h-5 w-5" /> Learning Objectives</h3>
              <ul className="space-y-2">
                {learningObjectives.map((obj, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-amber-500 mt-2" />
                    <span className="text-amber-700">{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200/60 bg-gradient-to-br from-orange-50/30 to-red-50/20">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-amber-900 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Submission Deadline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="flex justify-center items-baseline gap-2 mb-2">
                <span className="text-4xl font-bold text-red-600">{timeRemaining.hours}</span>
                <span className="text-amber-700">hours</span>
                <span className="text-4xl font-bold text-red-600">{timeRemaining.minutes}</span>
                <span className="text-amber-700">minutes</span>
              </div>
              <p className="text-sm text-amber-600">Time remaining to submit</p>
            </div>
            <Progress value={(24 - timeRemaining.hours) / 24 * 100} className="h-2 bg-amber-100" />
            <div className="text-sm text-amber-700">
              <p>Total Marks: <span className="font-bold">{totalMarks}</span></p>
              <p>Due: {new Date(lastSubmissionAt).toLocaleDateString()} at {new Date(lastSubmissionAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-green-200/60 bg-gradient-to-br from-emerald-50/20 to-amber-50/10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-amber-900">Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {questions.map((question, index) => (
              <div key={question.id} className="p-4 rounded-lg border border-amber-200/40 bg-gradient-to-r from-white/50 to-amber-50/20">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white font-bold">
                      {index + 1}
                    </div>
                    <div className="flex items-center gap-2 text-amber-700">
                      {getQuestionIcon(question.questionType)}
                      <Badge variant="outline" className="text-xs border-amber-300 bg-amber-50/50">
                        {question.questionType.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                  </div>
                  <Badge className="bg-gradient-to-r from-emerald-500 to-green-600 text-white">
                    {question.marks} mark{question.marks > 1 ? 's' : ''}
                  </Badge>
                </div>
                <p className="text-amber-900 font-medium mb-3">{question.prompt}</p>
                
                {question.questionType === "multiple_choice" && (
                  <ul className="space-y-2">
                    {question.options.map((option, optIndex) => (
                      <li key={optIndex} className="flex items-center gap-2">
                        <div className={`h-4 w-4 rounded-full border ${question.correctAnswer === option ? 'border-emerald-500' : 'border-amber-300'}`} />
                        <span className={`text-amber-700 ${question.correctAnswer === option ? 'font-semibold text-emerald-700' : ''}`}>
                          {option}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                
                {question.questionType === "true_false" && (
                  <p className="text-amber-700">
                    Correct Answer: <span className="font-semibold">{question.correctAnswer ? 'True' : 'False'}</span>
                  </p>
                )}
                
                {question.questionType === "short_answer" && (
                  <p className="text-amber-700">
                    Answer: <span className="font-semibold text-emerald-700">{question.correctAnswer}</span>
                  </p>
                )}
                
                {question.questionType === "fill_in_the_blanks" && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-amber-800">Correct Answers:</p>
                    <div className="flex flex-wrap gap-2">
                      {question.correctAnswers.map((answer, idx) => (
                        <Badge key={idx} variant="outline" className="bg-emerald-50/50 text-emerald-700 border-emerald-300">
                          {answer}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {question.questionType === "long_answer" && (
                  <div className="mt-3 p-3 rounded border border-amber-200 bg-amber-50/30">
                    <p className="text-sm font-medium text-amber-800 mb-1">Evaluation Guidelines:</p>
                    <p className="text-sm text-amber-700">{question.evaluationGuidelines}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}