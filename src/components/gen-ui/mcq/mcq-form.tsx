'use client'

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Hash, Clock, Target, FileText, Brain } from 'lucide-react';
import { COLORS } from '@/lib/constants';
import { useTamboThreadInput } from '@tambo-ai/react';

const DIFFICULTY_LEVELS = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

const formSchema = z.object({
  topic: z.string().min(3, 'Topic must be at least 3 characters'),
  numberOfQuestions: z.number().min(1).max(15),
  difficulty: z.enum(['easy', 'medium', 'hard', 'expert']),
  context: z.string().optional(),
  timeLimit: z.number().min(0).max(120),
});

type FormData = z.infer<typeof formSchema>;

export default function MCQGeneratorForm() {
  const [isGenerating, setIsGenerating] = useState(false);

  const {register,handleSubmit,watch,setValue,formState: { errors }} = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
      numberOfQuestions: 10,
      difficulty: 'medium',
      context: '',
      timeLimit: 30,
    }
  });

  const { submit,setValue:setTamboInputValue } = useTamboThreadInput();

  const onSubmit = async (data: FormData) => {
    setIsGenerating(true);
    setTamboInputValue('Generate MCQ according to the given form data.');
    await submit({
      streamResponse: true,
      additionalContext: {
        formSubmission: data
      },
    });
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsGenerating(false);
  };
  
  return (
    <Card className="w-full max-w-100 border-2 pt-2 -ml-8 -mt-10  scale-85 border-amber-300 bg-linear-to-br from-amber-50 to-yellow-50 shadow-[4px_4px_0px_0px_rgba(255,204,0,0.3)]">
      <CardContent>
        <div className="flex items-center gap-3 pb-4 border-b-2 border-amber-200">
          <div className="px-2 rounded-lg" style={{ backgroundColor: COLORS.primary, border: COLORS.border }}>
            <Brain className="h-6 w-6" style={{ color: COLORS.yellow }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'Georgia, serif', color: COLORS.yellow }}>
              MCQ Generator
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="topic" className="flex items-center gap-2 text-base font-semibold">
              <BookOpen className="h-4 w-4" style={{ color: COLORS.yellow }} />
              Topic
            </Label>
            <Input
              id="topic"
              {...register('topic')}
              className="border-2 border-amber-300 bg-white focus-visible:ring-amber-500"
              placeholder="Enter topic or subject"
            />
            {errors.topic && <p className="text-sm" style={{ color: COLORS.red }}>{errors.topic.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numberOfQuestions" className="flex items-center gap-2">
                <Hash className="h-4 w-4" style={{ color: COLORS.yellow }} />
                Questions
              </Label>
              <Input
                id="numberOfQuestions"
                type="number"
                {...register('numberOfQuestions', { valueAsNumber: true })}
                className="border-2 border-amber-300 bg-white"
                min={1}
                max={15}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty" className="flex items-center gap-2">
                <Target className="h-4 w-4" style={{ color: COLORS.yellow }} />
                Difficulty
              </Label>
              <Select
                value={watch('difficulty')}
                onValueChange={(value) => setValue('difficulty', value as FormData['difficulty'])}
              >
                <SelectTrigger className="border-2 border-amber-300 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTY_LEVELS.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeLimit" className="flex items-center gap-2">
              <Clock className="h-4 w-4" style={{ color: COLORS.yellow }} />
              Time Limit: {watch('timeLimit')} minutes
            </Label>
            <Slider
              defaultValue={[30]}
              max={120}
              min={0}
              step={5}
              value={[watch('timeLimit')]}
              onValueChange={([value]) => setValue('timeLimit', value)}
              className="[&>span]:bg-amber-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="context" className="flex items-center gap-2">
              <FileText className="h-4 w-4" style={{ color: COLORS.yellow }} />
              Additional Context
            </Label>
            <Textarea
              id="context"
              {...register('context')}
              className="border-2 border-amber-300 bg-white min-h-20"
              placeholder="Provide additional context or specific requirements..."
            />
          </div>

          <Button
            type="submit"
            disabled={isGenerating}
            className="w-full py-2 text-lg font-bold transition-all hover:shadow-[4px_4px_0px_0px_rgba(255,152,0,0.3)]"
            style={{
              backgroundColor: COLORS.yellow,
              color: 'white',
              border: COLORS.border
            }}
          >
            {isGenerating ? 'Generating Questions...' : 'Generate MCQ Questions'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}