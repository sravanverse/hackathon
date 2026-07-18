/**
 * Shared types for agents and coordinators.
 */

import { ToolResult } from '../models/ToolResult.js';

export interface BedAvailabilityResult {
  ward: string;
  availableBeds: Array<{ bedId: string; ward: string; status: string }>;
  totalAvailable: number;
}

export interface BedStats {
  total: number;
  available: number;
  occupied: number;
}

export interface DrugInteractionResult {
  drug1: string;
  drug2: string;
  severity: 'none' | 'mild' | 'moderate' | 'severe' | 'high' | 'critical';
  interactions?: string[];
  description: string;
  recommendation?: string;
}

// Re-export ToolResult for convenience
export type { ToolResult }
