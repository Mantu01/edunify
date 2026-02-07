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
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Target, FileText, Brain, BookMarked, GraduationCap} from 'lucide-react';
import { roleColors } from '@/lib/constants';
import { useTamboThreadInput } from '@tambo-ai/react';
import { useAuth } from '@clerk/nextjs';

const NOTE_TYPES = [
  { value: 'summary', label: 'Summary Notes' },
  { value: 'detailed', label: 'Detailed Notes' },
  { value: 'concept_map', label: 'Concept Map' },
  { value: 'flashcards', label: 'Flashcards' },
  { value: 'cheat_sheet', label: 'Cheat Sheet' },
  { value: 'comparison', label: 'Comparison Table' },
  { value: 'timeline', label: 'Timeline/Chronology' },
  { value: 'formula_sheet', label: 'Formula Sheet' },
];

const formSchema = z.object({
  topic: z.string().min(3, 'Topic must be at least 3 characters'),
  subject: z.string().min(2, 'Subject is required'),
  noteType: z.enum(['summary', 'detailed', 'concept_map', 'flashcards', 'cheat_sheet', 'comparison', 'timeline', 'formula_sheet']),
  depthLevel: z.enum(['basic', 'intermediate', 'advanced', 'expert']),
  customInstructions: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function NoteGeneratorForm() {
  const [isGenerating, setIsGenerating] = useState(false);
  const {sessionClaims}=useAuth();

  const role = sessionClaims?.role as keyof typeof roleColors;
  const colors = roleColors[role ?? 'student']

  const {register,handleSubmit,watch,setValue,formState: { errors }} = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
      subject: '',
      noteType: 'summary',
      depthLevel: 'intermediate',
    }
  });

  const { submit, setValue: setTamboInputValue } = useTamboThreadInput();

  const onSubmit = async (data: FormData) => {
    setIsGenerating(true);
    setTamboInputValue('Generate a detailed Note according to the given form data.');
    
    await submit({
      streamResponse: true,
      additionalContext: {
        formSubmission: data,
      },
    });
    setIsGenerating(false);
  };

  return (
    <Card className={`w-full max-w-4xl border-2 pt-2 -ml-8 -mt-12  scale-80 ${colors.border} ${colors.bg} ${colors.darkBorder} ${colors.darkBg} shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]`}>
      <CardContent>
        <div className={`flex items-center gap-3 pb-4 border-b-2 ${colors.border}`}>
          <div className={`p-2 rounded-lg ${colors.button} shadow-md`}>
            <BookMarked className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className={`text-2xl font-bold tracking-tight ${colors.text}`} style={{ fontFamily: 'Georgia, serif' }}>
              Smart Note Generator
            </h1>
            <p className={`text-sm ${colors.text} mt-1`}>Generate comprehensive study notes tailored to your needs</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <Label htmlFor="subject" className={`flex items-center gap-2 text-base font-semibold ${colors.text}`}>
                <GraduationCap className="h-4 w-4" />
                Subject Area *
              </Label>
              <Input
                id="subject"
                {...register('subject')}
                className={`border-2 ${colors.border} bg-white`}
                placeholder="e.g., Computer, Biology, History"
              />
              {errors.subject && <p className="text-sm text-red-500">{errors.subject.message}</p>}
            </div>
            <div className="space-y-4">
              <Label htmlFor="topic" className={`flex items-center gap-2 text-base font-semibold ${colors.text}`}>
                <BookOpen className="h-4 w-4" />
                Topic *
              </Label>
              <Input
                id="topic"
                {...register('topic')}
                className={`border-2 ${colors.border} bg-white focus-visible:ring-${colors.text.split('text-')[1]}`}
                placeholder="e.g., DSA, Photosynthesis, World War II"
              />
              {errors.topic && <p className="text-sm text-red-500">{errors.topic.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <Label htmlFor="noteType" className={`flex items-center gap-2 ${colors.text}`}>
                <FileText className="h-4 w-4" />
                Note Type
              </Label>
              <Select
                value={watch('noteType')}
                onValueChange={(value) => setValue('noteType', value as FormData['noteType'])}
              >
                <SelectTrigger className={`border-2 ${colors.border} bg-white`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className='backdrop-blur-2xl'>
                  {NOTE_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-4">
              <Label htmlFor="depthLevel" className={`flex items-center gap-2 ${colors.text}`}>
                <Target className="h-4 w-4" />
                Depth Level
              </Label>
              <Select
                value={watch('depthLevel')}
                onValueChange={(value) => setValue('depthLevel', value as FormData['depthLevel'])}
              >
                <SelectTrigger className={`border-2 ${colors.border} bg-white`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className='backdrop-blur-2xl'>
                  <SelectItem value="basic">Basic Overview</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="expert">Expert Level</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-4">
            <Label htmlFor="customInstructions" className={`flex items-center gap-2 ${colors.text}`}>
              <Brain className="h-4 w-4" />
              Additional Custom Instructions
            </Label>
            <Textarea
              id="customInstructions"
              {...register('customInstructions')}
              className={`border-2 ${colors.border} bg-white min-h-16`}
              placeholder="Any special formatting requests, mnemonics, memory aids, or specific requirements..."
            />
          </div>

          <Button
            type="submit"
            disabled={isGenerating}
            className={`w-full py-3 text-lg font-bold transition-all hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] ${colors.button} text-white`}
            style={{
              border: `2px solid ${colors.border.split('border-')[1].split('-')[1] === '300' ? '#1d4ed8' : '#000'}`
            }}
          >
            {isGenerating ? 'Generating Notes...' : 'Generate Smart Notes'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}