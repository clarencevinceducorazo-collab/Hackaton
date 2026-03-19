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
  const [faqIndex, setFaqIndex] = useState<number | null>(0);
  const [demoIndex, setDemoIndex] = useState(0);
  
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMx(e.clientX);
      setMy(e.clientY);
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
    };

    const handleScroll = () => {
      setScrollPos(window.scrollY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    let requestRef: number;
    const animateRing = () => {
      setRx((prev) => prev + (mx - prev) * 0.1);
      setRy((prev) => prev + (my - prev) * 0.1);
      if (ringRef.current) {
        ringRef.current.style.left = `${rx}px`;
        ringRef.current.style.top = `${ry}px`;
      }
      requestRef = requestAnimationFrame(animateRing);
    };
    requestRef = requestAnimationFrame(animateRing);

    const newParticles = Array.from({ length: 35 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 18,
      duration: Math.random() * 12 + 10,
      size: Math.random() * 2 + 1,
    }));
    setParticles(newParticles);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".reveal, .reveal-left, .reveal-right").forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(requestRef);
    };
  }, [mx, my, rx, ry]);

  const toggleCursorHover = (isHovering: boolean) => {
    if (cursorRef.current && ringRef.current) {
      cursorRef.current.style.width = isHovering ? '14px' : '8px';
      cursorRef.current.style.height = isHovering ? '14px' : '8px';
      ringRef.current.style.width = isHovering ? '48px' : '32px';
      ringRef.current.style.height = isHovering ? '48px' : '32px';
    }
  };

  const demoStates = [
    {
      url: 'bountyboard.vercel.app/dashboard',
      title: 'Dashboard: bounties open',
      sub: 'The main board with 3 bounties in different states: OPEN, IN REVIEW, and PAID',
      content: (
        <>
          <div className="b-app-header">
            <span className="b-app-title">⚡ AI Bounty Board</span>
            <div className="b-app-right">
              <div className="b-wallet"><div className="b-wallet-dot"></div>0x4f2a...8c91</div>
              <div className="b-post-btn">+ Post Bounty</div>
            </div>
          </div>
          <div className="b-tabs">
            <div className="b-tab active">ALL (3)</div>
            <div className="b-tab">OPEN (1)</div>
            <div className="b-tab">IN REVIEW (1)</div>
            <div className="b-tab">PAID (1)</div>
          </div>
          <div className="b-bounty"><div className="b-b-left"><div className="b-b-title">Write a Base L2 explainer</div><div className="b-b-meta">200 words • mention L2, low fees, EVM</div></div><div className="b-b-right"><span className="bbadge bbadge-open">OPEN</span><div className="b-reward">10 USDC</div></div></div>
          <div className="b-bounty"><div className="b-b-left"><div className="b-b-title">Debug this Solidity contract</div><div className="b-b-meta">Fix reentrancy vulnerability in withdraw()</div></div><div className="b-b-right"><span className="bbadge bbadge-review">IN REVIEW</span><div className="b-reward">25 USDC</div></div></div>
          <div className="b-bounty"><div className="b-b-left"><div className="b-b-title">Design a landing page hero section</div><div className="b-b-meta">Dark theme, Tailwind only, no images</div></div><div className="b-b-right"><span className="bbadge bbadge-paid">PAID ✓</span><div className="b-reward">15 USDC</div></div></div>
        </>
      )
    },
    {
      url: 'bountyboard.vercel.app/submit → AI verdict',
      title: 'AI returns APPROVED',
      sub: 'Submitter gets a green verdict with confidence score and full explanation',
      content: (
        <>
          <div className="b-app-header">
            <span className="b-app-title">⚡ Submission Review</span>
            <div className="b-app-right"><div className="b-wallet"><div className="b-wallet-dot"></div>0x4f2a...8c91</div></div>
          </div>
          <div className="b-bounty" style={{marginBottom: '12px'}}><div className="b-b-left"><div className="b-b-title">Write a Base L2 explainer</div><div className="b-b-meta">Submitted: "Base is an Ethereum Layer 2 that reduces fees..."</div></div><div className="b-b-right"><span className="bbadge bbadge-review">EVALUATING</span></div></div>
          <div className="b-verdict">
            <div className="b-verdict-title">✓ AI VERDICT — APPROVED — CONFIDENCE: 94%</div>
            <div className="b-verdict-text">The submission explicitly addresses all three requirements. Layer 2 scaling is mentioned and explained. Low fees are quantified ($0.001 avg). EVM compatibility is confirmed with a note about existing Solidity tooling working unchanged. All criteria met.</div>
            <div className="b-claim">⚡ Claim 10 USDC Reward</div>
          </div>
        </>
      )
    },
    {
      url: 'bountyboard.vercel.app/submit → AI rejected',
      title: 'AI returns REJECTED',
      sub: 'AI explains exactly which requirements were not met, with no ambiguity',
      content: (
        <>
          <div className="b-app-header">
            <span className="b-app-title">⚡ Submission Review</span>
            <div className="b-app-right"><div className="b-wallet"><div className="b-wallet-dot"></div>0x4f2a...8c91</div></div>
          </div>
          <div className="b-bounty" style={{marginBottom: '12px'}}><div className="b-b-left"><div className="b-b-title">Debug this Solidity contract</div><div className="b-b-meta">Submitted: "I moved the state update before the external call"</div></div><div className="b-b-right"><span className="bbadge" style={{background: 'rgba(239,68,68,.1)', color: '#ef4444', border: '.5px solid rgba(239,68,68,.3)'}}>REJECTED</span></div></div>
          <div className="b-verdict" style={{background: 'rgba(239,68,68,.06)', borderColor: 'rgba(239,68,68,.3)'}}>
            <div className="b-verdict-title" style={{color: '#ef4444'}}>✗ AI VERDICT — REJECTED — CONFIDENCE: 88%</div>
            <div className="b-verdict-text">Submission addresses the checks-effects-interactions pattern but fails to provide: (1) the actual fixed code, only a description. (2) No test case or verification that the fix works. (3) Missing explanation of why the original code was vulnerable. Requirements 2 and 3 not met — please resubmit with corrected code and a brief vulnerability analysis.</div>
          </div>
        </>
      )
    },
    {
      url: 'bountyboard.vercel.app/payout → basescan proof',
      title: 'Payout claimed onchain',
      sub: 'Transaction hash links to Basescan: real blockchain proof of payment',
      content: (
        <>
          <div className="b-app-header">
            <span className="b-app-title">⚡ Payout Complete</span>
            <div className="b-app-right"><div className="b-wallet"><div className="b-wallet-dot"></div>0x4f2a...8c91</div></div>
          </div>
          <div className="b-bounty" style={{marginBottom: '12px', borderColor: 'rgba(16,185,129,.3)'}}><div className="b-b-left"><div className="b-b-title">Write a Base L2 explainer</div><div className="b-b-meta">AI approved • 10 USDC sent</div></div><div className="b-b-right"><span className="bbadge bbadge-paid">PAID ✓</span><div className="b-reward">10 USDC</div></div></div>
          <div className="b-verdict">
            <div className="b-verdict-title">⚡ TRANSACTION CONFIRMED ON BASE SEPOLIA</div>
            <div className="b-verdict-text">10 USDC successfully transferred to 0x4f2a...8c91 on Base Sepolia testnet. Transaction finalized in 2.1 seconds. Cryptographic proof below.</div>
            <div className="b-tx" style={{marginTop: '8px'}}>TX HASH: <span className="underline">0x7c3d9f2a1b4e8c6d0f5a3e9b2c7d1e4f8a6b3c...</span></div>
            <div className="b-tx">BLOCK: <span className="underline">#18,542,891</span> • GAS: 0.000001 ETH • STATUS: <span style={{color: 'var(--green)'}}>SUCCESS</span></div>
            <div className="b-tx" style={{marginTop: '4px'}}>View on <span className="underline">sepolia.basescan.org →</span></div>
          </div>
        </>
      )
    }
  ];

  return (
    <div className="landing-container min-h-screen bg-[#04070f] text-[#eef2ff] font-['Plus_Jakarta_Sans'] overflow-x-hidden cursor-none selection:bg-cyan-500/30">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500&display=swap');

        :root {
          --bg: #04070f;
          --bg2: #080d1c;
          --bg3: #0c1228;
          --bg4: #111829;
          --blue: #3b82f6;
          --blue2: #1d4ed8;
          --cyan: #06b6d4;
          --electric: #00d4ff;
          --electric2: #0ea5e9;
          --green: #10b981;
          --green2: #059669;
          --amber: #f59e0b;
          --red: #ef4444;
          --purple: #8b5cf6;
          --text: #eef2ff;
          --text2: #c7d2fe;
          --muted: #6b7a99;
          --muted2: #94a3b8;
          --border: rgba(59,130,246,0.12);
          --border2: rgba(59,130,246,0.22);
          --glow: rgba(0,212,255,0.07);
          --font-main: 'Plus Jakarta Sans', sans-serif;
        }

        *, body {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .cursor { position: fixed; z-index: 9999; transform: translate(-50%, -50%); pointer-events: none; mix-blend-mode: screen; transition: width .2s, height .2s; }
        .cursor-ring { position: fixed; z-index: 9998; transform: translate(-50%, -50%); pointer-events: none; transition: transform .1s ease-out, width .2s, height .2s; }

        .reveal { opacity: 0; transform: translateY(36px); transition: opacity .75s ease, transform .75s ease; }
        .reveal.visible { opacity: 1; transform: translateY(0); }
        .reveal-left { opacity: 0; transform: translateX(-36px); transition: opacity .75s ease, transform .75s ease; }
        .reveal-left.visible { opacity: 1; transform: translateX(0); }
        .reveal-right { opacity: 0; transform: translateX(36px); transition: opacity .75s ease, transform .75s ease; }
        .reveal-right.visible { opacity: 1; transform: translateX(0); }

        .delay-1 { transition-delay: .1s; }
        .delay-2 { transition-delay: .2s; }
        .delay-3 { transition-delay: .3s; }
        .delay-4 { transition-delay: .4s; }

        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .marquee-track { display: flex; animation: marquee 28s linear infinite; width: max-content; }

        @keyframes pulse-dot { 0%,100% { opacity:1; box-shadow: 0 0 0 0 rgba(0,212,255,.4); } 50% { opacity:.6; box-shadow: 0 0 0 6px rgba(0,212,255,0); } }
        @keyframes rise { 0% { transform: translateY(100vh) scale(0); opacity: 0; } 10% { opacity: .7; } 90% { opacity: .2; } 100% { transform: translateY(-10vh) scale(2); opacity: 0; } }
        @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes spin-slow { to { transform: rotate(360deg); } }

        .glass-bg { backdrop-filter: blur(24px) saturate(180%); background: rgba(4,7,15,0.75); }
        .clip-polygon { clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px)); }
        .clip-polygon-lg { clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px)); }

        /* Demo app styles — all using Plus Jakarta Sans */
        .b-app-header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 1.25rem; margin-bottom: 1.25rem; border-bottom: .5px solid rgba(255,255,255,0.05); }
        .b-app-title { font-size: 16px; font-weight: 800; background: linear-gradient(to right, var(--blue), var(--electric)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-family: 'Plus Jakarta Sans', sans-serif; }
        .b-app-right { display: flex; align-items: center; gap: 10px; }
        .b-wallet { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 10px; font-weight: 600; padding: 5px 12px; border: .5px solid rgba(0,212,255,.35); color: var(--electric); background: rgba(0,212,255,.05); display: flex; align-items: center; gap: 6px; letter-spacing: 0.04em; }
        .b-wallet-dot { width: 6px; height: 6px; background: var(--green); border-radius: 50%; animation: pulse-dot 2s infinite; }
        .b-post-btn { font-size: 11px; padding: 5px 12px; background: var(--electric); color: var(--bg); font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif; }
        .b-tabs { display: flex; gap: 0; margin-bottom: 1.25rem; border-bottom: .5px solid var(--border); }
        .b-tab { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 10px; font-weight: 600; padding: 6px 14px; color: var(--muted); letter-spacing: .06em; cursor: pointer; border-bottom: 2px solid transparent; transition: all .2s; margin-bottom: -1px; }
        .b-tab.active { color: var(--electric); border-bottom-color: var(--electric); }
        .b-bounty { background: rgba(255,255,255,0.02); border: .5px solid rgba(255,255,255,0.05); padding: 12px 14px; margin-bottom: 7px; display: flex; justify-content: space-between; align-items: center; transition: border-color .2s; }
        .b-b-title { font-size: 12px; font-weight: 700; color: var(--text); margin-bottom: 3px; font-family: 'Plus Jakarta Sans', sans-serif; }
        .b-b-meta { font-size: 10px; color: var(--muted); font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 500; }
        .bbadge { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 9px; padding: 2px 8px; letter-spacing: .06em; font-weight: 700; }
        .bbadge-open { background: rgba(16,185,129,.1); color: #10b981; border: .5px solid rgba(16,185,129,.3); }
        .bbadge-review { background: rgba(245,158,11,.1); color: #f59e0b; border: .5px solid rgba(245,158,11,.3); }
        .bbadge-paid { background: rgba(59,130,246,.1); color: #60a5fa; border: .5px solid rgba(59,130,246,.3); }
        .b-reward { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; font-weight: 700; color: var(--electric); margin-top: 4px; }
        .b-verdict { background: rgba(16,185,129,.07); border: .5px solid rgba(16,185,129,.3); padding: 12px 14px; margin: 8px 0; }
        .b-verdict-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 10px; color: var(--green); font-weight: 800; letter-spacing: .1em; margin-bottom: 5px; }
        .b-verdict-text { font-size: 11px; color: var(--muted2); line-height: 1.55; font-family: 'Plus Jakarta Sans', sans-serif; }
        .b-claim { display: inline-flex; align-items: center; gap: 6px; margin-top: 8px; padding: 6px 14px; background: var(--green); color: var(--bg); font-size: 11px; font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif; }
        .b-tx { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 10px; font-weight: 500; color: var(--muted); margin-top: 6px; }
        .b-tx span { color: var(--blue); }

        /* Section label */
        .section-label { display: flex; align-items: center; gap: 2.5; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 11px; font-weight: 700; color: var(--electric); letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 1rem; }
      `}</style>

      {/* Custom cursor */}
      <div ref={cursorRef} className="cursor fixed w-2 h-2 bg-[#00d4ff] rounded-full z-[9999]" />
      <div ref={ringRef} className="cursor-ring fixed w-8 h-8 border border-[#00d4ff]/35 rounded-full z-[9998]" />

      {/* Noise overlay */}
      <div className="fixed inset-0 pointer-events-none z-[1] opacity-50 bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.035\'/%3E%3C/svg%3E')]" />

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-[200] px-12 h-16 flex items-center justify-between glass-bg border-b border-[#3b82f6]/12">
        <a href="#home" className="nav-logo flex items-center gap-2.5">
          <div className="w-7 h-7 bg-[#00d4ff] [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)] animate-[spin-slow_8s_linear_infinite]" />
          <span className="font-['Plus_Jakarta_Sans'] text-[13px] text-[#00d4ff] tracking-widest font-bold">BOUNTY.AI</span>
        </a>
        <ul className="hidden md:flex gap-8 list-none">
          {['home', 'about', 'how', 'features', 'demo', 'faq'].map((id) => (
            <li key={id}>
              <a 
                href={`#${id}`} 
                className="text-[13px] text-[#94a3b8] hover:text-white transition-colors tracking-wide font-['Plus_Jakarta_Sans'] font-medium capitalize"
                onMouseEnter={() => toggleCursorHover(true)}
                onMouseLeave={() => toggleCursorHover(false)}
              >
                {id.replace('usecases', 'Use cases')}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-3">
          <div className="hidden md:block font-['Plus_Jakarta_Sans'] text-[10px] font-bold px-2.5 py-1 bg-green-500/10 text-[#10b981] border border-green-500/25 tracking-widest">BASE BATCHES 2026</div>
          <Link 
            href="/canvas" 
            className="font-['Plus_Jakarta_Sans'] font-bold text-[12px] px-5 py-2 border border-[#00d4ff] text-[#00d4ff] hover:text-[#04070f] relative overflow-hidden transition-colors clip-polygon z-[1] group"
            onMouseEnter={() => toggleCursorHover(true)}
            onMouseLeave={() => toggleCursorHover(false)}
          >
            <div className="absolute inset-0 bg-[#00d4ff] -translate-x-full group-hover:translate-x-0 transition-transform -z-[1]" />
            Launch App →
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden px-12 pt-32 pb-20">
        <div 
          className="grid-bg absolute inset-[-30%] bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:64px_64px] [transform:perspective(900px)_rotateX(28deg)] origin-bottom transition-transform duration-100 ease-out"
          style={{ transform: `perspective(900px) rotateX(28deg) translateY(${scrollPos * 0.25}px)` }}
        />
        
        <div className="orb absolute w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(59,130,246,0.18)_0%,transparent_70%)] rounded-full blur-[90px] -top-[150px] -left-[150px] pointer-events-none" style={{ transform: `translateY(${scrollPos * 0.12}px)` }} />
        <div className="orb absolute w-[450px] h-[450px] bg-[radial-gradient(circle,rgba(0,212,255,0.13)_0%,transparent_70%)] rounded-full blur-[90px] bottom-0 right-[5%] animate-[float-orb_9s_ease-in-out_infinite] pointer-events-none" style={{ transform: `translateY(${scrollPos * -0.09}px)` }} />
        <div className="orb absolute w-[350px] h-[350px] bg-[radial-gradient(circle,rgba(139,92,246,0.1)_0%,transparent_70%)] rounded-full blur-[90px] top-[35%] left-[55%] animate-[float-orb_13s_ease-in-out_infinite_reverse] pointer-events-none" style={{ transform: `translateY(${scrollPos * 0.07}px)` }} />
        <div className="orb absolute w-[280px] h-[280px] bg-[radial-gradient(circle,rgba(16,185,129,0.09)_0%,transparent_70%)] rounded-full blur-[90px] bottom-[20%] left-[15%] animate-[float-orb_11s_ease-in-out_infinite_3s] pointer-events-none" style={{ transform: `translateY(${scrollPos * -0.06}px)` }} />

        {/* Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map((p) => (
            <div 
              key={p.id}
              className="absolute w-[2px] h-[2px] bg-[#00d4ff] rounded-full animate-[rise_linear_infinite] opacity-0"
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

        <div className="relative z-[2] text-center max-w-[960px] mx-auto">
          <div className="hero-eyebrow inline-flex items-center gap-2.5 font-['Plus_Jakarta_Sans'] font-bold text-[11px] text-[#00d4ff] px-4.5 py-1.5 border border-[#00d4ff]/28 bg-[#00d4ff]/5 mb-8 animate-[fadeUp_.9s_ease_both] tracking-widest">
            <div className="w-1.5 h-1.5 bg-[#00d4ff] rounded-full animate-[pulse-dot_1.8s_ease-in-out_infinite]" />
            BASE BATCHES 2026 · AI AGENT TRACK · ZERO COST BUILD
          </div>
          <h1 className="text-5xl md:text-[6rem] lg:text-[7rem] font-[800] leading-[1.0] tracking-tight mb-7 animate-[fadeUp_.9s_ease_.1s_both] font-['Plus_Jakarta_Sans'] px-4">
            <span className="block text-[#eef2ff]">Bounties.</span>
            <span className="block bg-gradient-to-r from-[#3b82f6] via-[#00d4ff] to-[#06b6d4] bg-clip-text text-transparent bg-[size:200%] animate-[grad-move_5s_ease-in-out_infinite]">Judged by AI.</span>
            <span className="block text-[#c7d2fe]">Paid onchain.</span>
          </h1>
          <p className="text-lg md:text-[1.15rem] text-[#94a3b8] leading-relaxed max-w-[600px] mx-auto mb-11 font-['Plus_Jakarta_Sans'] font-light animate-[fadeUp_.9s_ease_.2s_both]">
            Post a task with a USDC reward. Submit your work. Watch an autonomous AI agent evaluate it in under 3 seconds, then trigger an instant blockchain payout. No human middleman. No delays. No bias.
          </p>
          <div className="flex flex-wrap justify-center gap-4 animate-[fadeUp_.9s_ease_.3s_both]">
            <a 
              href="#demo" 
              className="btn-primary"
              style={{ isolation: 'isolate', color: '#020810', WebkitTextFillColor: '#020810' }}
              onMouseEnter={() => toggleCursorHover(true)}
              onMouseLeave={() => toggleCursorHover(false)}
            >
              <span>▶</span> See live demo
            </a>
            <a 
              href="#how" 
              className="btn-outline"
              onMouseEnter={() => toggleCursorHover(true)}
              onMouseLeave={() => toggleCursorHover(false)}
            >
              How it works →
            </a>
            <a 
              href="#about" 
              className="btn-ghost"
              onMouseEnter={() => toggleCursorHover(true)}
              onMouseLeave={() => toggleCursorHover(false)}
            >
              Learn more ↓
            </a>
          </div>
          <div className="hero-stats flex flex-wrap justify-center mt-16 pt-14 border-t border-[#3b82f6]/12 animate-[fadeUp_.9s_ease_.4s_both]">
            {[
              { val: "<3s", lbl: "AI VERDICT TIME" },
              { val: "$0", lbl: "BUILD COST" },
              { val: "100%", lbl: "AUTONOMOUS" },
              { val: "BASE", lbl: "BLOCKCHAIN" },
              { val: "6", lbl: "TECH LAYERS" },
            ].map((s, i) => (
              <div key={i} className="stat flex-1 min-w-[50%] md:min-w-0 py-3 relative border-b border-[#3b82f6]/12 md:border-b-0">
                {i > 0 && <div className="hidden md:block absolute left-0 top-[10%] h-[80%] w-[.5px] bg-[#3b82f6]/12" />}
                <span className="font-['Plus_Jakarta_Sans'] text-3xl md:text-[2.2rem] font-bold text-[#00d4ff] block leading-none">{s.val}</span>
                <span className="text-[11px] text-[#6b7a99] tracking-widest mt-1.5 font-['Plus_Jakarta_Sans'] font-semibold">{s.lbl}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="scroll-hint absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#6b7a99] font-['Plus_Jakarta_Sans'] font-semibold text-[10px] tracking-widest animate-[fadeUp_1s_ease_.7s_both]">
          <span>SCROLL</span>
          <div className="scroll-line" />
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-section relative z-[2] py-6 bg-[#00d4ff]/[0.04] border-y border-[#3b82f6]/12 overflow-hidden">
        <div className="marquee-track">
          {Array.from({ length: 2 }).map((_, i) => (
            <React.Fragment key={i}>
              {['AI AGENT TRACK', 'BASE SEPOLIA TESTNET', 'GEMINI API FREE', 'WAGMI V2 + VIEM', 'NEXT.JS 14 APP ROUTER', 'ZERO COST STACK', 'USDC PAYOUTS', 'AUTONOMOUS EVALUATION', 'VERCEL DEPLOY', 'COINBASE DEVELOPER PLATFORM'].map((item, j) => (
                <div key={j} className="marquee-item flex items-center gap-2.5 px-10 font-['Plus_Jakarta_Sans'] font-semibold text-[12px] text-[#6b7a99] tracking-widest whitespace-nowrap">
                  <div className="w-1.25 h-1.25 bg-[#00d4ff] rounded-full flex-shrink-0" />
                  {item}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ABOUT */}
      <section id="about" className="relative py-32 bg-[#080d1c] before:absolute before:inset-0 before:bg-[linear-gradient(rgba(59,130,246,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.025)_1px,transparent_1px)] before:bg-[size:48px_48px]">
        <div className="section-inner relative z-[2] max-w-[1240px] mx-auto px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center mt-16">
            <div className="reveal">
              <div className="section-label font-['Plus_Jakarta_Sans'] font-bold text-[11px] text-[#00d4ff] tracking-[0.15em] uppercase mb-4">ABOUT THE PROJECT</div>
              <h2 className="text-4xl md:text-[3rem] font-[800] leading-[1.08] tracking-tight mb-6 font-['Plus_Jakarta_Sans']">The future of work<br />is trustless.</h2>
              <p className="text-base text-[#94a3b8] leading-relaxed font-['Plus_Jakarta_Sans'] font-light mb-4">Today's bounty platforms are broken. You post a task, someone does the work, and then you wait, days, sometimes weeks, for a human reviewer to make a decision that might be inconsistent, biased, or just slow. That's not how the future of work should operate.</p>
              <p className="text-base text-[#94a3b8] leading-relaxed font-['Plus_Jakarta_Sans'] font-light mb-8">AI Onchain Bounty Board is our answer. An autonomous agent reads both sides, what was asked, and what was delivered, and makes an instant, fair, explainable decision. No middleman. No waiting. The blockchain handles the payment the moment the AI says approved.</p>
              <div className="about-quote p-6 border-l-2 border-[#00d4ff] bg-[#00d4ff]/[0.04] mt-8">
                <p className="font-['Plus_Jakarta_Sans'] text-base text-[#c7d2fe] leading-relaxed italic">"The killer app of the onchain economy isn't another DeFi protocol. It's autonomous coordination between humans and AI agents, where trust is replaced by cryptographic proof."</p>
                <cite className="block mt-3 font-['Plus_Jakarta_Sans'] font-semibold text-[11px] text-[#6b7a99] tracking-widest font-normal">— Built for Base Batches 2026, AI Agent Track</cite>
              </div>
            </div>
            <div className="reveal delay-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[#3b82f6]/12">
                {[
                  { icon: "🎯", title: "Problem we solve", desc: "Human review of bounty submissions is slow (days), inconsistent (subjective), and unscalable. We replace the reviewer with an AI that never sleeps." },
                  { icon: "⚡", title: "How we solve it", desc: "Gemini AI reads the exact requirements posted and the exact submission made. It returns a structured verdict with a confidence score." },
                  { icon: "🔐", title: "Why blockchain", desc: "Smart contract payout means the payment rule is enforced by code, not by a company. When AI approves, the contract pays." },
                  { icon: "🌏", title: "Why it matters now", desc: "Cross-border payments for freelancers are broken. USDC on Base solves this: instant, cheap, global." },
                ].map((c, i) => (
                  <div key={i} className="bg-[#080d1c] p-7 transition-colors hover:bg-[#0c1228]/90 group">
                    <div className="text-[26px] mb-3.5 group-hover:scale-110 transition-transform">{c.icon}</div>
                    <div className="text-[15px] font-bold text-[#eef2ff] mb-2 font-['Plus_Jakarta_Sans']">{c.title}</div>
                    <div className="text-[13px] text-[#94a3b8] leading-relaxed font-['Plus_Jakarta_Sans']">{c.desc}</div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-10 bg-black/30 border border-[#3b82f6]/22 relative overflow-hidden reveal delay-3">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#3b82f6] via-[#00d4ff] to-[#06b6d4]" />
                <div className="font-['Plus_Jakarta_Sans'] font-bold text-[13px] text-[#00d4ff] tracking-widest mb-4 uppercase">OUR MISSION</div>
                <p className="font-['Plus_Jakarta_Sans'] text-base text-[#94a3b8] leading-[1.8]">To demonstrate that <strong className="text-[#eef2ff] font-semibold">AI agents can be trusted to make consequential decisions</strong>, ones that immediately trigger real-world financial transactions. This project proves the concept, provides the code, and ships a working demo in under 4 hours.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="relative py-32 bg-[#0c1228] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-gradient-to-r after:from-transparent after:via-[#00d4ff] after:to-transparent">
        <div className="section-inner max-w-[1240px] mx-auto px-12">
          <div className="how-header text-center mb-20 reveal">
            <div className="font-['Plus_Jakarta_Sans'] font-bold text-[11px] text-[#00d4ff] tracking-[0.15em] uppercase mb-4 flex justify-center">HOW IT WORKS</div>
            <h2 className="text-4xl md:text-[3rem] font-[800] leading-[1.08] tracking-tight mb-4 max-w-[600px] mx-auto font-['Plus_Jakarta_Sans']">Four steps.<br />Fully automated.</h2>
            <p className="text-base text-[#94a3b8] leading-relaxed font-['Plus_Jakarta_Sans'] font-light max-w-[520px] mx-auto">From task posting to blockchain payment, every step is handled by code. No human in the loop.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#3b82f6]/12">
            {[
              {
                num: "01", tag: "BOUNTY CREATOR", title: "Post a bounty",
                desc: "Anyone with a wallet can post a task. You define exactly what needs to be done, set criteria clearly, and lock in a USDC reward. The clearer your requirements, the better the AI can judge.",
                detail: "Fields: Title / Description / Requirements / Reward (USDC) · Status: OPEN",
                illustration: (
                  <svg viewBox="0 0 520 220" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    <defs>
                      <linearGradient id="cardGrad1" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#0c1228"/>
                        <stop offset="100%" stopColor="#080d1c"/>
                      </linearGradient>
                      <linearGradient id="btnGrad1" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#3b82f6"/>
                        <stop offset="100%" stopColor="#00d4ff"/>
                      </linearGradient>
                    </defs>
                    <rect width="520" height="220" fill="url(#cardGrad1)"/>
                    <rect width="520" height="220" fill="url(#cardGrad1)" opacity="0.6"/>
                    {[0,1,2,3,4,5,6,7,8].map(i => (
                      <line key={i} x1={i*65} y1="0" x2={i*65} y2="220" stroke="#3b82f6" strokeWidth="0.4" opacity="0.12"/>
                    ))}
                    {[0,1,2,3,4].map(i => (
                      <line key={i} x1="0" y1={i*55} x2="520" y2={i*55} stroke="#3b82f6" strokeWidth="0.4" opacity="0.12"/>
                    ))}
                    <rect x="80" y="22" width="360" height="176" rx="4" fill="#0a0f1e" stroke="#3b82f6" strokeWidth="0.6" strokeOpacity="0.3"/>
                    <rect x="80" y="22" width="360" height="32" rx="4" fill="#111829"/>
                    <rect x="80" y="38" width="360" height="16" fill="#111829"/>
                    <circle cx="100" cy="38" r="5" fill="#ff5f57" opacity="0.8"/>
                    <circle cx="115" cy="38" r="5" fill="#ffbd2e" opacity="0.8"/>
                    <circle cx="130" cy="38" r="5" fill="#28ca42" opacity="0.8"/>
                    <text x="240" y="43" textAnchor="middle" fill="#6b7a99" fontSize="9" fontFamily="monospace">Post New Bounty</text>
                    <rect x="100" y="66" width="320" height="22" rx="2" fill="#0d1525" stroke="#3b82f6" strokeWidth="0.5" strokeOpacity="0.25"/>
                    <text x="110" y="81" fill="#94a3b8" fontSize="9" fontFamily="sans-serif" opacity="0.6">Title</text>
                    <text x="150" y="81" fill="#c7d2fe" fontSize="9" fontFamily="sans-serif">Write a Base L2 explainer</text>
                    <rect x="100" y="96" width="320" height="38" rx="2" fill="#0d1525" stroke="#3b82f6" strokeWidth="0.5" strokeOpacity="0.25"/>
                    <text x="110" y="110" fill="#94a3b8" fontSize="9" fontFamily="sans-serif" opacity="0.6">Requirements</text>
                    <text x="110" y="123" fill="#c7d2fe" fontSize="9" fontFamily="sans-serif">200 words · mention L2, low fees, EVM</text>
                    <rect x="100" y="142" width="148" height="22" rx="2" fill="#0d1525" stroke="#3b82f6" strokeWidth="0.5" strokeOpacity="0.25"/>
                    <text x="110" y="157" fill="#94a3b8" fontSize="9" fontFamily="sans-serif" opacity="0.6">Reward</text>
                    <text x="148" y="157" fill="#00d4ff" fontSize="9" fontFamily="sans-serif" fontWeight="bold">10 USDC</text>
                    <rect x="258" y="142" width="162" height="22" rx="2" fill="url(#btnGrad1)"/>
                    <text x="339" y="157" textAnchor="middle" fill="#04070f" fontSize="9" fontFamily="sans-serif" fontWeight="bold">+ Post Bounty</text>
                    <circle cx="432" cy="38" r="4" fill="#10b981" opacity="0.9"/>
                    <text x="418" y="42" fill="#6b7a99" fontSize="8" fontFamily="monospace">0x4f2a…8c91</text>
                    <ellipse cx="240" cy="110" rx="160" ry="80" fill="#3b82f6" opacity="0.025"/>
                  </svg>
                )
              },
              {
                num: "02", tag: "WORKER / CONTRIBUTOR", title: "Submit your work",
                desc: "Any developer, designer, or writer can browse open bounties and submit their work. Submissions can be text descriptions, GitHub links, or any deliverable that can be described in text.",
                detail: "Submission · Status: IN REVIEW · AI evaluation begins immediately",
                illustration: (
                  <svg viewBox="0 0 520 220" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    <defs>
                      <linearGradient id="cardGrad2" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#0a0c1e"/>
                        <stop offset="100%" stopColor="#070b18"/>
                      </linearGradient>
                    </defs>
                    <rect width="520" height="220" fill="url(#cardGrad2)"/>
                    {[0,1,2,3,4,5,6,7,8].map(i => (
                      <line key={i} x1={i*65} y1="0" x2={i*65} y2="220" stroke="#3b82f6" strokeWidth="0.4" opacity="0.1"/>
                    ))}
                    {[0,1,2,3,4].map(i => (
                      <line key={i} x1="0" y1={i*55} x2="520" y2={i*55} stroke="#3b82f6" strokeWidth="0.4" opacity="0.1"/>
                    ))}
                    <rect x="60" y="18" width="240" height="184" rx="4" fill="#0a0f1e" stroke="#3b82f6" strokeWidth="0.6" strokeOpacity="0.25"/>
                    <rect x="60" y="18" width="240" height="28" rx="4" fill="#111829"/>
                    <rect x="60" y="34" width="240" height="12" fill="#111829"/>
                    <circle cx="78" cy="32" r="4" fill="#ff5f57" opacity="0.8"/>
                    <circle cx="91" cy="32" r="4" fill="#ffbd2e" opacity="0.8"/>
                    <circle cx="104" cy="32" r="4" fill="#28ca42" opacity="0.8"/>
                    <text x="180" y="36" textAnchor="middle" fill="#6b7a99" fontSize="8" fontFamily="monospace">submission.md</text>
                    {[
                      { y: 60, color: "#7c3aed", text: "# Base L2 Explainer" },
                      { y: 75, color: "#94a3b8", text: "" },
                      { y: 88, color: "#00d4ff", text: "Base is an Ethereum Layer 2" },
                      { y: 101, color: "#94a3b8", text: "that reduces fees to $0.001" },
                      { y: 114, color: "#94a3b8", text: "avg per transaction. Built on" },
                      { y: 127, color: "#10b981", text: "the OP Stack and fully EVM-" },
                      { y: 140, color: "#10b981", text: "compatible. Deploy existing" },
                      { y: 153, color: "#94a3b8", text: "Solidity contracts unchanged." },
                      { y: 166, color: "#f59e0b", text: "Low fees. Fast finality." },
                      { y: 179, color: "#94a3b8", text: "Secured by Ethereum." },
                    ].map((line, i) => (
                      <text key={i} x="76" y={line.y} fill={line.color} fontSize="8.5" fontFamily="monospace">{line.text}</text>
                    ))}
                    <rect x="76" y="182" width="5" height="9" fill="#00d4ff" opacity="0.85">
                      <animate attributeName="opacity" values="0.85;0;0.85" dur="1.1s" repeatCount="indefinite"/>
                    </rect>
                    <rect x="314" y="18" width="146" height="184" rx="4" fill="#0a0f1e" stroke="#3b82f6" strokeWidth="0.6" strokeOpacity="0.25"/>
                    <text x="387" y="46" textAnchor="middle" fill="#c7d2fe" fontSize="9" fontFamily="sans-serif" fontWeight="bold">Submit Work</text>
                    <line x1="324" y1="54" x2="450" y2="54" stroke="#3b82f6" strokeWidth="0.5" opacity="0.2"/>
                    <rect x="324" y="62" width="126" height="28" rx="2" fill="#111829"/>
                    <text x="334" y="74" fill="#00d4ff" fontSize="8" fontFamily="monospace">BOUNTY #001</text>
                    <text x="334" y="85" fill="#6b7a99" fontSize="7.5" fontFamily="sans-serif">Write a Base L2 explainer</text>
                    <rect x="324" y="98" width="126" height="20" rx="2" fill="rgba(16,185,129,0.08)" stroke="rgba(16,185,129,0.25)" strokeWidth="0.5"/>
                    <text x="334" y="112" fill="#10b981" fontSize="8" fontFamily="monospace" fontWeight="bold">Reward: 10 USDC</text>
                    <rect x="324" y="126" width="126" height="42" rx="2" fill="#0d1525" stroke="#3b82f6" strokeWidth="0.5" strokeOpacity="0.2"/>
                    <text x="334" y="139" fill="#6b7a99" fontSize="7.5" fontFamily="sans-serif">Your submission link</text>
                    <text x="334" y="151" fill="#c7d2fe" fontSize="7.5" fontFamily="monospace">github.com/user/</text>
                    <text x="334" y="162" fill="#c7d2fe" fontSize="7.5" fontFamily="monospace">base-explainer</text>
                    <rect x="324" y="175" width="126" height="20" rx="2" fill="#00d4ff"/>
                    <text x="387" y="189" textAnchor="middle" fill="#04070f" fontSize="8.5" fontFamily="sans-serif" fontWeight="bold">Submit →</text>
                    <ellipse cx="260" cy="110" rx="180" ry="80" fill="#3b82f6" opacity="0.02"/>
                  </svg>
                )
              },
              {
                num: "03", tag: "GEMINI AI JUDGE", title: "AI evaluates in 3 seconds",
                desc: "Gemini 1.5 Flash reads original requirements and submission side by side. It checks if submission addresses all requirements, returning a verdict with confidence score and explanation.",
                detail: "Input: {bountyTitle, requirements, submission} · Output: {verdict, reason, confidence}",
                illustration: (
                  <svg viewBox="0 0 520 220" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    <defs>
                      <linearGradient id="cardGrad3" x1="0" y1="1" x2="1" y2="0">
                        <stop offset="0%" stopColor="#080c1c"/>
                        <stop offset="100%" stopColor="#0c1228"/>
                      </linearGradient>
                      <radialGradient id="aiGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.18"/>
                        <stop offset="100%" stopColor="#00d4ff" stopOpacity="0"/>
                      </radialGradient>
                      <linearGradient id="confBar" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#3b82f6"/>
                        <stop offset="94%" stopColor="#00d4ff"/>
                        <stop offset="100%" stopColor="#06b6d4"/>
                      </linearGradient>
                    </defs>
                    <rect width="520" height="220" fill="url(#cardGrad3)"/>
                    {[0,1,2,3,4,5,6,7,8].map(i => (
                      <line key={i} x1={i*65} y1="0" x2={i*65} y2="220" stroke="#3b82f6" strokeWidth="0.4" opacity="0.1"/>
                    ))}
                    {[0,1,2,3,4].map(i => (
                      <line key={i} x1="0" y1={i*55} x2="520" y2={i*55} stroke="#3b82f6" strokeWidth="0.4" opacity="0.1"/>
                    ))}
                    <circle cx="260" cy="110" r="52" fill="url(#aiGlow)"/>
                    <circle cx="260" cy="110" r="42" fill="none" stroke="#00d4ff" strokeWidth="0.8" strokeOpacity="0.4" strokeDasharray="4 3">
                      <animateTransform attributeName="transform" type="rotate" from="0 260 110" to="360 260 110" dur="12s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="260" cy="110" r="30" fill="none" stroke="#3b82f6" strokeWidth="0.6" strokeOpacity="0.3" strokeDasharray="2 4">
                      <animateTransform attributeName="transform" type="rotate" from="360 260 110" to="0 260 110" dur="8s" repeatCount="indefinite"/>
                    </circle>
                    <ellipse cx="260" cy="94" rx="7" ry="14" fill="#00d4ff" opacity="0.9"/>
                    <ellipse cx="260" cy="126" rx="7" ry="14" fill="#3b82f6" opacity="0.9"/>
                    <text x="260" y="167" textAnchor="middle" fill="#00d4ff" fontSize="9" fontFamily="monospace" fontWeight="bold" letterSpacing="2">GEMINI 1.5 FLASH</text>
                    <rect x="30" y="38" width="160" height="144" rx="3" fill="#0a0f1e" stroke="#3b82f6" strokeWidth="0.5" strokeOpacity="0.3"/>
                    <rect x="30" y="38" width="160" height="18" rx="3" fill="#111829"/>
                    <rect x="30" y="48" width="160" height="8" fill="#111829"/>
                    <text x="110" y="51" textAnchor="middle" fill="#6b7a99" fontSize="8" fontFamily="monospace">REQUIREMENTS</text>
                    {[
                      { y: 72, text: "· 200 words min", color: "#c7d2fe" },
                      { y: 86, text: "· Mention L2 scaling", color: "#c7d2fe" },
                      { y: 100, text: "· Explain low fees", color: "#c7d2fe" },
                      { y: 114, text: "· EVM compatibility", color: "#c7d2fe" },
                      { y: 128, text: "· Factually accurate", color: "#c7d2fe" },
                    ].map((l, i) => (
                      <text key={i} x="44" y={l.y} fill={l.color} fontSize="8.5" fontFamily="sans-serif">{l.text}</text>
                    ))}
                    <line x1="40" y1="140" x2="180" y2="140" stroke="#3b82f6" strokeWidth="0.4" opacity="0.2"/>
                    <text x="44" y="154" fill="#6b7a99" fontSize="7.5" fontFamily="monospace">Reward: 10 USDC</text>
                    <text x="44" y="167" fill="#6b7a99" fontSize="7.5" fontFamily="monospace">Status: IN REVIEW</text>
                    <line x1="195" y1="110" x2="213" y2="110" stroke="#00d4ff" strokeWidth="1.5" strokeOpacity="0.6" strokeDasharray="3 2"/>
                    <polygon points="216,110 211,107 211,113" fill="#00d4ff" opacity="0.6"/>
                    <rect x="330" y="38" width="160" height="144" rx="3" fill="#0a0f1e" stroke="#10b981" strokeWidth="0.5" strokeOpacity="0.35"/>
                    <rect x="330" y="38" width="160" height="18" rx="3" fill="#0a1a12"/>
                    <rect x="330" y="48" width="160" height="8" fill="#0a1a12"/>
                    <text x="410" y="51" textAnchor="middle" fill="#10b981" fontSize="8" fontFamily="monospace">AI VERDICT</text>
                    <rect x="344" y="64" width="132" height="18" rx="2" fill="rgba(16,185,129,0.12)" stroke="rgba(16,185,129,0.35)" strokeWidth="0.6"/>
                    <text x="410" y="77" textAnchor="middle" fill="#10b981" fontSize="9" fontFamily="monospace" fontWeight="bold">✓ APPROVED</text>
                    <text x="344" y="98" fill="#6b7a99" fontSize="8" fontFamily="sans-serif">Confidence</text>
                    <text x="476" y="98" textAnchor="end" fill="#00d4ff" fontSize="8" fontFamily="monospace" fontWeight="bold">94%</text>
                    <rect x="344" y="102" width="132" height="5" rx="2" fill="#1a2038"/>
                    <rect x="344" y="102" width="124" height="5" rx="2" fill="url(#confBar)"/>
                    <text x="344" y="122" fill="#6b7a99" fontSize="7.5" fontFamily="sans-serif">Reasoning:</text>
                    {[
                      { y: 135, text: "L2 scaling ✓ explained" },
                      { y: 147, text: "Low fees ✓ quantified" },
                      { y: 159, text: "EVM compat ✓ confirmed" },
                      { y: 171, text: "Word count ✓ met" },
                    ].map((l, i) => (
                      <text key={i} x="344" y={l.y} fill="#10b981" fontSize="8" fontFamily="monospace">{l.text}</text>
                    ))}
                    <line x1="307" y1="110" x2="325" y2="110" stroke="#10b981" strokeWidth="1.5" strokeOpacity="0.6" strokeDasharray="3 2"/>
                    <polygon points="328,110 323,107 323,113" fill="#10b981" opacity="0.6"/>
                    <rect x="221" y="72" width="78" height="16" rx="8" fill="rgba(0,212,255,0.08)" stroke="rgba(0,212,255,0.25)" strokeWidth="0.5"/>
                    <text x="260" y="84" textAnchor="middle" fill="#00d4ff" fontSize="8" fontFamily="monospace">⏱ &lt; 3 seconds</text>
                  </svg>
                )
              },
              {
                num: "04", tag: "BASE BLOCKCHAIN", title: "Instant blockchain payout",
                desc: "On APPROVED verdict, the app triggers a USDC transfer to the submitter's wallet on Base Sepolia. A verifiable transaction hash is generated and linked to Basescan.",
                detail: "APPROVED · useSendTransaction() · tx hash · basescan.org proof · Status: PAID",
                illustration: (
                  <svg viewBox="0 0 520 220" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    <defs>
                      <linearGradient id="cardGrad4" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#070b18"/>
                        <stop offset="100%" stopColor="#0c1428"/>
                      </linearGradient>
                      <radialGradient id="payGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.12"/>
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
                      </radialGradient>
                      <linearGradient id="flowLine" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#3b82f6"/>
                        <stop offset="50%" stopColor="#00d4ff"/>
                        <stop offset="100%" stopColor="#10b981"/>
                      </linearGradient>
                    </defs>
                    <rect width="520" height="220" fill="url(#cardGrad4)"/>
                    {[0,1,2,3,4,5,6,7,8].map(i => (
                      <line key={i} x1={i*65} y1="0" x2={i*65} y2="220" stroke="#3b82f6" strokeWidth="0.4" opacity="0.1"/>
                    ))}
                    {[0,1,2,3,4].map(i => (
                      <line key={i} x1="0" y1={i*55} x2="520" y2={i*55} stroke="#3b82f6" strokeWidth="0.4" opacity="0.1"/>
                    ))}
                    <rect x="22" y="50" width="120" height="120" rx="3" fill="#0a0f1e" stroke="#10b981" strokeWidth="0.6" strokeOpacity="0.35"/>
                    <rect x="22" y="50" width="120" height="22" rx="3" fill="rgba(16,185,129,0.1)"/>
                    <rect x="22" y="62" width="120" height="10" fill="rgba(16,185,129,0.1)"/>
                    <text x="82" y="66" textAnchor="middle" fill="#10b981" fontSize="8.5" fontFamily="monospace" fontWeight="bold">AI VERDICT</text>
                    <text x="82" y="90" textAnchor="middle" fill="#10b981" fontSize="22">✓</text>
                    <text x="82" y="112" textAnchor="middle" fill="#10b981" fontSize="9" fontFamily="monospace" fontWeight="bold">APPROVED</text>
                    <text x="82" y="126" textAnchor="middle" fill="#6b7a99" fontSize="7.5" fontFamily="monospace">Confidence: 94%</text>
                    <rect x="36" y="136" width="92" height="14" rx="2" fill="rgba(0,212,255,0.06)" stroke="rgba(0,212,255,0.2)" strokeWidth="0.5"/>
                    <text x="82" y="147" textAnchor="middle" fill="#00d4ff" fontSize="7.5" fontFamily="monospace">Trigger payout →</text>
                    <line x1="146" y1="110" x2="185" y2="110" stroke="url(#flowLine)" strokeWidth="2" strokeOpacity="0.7"/>
                    <polygon points="188,110 182,106.5 182,113.5" fill="#00d4ff" opacity="0.8"/>
                    <rect x="190" y="40" width="140" height="140" rx="3" fill="#0a0f1e" stroke="#00d4ff" strokeWidth="0.7" strokeOpacity="0.4"/>
                    <circle cx="260" cy="110" r="28" fill="url(#payGlow)"/>
                    <text x="260" y="90" textAnchor="middle" fill="#00d4ff" fontSize="20">⛓</text>
                    <text x="260" y="108" textAnchor="middle" fill="#00d4ff" fontSize="9" fontFamily="monospace" fontWeight="bold">BASE SEPOLIA</text>
                    <text x="260" y="122" textAnchor="middle" fill="#10b981" fontSize="12" fontWeight="bold" fontFamily="monospace">10 USDC</text>
                    <text x="260" y="136" textAnchor="middle" fill="#6b7a99" fontSize="7.5" fontFamily="monospace">2.1 sec · $0.000001</text>
                    <text x="260" y="60" textAnchor="middle" fill="#6b7a99" fontSize="7.5" fontFamily="monospace">useSendTransaction()</text>
                    <rect x="196" y="156" width="128" height="14" rx="2" fill="#080d1c"/>
                    <text x="202" y="167" fill="#3b82f6" fontSize="6.5" fontFamily="monospace">0x7c3d9f2a1b4e8c6d…</text>
                    <line x1="334" y1="110" x2="373" y2="110" stroke="url(#flowLine)" strokeWidth="2" strokeOpacity="0.7"/>
                    <polygon points="376,110 370,106.5 370,113.5" fill="#10b981" opacity="0.8"/>
                    <rect x="378" y="50" width="120" height="120" rx="3" fill="#0a0f1e" stroke="#10b981" strokeWidth="0.6" strokeOpacity="0.35"/>
                    <rect x="378" y="50" width="120" height="22" rx="3" fill="rgba(16,185,129,0.08)"/>
                    <rect x="378" y="62" width="120" height="10" fill="rgba(16,185,129,0.08)"/>
                    <text x="438" y="66" textAnchor="middle" fill="#10b981" fontSize="8.5" fontFamily="monospace" fontWeight="bold">WALLET</text>
                    <circle cx="438" cy="95" r="12" fill="rgba(0,212,255,0.08)" stroke="#00d4ff" strokeWidth="0.7" strokeOpacity="0.4"/>
                    <text x="438" y="100" textAnchor="middle" fill="#00d4ff" fontSize="13">👛</text>
                    <text x="438" y="120" textAnchor="middle" fill="#6b7a99" fontSize="7" fontFamily="monospace">0x4f2a…8c91</text>
                    <rect x="392" y="128" width="92" height="14" rx="2" fill="rgba(16,185,129,0.1)" stroke="rgba(16,185,129,0.3)" strokeWidth="0.5"/>
                    <text x="438" y="139" textAnchor="middle" fill="#10b981" fontSize="8.5" fontFamily="monospace" fontWeight="bold">PAID ✓</text>
                    <rect x="392" y="148" width="92" height="12" rx="2" fill="rgba(59,130,246,0.07)"/>
                    <text x="438" y="158" textAnchor="middle" fill="#3b82f6" fontSize="7" fontFamily="monospace">basescan.org →</text>
                    <rect x="185" y="188" width="150" height="16" rx="8" fill="rgba(16,185,129,0.07)" stroke="rgba(16,185,129,0.2)" strokeWidth="0.5"/>
                    <text x="260" y="200" textAnchor="middle" fill="#10b981" fontSize="8" fontFamily="monospace">Block #18,542,891 · CONFIRMED</text>
                  </svg>
                )
              },
            ].map((step, i) => (
              <div key={i} className={`bg-[#0c1228] relative overflow-hidden transition-all hover:bg-[#0e142a]/95 group reveal delay-${i + 1}`}>
                <div className="w-full h-52 bg-[#080d1c] border-b border-[#3b82f6]/12 relative overflow-hidden group-hover:border-[#00d4ff]/20 transition-colors">
                  <div className="absolute top-3 left-4 font-['Plus_Jakarta_Sans'] text-[56px] font-[800] leading-none text-[#00d4ff] opacity-[0.07] group-hover:opacity-[0.12] transition-opacity select-none z-10">{step.num}</div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    {step.illustration}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#0c1228] to-transparent pointer-events-none" />
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-2 font-['Plus_Jakarta_Sans'] font-bold text-[10px] text-[#00d4ff] tracking-widest mb-4">
                    <div className="w-4 h-[1px] bg-[#00d4ff]" /> {step.tag}
                  </div>
                  <div className="text-[1.25rem] font-[800] text-[#eef2ff] mb-3 tracking-tight font-['Plus_Jakarta_Sans']">{step.title}</div>
                  <div className="text-[13px] text-[#94a3b8] leading-relaxed font-['Plus_Jakarta_Sans'] mb-5">{step.desc}</div>
                  <div className="text-[11px] font-['Plus_Jakarta_Sans'] font-semibold text-[#6b7a99] p-3 border-l-2 border-[#00d4ff]/25 bg-[#00d4ff]/[0.03]">{step.detail}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="how-flow grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] items-center p-12 bg-black/30 border border-[#3b82f6]/12 mt-[1px] reveal">
            {[
              { icon: "👤", lbl: "Creator", sub: "posts bounty" },
              { icon: "💼", lbl: "Worker", sub: "submits work" },
              { icon: "🤖", lbl: "Gemini AI", sub: "evaluates <3s" },
              { icon: "💰", lbl: "Base Chain", sub: "pays instantly" },
            ].map((node, i) => (
              <React.Fragment key={i}>
                <div className="text-center py-6 px-4">
                  <div className="text-[28px] mb-2">{node.icon}</div>
                  <div className="text-[12px] font-bold text-[#eef2ff] mb-1 font-['Plus_Jakarta_Sans']">{node.lbl}</div>
                  <div className="text-[11px] text-[#6b7a99] font-['Plus_Jakarta_Sans'] font-medium">{node.sub}</div>
                </div>
                {i < 3 && (
                  <div className="hidden md:flex items-center justify-center px-2">
                    <div className="w-8 h-[1px] bg-gradient-to-r from-[#00d4ff]/30 to-[#00d4ff]/80 relative after:absolute after:right-[-1px] after:top-[-3.5px] after:border-l-[7px] after:border-l-[#00d4ff]/80 after:border-t-[3.5px] after:border-t-transparent after:border-b-[3.5px] after:border-b-transparent" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="relative py-32 bg-[#080d1c]">
        <div className="section-inner max-w-[1240px] mx-auto px-12">
          <div className="mb-16 reveal">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-end">
              <div>
                <div className="font-['Plus_Jakarta_Sans'] font-bold text-[11px] text-[#00d4ff] tracking-[0.15em] uppercase mb-4">CORE FEATURES</div>
                <h2 className="text-4xl md:text-[3rem] font-[800] leading-[1.08] tracking-tight font-['Plus_Jakarta_Sans']">Everything a bounty platform needs.</h2>
              </div>
              <div>
                <p className="text-base text-[#94a3b8] leading-relaxed font-['Plus_Jakarta_Sans'] font-light">Four tightly integrated layers: UI, AI, wallet, blockchain, working together as one seamless experience. Built clean, shipped fast.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#3b82f6]/12">
            {[
              { num: "01", icon: "📊", title: "Live bounty dashboard", desc: "All active, in-review, and completed bounties visible in real time. Color-coded status badges: OPEN, IN REVIEW, PAID.", tag: "NEXT.JS STATE" },
              { num: "02", icon: "📝", title: "Post bounty in seconds", desc: "A modal form lets anyone define a task with requirements and a reward. Fund payouts directly from your connected wallet.", tag: "REACT MODAL" },
              { num: "03", icon: "🧠", title: "Autonomous AI judge", desc: "Gemini API evaluates every submission against exact requirements. Returns verdict with confidence score in under 3 seconds.", tag: "GEMINI 1.5 FLASH" },
              { num: "04", icon: "👛", title: "One-click wallet connect", desc: "MetaMask and Coinbase Wallet supported via wagmi v2. Live balance indicator and automatic network switching.", tag: "WAGMI V2" },
              { num: "05", icon: "⛓️", title: "Blockchain-verified payouts", desc: "On AI approval, USDC transfer fires on Base Sepolia. A real transaction hash is generated as cryptographic proof.", tag: "BASE SEPOLIA" },
              { num: "06", icon: "🔍", title: "Transparent AI reasoning", desc: "Every verdict comes with a full explanation. Rejected verdicts explain exactly which requirements were not met.", tag: "STRUCTURED OUTPUT" },
            ].map((f, i) => (
              <div key={i} className="bg-[#080d1c] p-9 relative overflow-hidden group transition-all hover:bg-[#0a0f1c]/95 reveal delay-1">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#3b82f6] via-[#00d4ff] to-[#06b6d4] scale-x-0 origin-left transition-transform group-hover:scale-x-100" />
                <div className="font-['Plus_Jakarta_Sans'] font-bold text-[10px] text-[#6b7a99] tracking-widest mb-5 uppercase">FEATURE {f.num}</div>
                <span className="text-3xl mb-4.5 block group-hover:scale-110 transition-transform">{f.icon}</span>
                <div className="text-[1.05rem] font-bold text-[#eef2ff] mb-2.5 font-['Plus_Jakarta_Sans']">{f.title}</div>
                <div className="text-[13px] text-[#94a3b8] leading-relaxed font-['Plus_Jakarta_Sans'] mb-4.5">{f.desc}</div>
                <span className="font-['Plus_Jakarta_Sans'] font-bold text-[10px] px-2 py-0.75 bg-[#00d4ff]/[0.06] text-[#00d4ff] border border-[#00d4ff]/18 tracking-widest">{f.tag}</span>
              </div>
            ))}

            {/* ── BONUS ROW — FIX 1: centered items within the full 3-col span ── */}
            <div className="md:col-span-3 bg-[#080d1c] p-10 border-t border-[#3b82f6]/12 relative reveal">
              <div className="absolute top-6 right-8 font-['Plus_Jakarta_Sans'] font-bold text-[10px] text-[#6b7a99] tracking-widest">BONUS</div>
              {/* Center the two bonus cards horizontally */}
              <div className="flex flex-col sm:flex-row gap-8 justify-center items-center sm:items-start">
                {[
                  { icon: "🛡️", title: "Error handling", desc: "API failures and wallet issues are caught and surfaced with helpful messages." },
                  { icon: "⚙️", title: "Loading states", desc: "Skeleton cards and spinners make interactions feel responsive during API calls." },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3.5 items-start max-w-[320px] text-center sm:text-left">
                    <div className="w-9 h-9 border border-[#3b82f6]/22 flex items-center justify-center text-base flex-shrink-0 mx-auto sm:mx-0">{item.icon}</div>
                    <div>
                      <div className="text-[14px] font-bold text-[#eef2ff] mb-1 font-['Plus_Jakarta_Sans']">{item.title}</div>
                      <div className="text-[12px] text-[#94a3b8] leading-relaxed font-['Plus_Jakarta_Sans']">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DEMO */}
      <section id="demo" className="relative py-32 bg-[#04070f] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(0,212,255,0.04)_0%,transparent_70%)] pointer-events-none" />
        <div className="section-inner max-w-[1240px] mx-auto px-12">
          <div className="text-center mb-16 reveal">
            <div className="font-['Plus_Jakarta_Sans'] font-bold text-[11px] text-[#00d4ff] tracking-[0.15em] uppercase mb-4 flex justify-center">INTERACTIVE DEMO</div>
            <h2 className="text-4xl md:text-[3rem] font-[800] leading-[1.08] tracking-tight mb-4 font-['Plus_Jakarta_Sans']">See every screen.<br />Understand every flow.</h2>
            <p className="text-base text-[#94a3b8] leading-relaxed font-['Plus_Jakarta_Sans'] font-light max-w-[500px] mx-auto">Each panel below shows a different state of the application. Click any tab to explore it.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-[340px_1fr] gap-12 items-start mt-12">
            <div className="flex flex-col gap-0 reveal-left">
              {demoStates.map((state, i) => (
                <div 
                  key={i} 
                  className={`p-5 border border-[#3b82f6]/12 cursor-pointer transition-all relative overflow-hidden ${demoIndex === i ? 'bg-[#00d4ff]/[0.05] border-[#00d4ff]/30' : ''}`}
                  onClick={() => setDemoIndex(i)}
                >
                  {demoIndex === i && <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#00d4ff]" />}
                  <div className="font-['Plus_Jakarta_Sans'] font-bold text-[10px] text-[#6b7a99] tracking-widest mb-1.5 uppercase">STATE 0{i + 1}</div>
                  <div className={`text-[14px] font-bold mb-1 transition-colors font-['Plus_Jakarta_Sans'] ${demoIndex === i ? 'text-[#00d4ff]' : 'text-[#eef2ff]'}`}>{state.title}</div>
                  <div className="text-[12px] text-[#94a3b8] font-['Plus_Jakarta_Sans'] leading-relaxed">{state.sub}</div>
                </div>
              ))}
            </div>

            <div className="demo-browser bg-[#080d1c] border border-white/[0.07] reveal-right">
              <div className="bg-[#0d1117] p-4 flex items-center gap-3 border-b border-white/[0.05]">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#28ca42]" />
                </div>
                <div className="flex-1 bg-white/[0.04] border border-white/[0.07] rounded-sm py-1 px-3 font-['Plus_Jakarta_Sans'] font-medium text-[11px] text-[#6b7a99]">
                  {demoStates[demoIndex].url}
                </div>
              </div>
              <div className="p-6 min-h-[480px] relative">
                {demoStates[demoIndex].content}
                <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.03)_2px,rgba(0,0,0,0.03)_4px)] pointer-events-none rounded-b-lg" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* USE CASES */}
      <section id="usecases" className="relative py-32 bg-[#0c1228]">
        <div className="section-inner max-w-[1240px] mx-auto px-12">
          <div className="text-center mb-20 reveal">
            <div className="font-['Plus_Jakarta_Sans'] font-bold text-[11px] text-[#00d4ff] tracking-[0.15em] uppercase mb-4 flex justify-center">USE CASES</div>
            <h2 className="text-4xl md:text-[3rem] font-[800] leading-[1.08] tracking-tight mb-4 font-['Plus_Jakarta_Sans']">Built for real people<br />doing real work.</h2>
            <p className="text-base text-[#94a3b8] font-['Plus_Jakarta_Sans'] font-light max-w-[520px] mx-auto">From solo developers to global teams, AI Bounty Board fits wherever there's work to be done and value to be exchanged.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#3b82f6]/12">
            {[
              { icon: "👨‍💻", role: "DEVELOPER", name: "Miguel, Philippines", org: "Freelance smart contract dev", quote: '"I spend 3 days waiting for a human review. AI review in 3 seconds changes everything."', scenario: "Submits contract code. AI checks for reentrancy, gas optimization, and specified functions. Paid instantly in USDC.", color: "59,130,246" },
              { icon: "🏢", role: "DAO OPERATOR", name: "Priya, India", org: "Community manager at a Base DAO", quote: '"Our DAO posts 50+ bounties a month. AI evaluation automates 80% of our decisions."', scenario: "Posts content bounties. AI checks word count, tone, and topic. Approved writers get paid on the spot.", color: "16,185,129" },
              { icon: "🎨", role: "DESIGNER", name: "Aisha, Nigeria", org: "UI/UX designer, Web3 ecosystem", quote: '"USDC on Base lands in my wallet in seconds and costs almost nothing in fees."', scenario: "Submits Figma link. AI evaluates brief match — theme, components, accessibility. Payment hits wallet immediately.", color: "245,158,11" },
            ].map((uc, i) => (
              <div key={i} className="bg-[#0c1228] p-10 relative overflow-hidden group hover:bg-[#0c1228]/95 reveal delay-1">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl mb-5 border border-[#3b82f6]/22" style={{ backgroundColor: `rgba(${uc.color}, 0.1)`, borderColor: `rgba(${uc.color}, 0.25)` }}>{uc.icon}</div>
                <div className="font-['Plus_Jakarta_Sans'] font-bold text-[10px] text-[#00d4ff] tracking-widest mb-2.5 uppercase">{uc.role}</div>
                <div className="text-[15px] font-bold text-[#eef2ff] mb-1.5 font-['Plus_Jakarta_Sans']">{uc.name}</div>
                <div className="text-[12px] text-[#6b7a99] mb-5 font-['Plus_Jakarta_Sans']">{uc.org}</div>
                <div className="text-[14px] text-[#94a3b8] leading-[1.75] font-['Plus_Jakarta_Sans'] italic mb-5">{uc.quote}</div>
                <div className="p-3.5 bg-black/30 border-l-2 border-[#00d4ff]">
                  <div className="font-['Plus_Jakarta_Sans'] font-bold text-[10px] text-[#00d4ff] tracking-widest mb-1.5 uppercase">HOW THEY USE IT</div>
                  <div className="text-[12px] text-[#94a3b8] leading-relaxed font-['Plus_Jakarta_Sans']">{uc.scenario}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="relative py-32 bg-[#080d1c]">
        <div className="section-inner max-w-[780px] mx-auto px-12">
          <div className="text-center mb-16 reveal">
            <div className="font-['Plus_Jakarta_Sans'] font-bold text-[11px] text-[#00d4ff] tracking-[0.15em] uppercase mb-4 flex justify-center">FAQ</div>
            <h2 className="text-4xl md:text-[3rem] font-[800] leading-[1.08] tracking-tight mb-4 font-['Plus_Jakarta_Sans']">Questions answered.</h2>
            <p className="text-base text-[#94a3b8] font-['Plus_Jakarta_Sans'] font-light">Everything you need to know about how the app works, what it costs, and how to use it.</p>
          </div>
          <div className="flex flex-col gap-0 reveal">
            {[
              { q: "Does this use real money?", a: "No. The app runs entirely on Base Sepolia testnet — a test version of the Base blockchain where all ETH and USDC is fake and free. No real money ever changes hands. The transactions look and feel exactly like real blockchain, but nothing has monetary value." },
              { q: "How does the AI decide to approve or reject?", a: "Gemini AI receives a structured prompt acting as a strict judge. It reads the bounty's requirements exactly as written, then reads the submission, and checks each requirement one by one. It only approves if the submission explicitly and completely addresses ALL stated requirements." },
              { q: "Can I fool the AI with a bad submission?", a: "Not easily. The AI prompt is engineered to be strict — it looks for explicit evidence that each requirement was met, not just vague mention of the topic. If you claim to have built something but don't describe how, the AI will flag that." },
              { q: "What wallets are supported?", a: "MetaMask and Coinbase Wallet are supported via wagmi v2. Both are free browser extensions. You will be prompted to switch to Base Sepolia testnet on connection — the app handles this automatically." },
              { q: "How much does it cost to build and run this?", a: "Exactly $0. Every tool in the stack is free: Next.js, Tailwind CSS, wagmi, Gemini API (free tier), Base Sepolia testnet, Vercel hosting, GitHub. No credit card required during a hackathon." },
            ].map((item, i) => {
              const isOpen = faqIndex === i;
              return (
                <div key={i} className="border-b border-[#3b82f6]/12">
                  <button
                    type="button"
                    className="w-full py-6 flex justify-between items-center gap-4 text-left cursor-pointer group"
                    onClick={() => setFaqIndex(isOpen ? null : i)}
                    aria-expanded={isOpen}
                  >
                    <span
                      className="text-[15px] font-semibold leading-relaxed font-['Plus_Jakarta_Sans'] transition-colors duration-200"
                      style={{ color: isOpen ? '#00d4ff' : '#eef2ff' }}
                    >
                      {item.q}
                    </span>
                    <span
                      className="font-['Plus_Jakarta_Sans'] font-bold text-[20px] flex-shrink-0 transition-all duration-300 select-none"
                      style={{
                        color: isOpen ? '#00d4ff' : '#6b7a99',
                        transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                      }}
                    >
                      +
                    </span>
                  </button>
                  <div
                    style={{
                      maxHeight: isOpen ? '400px' : '0px',
                      overflow: 'hidden',
                      transition: 'max-height 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    <div className="pb-6 pr-10 text-[14px] text-[#94a3b8] leading-[1.85] font-['Plus_Jakarta_Sans']">
                      {item.a}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TECH STACK */}
      <section id="stack" className="relative py-32 bg-[#04070f]">
        <div className="section-inner max-w-[1240px] mx-auto px-12">
          <div className="text-center mb-16 reveal">
            <div className="font-['Plus_Jakarta_Sans'] font-bold text-[11px] text-[#00d4ff] tracking-[0.15em] uppercase mb-4 flex justify-center">TECH STACK</div>
            <h2 className="text-4xl md:text-[3rem] font-[800] leading-[1.08] tracking-tight mb-4 font-['Plus_Jakarta_Sans']">Six layers. Zero cost.<br />All free forever.</h2>
            <p className="text-base text-[#94a3b8] font-['Plus_Jakarta_Sans'] font-light max-w-[500px] mx-auto mb-4">Every single tool in this stack has a generous free tier. No trials, no expiry dates, no credit cards needed.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#3b82f6]/12">
            {[
              { icon: "⚛️", name: "Next.js 14", role: "Frontend + API routes — App Router" },
              { icon: "📘", name: "TypeScript", role: "Type safety — fewer runtime errors" },
              { icon: "🎨", name: "Tailwind CSS", role: "Utility-first styling — no UI libs" },
              { icon: "🤖", name: "Gemini 1.5 Flash", role: "AI judge engine — via Google AI Studio" },
              { icon: "👛", name: "wagmi v2 + viem", role: "Wallet connection + tx hooks" },
              { icon: "🔗", name: "Base Sepolia", role: "Testnet — fake ETH, real tx hashes" },
              { icon: "🏭", name: "Firebase Studio", role: "IDE — Gemini Unlimited built in" },
              { icon: "🚀", name: "Vercel", role: "Deployment — live URL in minutes" },
              { icon: "🐙", name: "GitHub", role: "Version control + CI/CD trigger" },
            ].map((s, i) => (
              <div key={i} className="bg-[#04070f] p-8 flex items-center gap-5 transition-colors hover:bg-[#080d1c]/90 reveal delay-1">
                <div className="w-11 h-11 border border-[#3b82f6]/12 flex items-center justify-center text-xl flex-shrink-0 transition-colors group-hover:border-[#00d4ff]/35">{s.icon}</div>
                <div>
                  <div className="text-[15px] font-bold text-[#eef2ff] mb-0.5 font-['Plus_Jakarta_Sans']">{s.name}</div>
                  <div className="text-[12px] text-[#6b7a99] font-['Plus_Jakarta_Sans']">{s.role}</div>
                </div>
                <div className="ml-auto font-['Plus_Jakarta_Sans'] font-bold text-[11px] text-[#10b981] tracking-widest">FREE</div>
              </div>
            ))}
          </div>
          <div className="p-8 bg-black/30 border border-[#3b82f6]/12 flex items-center gap-6 justify-center flex-wrap reveal mt-[1px]">
            <span className="font-['Plus_Jakarta_Sans'] font-semibold text-[12px] text-[#6b7a99] tracking-widest">Total build cost: <strong className="text-[#10b981]">$0.00</strong></span>
            <span className="text-[#6b7a99]">•</span>
            <span className="font-['Plus_Jakarta_Sans'] font-semibold text-[12px] text-[#6b7a99] tracking-widest">API calls during hackathon: <strong className="text-[#10b981]">~$0.00</strong></span>
            <span className="text-[#6b7a99]">•</span>
            <span className="font-['Plus_Jakarta_Sans'] font-semibold text-[12px] text-[#6b7a99] tracking-widest">Real money transacted: <strong className="text-[#10b981]">$0.00</strong></span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="relative py-36 bg-[#0c1228] text-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(0,212,255,0.05)_0%,transparent_65%)] pointer-events-none" />
        <div className="section-inner max-w-[1240px] mx-auto px-12 relative z-[2]">
          <div className="reveal">
            <div className="inline-flex items-center gap-2 font-['Plus_Jakarta_Sans'] font-bold text-[11px] text-[#10b981] tracking-widest px-4 py-1.5 border border-green-500/30 bg-green-500/7 mb-7">✓ BUILD GUIDE READY — START NOW</div>
            <h2 className="text-4xl md:text-[4.5rem] font-[800] leading-[1.05] tracking-tight mb-6 font-['Plus_Jakarta_Sans']">Ready to build<br /><span className="bg-gradient-to-r from-[#3b82f6] to-[#00d4ff] bg-clip-text text-transparent">something real?</span></h2>
            <p className="text-base text-[#94a3b8] max-w-[480px] mx-auto mb-12 font-['Plus_Jakarta_Sans'] font-light">The full PRD, step-by-step master prompts, and emergency fixes are in your document. Open Firebase Studio. Follow Step 1.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="/canvas" 
                className="btn-primary"
                style={{ isolation: 'isolate', color: '#020810', WebkitTextFillColor: '#020810' }}
                onMouseEnter={() => toggleCursorHover(true)}
                onMouseLeave={() => toggleCursorHover(false)}
              >
                <span>⚡</span> Start Step 1 now
              </Link>
              {/* ── FIX 2: "Read the PRD" — now a bright, visible amber/gold outlined button ── */}
              <a 
                href="#about" 
                className="btn-prd"
                onMouseEnter={() => toggleCursorHover(true)}
                onMouseLeave={() => toggleCursorHover(false)}
              >
                📄 Read the PRD →
              </a>
            </div>
            <div className="flex gap-10 justify-center mt-10 flex-wrap">
              {['100% free stack', 'No Web3 experience needed', 'Live URL in 3–4 hours', 'Emergency prompts included'].map((check, i) => (
                <div key={i} className="flex items-center gap-2 font-['Plus_Jakarta_Sans'] font-semibold text-[12px] text-[#6b7a99] tracking-widest">
                  <span className="text-[#10b981] text-sm">✓</span> {check}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#04070f] border-t border-[#3b82f6]/12 pt-16 pb-8 px-12 relative z-[2]">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-16 max-w-[1240px] mx-auto pb-12 border-b border-[#3b82f6]/12">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 bg-[#00d4ff] [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)]" />
              <span className="font-['Plus_Jakarta_Sans'] font-bold text-sm text-[#00d4ff] tracking-widest">BOUNTY.AI</span>
            </div>
            <p className="text-[13px] text-[#94a3b8] leading-relaxed max-w-[240px] font-['Plus_Jakarta_Sans'] mb-6">An autonomous bounty platform where AI evaluates submissions and Base blockchain handles instant USDC payouts. Built for Base Batches 2026.</p>
            <div className="inline-flex items-center gap-2 font-['Plus_Jakarta_Sans'] font-semibold text-[10px] text-[#6b7a99] px-3 py-1.25 border border-[#3b82f6]/12 tracking-widest">⚡ POWERED BY <span className="text-[#00d4ff]">GEMINI AI</span> + <span className="text-[#00d4ff]">BASE</span></div>
          </div>
          <div>
            <div className="font-['Plus_Jakarta_Sans'] font-bold text-[11px] text-[#00d4ff] tracking-widest mb-5 uppercase">NAVIGATE</div>
            <div className="flex flex-col gap-2.5">
              {['Home', 'About', 'How it works', 'Features', 'Live demo'].map(l => (
                <a key={l} href={`#${l.toLowerCase().replace(/ /g, '')}`} className="text-[13px] text-[#94a3b8] font-['Plus_Jakarta_Sans'] transition-colors hover:text-[#eef2ff]">{l}</a>
              ))}
            </div>
          </div>
          <div>
            <div className="font-['Plus_Jakarta_Sans'] font-bold text-[11px] text-[#00d4ff] tracking-widest mb-5 uppercase">LEARN</div>
            <div className="flex flex-col gap-2.5">
              {['Use cases', 'FAQ', 'Tech stack', 'Build guide'].map(l => (
                <a key={l} href={`#${l.toLowerCase().replace(/ /g, '')}`} className="text-[13px] text-[#94a3b8] font-['Plus_Jakarta_Sans'] transition-colors hover:text-[#eef2ff]">{l}</a>
              ))}
            </div>
          </div>
          <div>
            <div className="font-['Plus_Jakarta_Sans'] font-bold text-[11px] text-[#00d4ff] tracking-widest mb-5 uppercase">BUILT WITH</div>
            <div className="flex flex-col gap-2.5">
              {['Base →', 'Google AI Studio →', 'wagmi →', 'Vercel →', 'Next.js →'].map(l => (
                <a key={l} href="#" className="text-[13px] text-[#94a3b8] font-['Plus_Jakarta_Sans'] transition-colors hover:text-[#eef2ff]">{l}</a>
              ))}
            </div>
          </div>
        </div>
        <div className="max-w-[1240px] mx-auto pt-7 flex justify-between items-center flex-wrap gap-4">
          <div className="font-['Plus_Jakarta_Sans'] font-semibold text-[11px] text-[#6b7a99] tracking-widest uppercase">AI ONCHAIN BOUNTY BOARD — BASE BATCHES HACKATHON 2026</div>
          <div className="flex gap-3 flex-wrap">
            {['AI AGENT TRACK', 'ZERO COST BUILD', 'BASE SEPOLIA', 'BUILT WITH CLAUDE'].map(b => (
              <div key={b} className="font-['Plus_Jakarta_Sans'] font-semibold text-[10px] px-2.5 py-0.75 border border-[#3b82f6]/12 text-[#6b7a99] tracking-widest uppercase">{b}</div>
            ))}
          </div>
        </div>
      </footer>

      <style jsx>{`
        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 16px 36px;
          background: #00d4ff;
          color: #020810 !important;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 800;
          font-size: 15px;
          letter-spacing: .05em;
          text-decoration: none !important;
          position: relative;
          transition: background .2s, box-shadow .25s, transform .15s;
          clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
          -webkit-text-fill-color: #020810 !important;
          text-fill-color: #020810 !important;
          mix-blend-mode: normal;
        }
        .btn-primary:hover {
          background: #33deff;
          box-shadow: 0 0 48px rgba(0,212,255,.55), 0 4px 20px rgba(0,212,255,.3);
          transform: translateY(-1px);
        }
        .btn-primary:active { transform: translateY(0); }

        .btn-outline {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 34px;
          border: 1px solid rgba(255,255,255,0.14);
          color: #c7d2fe;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: .04em;
          text-decoration: none;
          transition: border-color .25s, color .25s;
          clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
        }
        .btn-outline:hover { border-color: rgba(0,212,255,.4); color: #00d4ff; }

        .btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 28px;
          color: #c7d2fe;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          border: 1px solid rgba(139, 92, 246, 0.45);
          background: rgba(139, 92, 246, 0.07);
          clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
          transition: border-color .25s, color .25s, background .25s, box-shadow .25s;
        }
        .btn-ghost:hover {
          color: #eef2ff;
          border-color: rgba(139, 92, 246, 0.75);
          background: rgba(139, 92, 246, 0.16);
          box-shadow: 0 0 28px rgba(139, 92, 246, 0.2);
        }

        /* ── FIX 2: PRD button — amber/gold so it pops on the dark CTA bg ── */
        .btn-prd {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 34px;
          border: 1px solid rgba(245, 158, 11, 0.6);
          color: #f59e0b;
          background: rgba(245, 158, 11, 0.07);
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: .04em;
          text-decoration: none;
          position: relative;
          overflow: hidden;
          transition: border-color .25s, color .25s, background .25s, box-shadow .25s;
          clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
          z-index: 1;
        }
        .btn-prd:hover {
          border-color: rgba(245, 158, 11, 0.9);
          color: #fbbf24;
          background: rgba(245, 158, 11, 0.14);
          box-shadow: 0 0 28px rgba(245, 158, 11, 0.25);
        }

        .scroll-line { width: 1px; height: 48px; background: linear-gradient(to bottom, transparent, #00d4ff); animation: scroll-anim 2.2s ease-in-out infinite; }
        @keyframes scroll-anim { 0%,100% { transform: scaleY(0); transform-origin: top; opacity: 0; } 40% { opacity: 1; transform: scaleY(1); transform-origin: top; } 60% { opacity: 1; transform: scaleY(1); transform-origin: bottom; } 100% { transform: scaleY(0); transform-origin: bottom; opacity: 0; } }
      `}</style>
    </div>
  );
}