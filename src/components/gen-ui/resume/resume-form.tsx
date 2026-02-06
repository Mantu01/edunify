import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Upload, Briefcase, FileText, Loader2 } from 'lucide-react';
import { roleColors } from '@/lib/constants';
import { useAuth } from '@clerk/nextjs';
import { useTamboContextAttachment, useTamboThreadInput } from '@tambo-ai/react';
import { extractTextFromPdf } from '@/lib/extract-text-from-pdf';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

const resumeFormSchema = z.object({
  jobTitle: z.string().min(1, "Job title is required"),
  jobDescription: z.string().min(1, "Job description is required"),
  additionalContext: z.string().optional()
});

type ResumeFormData = z.infer<typeof resumeFormSchema>;

const FORM_TEXTS = {
  title: "Resume Analysis",
  description: "Upload resume for analysis against job requirements.",
  jobTitle: "Job Title",
  jobDescription: "Job Description",
  additionalContext: "Additional Context",
  resumeUpload: "Upload Resume",
  resumePlaceholder: "PDF file (max 5MB)",
  analyzeButton: "Analyze Resume",
  uploading: "Uploading...",
  required: "Required",
  optional: "Optional",
};

export default function ResumeAnalyzerForm() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { sessionClaims } = useAuth();
  const { submit, setValue: setTamboInputValue } = useTamboThreadInput();
  const { addContextAttachment } = useTamboContextAttachment();
  
  const role = sessionClaims?.role as keyof typeof roleColors;
  const colors = roleColors[role];
  
  const { register, handleSubmit, formState: { errors } } = useForm<ResumeFormData>({
    resolver: zodResolver(resumeFormSchema),
    defaultValues: {
      jobTitle: "",
      jobDescription: "",
      additionalContext: ""
    },
  });

  const handleFileChange = async(event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf" && file.size <= 5 * 1024 * 1024) {
      setResumeFile(file);
      try {
        const text = await extractTextFromPdf(file);
        addContextAttachment({
          context: text,
          displayName: file.name,
          type: "text",
        });
      } catch {
        toast.error('Error Parsing the PDF.')
      }
    } else if (file) {
      alert("Please upload a PDF file under 5MB");
    }
  };

  const onSubmit = async (data: ResumeFormData) => {
    if (!resumeFile) {
      return;
    }

    setIsUploading(true);
    try {
      setTamboInputValue('Analyse the given PDF and Generate an Analytic according to provided data.');
      await submit({
        streamResponse: true,
        additionalContext: {
          formSubmission: data,
        },
      });
    } catch (error) {
      console.error("Error analyzing resume:", error);
      alert("Failed to analyze resume. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className={`w-full max-w-4xl mx-auto ${colors.bg} ${colors.border} border-2 shadow-lg`}>
      <CardHeader className="pb-4">
        <CardTitle className={`flex items-center gap-2 ${colors.text} text-2xl font-bold`}>
          <FileText className="h-6 w-6" />
          {FORM_TEXTS.title}
        </CardTitle>
        <CardDescription className="text-gray-600">
          {FORM_TEXTS.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label className="flex items-center gap-1 font-semibold">
              <Briefcase className="h-4 w-4" />
              {FORM_TEXTS.jobTitle}
              <span className="text-red-500">*</span>
            </Label>
            <Input 
              placeholder="e.g., Senior Frontend Developer" 
              className={`bg-white ${errors.jobTitle ? 'border-red-500' : ''}`}
              {...register("jobTitle")}
            />
            {errors.jobTitle && (
              <p className="text-sm text-red-500 mt-1">{errors.jobTitle.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label className="flex items-center gap-1 font-semibold">
              <FileText className="h-4 w-4" />
              {FORM_TEXTS.jobDescription}
              <span className="text-red-500">*</span>
            </Label>
            <Textarea 
              placeholder="Paste the job description here..."
              className={`min-h-37.5 bg-white resize-vertical ${errors.jobDescription ? 'border-red-500' : ''}`}
              {...register("jobDescription")}
            />
            {errors.jobDescription && (
              <p className="text-sm text-red-500 mt-1">{errors.jobDescription.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1 font-semibold">
              <FileText className="h-4 w-4" />
              {FORM_TEXTS.additionalContext}
              <span className="text-gray-500 text-sm">(Optional)</span>
            </Label>
            <Textarea 
              placeholder="Any additional requirements, notes, or context..."
              className="min-h-25 bg-white resize-vertical"
              {...register("additionalContext")}
            />
          </div>
          
          <div className="space-y-2">
            <Label className="flex items-center gap-1 font-semibold">
              <Upload className="h-4 w-4" />
              {FORM_TEXTS.resumeUpload}
              <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="bg-white cursor-pointer"
              />
            </div>
            {resumeFile && (
              <div className={`text-sm p-2 rounded mt-2 ${colors.text} bg-opacity-20 ${colors.bg}`}>
                <FileText className="h-4 w-4 inline mr-2" />
                {resumeFile.name}
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">{FORM_TEXTS.resumePlaceholder}</p>
            {!resumeFile && (
              <p className="text-sm text-red-500 mt-1">Please upload a resume PDF file</p>
            )}
          </div>
          
          <CardFooter className="px-0 pb-0 pt-4">
            <Button 
              type="submit" 
              className={`w-full ${colors.button} text-white font-bold py-3 px-4 rounded-lg transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed`}
              disabled={isUploading || !resumeFile}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {FORM_TEXTS.uploading}
                </>
              ) : (
                FORM_TEXTS.analyzeButton
              )}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}