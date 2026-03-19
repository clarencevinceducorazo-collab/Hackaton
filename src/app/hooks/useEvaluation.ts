'use client';
/**
 * @fileOverview Hook to manage the AI evaluation lifecycle.
 */

import { useState } from 'react';
import { EvaluationRequest, EvaluationResult } from '../types/evaluation';

export function useEvaluation() {
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [evaluationMs, setEvaluationMs] = useState<number | null>(null);

  const evaluate = async (request: EvaluationRequest) => {
    setIsEvaluating(true);
    setError(null);
    setResult(null);
    setEvaluationMs(null);

    try {
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Evaluation failed');
      }

      setResult(data);
      setEvaluationMs(data.evaluationMs);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsEvaluating(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
    setEvaluationMs(null);
    setIsEvaluating(false);
  };

  return { isEvaluating, result, error, evaluationMs, evaluate, reset };
}
