"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Sparkles, Eraser } from "lucide-react";
import { cn } from "@/lib/utils";
import { initialCanvasGeneration } from "@/ai/flows/initial-canvas-generation-flow";

interface ToolbarProps {
  onAddCard: () => void;
  onClear: () => void;
  onBulkAdd: (ideas: { title: string; content: string }[]) => void;
}

export function Toolbar({ onAddCard, onClear, onBulkAdd }: ToolbarProps) {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
      const result = await initialCanvasGeneration({ prompt });
      onBulkAdd(result.ideas);
      setPrompt("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4">
      <div className="glass-panel p-2 rounded-full flex items-center gap-2 shadow-2xl px-6">
        <Button
          onClick={onAddCard}
          className="squishy-btn h-12 w-12 rounded-full bg-accent hover:bg-accent/90 text-white shadow-lg"
        >
          <Plus className="h-6 w-6" />
        </Button>
        
        <div className="h-8 w-[1px] bg-slate-200 mx-2" />
        
        <div className="flex items-center gap-2 bg-slate-100/50 rounded-full pl-4 pr-1 py-1">
          <Input 
            placeholder="Generate canvas from theme..."
            className="border-none bg-transparent focus-visible:ring-0 w-64 text-sm"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          />
          <Button 
            variant="ghost" 
            size="icon" 
            disabled={isGenerating || !prompt.trim()}
            onClick={handleGenerate}
            className="h-10 w-10 rounded-full text-primary hover:bg-white"
          >
            <Sparkles className={cn("h-5 w-5", isGenerating && "animate-spin")} />
          </Button>
        </div>

        <div className="h-8 w-[1px] bg-slate-200 mx-2" />

        <Button
          variant="ghost"
          size="icon"
          onClick={onClear}
          className="h-10 w-10 rounded-full text-slate-400 hover:text-destructive hover:bg-destructive/10"
        >
          <Eraser className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
