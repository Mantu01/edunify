'use client'

import { useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { User, Briefcase, Code, GraduationCap, Folder, ChevronRight, ChevronLeft, Plus, Trash2 } from 'lucide-react';
import { useTamboThreadInput } from '@tambo-ai/react';

export const FORM_STEPS = [
  { id: 'personal', label: 'Personal Info', required: true },
  { id: 'skills', label: 'Skills', required: true },
  { id: 'projects', label: 'Projects', required: true },
  { id: 'experience', label: 'Work Experience', required: false },
  { id: 'education', label: 'Education', required: false },
  { id: 'instructions', label: 'Instructions', required: false },
];

export const SKILL_LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'expert', label: 'Expert' },
];

const personalSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  location: z.string().min(2, 'Location is required'),
  summary: z.string().min(10, 'Summary must be at least 10 characters'),
});

const skillSchema = z.object({
  skills: z.array(z.object({
    name: z.string().min(1, 'Skill name is required'),
    level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
    category: z.string().min(1, 'Category is required'),
  })).min(1, 'At least one skill is required')
});

const projectSchema = z.object({
  projects: z.array(z.object({
    title: z.string().min(1, 'Project title is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    technologies: z.string().min(1, 'Technologies used are required'),
    url: z.string().optional(),
    repoUrl:z.string().optional()
  })).min(1, 'At least one project is required')
});

const experienceSchema = z.object({
  experiences: z.array(z.object({
    company: z.string().optional(),
    position: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    description: z.string().optional(),
  })).optional()
});

const educationSchema = z.object({
  educations: z.array(z.object({
    institution: z.string().optional(),
    degree: z.string().optional(),
    field: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  })).optional()
});

const instructionsSchema = z.object({
  instructions: z.string().optional(),
});

const formSchema = z.object({
  personal: personalSchema,
  skills: skillSchema,
  projects: projectSchema,
  experiences: experienceSchema,
  educations: educationSchema,
  instructions: instructionsSchema,
});

type FormData = z.infer<typeof formSchema>;
type StepId = typeof FORM_STEPS[number]['id'];

export default function ResumeGeneratorForm() {
  const [currentStep, setCurrentStep] = useState<StepId>('personal');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const { register, control, handleSubmit, trigger, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      personal: {
        fullName: '',
        email: '',
        phone: '',
        location: '',
        summary: '',
      },
      skills: {
        skills: [{ name: '', level: 'intermediate', category: '' }]
      },
      projects: {
        projects: [{ title: '', description: '', technologies: '', url: '', repoUrl:'' }]
      },
      experiences: {
        experiences: []
      },
      educations: {
        educations: []
      },
      instructions: {
        instructions: ''
      }
    }
  });

  const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({
    control,
    name: 'skills.skills'
  });

  const { fields: projectFields, append: appendProject, remove: removeProject } = useFieldArray({
    control,
    name: 'projects.projects'
  });

  const { fields: experienceFields, append: appendExperience, remove: removeExperience } = useFieldArray({
    control,
    name: 'experiences.experiences'
  });

  const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({
    control,
    name: 'educations.educations'
  });

  const { submit } = useTamboThreadInput();

  const currentStepIndex = FORM_STEPS.findIndex(step => step.id === currentStep);

  const validateCurrentStep = async () => {
    if (currentStep === 'experience' || currentStep === 'education' || currentStep === 'instructions') {
      return true;
    }
    const isValid = await trigger(currentStep as any);
    return isValid;
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (isValid) {
      const nextIndex = currentStepIndex + 1;
      if (nextIndex < FORM_STEPS.length) {
        setCurrentStep(FORM_STEPS[nextIndex].id);
      }
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(FORM_STEPS[currentStepIndex - 1].id);
    }
  };

  const onSubmit = async (data: FormData) => {
    const allValid = await trigger();
    if (!allValid) return;
    
    setIsGenerating(true);
    await submit({
      streamResponse: true,
      additionalContext: {
        formSubmission: data
      },
    });
    setIsGenerating(false);
  };

  const renderStep = () => {
    switch(currentStep) {
      case 'personal':
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  {...register('personal.fullName')}
                  className="border-2"
                  placeholder="John Doe"
                />
                {errors.personal?.fullName && <p className="text-xs text-red-500">{errors.personal.fullName.message}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('personal.email')}
                  className="border-2"
                  placeholder="john@example.com"
                />
                {errors.personal?.email && <p className="text-xs text-red-500">{errors.personal.email.message}</p>}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  {...register('personal.phone')}
                  className="border-2"
                  placeholder="+1 (555) 123-4567"
                />
                {errors.personal?.phone && <p className="text-xs text-red-500">{errors.personal.phone.message}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  {...register('personal.location')}
                  className="border-2"
                  placeholder="New York, NY"
                />
                {errors.personal?.location && <p className="text-xs text-red-500">{errors.personal.location.message}</p>}
              </div>
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="summary">Professional Summary</Label>
              <Textarea
                id="summary"
                {...register('personal.summary')}
                className="border-2 min-h-20"
                placeholder="Experienced software developer with 5+ years..."
              />
              {errors.personal?.summary && <p className="text-xs text-red-500">{errors.personal.summary.message}</p>}
            </div>
          </div>
        );

      case 'skills':
        return (
          <div className="space-y-3">
            {skillFields.map((field, index) => (
              <div key={field.id} className="space-y-2 p-2 border rounded-lg">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-sm">Technology Category {index + 1}</h4>
                  {skillFields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSkill(index)}
                      className="h-7 w-7 p-0"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="space-y-1">
                    <Label className="text-sm">Technology Name</Label>
                    <Input
                      {...register(`skills.skills.${index}.category`)}
                      placeholder="Frontend Development"
                      className="text-sm"
                    />
                    {errors.skills?.skills?.[index]?.category && (
                      <p className="text-xs text-red-500">{errors.skills.skills[index]?.category?.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <Label className="text-sm">Tools for this Technology</Label>
                    <Textarea
                      {...register(`skills.skills.${index}.name`)}
                      className="min-h-14 text-sm"
                      placeholder="React, Next.js, TypeScript, Tailwind CSS"
                    />
                    {errors.skills?.skills?.[index]?.name && (
                      <p className="text-xs text-red-500">{errors.skills.skills[index]?.name?.message}</p>
                    )}
                    <p className="text-xs text-gray-500">List specific tools/frameworks for this technology category</p>
                  </div>
                  
                  <div className="space-y-1">
                    <Label className="text-sm">Proficiency Level</Label>
                    <Controller
                      control={control}
                      name={`skills.skills.${index}.level`}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="border-2 text-sm">
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent>
                            {SKILL_LEVELS.map((level) => (
                              <SelectItem key={level.value} value={level.value}>
                                {level.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={() => appendSkill({ category: '', name: '', level: 'intermediate' })}
              className="w-full text-sm py-1.5"
            >
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Add Another Technology Category
            </Button>
            
            {errors.skills?.skills?.root && (
              <p className="text-xs text-red-500">{errors.skills.skills.root.message}</p>
            )}
          </div>
        );

      case 'projects':
        return (
          <div className="space-y-3">
            {projectFields.map((field, index) => (
              <div key={field.id} className="space-y-2 p-2 border rounded-lg">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-sm">Project {index + 1}</h4>
                  {projectFields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeProject(index)}
                      className="h-7 w-7 p-0"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
                
                <div className="space-y-1">
                  <Label className="text-sm">Project Title</Label>
                  <Input
                    {...register(`projects.projects.${index}.title`)}
                    placeholder="E-commerce Platform"
                    className="text-sm"
                  />
                  {errors.projects?.projects?.[index]?.title && (
                    <p className="text-xs text-red-500">{errors.projects.projects[index]?.title?.message}</p>
                  )}
                </div>
                
                <div className="space-y-1">
                  <Label className="text-sm">Description</Label>
                  <Textarea
                    {...register(`projects.projects.${index}.description`)}
                    className="min-h-16 text-sm"
                    placeholder="Describe the project, your role, and achievements..."
                  />
                  {errors.projects?.projects?.[index]?.description && (
                    <p className="text-xs text-red-500">{errors.projects.projects[index]?.description?.message}</p>
                  )}
                </div>
                
                <div className="space-y-1">
                  <Label className="text-sm">Technologies Used</Label>
                  <Input
                    {...register(`projects.projects.${index}.technologies`)}
                    placeholder="React, Node.js, MongoDB"
                    className="text-sm"
                  />
                  {errors.projects?.projects?.[index]?.technologies && (
                    <p className="text-xs text-red-500">{errors.projects.projects[index]?.technologies?.message}</p>
                  )}
                </div>
                
                <div className="space-y-1">
                  <Label className="text-sm">Project URL (Optional)</Label>
                  <Input
                    {...register(`projects.projects.${index}.url`)}
                    placeholder="https://example.com"
                    className="text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-sm">Github Repo (Optional)</Label>
                  <Input
                    {...register(`projects.projects.${index}.repoUrl`)}
                    placeholder="https://github.com/username/project"
                    className="text-sm"
                  />
                </div>
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={() => appendProject({ title: '', description: '', technologies: '', url: '' })}
              className="w-full text-sm py-1.5"
            >
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Add Another Project
            </Button>
            
            {errors.projects?.projects?.root && (
              <p className="text-xs text-red-500">{errors.projects.projects.root.message}</p>
            )}
          </div>
        );

      case 'experience':
        return (
          <div className="space-y-3">
            {experienceFields.map((field, index) => (
              <div key={field.id} className="space-y-2 p-2 border rounded-lg">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-sm">Experience {index + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeExperience(index)}
                    className="h-7 w-7 p-0"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-sm">Company</Label>
                    <Input
                      {...register(`experiences.experiences.${index}.company`)}
                      placeholder="Tech Corp Inc."
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm">Position</Label>
                    <Input
                      {...register(`experiences.experiences.${index}.position`)}
                      placeholder="Senior Developer"
                      className="text-sm"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-sm">Start Date</Label>
                    <Input
                      type="month"
                      {...register(`experiences.experiences.${index}.startDate`)}
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm">End Date</Label>
                    <Input
                      type="month"
                      {...register(`experiences.experiences.${index}.endDate`)}
                      placeholder="Present"
                      className="text-sm"
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label className="text-sm">Description</Label>
                  <Textarea
                    {...register(`experiences.experiences.${index}.description`)}
                    className="min-h-14 text-sm"
                    placeholder="Responsibilities and achievements..."
                  />
                </div>
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={() => appendExperience({ company: '', position: '', startDate: '', endDate: '', description: '' })}
              className="w-full text-sm py-1.5"
            >
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Add Work Experience
            </Button>
            
            <p className="text-xs text-gray-500 text-center">Optional - Skip if not applicable</p>
          </div>
        );

      case 'education':
        return (
          <div className="space-y-3">
            {educationFields.map((field, index) => (
              <div key={field.id} className="space-y-2 p-2 border rounded-lg">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-sm">Education {index + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEducation(index)}
                    className="h-7 w-7 p-0"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-sm">Institution</Label>
                    <Input
                      {...register(`educations.educations.${index}.institution`)}
                      placeholder="University of Technology"
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm">Degree</Label>
                    <Input
                      {...register(`educations.educations.${index}.degree`)}
                      placeholder="Bachelor of Science"
                      className="text-sm"
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label className="text-sm">Field of Study</Label>
                  <Input
                    {...register(`educations.educations.${index}.field`)}
                    placeholder="Computer Science"
                    className="text-sm"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-sm">Start Date</Label>
                    <Input
                      type="month"
                      {...register(`educations.educations.${index}.startDate`)}
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm">End Date</Label>
                    <Input
                      type="month"
                      {...register(`educations.educations.${index}.endDate`)}
                      className="text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={() => appendEducation({ institution: '', degree: '', field: '', startDate: '', endDate: '' })}
              className="w-full text-sm py-1.5"
            >
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Add Education
            </Button>
            
            <p className="text-xs text-gray-500 text-center">Optional - Skip if not applicable</p>
          </div>
        );

      case 'instructions':
        return (
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-sm">Additional Instructions for Resume Generation</Label>
              <Textarea
                {...register('instructions.instructions')}
                className="border-2 min-h-24 text-sm"
                placeholder="Example: Focus on frontend skills, use a modern design, emphasize leadership experience, keep it to one page, include specific keywords for tech industry..."
              />
              <p className="text-xs text-gray-500">
                Provide any specific requirements or preferences for your resume format, style, or content focus.
              </p>
            </div>
          </div>
        );
    }
  };

  const getStepIcon = (stepId: StepId) => {
    switch(stepId) {
      case 'personal': return <User className="h-4 w-4" />;
      case 'skills': return <Code className="h-4 w-4" />;
      case 'projects': return <Folder className="h-4 w-4" />;
      case 'experience': return <Briefcase className="h-4 w-4" />;
      case 'education': return <GraduationCap className="h-4 w-4" />;
      case 'instructions': return <Plus className="h-4 w-4" />;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto border-2 pt-2 scale-85 border-blue-300 bg-linear-to-br from-blue-50 to-indigo-50 shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-center gap-3 pb-3 border-b-2 border-blue-200 mb-4">
          <div className="p-2 rounded-lg bg-blue-600">
            <User className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-blue-900">Resume Generator</h1>
            <p className="text-xs text-blue-600">Step {currentStepIndex + 1} of {FORM_STEPS.length}: {FORM_STEPS[currentStepIndex].label}</p>
          </div>
        </div>

        <div className="flex justify-between mb-4">
          {FORM_STEPS.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center">
              <div className={`flex items-center justify-center h-8 w-8 rounded-full border-2 ${
                index < currentStepIndex || currentStep === step.id
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'border-gray-300 text-gray-400'
              }`}>
                {getStepIcon(step.id)}
              </div>
              <span className={`mt-1 text-xs font-medium ${
                index < currentStepIndex || currentStep === step.id
                  ? 'text-blue-900'
                  : 'text-gray-500'
              }`}>
                {step.label}
              </span>
              {step.required && (
                <span className="text-[10px] text-red-500 mt-0.5">Required</span>
              )}
            </div>
          ))}
        </div>

        <form>
          <div className="mb-4">
            {renderStep()}
          </div>

          <div className="flex justify-between pt-3 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              className="gap-2 text-sm py-1.5 h-9"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Previous
            </Button>
            
            {(currentStep!=='instructions') ? (
              <Button
                type="button"
                onClick={handleNext}
                className="gap-2 bg-blue-600 hover:bg-blue-700 text-sm py-1.5 h-9"
              >
                Next
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit(onSubmit)}
                disabled={isGenerating}
                className="gap-2 bg-green-600 hover:bg-green-700 text-sm py-1.5 h-9"
              >
                {isGenerating ? 'Generating...' : 'Generate Resume'}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}