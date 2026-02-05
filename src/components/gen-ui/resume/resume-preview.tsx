import React from 'react';
import { z } from 'zod';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, FileText, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { roleColors } from '@/lib/constants';

const ResumePreviewPropsSchema = z.object({
  content: z.string(),
  userRole: z.enum(['student', 'teacher', 'founder']).default('student'),
  isLoading: z.boolean().default(false),
});

type ResumePreviewProps = z.infer<typeof ResumePreviewPropsSchema>;

const ResumePreview: React.FC<ResumePreviewProps> = ({ content, userRole = 'student', isLoading = false }) => {
  const colors = roleColors[userRole];
  const [previewError, setPreviewError] = React.useState<string | null>(null);

  const renderLatexPreview = () => {
    if (!content.trim()) {
      return (
        <div className="flex flex-col items-center justify-center h-64">
          <FileText className={`w-12 h-12 ${colors.text} opacity-30 mb-4`} />
          <p className={`${colors.text} opacity-50 text-center`}>LaTeX content will appear here</p>
        </div>
      );
    }

    try {

      return <div />;
    } catch (error) {
      console.log(error)
      setPreviewError('Failed to render LaTeX content');
      return null;
    }
  };

  return (
    <Card className={`w-full ${colors.border} ${colors.darkBorder} border-2 shadow-lg`}>
      <CardContent className={`p-6 ${colors.bg} ${colors.darkBg} min-h-100`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className={`w-5 h-5 ${colors.text}`} />
            <h2 className={`text-lg font-bold ${colors.text}`}>Resume Preview</h2>
          </div>
          <div className={`px-3 py-1 text-xs font-medium rounded-full ${colors.button} text-white`}>
            {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className={`w-8 h-8 ${colors.text} animate-spin`} />
          </div>
        ) : previewError ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{previewError}</AlertDescription>
          </Alert>
        ) : (
          <div className={`border rounded-lg p-4 bg-white/80 backdrop-blur-sm font-serif ${colors.border} border-dashed`}>
            <div className="text-sm leading-relaxed">
              {renderLatexPreview()}
            </div>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-dashed">
          <div className="flex items-center gap-2 text-xs opacity-70">
            <div className={`w-3 h-3 rounded-full ${colors.button}`} />
            <span className={colors.text}>LaTeX Resume Preview</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
export default ResumePreview