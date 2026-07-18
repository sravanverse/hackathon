import { Injectable } from '@nitrostack/core';
import { ToolResult } from '../models/ToolResult.js';
import { DrugService } from '../services/drug.service.js';
import { BedService } from '../services/bed.service.js';
import { IntentDetector } from './intent-detector.js';
import { BedAvailabilityResult, DrugInteractionResult } from '../agents/types.js';
import { BedStatus } from '../models/BedStatus.js';

/**
 * Coordinates tool execution based on detected intent.
 */
@Injectable({ deps: [IntentDetector, DrugService, BedService] })
export class ToolCoordinator {
  private readonly intentDetector: IntentDetector;
  private readonly drugService: DrugService;
  private readonly bedService: BedService;

  constructor(
    intentDetector: IntentDetector,
    drugService: DrugService,
    bedService: BedService
  ) {
    this.intentDetector = intentDetector;
    this.drugService = drugService;
    this.bedService = bedService;
  }

  /**
   * Check drug interaction between two medications.
   * @param drug1 First medication name
   * @param drug2 Second medication name
   * @returns ToolResult with interaction data or error
   */
  async checkDrugInteraction(
    drug1: string,
    drug2: string
  ): Promise<ToolResult<DrugInteractionResult | null>> {
    const timestamp = new Date().toISOString();

    try {
      if (!drug1 || !drug2) {
        return {
          success: false,
          error: 'Both drug1 and drug2 are required',
          timestamp,
        };
      }

      const interaction = await this.drugService.checkInteraction(drug1, drug2);

      return interaction;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: `Drug interaction check failed: ${errorMessage}`,
        timestamp,
      };
    }
  }

  /**
   * Find available beds, optionally filtered by ward.
   * @param ward Optional ward name
   * @param count Optional maximum number of beds to return
   * @returns ToolResult with available beds or error
   */
  async findAvailableBeds(
    ward?: string,
    count?: number
  ): Promise<ToolResult<BedAvailabilityResult>> {
    const timestamp = new Date().toISOString();

    try {
      if (count !== undefined && count < 1) {
        return {
          success: false,
          error: 'Count must be a positive number',
          timestamp,
        };
      }

      const beds = await this.bedService.findAvailableBeds(ward, count);

      return beds;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: `Bed availability check failed: ${errorMessage}`,
        timestamp,
      };
    }
  }

  /**
   * Get all beds in a specific ward.
   * @param ward Ward name
   * @returns ToolResult with beds or error
   */
  async getBedsByWard(ward: string): Promise<ToolResult<BedStatus[]>> {
    const timestamp = new Date().toISOString();

    try {
      if (!ward) {
        return {
          success: false,
          error: 'Ward name is required',
          timestamp,
        };
      }

      const beds = await this.bedService.getBedsByWard(ward);

      return beds;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: `Ward lookup failed: ${errorMessage}`,
        timestamp,
      };
    }
  }

  /**
   * Get availability statistics.
   * @returns ToolResult with stats or error
   */
  async getAvailabilityStats(): Promise<
    ToolResult<{ total: number; available: number; occupied: number }>
  > {
    const timestamp = new Date().toISOString();

    try {
      const stats = await this.bedService.getAvailabilityStats();

      return stats;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: `Stats retrieval failed: ${errorMessage}`,
        timestamp,
      };
    }
  }
}
