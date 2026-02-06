"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, BookOpen, Target, Clock, FileQuestion } from "lucide-react";
import { useState } from "react";
import { useTamboThreadInput } from "@tambo-ai/react";

const assignmentFormSchema = z.object({
  subject: z.string().min(1),
  gradeLevel: z.string().min(1),
  topic: z.string().min(1),
  learningObjectives: z.array(z.string().min(1)).min(1),
  difficultyLevel: z.enum(["easy", "medium", "hard"]),
  questionCount: z.number().int().min(1).max(15),
  questionTypes: z.array(z.enum(["multiple_choice","short_answer","long_answer","true_false","fill_in_the_blanks"])).min(1),
  lastSubmissionHours: z.number().int().min(1),
  specialInstructions: z.string().optional(),
});

const GRADE_LEVELS = ["K-2", "3-5", "6-8", "9-10", "11-12", "Undergraduate", "Graduate"];

const DIFFICULTY_LEVELS = [
  { value: "easy", label: "Easy", color: "text-green-600" },
  { value: "medium", label: "Medium", color: "text-yellow-600" },
  { value: "hard", label: "Hard", color: "text-red-600" }
];

const QUESTION_TYPES = [
  { value: "multiple_choice", label: "Multiple Choice" },
  { value: "short_answer", label: "Short Answer" },
  { value: "long_answer", label: "Long Answer" },
  { value: "true_false", label: "True/False" },
  { value: "fill_in_the_blanks", label: "Fill in the Blanks" }
];

export default function AssignmentForm() {
  const [objectives, setObjectives] = useState<string[]>([""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { submit,setValue:setTamboInputValue } = useTamboThreadInput();

  const form = useForm<z.infer<typeof assignmentFormSchema>>({
    resolver: zodResolver(assignmentFormSchema),
    defaultValues: {
      subject: "",
      gradeLevel: "",
      topic: "",
      learningObjectives: [""],
      difficultyLevel: "medium",
      questionCount: 5,
      questionTypes: [],
      lastSubmissionHours: 24,
      specialInstructions: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof assignmentFormSchema>) => {
    setIsSubmitting(true);
    try {
      setTamboInputValue('Generate Assignment according to the given form data.');
      await submit({
        streamResponse: true,
        additionalContext: {
          formSubmission: values
        },
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addObjective = () => {
    const newObjectives = [...objectives, ""];
    setObjectives(newObjectives);
    form.setValue("learningObjectives", newObjectives);
  };

  const removeObjective = (index: number) => {
    const newObjectives = objectives.filter((_, i) => i !== index);
    setObjectives(newObjectives);
    form.setValue("learningObjectives", newObjectives);
  };

  const updateObjective = (index: number, value: string) => {
    const newObjectives = [...objectives];
    newObjectives[index] = value;
    setObjectives(newObjectives);
    form.setValue("learningObjectives", newObjectives);
  };

  return (
    <div className="w-full max-w-100 -ml-10 -mt-14 scale-85 bg-linear-to-br from-amber-50 border-2 border-amber-200 to-yellow-50 p-4" style={{ fontFamily: "'Courier New', monospace" }}>
      <div className="mx-auto max-w-full">
        <div className="mb-4 flex items-center gap-2 border-b-2 border-yellow-600 pb-2">
          <BookOpen className="h-5 w-5 text-yellow-600" />
          <h2 className="text-lg font-bold uppercase tracking-wider text-yellow-900">Create Assignment</h2>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase text-yellow-900">Subject</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Mathematics" 
                        {...field} 
                        className="border-2 border-yellow-600 bg-yellow-50/30 text-sm focus-visible:ring-yellow-600"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gradeLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase text-yellow-900">Grade Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-2 border-yellow-600 bg-yellow-50/30 text-sm focus:ring-yellow-600">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-yellow-50 border-2 border-yellow-600">
                        {GRADE_LEVELS.map((grade) => (
                          <SelectItem key={grade} value={grade} className="text-sm hover:bg-yellow-100">
                            {grade}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase text-yellow-900">Topic</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Quadratic Equations" 
                      {...field} 
                      className="border-2 border-yellow-600 bg-yellow-50/30 text-sm focus-visible:ring-yellow-600"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="learningObjectives"
              render={() => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-xs font-bold uppercase text-yellow-900 flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      Learning Objectives
                    </FormLabel>
                    <Button
                      type="button"
                      onClick={addObjective}
                      size="sm"
                      variant="outline"
                      className="h-6 border-2 border-green-600 bg-green-50 text-xs hover:bg-green-100"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {objectives.map((obj, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder={`Objective ${index + 1}`}
                          value={obj}
                          onChange={(e) => updateObjective(index, e.target.value)}
                          className="border-2 border-yellow-600 bg-yellow-50/30 text-sm focus-visible:ring-yellow-600"
                        />
                        {objectives.length > 1 && (
                          <Button
                            type="button"
                            onClick={() => removeObjective(index)}
                            size="sm"
                            variant="outline"
                            className="h-9 border-2 border-red-600 bg-red-50 hover:bg-red-100"
                          >
                            <Trash2 className="h-3 w-3 text-red-600" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-3">
              <FormField
                control={form.control}
                name="difficultyLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase text-yellow-900">Difficulty</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-2 border-yellow-600 bg-yellow-50/30 text-sm focus:ring-yellow-600">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-yellow-50 border-2 border-yellow-600">
                        {DIFFICULTY_LEVELS.map((level) => (
                          <SelectItem 
                            key={level.value} 
                            value={level.value}
                            className="text-sm hover:bg-yellow-100"
                          >
                            <span className={level.color}>{level.label}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="questionCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase text-yellow-900">Questions</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={15}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                        className="border-2 border-yellow-600 bg-yellow-50/30 text-sm focus-visible:ring-yellow-600"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastSubmissionHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase text-yellow-900 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      End (hrs)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                        className="border-2 border-yellow-600 bg-yellow-50/30 text-sm focus-visible:ring-yellow-600"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
            />
            </div>

            <FormField
              control={form.control}
              name="questionTypes"
              render={() => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase text-yellow-900 flex items-center gap-1">
                    <FileQuestion className="h-3 w-3" />
                    Question Types
                  </FormLabel>
                  <div className="grid grid-cols-3 gap-2">
                    {QUESTION_TYPES.map((type) => (
                      <FormField
                        key={type.value}
                        control={form.control}
                        name="questionTypes"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(type.value as any)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, type.value])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== type.value
                                        )
                                      );
                                }}
                                className="border-2 border-yellow-600 data-[state=checked]:bg-yellow-600"
                              />
                            </FormControl>
                            <FormLabel className="text-xs font-normal cursor-pointer">
                              {type.label}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="specialInstructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase text-yellow-900">Special Instructions</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any additional requirements..."
                      className="border-2 border-yellow-600 bg-yellow-50/30 text-sm resize-none focus-visible:ring-yellow-600"
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <Button 
              disabled={isSubmitting}
              type="submit" 
              className="w-full border-2 border-yellow-600 bg-yellow-600 text-sm font-bold uppercase tracking-wider hover:bg-yellow-700 hover:border-yellow-700"
            >
              Generate Assignment
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}