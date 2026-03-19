"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";

export default function LandingPage() {
  const [mx, setMx] = useState(0);
  const [my, setMy] = useState(0);
  const [rx, setRx] = useState(0);
  const [ry, setRy] = useState(0);
  const [scrollPos, setScrollPos] = useState(0);
  const [particles, setParticles] = useState<any[]>([]);
  
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Cursor handling
    const handleMouseMove = (e: MouseEvent) => {
      setMx(e.clientX);
      setMy(e.clientY);
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
    };

    // Parallax & Scroll handling
    const handleScroll = () => {
      setScrollPos(window.scrollY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    // Ring animation loop
    let requestRef: number;
    const animateRing = () => {
      setRx((prev) => prev + (mx - prev) * 0.12);
      setRy((prev) => prev + (my - prev) * 0.12);
      if (ringRef.current) {
        ringRef.current.style.left = `${rx}px`;
        ringRef.current.style.top = `${ry}px`;
      }
      requestRef = requestAnimationFrame(animateRing);
    };
    requestRef = requestAnimationFrame(animateRing);

    // Initial particles
    const newParticles = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 15,
      duration: Math.random() * 10 + 10,
      size: Math.random() * 2 + 1,
    }));
    setParticles(newParticles);

    // Intersection Observer for Reveal
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(requestRef);
    };
  }, [mx, my, rx, ry]);

  const toggleCursorHover = (isHovering: boolean) => {
    if (cursorRef.current && ringRef.current) {
      cursorRef.current.style.width = isHovering ? '16px' : '8px';
      cursorRef.current.style.height = isHovering ? '16px' : '8px';
      ringRef.current.style.width = isHovering ? '50px' : '32px';
      ringRef.current.style.height = isHovering ? '50px' : '32px';
    }
  };

  return (
    <div className="landing-container min-h-screen bg-[#050810] text-[#f0f4ff] font-['Syne'] overflow-x-hidden cursor-none selection:bg-cyan-500/30">
      {/* Custom cursor */}
      <div 
        ref={cursorRef} 
        className="cursor fixed w-2 h-2 bg-[#00d4ff] rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-[width,height,opacity] duration-200 mix-blend-screen opacity-100" 
      />
      <div 
        ref={ringRef} 
        className="cursor-ring fixed w-8 h-8 border border-[#00d4ff]/40 rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 transition-[width,height] duration-200" 
      />

      {/* Noise overlay */}
      <div className="fixed inset-0 pointer-events-none z-[1] opacity-40 bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.03\'/%3E%3C/svg%3E')]" />

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-[100] px-6 md:px-12 py-5 flex items-center justify-between backdrop-blur-xl bg-[#050810]/70 border-b border-[#3b82f6]/15">
        <div className="nav-logo font-['JetBrains_Mono'] text-[13px] text-[#00d4ff] flex items-center gap-2 tracking-widest">
          <div className="w-2 h-2 bg-[#00d4ff] rounded-full shadow-[0_0_8px_#00d4ff] animate-pulse" />
          BOUNTY.AI
        </div>
        <ul className="hidden md:flex gap-10 list-none">
          {["how", "features", "demo", "stack"].map((id) => (
            <li key={id}>
              <a 
                href={`#${id}`} 
                className="text-[13px] text-[#8892a4] hover:text-[#f0f4ff] transition-colors tracking-wide uppercase"
                onMouseEnter={() => toggleCursorHover(true)}
                onMouseLeave={() => toggleCursorHover(false)}
              >
                {id.replace("-", " ")}
              </a>
            </li>
          ))}
        </ul>
        <Link 
          href="/canvas" 
          className="nav-cta font-['JetBrains_Mono'] text-[12px] px-5 py-2 border border-[#00d4ff] text-[#00d4ff] hover:bg-[#00d4ff] hover:text-[#050810] transition-all relative overflow-hidden group"
          onMouseEnter={() => toggleCursorHover(true)}
          onMouseLeave={() => toggleCursorHover(false)}
        >
          Launch App →
        </Link>
      </nav>

      {/* HERO */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center px-6 pt-32 pb-16 overflow-hidden">
        <div 
          className="grid-bg absolute inset-[-20%] bg-[linear-gradient(rgba(59,130,246,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.06)_1px,transparent_1px)] bg-[size:60px_60px] [transform:perspective(800px)_rotateX(30deg)] origin-bottom transition-transform duration-100 ease-out"
          style={{ transform: `perspective(800px) rotateX(30deg) translateY(${scrollPos * 0.3}px)` }}
        />
        
        <div className="orb absolute w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(59,130,246,0.2)_0%,transparent_70%)] rounded-full blur-[80px] -top-24 -left-24 pointer-events-none" style={{ transform: `translateY(${scrollPos * 0.15}px)` }} />
        <div className="orb absolute w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(0,212,255,0.15)_0%,transparent_70%)] rounded-full blur-[80px] bottom-12 right-[10%] animate-float pointer-events-none" style={{ transform: `translateY(${scrollPos * -0.1}px)` }} />
        <div className="orb absolute w-[300px] h-[300px] bg-[radial-gradient(circle,rgba(16,185,129,0.1)_0%,transparent_70%)] rounded-full blur-[80px] top-[40%] left-[60%] animate-float-reverse pointer-events-none" style={{ transform: `translateY(${scrollPos * 0.08}px)` }} />

        {/* Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map((p) => (
            <div 
              key={p.id}
              className="absolute w-[2px] h-[2px] bg-[#00d4ff] rounded-full animate-rise opacity-0"
              style={{
                left: `${p.left}%`,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
                width: `${p.size}px`,
                height: `${p.size}px`,
              }}
            />
          ))}
        </div>

        <div className="relative z-[2] text-center max-w-[900px]">
          <div className="hero-tag inline-flex items-center gap-2 font-['JetBrains_Mono'] text-[11px] text-[#00d4ff] px-4 py-1.5 border border-[#00d4ff]/30 bg-[#00d4ff]/10 mb-8 animate-fade-slide-up">
            <div className="w-1.5 h-1.5 bg-[#00d4ff] rounded-full animate-pulse" />
            BASE BATCHES 2026 — AI AGENT TRACK
          </div>
          <h1 className="hero-title text-5xl md:text-[7rem] font-[800] leading-[0.95] tracking-tight mb-6 animate-fade-slide-up [animation-delay:0.1s]">
            <span className="block text-[#f0f4ff]">Bounties.</span>
            <span className="block bg-gradient-to-r from-blue-500 via-[#00d4ff] to-cyan-500 bg-clip-text text-transparent animate-gradient-shift bg-[length:200%_200%]">Judged by AI.</span>
            <span className="block text-[#f0f4ff]">Paid onchain.</span>
          </h1>
          <p className="hero-sub text-lg text-[#8892a4] leading-relaxed max-w-[580px] mx-auto mb-12 font-normal animate-fade-slide-up [animation-delay:0.2s]">
            Post a task, submit your work, and let an autonomous AI agent evaluate and pay you instantly — no human middleman, no delays, no bias.
          </p>
          <div className="hero-actions flex flex-wrap justify-center gap-4 animate-fade-slide-up [animation-delay:0.3s]">
            <a 
              href="#demo" 
              className="btn-primary inline-flex items-center gap-2.5 px-8 py-3.5 bg-[#00d4ff] text-[#050810] font-bold text-sm tracking-wide relative overflow-hidden transition-all hover:shadow-[0_0_40px_rgba(0,212,255,0.4)] clip-path-polygon"
              onMouseEnter={() => toggleCursorHover(true)}
              onMouseLeave={() => toggleCursorHover(false)}
            >
              ▶ See it live
            </a>
            <a 
              href="#how" 
              className="btn-secondary inline-flex items-center gap-2.5 px-8 py-3.5 border border-white/15 text-[#f0f4ff] font-medium text-sm tracking-wide transition-all hover:border-[#00d4ff]/40 hover:text-[#00d4ff] clip-path-polygon"
              onMouseEnter={() => toggleCursorHover(true)}
              onMouseLeave={() => toggleCursorHover(false)}
            >
              How it works →
            </a>
          </div>
          <div className="hero-stats flex flex-wrap justify-center gap-12 mt-16 pt-12 border-t border-[#3b82f6]/15 animate-fade-slide-up [animation-delay:0.4s]">
            {[
              { num: "<3s", label: "AI VERDICT TIME" },
              { num: "$0", label: "COST TO BUILD" },
              { num: "100%", label: "AUTONOMOUS" },
              { num: "BASE", label: "BLOCKCHAIN" },
            ].map((s, i) => (
              <div key={i} className="stat text-center">
                <span className="stat-num block text-3xl font-extrabold text-[#00d4ff] font-['JetBrains_Mono']">{s.num}</span>
                <span className="stat-label text-[12px] text-[#8892a4] tracking-wider mt-1">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#8892a4] font-['JetBrains_Mono'] text-[10px] tracking-widest animate-fade-slide-up [animation-delay:0.8s]">
          <span>SCROLL</span>
          <div className="scroll-line w-[1px] h-[50px] bg-gradient-to-b from-transparent to-[#00d4ff] animate-scroll-line" />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="relative z-[2] bg-[#0a0f1e] px-6 md:px-12 py-28 before:absolute before:inset-0 before:bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] before:bg-[size:40px_40px]">
        <div className="how-inner max-w-[1200px] mx-auto relative">
          <div className="how-header text-center mb-20 reveal">
            <div className="section-label font-['JetBrains_Mono'] text-[11px] text-[#00d4ff] tracking-[0.15em] mb-4 flex items-center justify-center gap-3">
              <div className="w-6 h-[1px] bg-[#00d4ff]" /> THE FLOW
            </div>
            <h2 className="section-title text-4xl md:text-5xl font-extrabold leading-tight tracking-tight mb-5 text-[#f0f4ff]">Zero friction.<br />End to end.</h2>
            <p className="section-sub text-base text-[#8892a4] leading-relaxed max-w-[520px] mx-auto">Four steps. Fully automated. No trust required between parties.</p>
          </div>
          <div className="steps-flow grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] items-start gap-4 md:gap-0">
            {[
              { num: "01", icon: "📋", title: "Post a bounty", desc: "Anyone sets a task with a title, description of requirements, and a USDC reward amount." },
              { num: "02", icon: "✍️", title: "Submit work", desc: "Any developer, designer, or writer submits their work for an open bounty via text or link." },
              { num: "03", icon: "🤖", title: "AI evaluates", desc: "Gemini AI reads both the requirements and the submission, returns APPROVED or REJECTED with full reasoning." },
              { num: "04", icon: "⚡", title: "Instant payout", desc: "On approval, USDC is sent automatically via Base blockchain. Transaction hash proves it happened." },
            ].map((step, i) => (
              <React.Fragment key={i}>
                <div 
                  className="step-card reveal bg-white/[0.02] border border-[#3b82f6]/15 p-8 relative group transition-all duration-300 hover:border-[#00d4ff]/30 hover:-translate-y-1 hover:bg-gradient-to-br hover:from-[#00d4ff]/5 hover:to-transparent"
                  onMouseEnter={() => toggleCursorHover(true)}
                  onMouseLeave={() => toggleCursorHover(false)}
                >
                  <div className="step-num font-['JetBrains_Mono'] text-[11px] text-[#00d4ff] tracking-widest mb-4">{step.num} —</div>
                  <div className="step-icon w-11 h-11 border border-[#3b82f6]/15 flex items-center justify-center text-xl mb-4 transition-colors group-hover:border-[#00d4ff]/40">{step.icon}</div>
                  <div className="step-title text-[15px] font-bold text-[#f0f4ff] mb-2">{step.title}</div>
                  <div className="step-desc text-[13px] text-[#8892a4] leading-relaxed">{step.desc}</div>
                </div>
                {i < 3 && (
                  <div className="step-arrow hidden md:flex items-center px-2 mt-16 reveal">
                    <div className="step-arrow-inner w-10 h-[1px] bg-gradient-to-r from-[#00d4ff]/30 to-[#00d4ff]/80 relative after:absolute after:right-[-1px] after:top-[-3px] after:border-l-[6px] after:border-l-[#00d4ff]/80 after:border-t-[3px] after:border-t-transparent after:border-b-[3px] after:border-b-transparent" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="relative z-[2] px-6 md:px-12 py-28">
        <div className="features-inner max-w-[1200px] mx-auto">
          <div className="features-header mb-16 reveal">
            <div className="section-label font-['JetBrains_Mono'] text-[11px] text-[#00d4ff] tracking-[0.15em] mb-4 flex items-center gap-3">
              <div className="w-6 h-[1px] bg-[#00d4ff]" /> CORE FEATURES
            </div>
            <h2 className="section-title text-4xl md:text-5xl font-extrabold leading-tight tracking-tight text-[#f0f4ff]">Everything a bounty<br />platform needs.</h2>
          </div>
          <div className="features-grid grid grid-cols-1 md:grid-cols-2 gap-px bg-[#3b82f6]/15">
            {[
              { icon: "🧠", title: "Autonomous AI judge", desc: "Gemini API reads the exact bounty requirements and the submission side by side. Strict, consistent, bias-free.", tag: "GEMINI API" },
              { icon: "⛓️", title: "Real onchain payouts", desc: "When AI approves, a USDC transfer fires on Base Sepolia. You get a real transaction hash you can verify on Basescan.", tag: "BASE SEPOLIA" },
              { icon: "👛", title: "Wallet-native experience", desc: "Connect MetaMask or Coinbase Wallet in one click. See your testnet balance. No login, no password.", tag: "WAGMI V2" },
              { icon: "📊", title: "Real-time bounty board", desc: "All bounties visible with live status badges — OPEN, IN REVIEW, PAID. Filter by status instantly.", tag: "NEXT.JS 14" },
            ].map((f, i) => (
              <div 
                key={i} 
                className="feature-card reveal bg-[#050810] p-10 relative overflow-hidden group hover:bg-[#0a0f1e]/95 transition-colors after:absolute after:top-0 after:left-0 after:right-0 after:h-[2px] after:bg-gradient-to-r after:from-[#3b82f6] after:to-[#00d4ff] after:scale-x-0 after:origin-left after:transition-transform after:duration-500 hover:after:scale-x-100"
                onMouseEnter={() => toggleCursorHover(true)}
                onMouseLeave={() => toggleCursorHover(false)}
              >
                <span className="feature-icon block text-3xl mb-5 transition-transform group-hover:scale-110">{f.icon}</span>
                <div className="feature-title text-[17px] font-bold text-[#f0f4ff] mb-3">{f.title}</div>
                <div className="feature-desc text-sm text-[#8892a4] leading-relaxed mb-4">{f.desc}</div>
                <span className="feature-tag inline-block font-['JetBrains_Mono'] text-[11px] px-2.5 py-1 bg-[#00d4ff]/10 text-[#00d4ff] border border-[#00d4ff]/20 tracking-wider uppercase">{f.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-6 md:px-12 py-8 border-t border-[#3b82f6]/15 flex flex-col md:row justify-between items-center gap-4 relative z-[2]">
        <div className="footer-left font-['JetBrains_Mono'] text-[11px] text-[#8892a4]">AI ONCHAIN BOUNTY BOARD — BASE BATCHES 2026</div>
        <div className="footer-right flex items-center gap-2">
          <div className="powered-badge flex items-center gap-2 px-3 py-1 border border-[#3b82f6]/15 bg-[#00d4ff]/5 font-['JetBrains_Mono'] text-[10px] text-[#00d4ff] tracking-widest uppercase">
            ⚡ POWERED BY GEMINI AI + BASE
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes fade-slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-40px) scale(1.05); }
        }
        @keyframes float-reverse {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(40px) scale(0.95); }
        }
        @keyframes rise {
          0% { transform: translateY(100vh) scale(0); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.3; }
          100% { transform: translateY(-10vh) scale(1.5); opacity: 0; }
        }
        @keyframes scroll-line {
          0%, 100% { transform: scaleY(0); transform-origin: top; }
          50% { transform: scaleY(1); transform-origin: top; }
          51% { transform: scaleY(1); transform-origin: bottom; }
          100% { transform: scaleY(0); transform-origin: bottom; }
        }
        .reveal {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .animate-fade-slide-up { animation: fade-slide-up 0.8s ease both; }
        .animate-gradient-shift { animation: gradient-shift 4s ease-in-out infinite; }
        .animate-float { animation: float 8s ease-in-out infinite; }
        .animate-float-reverse { animation: float-reverse 12s ease-in-out infinite; }
        .animate-rise { animation: rise linear infinite; }
        .animate-scroll-line { animation: scroll-line 2s ease-in-out infinite; }
        .clip-path-polygon {
          clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
        }
      `}</style>
    </div>
  );
}
