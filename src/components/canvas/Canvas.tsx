"use client";

import React, { useState, useEffect } from "react";
import { IdeaCard, CardData } from "./IdeaCard";
import { Toolbar } from "./Toolbar";
import { Background } from "./Background";

export function Canvas() {
  const [cards, setCards] = useState<CardData[]>([]);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem("spark-canvas-data");
    if (saved) {
      try {
        setCards(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved canvas", e);
      }
    } else {
      // Default initial card
      setCards([{
        id: "initial-1",
        title: "Hackaton Project",
        content: "Use the plus button to add ideas, or type a theme below to let AI kickstart your brainstorming session!",
        x: 100,
        y: 100
      }]);
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem("spark-canvas-data", JSON.stringify(cards));
  }, [cards]);

  const addCard = () => {
    const newCard: CardData = {
      id: crypto.randomUUID(),
      title: "",
      content: "",
      x: window.innerWidth / 2 - 160 + (Math.random() * 40 - 20),
      y: window.innerHeight / 2 - 100 + (Math.random() * 40 - 20),
    };
    setCards((prev) => [...prev, newCard]);
  };

  const updateCard = (id: string, updates: Partial<CardData>) => {
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const deleteCard = (id: string) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
  };

  const clearCanvas = () => {
    if (confirm("Clear your entire canvas?")) {
      setCards([]);
    }
  };

  const bulkAdd = (ideas: { title: string; content: string }[]) => {
    const newCards: CardData[] = ideas.map((idea, i) => ({
      id: crypto.randomUUID(),
      title: idea.title,
      content: idea.content,
      x: 150 + i * 340,
      y: 200 + (i % 2 === 0 ? 0 : 100),
    }));
    setCards((prev) => [...prev, ...newCards]);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-background">
      <Background />
      
      <header className="fixed top-0 left-0 right-0 p-6 flex justify-between items-center z-50 pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg transform rotate-6 hover:rotate-0 transition-transform cursor-pointer">
            <span className="text-white font-black text-xl">S</span>
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Spark<span className="text-primary">Canvas</span></h1>
        </div>
        
        <div className="flex items-center gap-4 pointer-events-auto">
          <div className="glass-panel px-4 py-2 rounded-full text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Workspace Live
          </div>
        </div>
      </header>

      <main className="w-full h-full relative cursor-default">
        {cards.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center opacity-20">
              <h2 className="text-6xl font-black mb-4">Empty Space</h2>
              <p className="text-xl font-bold">Add your first spark to begin</p>
            </div>
          </div>
        )}
        
        <div className="absolute inset-0 overflow-auto p-[500px]">
           {/* In a real production app, we would use a library like react-draggable or framer-motion 
               for drag-and-drop. For this professional UI prototype, we focus on the visual card state. */}
           {cards.map((card) => (
             <IdeaCard
               key={card.id}
               card={card}
               onUpdate={updateCard}
               onDelete={deleteCard}
             />
           ))}
        </div>
      </main>

      <Toolbar 
        onAddCard={addCard} 
        onClear={clearCanvas} 
        onBulkAdd={bulkAdd}
      />
    </div>
  );
}
