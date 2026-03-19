'use client';

import { useState } from 'react';
import { EvaluationRequest, EvaluationResult } from '../types';

/**
 * @fileOverview Hook to interface with the AI Judge API route.
 */

export function useEvaluation() {
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [evaluationMs, setEvaluationMs] = useState<number | null>(null);

  const evaluate = async (request: EvaluationRequest) => {
    setIsEvaluating(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'AI Evaluation failed');
      }

      setResult(data);
      setEvaluationMs(data.evaluationMs);
    } catch (err: any) {
      setError(err.message || 'AI service unavailable');
    } finally {
      setIsEvaluating(false);
    }
  };

  const reset = () => {
    setIsEvaluating(false);
    setResult(null);
    setError(null);
    setEvaluationMs(null);
  };

  return { isEvaluating, result, error, evaluationMs, evaluate, reset };
}
