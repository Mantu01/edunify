'use client'

import UserCard from "@/components/profile/user-card";
import { useSearchParams } from "next/navigation";

export default function Content() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type') || 'info';


  return type==='info'?<UserCard/>:null;
};