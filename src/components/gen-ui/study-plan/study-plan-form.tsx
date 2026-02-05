'use client'

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, Trash2, Target, BookOpen, Clock, CalendarDays, Brain, Zap } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { COLORS } from '@/lib/constants';
import { useTamboThreadInput } from '@tambo-ai/react';

const StudyPlanInputSchema = z.object({
  goal: z.string().min(3, "Goal is required"),
  
  subjects: z.array(
    z.object({
      name: z.string().min(1),
      priority: z.enum(["low", "medium", "high"]).default("medium"),
      difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
    })
  ).min(1, "At least one subject is required"),

  availableTime: z.object({
    hoursPerDay: z.number().min(0.5).max(12),
    daysPerWeek: z.number().min(1).max(7),
    preferredStudyTime: z.enum(["morning", "afternoon", "evening", "night"]).default("morning"),
  }),

  planDuration: z.object({
    startDate: z.string(),
    endDate: z.string(),
  }),

  studyPreferences: z.object({
    sessionLengthMinutes: z.number().min(15).max(180).default(60),
    breakLengthMinutes: z.number().min(5).max(30).default(10),
    studyStyle: z.enum(["pomodoro", "deep-focus", "mixed"]).default("mixed"),
  }),

  examDate: z.string().optional(),
  currentLevel: z.enum(["beginner", "intermediate", "advanced"]).default("beginner"),
});

type FormData = z.infer<typeof StudyPlanInputSchema>;

