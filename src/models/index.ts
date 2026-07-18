/**
 * Core domain models for the MCP server.
 */

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
}

export interface Allergy {
  allergen: string;
  reaction: string;
}

export interface DrugInteraction {
  drug1: string;
  drug2: string;
  severity: 'low' | 'moderate' | 'high' | 'critical';
  description: string;
  recommendation?: string;
}

export type { BedStatus } from './BedStatus.js';

export interface ToolResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string; // ISO 8601
}
