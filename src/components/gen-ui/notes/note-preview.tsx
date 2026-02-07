import React from 'react';
import { FileText, Download, BookOpen, Brain, Calendar, BarChart, School, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { roleColors } from '@/lib/constants';
import MarkdownPreview from '@/components/ui/custome-markdown-preview';
import { useAuth } from '@clerk/nextjs';
import { useRoom } from '@/contexts/room-context';
import { toast } from 'sonner';

const NOTE_TYPE_CONFIG = {
  summary: { icon: FileText, label: 'Summary', color: 'text-yellow-600' },
  detailed: { icon: BookOpen, label: 'Detailed', color: 'text-green-600' },
  concept_map: { icon: Brain, label: 'Concept Map', color: 'text-orange-600' },
  flashcards: { icon: Layers, label: 'Flashcards', color: 'text-red-600' },
  cheat_sheet: { icon: FileText, label: 'Cheat Sheet', color: 'text-yellow-600' },
  comparison: { icon: BarChart, label: 'Comparison', color: 'text-green-600' },
  timeline: { icon: Calendar, label: 'Timeline', color: 'text-orange-600' },
  formula_sheet: { icon: School, label: 'Formula Sheet', color: 'text-red-600' },
};

const DEPTH_LEVEL_CONFIG = {
  basic: { label: 'Basic', color: 'bg-yellow-100 text-yellow-800' },
  intermediate: { label: 'Intermediate', color: 'bg-orange-100 text-orange-800' },
  advanced: { label: 'Advanced', color: 'bg-red-100 text-red-800' },
  expert: { label: 'Expert', color: 'bg-green-100 text-green-800' },
};

const NoteComponent: React.FC = () => {
  const {sessionClaims}=useAuth();
  const {note}=useRoom();

  if(!note) return null;

  const {content,depthLevel,noteType,subject,title,uniqueId}=note;
  
  const role = sessionClaims?.role as keyof typeof roleColors;
  const roleColor = roleColors[role ?? 'student'];
  const NoteTypeIcon = NOTE_TYPE_CONFIG[noteType].icon;

  const sidebarData = [
    { icon: BookOpen, label: 'Subject', value: subject },
    { icon: NOTE_TYPE_CONFIG[noteType].icon, label: 'Type', value: NOTE_TYPE_CONFIG[noteType].label },
    { icon: Brain, label: 'Depth', value: DEPTH_LEVEL_CONFIG[depthLevel].label },
  ];

  const handleDownloadPDF = () => {
    toast.info('This feature is not available yet.')
  };

  return (
    <div className={`flex h-160 ${roleColor.bg} p-6 gap-6`}>
      <div className="w-1/5 flex flex-col space-y-6">
        <Card className={`${roleColor.border} border-2 ${roleColor.bg} backdrop-blur-sm`}>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-2 rounded-lg ${roleColor.bg}`}>
                <NoteTypeIcon className={`h-6 w-6 ${NOTE_TYPE_CONFIG[noteType].color}`} />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${roleColor.text}`}>{title}</h1>
                <p className="text-sm text-gray-600">AI-Generated Note</p>
              </div>
            </div>

            <div className="space-y-4">
              {sidebarData.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/50">
                  <div className="flex items-center gap-2">
                    <item.icon className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{item.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-6">

              <Button
                onClick={handleDownloadPDF}
                className={`w-full ${roleColor.button} text-white font-semibold py-6`}
              >
                <Download className="mr-2 h-5 w-5" />
                Download PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="w-4/5">
        <Card className={`h-full ${roleColor.border} border-2 ${roleColor.bg} backdrop-blur-sm overflow-hidden`}>
          <div className="h-full overflow-y-auto p-8">
            <div className="max-w-4xl mx-auto">
              <div className="mb-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-12 h-1 bg-yellow-400"></div>
                  <div className="w-8 h-1 bg-green-400"></div>
                  <div className="w-6 h-1 bg-orange-400"></div>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{subject}</h2>
              </div>
              <div className="prose prose-lg max-w-none">
                <div className="px-6 py-2 bg-yellow-50/10 border-l-4 border-yellow-300 mb-8 rounded-r-lg">
                  <p className="text-gray-700 font-medium">{title}</p>
                </div>
                <div className="text-gray-800 leading-relaxed space-y-6">
                  <MarkdownPreview userRole={role} markdown={content} />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default NoteComponent;