export default function StudyPlanForm() {
  const [isGenerating, setIsGenerating] = useState(false);

  const { register, handleSubmit, watch, setValue, control, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(StudyPlanInputSchema),
    defaultValues: {
      goal: '',
      subjects: [{ name: '', priority: 'medium', difficulty: 'medium' }],
      availableTime: {
        hoursPerDay: 2,
        daysPerWeek: 5,
        preferredStudyTime: 'morning'
      },
      planDuration: {
        startDate: format(new Date(), 'yyyy-MM-dd'),
        endDate: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
      },
      studyPreferences: {
        sessionLengthMinutes: 60,
        breakLengthMinutes: 10,
        studyStyle: 'mixed'
      },
      currentLevel: 'beginner'
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "subjects"
  });

  const { submit, setValue: setTamboInputValue } = useTamboThreadInput();

  const onSubmit = async (data: FormData) => {
    setIsGenerating(true);
    setTamboInputValue('Generate a detailed study plan based on the provided form data.');
    
    await submit({
      streamResponse: true,
      additionalContext: {
        formSubmission: data
      },
    });
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsGenerating(false);
  };

  const handleDateChange = (field: 'startDate' | 'endDate' | 'examDate', date: Date | undefined) => {
    if (date) {
      setValue(`planDuration.${field}`, format(date, 'yyyy-MM-dd'));
    }
  };

  return (
    <Card className="w-full max-w-100 border-2 pt-2 -ml-8 -mt-10 scale-85 border-blue-300 bg-linear-to-br from-blue-50 to-indigo-50 shadow-[4px_4px_0px_0px_rgba(59,130,246,0.3)]">
      <CardContent>
        <div className="flex items-center gap-3 pb-4 border-b-2 border-blue-200">
          <div className="px-2 rounded-lg" style={{ backgroundColor: COLORS.primary, border: COLORS.border }}>
            <Brain className="h-6 w-6" style={{ color: COLORS.blue }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'Georgia, serif', color: COLORS.blue }}>
              Study Plan Generator
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="goal" className="flex items-center gap-2 text-base font-semibold">
              <Target className="h-4 w-4" style={{ color: COLORS.blue }} />
              Learning Goal
            </Label>
            <Textarea
              id="goal"
              {...register('goal')}
              className="border-2 border-blue-300 bg-white focus-visible:ring-blue-500 min-h-20"
              placeholder="What do you want to achieve?"
            />
            {errors.goal && <p className="text-sm" style={{ color: COLORS.red }}>{errors.goal.message}</p>}
          </div>

          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-base font-semibold">
              <BookOpen className="h-4 w-4" style={{ color: COLORS.blue }} />
              Subjects / Topics
            </Label>
            
            {fields.map((field, index) => (
              <div key={field.id} className="space-y-2 p-3 border border-blue-200 rounded-md bg-white">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label>Subject Name</Label>
                    <Input
                      {...register(`subjects.${index}.name`)}
                      className="border-blue-300"
                      placeholder="e.g., Calculus"
                    />
                  </div>
                  
                  <div className="flex items-center justify-end">
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label>Priority</Label>
                    <Select
                      value={watch(`subjects.${index}.priority`)}
                      onValueChange={(value) => setValue(`subjects.${index}.priority`, value as "low" | "medium" | "high")}
                    >
                      <SelectTrigger className="border-blue-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label>Difficulty</Label>
                    <Select
                      value={watch(`subjects.${index}.difficulty`)}
                      onValueChange={(value) => setValue(`subjects.${index}.difficulty`, value as "easy" | "medium" | "hard")}
                    >
                      <SelectTrigger className="border-blue-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ name: '', priority: 'medium', difficulty: 'medium' })}
              className="w-full border-blue-300 text-blue-600 hover:bg-blue-50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Subject
            </Button>
            {errors.subjects && <p className="text-sm" style={{ color: COLORS.red }}>{errors.subjects.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Clock className="h-4 w-4" style={{ color: COLORS.blue }} />
                Hours/Day
              </Label>
              <Input
                type="number"
                {...register('availableTime.hoursPerDay', { valueAsNumber: true })}
                className="border-blue-300"
                min={0.5}
                max={12}
                step={0.5}
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" style={{ color: COLORS.blue }} />
                Days/Week
              </Label>
              <Select
                value={watch('availableTime.daysPerWeek').toString()}
                onValueChange={(value) => setValue('availableTime.daysPerWeek', parseInt(value))}
              >
                <SelectTrigger className="border-blue-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1,2,3,4,5,6,7].map((day) => (
                    <SelectItem key={day} value={day.toString()}>
                      {day} day{day !== 1 ? 's' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Zap className="h-4 w-4" style={{ color: COLORS.blue }} />
              Preferred Time
            </Label>
            <Select
              value={watch('availableTime.preferredStudyTime')}
              onValueChange={(value) => setValue('availableTime.preferredStudyTime', value as FormData['availableTime']['preferredStudyTime'])}
            >
              <SelectTrigger className="border-blue-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="morning">Morning</SelectItem>
                <SelectItem value="afternoon">Afternoon</SelectItem>
                <SelectItem value="evening">Evening</SelectItem>
                <SelectItem value="night">Night</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal border-blue-300",
                      !watch('planDuration.startDate') && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {watch('planDuration.startDate') ? format(new Date(watch('planDuration.startDate')), 'MMM dd, yyyy') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={new Date(watch('planDuration.startDate'))}
                    onSelect={(date) => handleDateChange('startDate', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal border-blue-300",
                      !watch('planDuration.endDate') && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {watch('planDuration.endDate') ? format(new Date(watch('planDuration.endDate')), 'MMM dd, yyyy') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={new Date(watch('planDuration.endDate'))}
                    onSelect={(date) => handleDateChange('endDate', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Current Level</Label>
            <Select
              value={watch('currentLevel')}
              onValueChange={(value) => setValue('currentLevel', value as FormData['currentLevel'])}
            >
              <SelectTrigger className="border-blue-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            disabled={isGenerating}
            className="w-full py-2 text-lg font-bold transition-all hover:shadow-[4px_4px_0px_0px_rgba(59,130,246,0.3)]"
            style={{
              backgroundColor: COLORS.blue,
              color: 'white',
              border: COLORS.border
            }}
          >
            {isGenerating ? 'Generating Plan...' : 'Generate Study Plan'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}