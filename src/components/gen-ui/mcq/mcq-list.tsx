import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle, Clock, AlertCircle, BarChart, BookOpen, Trophy, Send, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useRoom } from '@/contexts/room-context';

const formSchema = z.object({
  answers: z.record(z.string(), z.number().min(0).max(3))
});

const DIFFICULTY_CONFIG = {
  easy: { label: 'Easy', color: 'bg-green-100 text-green-800 border-green-200' },
  medium: { label: 'Medium', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  hard: { label: 'Hard', color: 'bg-red-100 text-red-800 border-red-200' }
};

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];
const OPTION_COLORS = ['bg-amber-50 border-amber-200', 'bg-emerald-50 border-emerald-200', 'bg-orange-50 border-orange-200', 'bg-red-50 border-red-200'];
const MCQList: React.FC = () => {
  const { mcqs } = useRoom();
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState((mcqs?.timer || 0) * 60);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { answers: {} }
  });

  useEffect(() => {
    if (timeLeft > 0 && !submitted) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
    if (timeLeft === 0 && !submitted) {
      handleSubmit();
    }
  }, [timeLeft, submitted]);

  const calculateScore = () => {
    let correct = 0;
    mcqs?.questionsLists?.forEach(question => {
      if (userAnswers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const handleSubmit = () => {
    const values = form.getValues();
    setUserAnswers(values.answers);
    setSubmitted(true);
  };

  const handleReset = () => {
    form.reset();
    setUserAnswers({});
    setSubmitted(false);
    setTimeLeft((mcqs?.timer || 0) * 60);
  };

  const handleRetake = () => {
    handleReset();
  };

   const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!mcqs) return null;

  const { difficulty, numberOfQuestions, questionsLists, topic } = mcqs;
  const score = calculateScore();
  const percentage = Math.round((score / questionsLists.length) * 100);
  const answeredCount = Object.keys(form.watch('answers')).length;
  const remainingCount = questionsLists.length - answeredCount;

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50/50 to-orange-50/30 p-4 md:p-8 font-serif">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/4">
          <Card className="border-2 border-amber-200 bg-white/90 shadow-lg sticky top-20">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">Quiz Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Total Questions</span>
                  <Badge variant="outline" className="text-amber-800 border-amber-300">
                    {numberOfQuestions}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Answered</span>
                  <Badge variant="outline" className="text-emerald-800 border-emerald-300">
                    {answeredCount}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Remaining</span>
                  <Badge variant="outline" className="text-red-800 border-red-300">
                    {remainingCount}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Time Left</span>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-700" />
                    <span className="font-bold text-amber-800">{formatTime(timeLeft)}s</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-amber-600" />
                  <span className="font-medium text-gray-800">{topic}</span>
                </div>
                <Badge className={`w-full h-8 justify-center ${DIFFICULTY_CONFIG[difficulty].color}`}>
                  {DIFFICULTY_CONFIG[difficulty].label}
                </Badge>
              </div>

              <div className="space-y-4 pt-4 border-t border-amber-100">
                <div className="flex gap-3">
                  {!submitted && (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleReset}
                        className="flex-1 border-amber-300 text-amber-800 hover:bg-amber-50"
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Reset
                      </Button>
                      <Button
                        type="button"
                        onClick={handleSubmit}
                        className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
                      >
                        <Send className="mr-2 h-4 w-4" />
                        Submit
                      </Button>
                    </>
                  )}
                  {submitted && (
                    <Button
                      onClick={handleRetake}
                      className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Retake
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:w-3/4">
          <Card className="border-2 border-amber-200 bg-white/90 shadow-lg">
            <CardHeader className="space-y-4 border-b border-amber-100">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-8 w-8 text-amber-600" />
                  <CardTitle className="text-3xl font-bold text-gray-800">{topic}</CardTitle>
                </div>
                <CardDescription className="text-lg text-gray-600">
                  Test your knowledge with this comprehensive quiz
                </CardDescription>
              </div>
            </CardHeader>

            {!submitted ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)}>
                  <CardContent className="pt-6">
                    <div className="space-y-8">
                      {questionsLists.map((question, index) => (
                        <Card key={question.id} className="border-2 border-amber-100 bg-white shadow-sm">
                          <CardHeader>
                            <div className="flex items-start gap-4">
                              <div className="shrink-0 w-10 h-10 rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center">
                                <span className="font-bold text-amber-800">{index + 1}</span>
                              </div>
                              <CardTitle className="text-xl text-gray-800 leading-relaxed">
                                {question.question}
                              </CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <FormField
                              control={form.control}
                              name={`answers.${question.id}`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <RadioGroup
                                      onValueChange={(value) => field.onChange(parseInt(value))}
                                      value={field.value?.toString()}
                                      className="space-y-4"
                                    >
                                      {question.options.map((option, optionIndex) => (
                                        <FormItem key={optionIndex} className="flex items-center space-x-3 space-y-0">
                                          <FormControl>
                                            <RadioGroupItem value={optionIndex.toString()} className="hidden" />
                                          </FormControl>
                                          <div className={`flex-1 p-4 rounded-lg border-2 ${OPTION_COLORS[optionIndex]} hover:border-amber-400 transition-all cursor-pointer ${field.value === optionIndex ? 'ring-2 ring-amber-500' : ''}`} onClick={() => field.onChange(optionIndex)}>
                                            <div className="flex items-center gap-4">
                                              <div className={`shrink-0 w-10 h-10 rounded-full border-2 ${field.value === optionIndex ? 'border-amber-600 bg-amber-100' : 'border-amber-200 bg-white'} flex items-center justify-center`}>
                                                <span className={`font-bold ${field.value === optionIndex ? 'text-amber-800' : 'text-gray-700'}`}>
                                                  {OPTION_LETTERS[optionIndex]}
                                                </span>
                                              </div>
                                              <FormLabel className="flex-1 text-lg cursor-pointer text-gray-700 font-normal">
                                                {option}
                                              </FormLabel>
                                              {field.value === optionIndex && (
                                                <div className="shrink-0">
                                                  <CheckCircle className="h-6 w-6 text-amber-600" />
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        </FormItem>
                                      ))}
                                    </RadioGroup>
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </form>
              </Form>
            ) : (
              <CardContent className="pt-6">
                <Card className="border-2 border-amber-200 bg-linear-to-r from-amber-50/80 to-yellow-50/80 mb-8">
                  <CardContent className="p-8">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-4">
                          <Trophy className="h-12 w-12 text-amber-600" />
                          <h2 className="text-3xl font-bold text-gray-800">Quiz Completed!</h2>
                        </div>
                        <p className="text-gray-600 text-lg">
                          You scored <span className="font-bold text-amber-700">{score}</span> out of <span className="font-bold text-gray-800">{questionsLists.length}</span> questions correctly.
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-700">Accuracy Rate</span>
                            <span className="font-bold text-amber-800">{percentage}%</span>
                          </div>
                          <Progress value={percentage} className="h-3 bg-amber-100" />
                        </div>
                      </div>
                      <div className="shrink-0">
                        <div className="relative">
                          <div className="w-48 h-48 rounded-full border-8 border-amber-200 bg-white flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-5xl font-bold text-amber-700">{score}</div>
                              <div className="text-gray-600">correct answers</div>
                            </div>
                          </div>
                          <div className="absolute -top-2 -right-2">
                            <BarChart className="h-10 w-10 text-amber-600" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-8">
                  <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                    <AlertCircle className="h-7 w-7 text-amber-600" />
                    Review Your Answers
                  </h3>
                  {questionsLists.map((question, index) => {
                    const userAnswer = userAnswers[question.id];
                    const isCorrect = userAnswer === question.correctAnswer;
                    
                    return (
                      <Card key={question.id} className={`border-2 ${isCorrect ? 'border-emerald-200' : 'border-red-200'} bg-white`}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4">
                              <div className={`shrink-0 w-10 h-10 rounded-full border-2 ${isCorrect ? 'border-emerald-300 bg-emerald-100' : 'border-red-300 bg-red-100'} flex items-center justify-center`}>
                                <span className={`font-bold ${isCorrect ? 'text-emerald-800' : 'text-red-800'}`}>
                                  {index + 1}
                                </span>
                              </div>
                              <CardTitle className={`text-xl ${isCorrect ? 'text-emerald-800' : 'text-red-800'}`}>
                                {question.question}
                              </CardTitle>
                            </div>
                            <Badge className={`${isCorrect ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-red-100 text-red-800 border-red-200'}`}>
                              {isCorrect ? 'Correct' : 'Incorrect'}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {question.options.map((option, optionIndex) => {
                              const isUserChoice = userAnswer === optionIndex;
                              const isCorrectAnswer = optionIndex === question.correctAnswer;
                              
                              return (
                                <div key={optionIndex} className={`p-4 rounded-lg border-2 ${isCorrectAnswer ? 'border-emerald-300 bg-emerald-50' : isUserChoice && !isCorrectAnswer ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}>
                                  <div className="flex items-center gap-4">
                                    <div className={`shrink-0 w-10 h-10 rounded-full border-2 ${isCorrectAnswer ? 'border-emerald-600 bg-emerald-100' : isUserChoice && !isCorrectAnswer ? 'border-red-600 bg-red-100' : 'border-gray-300 bg-white'} flex items-center justify-center`}>
                                      <span className={`font-bold ${isCorrectAnswer ? 'text-emerald-800' : isUserChoice && !isCorrectAnswer ? 'text-red-800' : 'text-gray-700'}`}>
                                        {OPTION_LETTERS[optionIndex]}
                                      </span>
                                    </div>
                                    <div className="flex-1">
                                      <div className="text-gray-700">{option}</div>
                                      {isCorrectAnswer && (
                                        <div className="flex items-center gap-2 mt-2 text-emerald-700">
                                          <CheckCircle className="h-5 w-5" />
                                          <span className="font-medium">Correct Answer</span>
                                        </div>
                                      )}
                                      {isUserChoice && !isCorrectAnswer && (
                                        <div className="flex items-center gap-2 mt-2 text-red-700">
                                          <AlertCircle className="h-5 w-5" />
                                          <span className="font-medium">Your Choice</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MCQList;