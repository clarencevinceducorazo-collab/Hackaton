"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Trash2, Maximize2, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { sparkSuggestions } from "@/ai/flows/spark-suggestions-flow";

export interface CardData {
  id: string;
  title: string;
  content: string;
  x: number;
  y: number;
  color?: string;
}

interface IdeaCardProps {
  card: CardData;
  onUpdate: (id: string, updates: Partial<CardData>) => void;
  onDelete: (id: string) => void;
  isDragging?: boolean;
}

export function IdeaCard({ card, onUpdate, onDelete }: IdeaCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSparking, setIsSparking] = useState(false);
  const [localTitle, setLocalTitle] = useState(card.title);
  const [localContent, setLocalContent] = useState(card.content);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleSpark = async () => {
    if (!localContent && !localTitle) return;
    setIsSparking(true);
    try {
      const suggestion = await sparkSuggestions(localContent || localTitle);
      setLocalContent((prev) => `${prev}\n\n✨ AI Spark:\n${suggestion}`);
      onUpdate(card.id, { content: `${localContent}\n\n✨ AI Spark:\n${suggestion}` });
    } catch (error) {
      console.error("Spark failed", error);
    } finally {
      setIsSparking(false);
    }
  };

  const saveChanges = () => {
    onUpdate(card.id, { title: localTitle, content: localContent });
    setIsEditing(false);
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        "toy-card absolute w-80 min-h-[160px] p-1 flex flex-col group z-10",
        isEditing ? "z-50" : "hover:z-20"
      )}
      style={{
        left: card.x,
        top: card.y,
        transition: "box-shadow 0.3s ease, transform 0.3s ease"
      }}
    >
      <div className="flex items-center justify-between p-3 pb-0 cursor-grab active:cursor-grabbing">
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full bg-white/50 hover:bg-white text-destructive"
            onClick={() => onDelete(card.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full bg-white/50 hover:bg-white text-accent"
              onClick={() => setIsEditing(true)}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full bg-accent text-white hover:bg-accent/90"
              onClick={saveChanges}
            >
              <Check className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="px-4 py-2 flex flex-col flex-grow">
        {isEditing ? (
          <div className="space-y-3">
            <Input
              value={localTitle}
              onChange={(e) => setLocalTitle(e.target.value)}
              placeholder="Idea Title..."
              className="border-none font-bold text-lg p-0 focus-visible:ring-0 bg-transparent h-auto"
            />
            <Textarea
              value={localContent}
              onChange={(e) => setLocalContent(e.target.value)}
              placeholder="What's on your mind?"
              className="border-none resize-none p-0 focus-visible:ring-0 bg-transparent min-h-[120px]"
            />
          </div>
        ) : (
          <div className="space-y-1">
            <h3 className="font-bold text-lg text-slate-800 line-clamp-2">{card.title || "New Idea"}</h3>
            <p className="text-sm text-slate-600 line-clamp-6 whitespace-pre-wrap">{card.content || "Click to add details..."}</p>
          </div>
        )}
      </div>

      <div className="p-3 pt-0 flex justify-end">
        <Button
          variant="secondary"
          size="sm"
          disabled={isSparking}
          onClick={handleSpark}
          className={cn(
            "squishy-btn shine-effect h-8 rounded-full text-xs font-bold gap-2",
            isSparking ? "animate-pulse" : ""
          )}
        >
          <Sparkles className="h-3 w-3" />
          {isSparking ? "Sparking..." : "Get Spark"}
        </Button>
      </div>
    </div>
  );
}
