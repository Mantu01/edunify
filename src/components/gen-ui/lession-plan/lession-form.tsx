import { Calendar, Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { z } from "zod";
import { useState } from "react";
import { useTamboThreadInput } from "@tambo-ai/react";

const FORM_STYLES = {
  primaryColor: "rgba(234, 179, 8, 0.1)",
  borderColor: "border-amber-200",
  textColor: "text-amber-900",
  accentText: "text-amber-700",
  buttonColor: "bg-amber-500 hover:bg-amber-600",
  retroBg: "bg-amber-50",
  cardBg: "bg-white",
  labelColor: "text-amber-800",
  errorColor: "text-red-500",
  successColor: "text-green-600",
  warningColor: "text-orange-500"
};

const GRADE_LEVELS = ["K", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th", "College"];
const CLASS_TYPES = ["online", "offline", "hybrid"];
const STUDENT_LEVELS = ["beginner", "intermediate", "advanced"];
const TEACHING_STYLES = ["lecture", "interactive", "discussion", "project"];
const ASSESSMENT_TYPES = ["quiz", "assignment", "presentation", "activity"];

const TeachingStyleLabels: Record<string, string> = {
  lecture: "Lecture",
  interactive: "Interactive",
  discussion: "Discussion",
  project: "Project",
};

const AssessmentLabels: Record<string, string> = {
  quiz: "Quiz",
  assignment: "Assignment",
  presentation: "Presentation",
  activity: "Activity"
};

const LessonPlanFormSchema = z.object({
  subject: z.string(),
  gradeLevel: z.string(),
  durationMinutes: z.number().positive(),
  classType: z.enum(["online","offline","hybrid"]),
  studentLevel: z.enum(["beginner","intermediate","advanced"]),
  learningGoals: z.string(),
  keyTopics: z.string(),
  priorKnowledge: z.string().optional(),
  teachingStylePreference: z.array(z.enum(["lecture","interactive","discussion","project"])).optional(),
  assessmentPreference: z.array(z.enum(["quiz","assignment","presentation","activity"])).optional(),
  homeworkRequired: z.boolean(),
  specialInstructions: z.string().optional()
});

type FormData = z.infer<typeof LessonPlanFormSchema>;

export default function LessonPlanForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { submit,setValue:setTamboInputValue } = useTamboThreadInput();

  const form = useForm<FormData>({
    resolver: zodResolver(LessonPlanFormSchema),
    defaultValues: {
      subject: "",
      gradeLevel: "",
      durationMinutes: 45,
      classType: "offline",
      studentLevel: "intermediate",
      learningGoals: "",
      keyTopics: "",
      priorKnowledge: "",
      teachingStylePreference: [],
      assessmentPreference: [],
      homeworkRequired: false,
      specialInstructions: ""
    }
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      setTamboInputValue('Generate Lession Plan according to the given form data.');
    await submit({
      streamResponse: true,
      additionalContext: {
        formSubmission: data
      },
    });
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`${FORM_STYLES.retroBg} p-4 -ml-10 -mt-14 scale-85 scale-x-80 rounded-lg border-2 ${FORM_STYLES.borderColor} shadow-lg max-w-lg mx-auto`}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <div className="grid grid-cols-3 gap-3">
            <FormField control={form.control} name="subject" render={({ field }) => (
              <FormItem>
                <FormLabel className={`${FORM_STYLES.labelColor} text-xs`}>Subject</FormLabel>
                <FormControl>
                  <Input placeholder="Computer Science" {...field} className={`${FORM_STYLES.borderColor} h-8 text-sm`} />
                </FormControl>
                <FormMessage className={`${FORM_STYLES.errorColor} text-xs`} />
              </FormItem>
            )} />

            <FormField control={form.control} name="gradeLevel" render={({ field }) => (
              <FormItem>
                <FormLabel className={`${FORM_STYLES.labelColor} text-xs`}>Grade</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className={`${FORM_STYLES.borderColor} h-8 text-sm`}>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {GRADE_LEVELS.map((grade) => (
                      <SelectItem key={grade} value={grade} className="text-sm backdrop-blur-xl">{grade}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className={`${FORM_STYLES.errorColor} text-xs`} />
              </FormItem>
            )} />

            <FormField control={form.control} name="studentLevel" render={({ field }) => (
            <FormItem>
              <FormLabel className={`${FORM_STYLES.labelColor} text-xs`}>Student Level</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className={`${FORM_STYLES.borderColor} h-8 text-sm`}>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {STUDENT_LEVELS.map((level) => (
                    <SelectItem key={level} value={level} className="text-sm backdrop-blur-xl">{level.charAt(0).toUpperCase() + level.slice(1)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className={`${FORM_STYLES.errorColor} text-xs`} />
            </FormItem>
          )} />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <FormField control={form.control} name="durationMinutes" render={({ field }) => (
              <FormItem>
                <FormLabel className={`${FORM_STYLES.labelColor} text-xs`}>Duration (min)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="45" {...field} onChange={e => field.onChange(parseInt(e.target.value))} className={`${FORM_STYLES.borderColor} h-8 text-sm`} />
                </FormControl>
                <FormMessage className={`${FORM_STYLES.errorColor} text-xs`} />
              </FormItem>
            )} />

            <FormField control={form.control} name="classType" render={({ field }) => (
              <FormItem>
                <FormLabel className={`${FORM_STYLES.labelColor} text-xs`}>Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className={`${FORM_STYLES.borderColor} h-8 text-sm`}>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CLASS_TYPES.map((type) => (
                      <SelectItem key={type} value={type} className="text-sm backdrop-blur-xl">{type.charAt(0).toUpperCase() + type.slice(1)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className={`${FORM_STYLES.errorColor} text-xs`} />
              </FormItem>
            )} />

            <FormField control={form.control} name="priorKnowledge" render={({ field }) => (
            <FormItem>
              <FormLabel className={`${FORM_STYLES.labelColor} text-xs`}>Prior Knowledge</FormLabel>
              <FormControl>
                <Input placeholder="Array, String, etc" {...field} className={`${FORM_STYLES.borderColor} h-8 text-sm`} />
              </FormControl>
            </FormItem>
          )} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField control={form.control} name="learningGoals" render={({ field }) => (
              <FormItem>
                <FormLabel className={`${FORM_STYLES.labelColor} text-xs`}>Learning Goals</FormLabel>
                <FormControl>
                  <Textarea placeholder="Advance DSA" {...field} className={`${FORM_STYLES.borderColor} text-sm min-h-15`} />
                </FormControl>
                <FormMessage className={`${FORM_STYLES.errorColor} text-xs`} />
              </FormItem>
            )} />

            <FormField control={form.control} name="keyTopics" render={({ field }) => (
              <FormItem>
                <FormLabel className={`${FORM_STYLES.labelColor} text-xs`}>Key Topics</FormLabel>
                <FormControl>
                  <Textarea placeholder="Stack, Queue, Sorting alogrithms, etc." {...field} className={`${FORM_STYLES.borderColor} text-sm min-h-15`} />
                </FormControl>
                <FormMessage className={`${FORM_STYLES.errorColor} text-xs`} />
              </FormItem>
            )} />
          </div>

          <FormField control={form.control} name="teachingStylePreference" render={() => (
            <FormItem>
              <FormLabel className={`${FORM_STYLES.labelColor} text-xs`}>Teaching Style</FormLabel>
              <div className="grid grid-cols-4 gap-1">
                {TEACHING_STYLES.map((style) => (
                  <FormField key={style} control={form.control} name="teachingStylePreference" render={({ field }) => (
                    <FormItem key={style} className="flex flex-row items-center space-x-2">
                      <FormControl>
                        <Checkbox checked={field.value?.includes(style as any)} onCheckedChange={(checked) => {
                          const current = field.value || [];
                          return checked
                            ? field.onChange([...current, style])
                            : field.onChange(current.filter((value) => value !== style));
                        }} className={`${FORM_STYLES.borderColor} h-4 w-4`} />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer text-xs">{TeachingStyleLabels[style]}</FormLabel>
                    </FormItem>
                  )} />
                ))}
              </div>
              <FormMessage className={`${FORM_STYLES.errorColor} text-xs`} />
            </FormItem>
          )} />

          <FormField control={form.control} name="assessmentPreference" render={() => (
            <FormItem>
              <FormLabel className={`${FORM_STYLES.labelColor} text-xs`}>Assessment</FormLabel>
              <div className="grid grid-cols-4 gap-1">
                {ASSESSMENT_TYPES.map((type) => (
                  <FormField key={type} control={form.control} name="assessmentPreference" render={({ field }) => (
                    <FormItem key={type} className="flex flex-row items-center space-x-2">
                      <FormControl>
                        <Checkbox checked={field.value?.includes(type as any)} onCheckedChange={(checked) => {
                          const current = field.value || [];
                          return checked
                            ? field.onChange([...current, type])
                            : field.onChange(current.filter((value) => value !== type));
                        }} className={`${FORM_STYLES.borderColor} h-4 w-4`} />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer text-xs">{AssessmentLabels[type]}</FormLabel>
                    </FormItem>
                  )} />
                ))}
              </div>
              <FormMessage className={`${FORM_STYLES.errorColor} text-xs`} />
            </FormItem>
          )} />

          <FormField control={form.control} name="homeworkRequired" render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-2 p-2 rounded-md" style={{ backgroundColor: FORM_STYLES.primaryColor }}>
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} className={`${FORM_STYLES.borderColor} h-4 w-4`} />
              </FormControl>
              <div className="space-y-0.5">
                <FormLabel className={`${FORM_STYLES.labelColor} text-xs`}>Homework</FormLabel>
                <FormDescription className={`${FORM_STYLES.accentText} text-xs`}>Assignments needed</FormDescription>
              </div>
            </FormItem>
          )} />

          <FormField control={form.control} name="specialInstructions" render={({ field }) => (
            <FormItem>
              <FormLabel className={`${FORM_STYLES.labelColor} text-xs`}>Special Instructions</FormLabel>
              <FormControl>
                <Textarea placeholder="Additional requirements" {...field} className={`${FORM_STYLES.borderColor} text-sm min-h-15`} />
              </FormControl>
              <FormMessage className={`${FORM_STYLES.errorColor} text-xs`} />
            </FormItem>
          )} />

          <Button type="submit" className={`w-full ${FORM_STYLES.buttonColor} text-white font-bold py-1.5 px-4 rounded text-sm`} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Calendar className="mr-2 h-3 w-3" />
                Generate Plan
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}