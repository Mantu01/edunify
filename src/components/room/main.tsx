'use client'

import { useRoom } from "@/contexts/room-context";
import MCQList from "../gen-ui/mcq/mcq-list";
import RolePage from "./default";
import NoteDisplay from "../gen-ui/notes/note-preview";


export const RoomPage = () => {
  const {currentState}=useRoom();

  if (currentState === "mcq") return <MCQList/>;
  if(currentState==='note')   return <NoteDisplay/> ;

  return <RolePage/> ;
};