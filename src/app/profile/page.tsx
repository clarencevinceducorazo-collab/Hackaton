"use client";

import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Copy,
  Check,
  User,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useBounties } from "../hooks/useBounties";
import { useSubmissions } from "../hooks/useSubmissions";
import { Bounty } from "../types/bounty";
import { Submission } from "../types/submission";

type Tab = "projects" | "submitted" | "reviews" | "rewards" | "wallet";

const STATUS_CONFIG = {
  OPEN: {
    label: "Open",
    color: "#10b981",
    bg: "rgba(16,185,129,0.1)",
    icon: "✦",
  },
  IN_REVIEW: {
    label: "In Review",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
    icon: "⏳",
  },
  PAID: {
    label: "Approved",
    color: "#a855f7",
    bg: "rgba(168,85,247,0.1)",
    icon: "★",
  },
};

const SUBMISSION_STATUS_CONFIG = {
  pending: {
    label: "Pending",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
    icon: "⏳",
  },
  approved: {
    label: "Approved",
    color: "#10b981",
    bg: "rgba(16,185,129,0.1)",
    icon: "✅",
  },
  rejected: {
    label: "Rejected",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.1)",
    icon: "✗",
  },
};

function truncAddr(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function SubmissionRow({
  submission,
  onApprove,
  onReject,
}: {
  submission: Submission;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}) {
  const cfg = SUBMISSION_STATUS_CONFIG[submission.status];
  return (
    <div className="bg-[#050810] border border-[rgba(59,130,246,0.1)] rounded-xl p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-full bg-[#a855f7]/20 flex items-center justify-center flex-shrink-0 text-[11px] font-black text-[#a855f7]">
            {submission.submitterAddress.slice(2, 3).toUpperCase()}
          </div>
          <span className="text-xs font-mono text-[#c7d2fe] truncate">
            {truncAddr(submission.submitterAddress)}
          </span>
        </div>
        <div
          className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0"
          style={{
            background: cfg.bg,
            color: cfg.color,
            border: `1px solid ${cfg.color}40`,
          }}
        >
          <span>{cfg.icon}</span>
          <span>{cfg.label}</span>
        </div>
      </div>

      <a
        href={submission.githubRepo}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 text-xs text-[#00d4ff] hover:underline break-all"
      >
        <ExternalLink className="w-3 h-3 flex-shrink-0" />
        {submission.githubRepo}
      </a>

      {submission.description && (
        <p className="text-xs text-[#6b7a99] leading-relaxed line-clamp-3">
          {submission.description}
        </p>
      )}

      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] text-[#6b7a99] flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {new Date(submission.submittedAt).toLocaleString()}
        </span>
        {submission.status === "pending" && (
          <div className="flex gap-2">
            <button
              onClick={() => onReject(submission.id)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/30 hover:bg-[#ef4444]/20 transition-colors"
            >
              <XCircle className="w-3 h-3" /> Reject
            </button>
            <button
              onClick={() => onApprove(submission.id)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30 hover:bg-[#10b981]/20 transition-colors"
            >
              <CheckCircle2 className="w-3 h-3" /> Approve
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ReviewBountyCard({
  bounty,
  submissions,
  onApprove,
  onReject,
}: {
  bounty: Bounty;
  submissions: Submission[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const pendingCount = submissions.filter((s) => s.status === "pending").length;

  return (
    <div className="bg-[#0d1424] border border-[rgba(245,158,11,0.2)] rounded-2xl overflow-hidden hover:border-[rgba(245,158,11,0.35)] transition-all">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-[#eef2ff] mb-1 line-clamp-1">
              {bounty.title}
            </h3>
            <p className="text-xs text-[#6b7a99] line-clamp-2">
              {bounty.description}
            </p>
          </div>
          <span className="text-xs text-[#00d4ff] font-mono font-bold flex-shrink-0">
            {bounty.reward.toFixed(4)} ETH
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Submission count badge */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#a855f7]/10 border border-[#a855f7]/30">
              <span className="text-sm font-black text-[#a855f7]">
                {submissions.length}
              </span>
              <span className="text-[10px] text-[#a855f7] font-bold">
                {submissions.length === 1 ? "submission" : "submissions"}
              </span>
            </div>
            {pendingCount > 0 && (
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#f59e0b]/10 border border-[#f59e0b]/30">
                <span className="text-[10px] font-bold text-[#f59e0b]">
                  {pendingCount} pending
                </span>
              </div>
            )}
          </div>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="flex items-center gap-1.5 text-xs text-[#6b7a99] hover:text-[#eef2ff] transition-colors font-medium"
          >
            {expanded ? (
              <>
                <ChevronUp className="w-4 h-4" /> Hide
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" /> View submissions
              </>
            )}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-[rgba(59,130,246,0.1)] p-5 flex flex-col gap-3">
          {submissions.length === 0 ? (
            <p className="text-xs text-[#6b7a99] text-center py-4">
              No submissions yet
            </p>
          ) : (
            submissions.map((sub) => (
              <SubmissionRow
                key={sub.id}
                submission={sub}
                onApprove={onApprove}
                onReject={onReject}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

function BountyProjectCard({
  bounty,
  submissionCount,
}: {
  bounty: Bounty;
  submissionCount?: number;
}) {
  const cfg = STATUS_CONFIG[bounty.status];
  return (
    <div className="bg-[#0d1424] border border-[rgba(59,130,246,0.12)] rounded-2xl overflow-hidden hover:border-[rgba(59,130,246,0.3)] transition-all">
      <div className="h-36 bg-gradient-to-br from-[#0d1424] to-[#1a2240] flex items-center justify-center relative">
        <span className="text-5xl opacity-10">🏆</span>
        <div
          className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold"
          style={{
            background: cfg.bg,
            color: cfg.color,
            border: `1px solid ${cfg.color}40`,
          }}
        >
          <span>{cfg.icon}</span>
          <span>{cfg.label}</span>
        </div>
        {submissionCount !== undefined && submissionCount > 0 && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#a855f7]/20 border border-[#a855f7]/40">
            <span className="text-[10px] font-bold text-[#a855f7]">
              {submissionCount} submitted
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-sm font-bold text-[#eef2ff] mb-1 line-clamp-1">
          {bounty.title}
        </h3>
        <p className="text-xs text-[#6b7a99] line-clamp-2 mb-3">
          {bounty.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#00d4ff] font-mono font-bold">
            {bounty.reward.toFixed(4)} ETH
          </span>
          <span className="text-[10px] text-[#6b7a99]">
            {new Date(bounty.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 bg-[#0d1424]/40 rounded-3xl border border-dashed border-[rgba(59,130,246,0.15)]">
      <div className="w-16 h-16 border-2 border-dashed border-[#6b7a99] rounded-full flex items-center justify-center mb-4 opacity-40">
        <span className="text-3xl text-[#6b7a99]">?</span>
      </div>
      <p className="text-[#6b7a99] font-medium">{message}</p>
    </div>
  );
}

export default function ProfilePage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const { bounties, isLoaded } = useBounties();
  const {
    getSubmissionsForBounty,
    getSubmissionCountForBounty,
    updateSubmissionStatus,
    isLoaded: subsLoaded,
  } = useSubmissions();
  const [activeTab, setActiveTab] = useState<Tab>("projects");
  const [copied, setCopied] = useState(false);
  const [projectFilter, setProjectFilter] = useState("All Projects");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const truncateAddress = (addr: string) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  const getInitial = (addr: string) => addr.slice(2, 3).toUpperCase();

  const inReviewBounties = bounties.filter((b) => b.status === "IN_REVIEW");
  const paidBounties = bounties.filter((b) => b.status === "PAID");
  const totalEarned = paidBounties.reduce((acc, b) => acc + b.reward, 0);

  const filterOptions = ["All Projects", "Open", "In Review", "Paid"];
  const filterMap: Record<string, Bounty["status"] | null> = {
    "All Projects": null,
    Open: "OPEN",
    "In Review": "IN_REVIEW",
    Paid: "PAID",
  };
  const filteredProjects = filterMap[projectFilter]
    ? bounties.filter((b) => b.status === filterMap[projectFilter])
    : bounties;

  if (!mounted || !isLoaded || !subsLoaded) return null;

  return (
    <div className="min-h-screen bg-[#050810] text-[#eef2ff] font-['DM_Sans'] selection:bg-[#00d4ff]/30">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-[#050810]/80 backdrop-blur-xl border-b border-[rgba(59,130,246,0.12)] z-[100] px-8 flex items-center justify-between">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 text-[#6b7a99] hover:text-[#eef2ff] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Dashboard</span>
        </button>
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-[#00d4ff] [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)] animate-pulse shadow-[0_0_15px_rgba(0,212,255,0.4)]" />
          <span className="font-extrabold tracking-tighter text-base">
            AI Bounty Board.
          </span>
        </div>
        <div className="w-24" />
      </nav>

      <main className="pt-24 pb-20 px-6 max-w-[960px] mx-auto">
        {/* ── PROFILE HEADER ────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row gap-8 mb-10">
          {/* Avatar + name */}
          <div className="flex flex-col items-center gap-3 min-w-[140px]">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(#0d1424, #0d1424) padding-box, linear-gradient(135deg, #a855f7, #00d4ff) border-box",
                borderWidth: "2.5px",
                borderStyle: "solid",
                borderColor: "transparent",
              }}
            >
              {address ? (
                <span className="text-3xl font-black text-[#eef2ff]">
                  {getInitial(address)}
                </span>
              ) : (
                <User className="w-8 h-8 text-[#6b7a99]" />
              )}
            </div>
            <div className="text-center">
              <p className="text-base font-black text-[#eef2ff]">
                {address ? truncateAddress(address) : "Not connected"}
              </p>
              {isConnected && (
                <div className="flex items-center justify-center gap-1.5 mt-1">
                  <div className="w-1.5 h-1.5 bg-[#10b981] rounded-full animate-pulse" />
                  <span className="text-xs text-[#10b981] font-semibold">
                    Wallet Bound
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Wallet card */}
          <div className="flex-1 bg-[#0d1424] border border-[rgba(59,130,246,0.12)] rounded-2xl divide-y divide-[rgba(59,130,246,0.08)]">
            {isConnected && address ? (
              <div className="flex items-center justify-between gap-4 px-5 py-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-[#10b981] rounded-full" />
                    <span className="text-[11px] font-bold text-[#6b7a99] uppercase tracking-wider">
                      EVM — MetaMask / WalletConnect
                    </span>
                  </div>
                  <span className="text-sm font-mono text-[#eef2ff] break-all">
                    {address}
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(address)}
                  className="flex-shrink-0 p-2 rounded-lg hover:bg-[#1a2240] transition-colors"
                  title="Copy address"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-[#10b981]" />
                  ) : (
                    <Copy className="w-4 h-4 text-[#6b7a99]" />
                  )}
                </button>
              </div>
            ) : (
              <div className="px-5 py-6 text-center text-sm text-[#6b7a99]">
                Connect a wallet to see your address
              </div>
            )}
          </div>
        </div>

        {/* ── TABS ─────────────────────────────────────────────── */}
        <div className="border-b border-[rgba(59,130,246,0.12)] mb-8">
          <div className="flex gap-8 overflow-x-auto">
            {(
              [
                { id: "projects", label: "Bounty" },
                { id: "submitted", label: "Submitted Work" },
                { id: "reviews", label: "Reviews" },
                { id: "rewards", label: "Rewards" },
                { id: "wallet", label: "Wallet" },
              ] as { id: Tab; label: string }[]
            ).map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`pb-3 text-sm font-bold whitespace-nowrap transition-colors border-b-2 -mb-px ${
                  activeTab === id
                    ? "text-[#eef2ff] border-[#a855f7]"
                    : "text-[#6b7a99] border-transparent hover:text-[#c7d2fe]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── PROJECTS TAB ─────────────────────────────────────── */}
        {activeTab === "projects" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-[#a855f7]">
                My Projects
              </h2>
              <select
                value={projectFilter}
                onChange={(e) => setProjectFilter(e.target.value)}
                className="bg-[#0d1424] border border-[rgba(59,130,246,0.2)] text-[#eef2ff] text-sm rounded-lg px-4 py-2 font-medium cursor-pointer focus:outline-none appearance-none pr-8"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%236b7a99' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 12px center",
                }}
              >
                {filterOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            {filteredProjects.length === 0 ? (
              <EmptyState message="No projects found" />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProjects.map((b) => (
                  <BountyProjectCard
                    key={b.id}
                    bounty={b}
                    submissionCount={getSubmissionCountForBounty(b.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── SUBMITTED WORK TAB ───────────────────────────────── */}
        {activeTab === "submitted" && (
          <div>
            <h2 className="text-2xl font-black text-[#a855f7] mb-6">
              Submitted Work
            </h2>
            {inReviewBounties.length === 0 ? (
              <EmptyState message="No submissions yet" />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {inReviewBounties.map((b) => (
                  <BountyProjectCard
                    key={b.id}
                    bounty={b}
                    submissionCount={getSubmissionCountForBounty(b.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── REVIEWS TAB ──────────────────────────────────────── */}
        {activeTab === "reviews" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-[#a855f7]">Reviews</h2>
              {inReviewBounties.length > 0 && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f59e0b]/10 border border-[#f59e0b]/30">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] animate-pulse" />
                  <span className="text-xs font-bold text-[#f59e0b]">
                    {inReviewBounties.length} bounty in review
                  </span>
                </div>
              )}
            </div>

            {/* Summary stats */}
            {inReviewBounties.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-[#0d1424] border border-[rgba(59,130,246,0.12)] rounded-xl p-4 text-center">
                  <p className="text-[10px] text-[#6b7a99] font-bold uppercase tracking-wider mb-1">
                    Bounties in Review
                  </p>
                  <p className="text-2xl font-black text-[#f59e0b] font-mono">
                    {inReviewBounties.length}
                  </p>
                </div>
                <div className="bg-[#0d1424] border border-[rgba(59,130,246,0.12)] rounded-xl p-4 text-center">
                  <p className="text-[10px] text-[#6b7a99] font-bold uppercase tracking-wider mb-1">
                    Total Submissions
                  </p>
                  <p className="text-2xl font-black text-[#a855f7] font-mono">
                    {inReviewBounties.reduce(
                      (acc, b) => acc + getSubmissionCountForBounty(b.id),
                      0,
                    )}
                  </p>
                </div>
                <div className="bg-[#0d1424] border border-[rgba(59,130,246,0.12)] rounded-xl p-4 text-center">
                  <p className="text-[10px] text-[#6b7a99] font-bold uppercase tracking-wider mb-1">
                    Rewards at Stake
                  </p>
                  <p className="text-2xl font-black text-[#00d4ff] font-mono">
                    {inReviewBounties
                      .reduce((acc, b) => acc + b.reward, 0)
                      .toFixed(4)}
                  </p>
                </div>
              </div>
            )}

            {inReviewBounties.length === 0 ? (
              <EmptyState message="No bounties currently in review" />
            ) : (
              <div className="flex flex-col gap-4">
                {inReviewBounties.map((b) => (
                  <ReviewBountyCard
                    key={b.id}
                    bounty={b}
                    submissions={getSubmissionsForBounty(b.id)}
                    onApprove={(id) => updateSubmissionStatus(id, "approved")}
                    onReject={(id) => updateSubmissionStatus(id, "rejected")}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── REWARDS TAB ──────────────────────────────────────── */}
        {activeTab === "rewards" && (
          <div>
            <h2 className="text-2xl font-black text-[#a855f7] mb-6">Rewards</h2>
            {paidBounties.length === 0 ? (
              <EmptyState message="No rewards earned yet" />
            ) : (
              <>
                <div className="bg-[#0d1424] border border-[rgba(59,130,246,0.12)] rounded-2xl p-5 mb-6 flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#10b981]/10 rounded-xl flex items-center justify-center text-2xl">
                    💰
                  </div>
                  <div>
                    <p className="text-[10px] text-[#6b7a99] font-bold uppercase tracking-widest mb-0.5">
                      Total Earned
                    </p>
                    <p className="text-2xl font-black text-[#10b981] font-mono">
                      {totalEarned.toFixed(4)} ETH
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {paidBounties.map((b) => (
                    <BountyProjectCard key={b.id} bounty={b} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── WALLET TAB ───────────────────────────────────────── */}
        {activeTab === "wallet" && (
          <div>
            <h2 className="text-2xl font-black text-[#a855f7] mb-6">Wallet</h2>
            {isConnected && address ? (
              <div className="bg-[#0d1424] border border-[rgba(59,130,246,0.12)] rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-[#00d4ff]/10 rounded-xl flex items-center justify-center text-xl">
                    🔗
                  </div>
                  <div>
                    <p className="text-sm font-bold">Connected Wallet</p>
                    <p className="text-xs text-[#6b7a99]">EVM Compatible</p>
                  </div>
                </div>
                <div className="font-mono text-sm bg-[#050810] border border-[rgba(59,130,246,0.1)] rounded-xl p-4 break-all flex items-start justify-between gap-4 mb-5">
                  <span className="text-[#eef2ff] leading-relaxed">
                    {address}
                  </span>
                  <button
                    onClick={() => copyToClipboard(address)}
                    className="flex-shrink-0 p-2 hover:bg-[#1a2240] rounded-lg transition-colors mt-0.5"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-[#10b981]" />
                    ) : (
                      <Copy className="w-4 h-4 text-[#6b7a99]" />
                    )}
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-[#050810] rounded-xl p-4 text-center">
                    <p className="text-[10px] text-[#6b7a99] font-bold uppercase tracking-wider mb-1">
                      Projects
                    </p>
                    <p className="text-2xl font-black text-[#eef2ff] font-mono">
                      {bounties.length}
                    </p>
                  </div>
                  <div className="bg-[#050810] rounded-xl p-4 text-center">
                    <p className="text-[10px] text-[#6b7a99] font-bold uppercase tracking-wider mb-1">
                      In Review
                    </p>
                    <p className="text-2xl font-black text-[#00d4ff] font-mono">
                      {inReviewBounties.length}
                    </p>
                  </div>
                  <div className="bg-[#050810] rounded-xl p-4 text-center">
                    <p className="text-[10px] text-[#6b7a99] font-bold uppercase tracking-wider mb-1">
                      Earned (ETH)
                    </p>
                    <p className="text-2xl font-black text-[#10b981] font-mono">
                      {totalEarned.toFixed(3)}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <EmptyState message="Connect your wallet to see details" />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
