"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useBounties } from "../hooks/useBounties";
import { BountyCard } from "../components/BountyCard";
import { BountyModal } from "../components/BountyModal";
import {
  BountyDetailModal,
  WorkSubmission,
} from "../../components/dashboard/BountyDetailModal";
import { FilterBar } from "../components/FilterBar";
import { Toast } from "../components/Toast";
import { WalletButton } from "../components/WalletButton";
import { NetworkBadge } from "../components/NetworkBadge";
import { PayoutButton } from "../components/PayoutButton";
import { TransactionHistory } from "../components/TransactionHistory";
import { TxEntry } from "../types/transaction";
import { useAccount } from "wagmi";
import { User } from "lucide-react";

export default function DashboardPage() {
  const { address } = useAccount();
  const router = useRouter();
  const { bounties, addBounty, updateBountyStatus, isLoaded } = useBounties();
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [transactions, setTransactions] = useState<TxEntry[]>([]);

  // ── Detail modal state ─────────────────────────────────────────────────────
  const [selectedBounty, setSelectedBounty] = useState<any | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // ── AI review state ────────────────────────────────────────────────────────
  const [submittingBountyId, setSubmittingBountyId] = useState<string | null>(
    null,
  );
  const [aiVerdict, setAiVerdict] = useState<{
    status: "APPROVED" | "REJECTED";
    reason: string;
  } | null>(null);

  // ── Derived ────────────────────────────────────────────────────────────────
  const filteredBounties = bounties.filter(
    (b) => activeFilter === "ALL" || b.status === activeFilter,
  );
  const counts = {
    ALL: bounties.length,
    OPEN: bounties.filter((b) => b.status === "OPEN").length,
    IN_REVIEW: bounties.filter((b) => b.status === "IN_REVIEW").length,
    PAID: bounties.filter((b) => b.status === "PAID").length,
  };

  // ── ETH total (from file 2) ────────────────────────────────────────────────
  const totalRewards = bounties.reduce((acc, b) => acc + b.reward, 0);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handlePostBounty = (data: any) => {
    addBounty(data);
    setIsModalOpen(false);
    setToast({ message: "Bounty posted successfully!", type: "success" });
  };

  /** Open the detail modal when a card is clicked */
  const handleCardClick = (bounty: any) => {
    setSelectedBounty(bounty);
    setIsDetailOpen(true);
  };

  /**
   * Called by BountyDetailModal when the user completes the submit-work form.
   * Passes githubRepo, description, and images to the AI judge.
   */
  const handleSubmitWork = (bounty: any, submission: WorkSubmission) => {
    setIsDetailOpen(false);
    setSubmittingBountyId(bounty.id);
    setToast({
      message: "Submission received! AI judge is reviewing...",
      type: "info",
    });

    // TODO: replace with your real AI judge API call, passing submission.githubRepo,
    //       submission.description, and submission.images.
    console.log("Submission:", submission);

    setTimeout(() => {
      setAiVerdict({
        status: "APPROVED",
        reason:
          "Submission explicitly addresses all three requirements. Layer 2 scaling is mentioned and explained. EVM compatibility is confirmed.",
      });
      updateBountyStatus(bounty.id, "IN_REVIEW");
    }, 2000);
  };

  const handlePayoutComplete = (txHash: string, bounty: any) => {
    updateBountyStatus(bounty.id, "PAID");
    setTransactions((prev) => [
      {
        txHash,
        amount: bounty.reward,
        recipient: address || "0x...",
        timestamp: new Date().toISOString(),
        bountyTitle: bounty.title,
        status: "confirmed",
      },
      ...prev,
    ]);
    setToast({
      message: "Payout confirmed! TX: " + txHash.slice(0, 10),
      type: "success",
    });
    setSubmittingBountyId(null);
    setAiVerdict(null);
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-[#050810] text-[#eef2ff] font-['DM_Sans'] selection:bg-[#00d4ff]/30">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-[#050810]/80 backdrop-blur-xl border-b border-[rgba(59,130,246,0.12)] z-[100] px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#00d4ff] [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)] animate-pulse shadow-[0_0_15px_rgba(0,212,255,0.4)]" />
          <span className="font-extrabold tracking-tighter text-lg">
            AI Bounty Board.
          </span>
        </div>

        <div className="hidden md:block">
          <NetworkBadge />
        </div>

        <div className="flex items-center gap-3">
          <WalletButton />
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#00d4ff] text-[#050810] px-5 py-2 rounded-lg text-xs font-bold hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-all active:scale-95"
          >
            Post Bounty
          </button>
          <button
            onClick={() => router.push("/profile")}
            className="w-9 h-9 rounded-full bg-[#0d1424] border-2 border-transparent flex items-center justify-center hover:border-[#a855f7] transition-all active:scale-95"
            style={{
              background:
                "linear-gradient(#0d1424, #0d1424) padding-box, linear-gradient(135deg, #a855f7, #00d4ff) border-box",
              borderWidth: "2px",
              borderStyle: "solid",
              borderColor: "transparent",
            }}
            title="Profile"
          >
            {address ? (
              <span className="text-xs font-black text-[#eef2ff]">
                {address.slice(2, 3).toUpperCase()}
              </span>
            ) : (
              <User className="w-4 h-4 text-[#6b7a99]" />
            )}
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="pt-28 pb-20 px-8 max-w-[1400px] mx-auto">
        {/* STATS BAR */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="bg-[#0d1424] border border-[rgba(59,130,246,0.12)] p-5 rounded-2xl flex flex-col items-center">
            <span className="text-[10px] text-[#6b7a99] font-bold uppercase tracking-widest mb-1">
              Total Bounties
            </span>
            <span className="text-3xl font-black text-[#eef2ff] font-mono">
              {counts.ALL}
            </span>
          </div>
          <div className="bg-[#0d1424] border border-[rgba(59,130,246,0.12)] p-5 rounded-2xl flex flex-col items-center">
            <span className="text-[10px] text-[#6b7a99] font-bold uppercase tracking-widest mb-1">
              Open Opportunities
            </span>
            <span className="text-3xl font-black text-[#10b981] font-mono">
              {counts.OPEN}
            </span>
          </div>
          {/* ETH reward pool display from file 2 */}
          <div className="bg-[#0d1424] border border-[rgba(59,130,246,0.12)] p-5 rounded-2xl flex flex-col items-center">
            <span className="text-[10px] text-[#6b7a99] font-bold uppercase tracking-widest mb-1">
              Total Reward Pool
            </span>
            <span className="text-3xl font-black text-[#00d4ff] font-mono">
              {totalRewards.toFixed(4)} ETH
            </span>
          </div>
        </div>

        {/* AI REVIEW OVERLAY */}
        {submittingBountyId && aiVerdict && (
          <div className="mb-12 p-8 bg-[#10b981]/5 border border-[#10b981]/30 rounded-2xl animate-fade-in">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#10b981] rounded-full flex items-center justify-center text-xl">
                    🤖
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-[#10b981]">
                      AI VERDICT: {aiVerdict.status}
                    </h3>
                    <p className="text-xs text-[#6b7a99] font-mono">
                      Confidence: 94%
                    </p>
                  </div>
                </div>
                <p className="text-[#c7d2fe] text-sm leading-relaxed italic">
                  "{aiVerdict.reason}"
                </p>
              </div>
              <div className="w-full md:w-80">
                {address ? (
                  <PayoutButton
                    recipientAddress={address}
                    rewardAmount={
                      bounties.find((b) => b.id === submittingBountyId)
                        ?.reward || 0
                    }
                    bountyId={submittingBountyId}
                    onPayoutComplete={(hash) =>
                      handlePayoutComplete(
                        hash,
                        bounties.find((b) => b.id === submittingBountyId),
                      )
                    }
                  />
                ) : (
                  <div className="text-center p-4 border border-dashed border-[#6b7a99] rounded-xl">
                    <p className="text-xs text-[#6b7a99] mb-3">
                      Connect wallet to claim reward
                    </p>
                    <WalletButton />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* FILTERS */}
        <FilterBar
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          counts={counts}
        />

        {/* GRID — cards are clickable to open detail modal */}
        {filteredBounties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBounties.map((b) => (
              <div
                key={b.id}
                onClick={() => handleCardClick(b)}
                className="cursor-pointer group"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && handleCardClick(b)}
                aria-label={`View details for ${b.title}`}
              >
                <BountyCard bounty={b} onSubmit={() => handleCardClick(b)} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 bg-[#0d1424]/40 rounded-3xl border border-dashed border-[rgba(59,130,246,0.15)]">
            <div className="w-20 h-20 border-2 border-dashed border-[#6b7a99] rounded-full flex items-center justify-center mb-6 opacity-40">
              <span className="text-4xl text-[#6b7a99]">?</span>
            </div>
            <h3 className="text-2xl font-black text-[#6b7a99] mb-2 tracking-tight">
              No bounties found
            </h3>
            <p className="text-[#6b7a99] font-medium">
              Be the first to post a new challenge!
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-8 text-[#00d4ff] font-bold hover:underline"
            >
              Post First Bounty →
            </button>
          </div>
        )}

        {/* TRANSACTION HISTORY */}
        <TransactionHistory transactions={transactions} />
      </main>

      {/* POST BOUNTY MODAL */}
      <BountyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPost={handlePostBounty}
      />

      {/* BOUNTY DETAIL / SUBMIT MODAL */}
      <BountyDetailModal
        bounty={selectedBounty}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedBounty(null);
        }}
        onSubmitWork={handleSubmitWork}
      />

      {/* TOAST */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
