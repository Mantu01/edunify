"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, FileText, ClipboardList, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { DIFFICULTY_CONFIG } from "@/lib/constants";

type ActivityItem = {
  type: "mcq" | "assignment" | "note";
  id: string;
  title: string;
  difficulty?: string;
  subject?: string;
  count?: number;
  depthLevel?: string;
  noteType?: string;
  date: string;
};

export default function Recent() {
  const router = useRouter();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await fetch("/api/activity");
        const data = await res.json();
        if (data.success && Array.isArray(data.activities)) {
          setActivities(
            data.activities.map((a: ActivityItem & { date?: Date }) => ({
              ...a,
              date: typeof a.date === "string" ? a.date : a.date ? new Date(a.date).toISOString() : ""
            }))
          );
        }
      } catch {
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
  }, []);

  const handleClick = (item: ActivityItem) => {
    if (item.type === "mcq") router.push(`/mcq?id=${item.id}`);
    if (item.type === "assignment") router.push(`/assignment?id=${item.id}`);
    if (item.type === "note") router.push(`/note?id=${item.id}`);
  };

  const icons = {
    mcq: BookOpen,
    assignment: ClipboardList,
    note: FileText
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return d.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex w-full items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="rounded-xl border-2 border-amber-200 bg-amber-50/50 p-8 text-center">
        <p className="text-amber-800/80">No recent activity yet. Create MCQs, notes, or assignments to see them here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full">
      <h2 className="text-xl font-semibold text-amber-900">Recent Activity</h2>
      <div className="space-y-3">
        {activities.map((item, idx) => {
          const Icon = icons[item.type];
          const diffColor = item.difficulty
            ? (DIFFICULTY_CONFIG as Record<string, { color: string }>)[item.difficulty]?.color || "bg-gray-100 text-gray-800"
            : "";

          return (
            <Card
              key={`${item.type}-${item.id}-${idx}`}
              className="border-2 border-amber-200 bg-amber-50/50 hover:bg-amber-50 cursor-pointer transition-colors"
              onClick={() => handleClick(item)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-amber-100 shrink-0">
                    <Icon className="h-5 w-5 text-amber-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-amber-900">{item.title}</span>
                      <Badge variant="outline" className="text-xs border-amber-300 text-amber-800 capitalize">
                        {item.type}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {item.difficulty && (
                        <Badge className={`text-xs ${diffColor} border`}>{item.difficulty}</Badge>
                      )}
                      {item.subject && (
                        <Badge variant="outline" className="text-xs border-amber-300 text-amber-800">
                          {item.subject}
                        </Badge>
                      )}
                      {item.count !== undefined && item.type !== "note" && (
                        <span className="text-sm text-amber-800/70">{item.count} questions</span>
                      )}
                    </div>
                    <p className="text-xs text-amber-700/70 mt-1">{formatDate(item.date)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
