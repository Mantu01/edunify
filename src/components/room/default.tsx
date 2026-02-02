"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ROLE_DATA, RoleType } from "@/lib/constants";
import { useAuth } from "@clerk/nextjs";

export default function RolePage() {
  const {sessionClaims}=useAuth();
  const role=sessionClaims?.role as RoleType
  const roleData = ROLE_DATA[role];

  return (
    <div className="min-h-screen p-6 md:p-8" style={{ fontFamily: "'Space Grotesk', sans-serif", backgroundColor: roleData.color }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <Badge variant="outline" className="mb-4 text-lg px-4 py-1 border-2" style={{ borderColor: roleData.accent, color: roleData.accent }}>
            AI Powered Assistant
          </Badge>
          <h1 className="text-5xl font-bold mb-3 tracking-tight" style={{ color: roleData.accent }}>{roleData.title}</h1>
          <p className="text-xl text-gray-600">Your AI companion for professional success</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roleData.features.map((feature, index) => (
            <Card key={index} className="overflow-hidden border-2 hover:shadow-2xl transition-all duration-300" style={{ borderColor: roleData.accent }}>
              <div className="h-2 w-full" style={{ backgroundColor: roleData.accent }} />
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-md" style={{ backgroundColor: roleData.color }}>
                    <feature.icon  />
                  </div>
                </div>
                <CardTitle className="text-2xl mt-4">{feature.title}</CardTitle>
                <CardDescription className="text-base">{feature.desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full text-base py-6" style={{ backgroundColor: roleData.accent }}>
                  Access Tool
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}