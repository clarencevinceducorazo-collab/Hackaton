"use client";

import React from "react";
import { Cloud } from "lucide-react";

export function Background() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {/* Blobs */}
      <div className="absolute top-[10%] left-[5%] w-[40vw] h-[40vw] bg-primary/10 rounded-full mix-blend-multiply filter blur-[80px] animate-blob" />
      <div className="absolute top-[20%] right-[10%] w-[35vw] h-[35vw] bg-accent/10 rounded-full mix-blend-multiply filter blur-[80px] animate-blob" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-[10%] left-[20%] w-[45vw] h-[45vw] bg-purple-300/10 rounded-full mix-blend-multiply filter blur-[80px] animate-blob" style={{ animationDelay: '4s' }} />
      
      {/* Clouds */}
      <Cloud 
        className="absolute top-20 left-[15%] text-white/40 w-32 h-32 animate-float-delayed" 
        strokeWidth={1}
      />
      <Cloud 
        className="absolute top-60 right-[20%] text-white/30 w-48 h-48 animate-float" 
        strokeWidth={1}
      />
      <Cloud 
        className="absolute bottom-40 right-[10%] text-white/20 w-24 h-24 animate-float-delayed" 
        strokeWidth={1}
      />
    </div>
  );
}
