import { Injectable } from '@nitrostack/core';
import { ToolResult, successResult, errorResult } from '../models/ToolResult.js';
import { DrugInteractionResult } from '../agents/types.js';

/**
 * Mock drug interaction database.
 */
const DRUG_INTERACTIONS: Record<string, Record<string, { severity: string; description: string }>> = {
  warfarin: {
    aspirin: {
      severity: 'severe',
      description: 'Increased bleeding risk when combined with aspirin',
    },
    ibuprofen: {
      severity: 'severe',
      description: 'NSAIDs increase bleeding risk with warfarin',
    },
  },
  metformin: {
    alcohol: {
      severity: 'moderate',
      description: 'Alcohol may increase lactic acidosis risk',
    },
  },
  lisinopril: {
    potassium: {
      severity: 'moderate',
      description: 'May cause hyperkalemia when combined',
    },
  },
};

/**
 * Service for checking drug interactions.
 */
@Injectable()
export class DrugService {
  /**
   * Check for interactions between two drugs.
   */
  async checkInteraction(
    drug1: string,
    drug2: string
  ): Promise<ToolResult<DrugInteractionResult | null>> {
    try {
      const normalizedDrug1 = drug1.toLowerCase().trim();
      const normalizedDrug2 = drug2.toLowerCase().trim();

      if (!normalizedDrug1 || !normalizedDrug2) {
        return errorResult('Drug names cannot be empty');
      }

      if (normalizedDrug1 === normalizedDrug2) {
        return errorResult('Cannot check interaction of a drug with itself');
      }

      // Check both directions
      let interaction = DRUG_INTERACTIONS[normalizedDrug1]?.[normalizedDrug2];
      let foundDrug1 = normalizedDrug1;
      let foundDrug2 = normalizedDrug2;

      if (!interaction) {
        interaction = DRUG_INTERACTIONS[normalizedDrug2]?.[normalizedDrug1];
        if (interaction) {
          foundDrug1 = normalizedDrug2;
          foundDrug2 = normalizedDrug1;
        }
      }

      if (!interaction) {
        // No known interaction
        return successResult<DrugInteractionResult | null>({
          drug1: normalizedDrug1,
          drug2: normalizedDrug2,
          interactions: [],
          severity: 'none',
          description: 'No known interactions found in database',
          recommendation: 'No known interactions found in database',
        });
      }

      return successResult<DrugInteractionResult>({
        drug1: foundDrug1,
        drug2: foundDrug2,
        interactions: [interaction.description],
        severity: interaction.severity as DrugInteractionResult['severity'],
        description: interaction.description,
        recommendation: `Caution: ${interaction.severity} interaction detected. Consult pharmacist.`,
      });
    } catch (error) {
      return errorResult(error instanceof Error ? error.message : 'Unknown error checking drug interaction');
    }
  }

  /**
   * Get all known drugs in the database.
   */
  async getKnownDrugs(): Promise<ToolResult<string[]>> {
    try {
      const drugs = Object.keys(DRUG_INTERACTIONS);
      return successResult(drugs);
    } catch (error) {
      return errorResult(error instanceof Error ? error.message : 'Unknown error fetching drugs');
    }
  }
}
