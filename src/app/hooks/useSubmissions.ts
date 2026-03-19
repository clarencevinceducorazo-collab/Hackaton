"use client";
import { useState, useEffect } from "react";
import { Submission } from "../types/submission";

const STORAGE_KEY = "bounty_submissions_data";

// Pre-seeded mock submissions for demo bounties in IN_REVIEW status
const INITIAL_SUBMISSIONS: Submission[] = [
  {
    id: "sub-1",
    bountyId: "2",
    submitterAddress: "0xA1B2C3D4E5F6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
    githubRepo: "https://github.com/alice-dev/hero-component",
    description:
      "Built a fully responsive hero section with animated gradient background, CTA button with hover effects, and a background grid pattern using CSS variables.",
    submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: "pending",
  },
  {
    id: "sub-2",
    bountyId: "2",
    submitterAddress: "0xDeF0123456789abcDeF0123456789abcDeF01234",
    githubRepo: "https://github.com/bob-ui/futuristic-hero",
    description:
      "Created a dark-themed hero component with a glassmorphism card, moving particle background, and fully responsive layout with Tailwind CSS.",
    submittedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    status: "pending",
  },
  {
    id: "sub-3",
    bountyId: "2",
    submitterAddress: "0x9876FEDC5432abcd9876FEDC5432abcd9876FEDC",
    githubRepo: "https://github.com/carol-codes/tailwind-hero",
    description:
      "Minimal hero section with spotlight effect behind the h1, animated CTA button, and a 12-column grid background. Passes Lighthouse a11y checks.",
    submittedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    status: "pending",
  },
];

export function useSubmissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setSubmissions(JSON.parse(saved));
      } catch {
        setSubmissions(INITIAL_SUBMISSIONS);
      }
    } else {
      setSubmissions(INITIAL_SUBMISSIONS);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
    }
  }, [submissions, isLoaded]);

  const addSubmission = (
    submission: Omit<Submission, "id" | "submittedAt" | "status">,
  ) => {
    const newSub: Submission = {
      ...submission,
      id: crypto.randomUUID(),
      submittedAt: new Date().toISOString(),
      status: "pending",
    };
    setSubmissions((prev) => [newSub, ...prev]);
  };

  const updateSubmissionStatus = (id: string, status: Submission["status"]) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s)),
    );
  };

  const getSubmissionsForBounty = (bountyId: string) =>
    submissions.filter((s) => s.bountyId === bountyId);

  const getSubmissionCountForBounty = (bountyId: string) =>
    submissions.filter((s) => s.bountyId === bountyId).length;

  return {
    submissions,
    isLoaded,
    addSubmission,
    updateSubmissionStatus,
    getSubmissionsForBounty,
    getSubmissionCountForBounty,
  };
}
