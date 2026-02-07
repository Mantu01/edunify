"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, FileText, ClipboardList, Search, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { DIFFICULTY_CONFIG } from "@/lib/constants";

type ExploreItem = {
  type: "mcq" | "assignment" | "note";
  id: string;
  title: string;
  difficulty?: string;
  subject?: string;
  count?: number;
  depthLevel?: string;
  noteType?: string;
};

export default function ExplorePage() {
  const router = useRouter();
  const [mcqs, setMcqs] = useState<ExploreItem[]>([]);
  const [assignments, setAssignments] = useState<ExploreItem[]>([]);
  const [notes, setNotes] = useState<ExploreItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [subjectFilter, setSubjectFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const fetchExplore = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (typeFilter && typeFilter !== "all") params.set("type", typeFilter);
      if (difficultyFilter && difficultyFilter !== "all") params.set("difficulty", difficultyFilter);
      if (subjectFilter) params.set("subject", subjectFilter);
      if (searchQuery) params.set("search", searchQuery);
      const res = await fetch(`/api/explore?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setMcqs(data.mcqs || []);
        setAssignments(data.assignments || []);
        setNotes(data.notes || []);
      }
    } catch {
      setMcqs([]);
      setAssignments([]);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  }, [typeFilter, difficultyFilter, subjectFilter, searchQuery]);

  useEffect(() => {
    fetchExplore();
  }, [fetchExplore]);

  const handleItemClick = (item: ExploreItem) => {
    if (item.type === "mcq") router.push(`/mcq?id=${item.id}`);
    if (item.type === "assignment") router.push(`/assignment?id=${item.id}`);
    if (item.type === "note") router.push(`/note?id=${item.id}`);
  };

  const ItemCard = ({ item }: { item: ExploreItem }) => {
    const icons = {
      mcq: BookOpen,
      assignment: ClipboardList,
      note: FileText
    };
    const Icon = icons[item.type];
    const diffColor = item.difficulty ? (DIFFICULTY_CONFIG as Record<string, { color: string }>)[item.difficulty]?.color || "bg-gray-100 text-gray-800" : "";

    return (
      <Card
        className="border-2 border-amber-200 bg-amber-50/50 hover:bg-amber-50 cursor-pointer transition-colors shadow-sm"
        onClick={() => handleItemClick(item)}
      >
        <CardHeader className="pb-2">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-100">
              <Icon className="h-5 w-5 text-amber-700" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-amber-900 truncate">{item.title}</h3>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {item.difficulty && (
                  <Badge className={`text-xs ${diffColor} border`}>
                    {item.difficulty}
                  </Badge>
                )}
                {item.subject && (
                  <Badge variant="outline" className="text-xs border-amber-300 text-amber-800">
                    {item.subject}
                  </Badge>
                )}
                {item.count !== undefined && (
                  <Badge variant="outline" className="text-xs border-amber-300 text-amber-800">
                    {item.count} {item.type === "mcq" ? "questions" : item.type === "assignment" ? "questions" : "note"}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50/80 to-orange-50/50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-amber-900">Explore</h1>
          <p className="text-amber-800/80 mt-1">Discover MCQs, assignments, and notes</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-600" />
            <Input
              placeholder="Search by topic, subject, or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-amber-200 bg-white/80 focus-visible:ring-amber-400"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-40 border-amber-200 bg-white/80">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="mcq">MCQ</SelectItem>
              <SelectItem value="assignment">Assignment</SelectItem>
              <SelectItem value="note">Note</SelectItem>
            </SelectContent>
          </Select>
          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger className="w-full sm:w-40 border-amber-200 bg-white/80">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="Subject filter"
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="w-full sm:w-44 border-amber-200 bg-white/80"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
          </div>
        ) : (
          <div className="space-y-8">
            {(typeFilter === "all" || typeFilter === "mcq") && mcqs.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold text-amber-900 mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-amber-600" />
                  MCQs
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {mcqs.map((item) => (
                    <ItemCard key={`mcq-${item.id}`} item={item} />
                  ))}
                </div>
              </section>
            )}
            {(typeFilter === "all" || typeFilter === "assignment") && assignments.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold text-amber-900 mb-4 flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-amber-600" />
                  Assignments
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {assignments.map((item) => (
                    <ItemCard key={`assignment-${item.id}`} item={item} />
                  ))}
                </div>
              </section>
            )}
            {(typeFilter === "all" || typeFilter === "note") && notes.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold text-amber-900 mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-amber-600" />
                  Notes
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {notes.map((item) => (
                    <ItemCard key={`note-${item.id}`} item={item} />
                  ))}
                </div>
              </section>
            )}
            {!loading && mcqs.length === 0 && assignments.length === 0 && notes.length === 0 && (
              <div className="text-center py-20 text-amber-800/70">
                <p>No items found. Try adjusting your filters.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
