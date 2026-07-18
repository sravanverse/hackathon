import { Injectable } from '@nitrostack/core';
import { ToolResult, successResult, errorResult } from '../models/ToolResult.js';
import { BedStatus } from '../models/BedStatus.js';
import { MockBedsService } from './mockBeds.js';
import { BedAvailabilityResult, BedStats } from '../agents/types.js';

/**
 * Service for managing bed availability.
 */
@Injectable()
export class BedService {
  private mockBeds = new MockBedsService();

  /**
   * Find available beds, optionally filtered by ward.
   */
  async findAvailableBeds(ward?: string, count?: number): Promise<ToolResult<BedAvailabilityResult>> {
    try {
      const availableBeds = this.mockBeds.getAvailableBeds(ward, count);

      return successResult<BedAvailabilityResult>({
        ward: ward || 'All',
        availableBeds: availableBeds.map((bed) => ({
          bedId: bed.bedId,
          ward: bed.ward,
          status: bed.status,
        })),
        totalAvailable: availableBeds.length,
      });
    } catch (error) {
      return errorResult(error instanceof Error ? error.message : 'Unknown error finding available beds');
    }
  }

  /**
   * Get all beds in a specific ward.
   */
  async getBedsByWard(ward: string): Promise<ToolResult<BedStatus[]>> {
    try {
      if (!ward || ward.trim().length === 0) {
        return errorResult('Ward name is required');
      }

      const beds = this.mockBeds.getBeds(ward);

      if (beds.length === 0) {
        return errorResult(`No beds found for ward: ${ward}`);
      }

      return successResult<BedStatus[]>(beds);
    } catch (error) {
      return errorResult(error instanceof Error ? error.message : 'Unknown error fetching beds by ward');
    }
  }

  /**
   * Get bed availability statistics.
   */
  async getStats(): Promise<ToolResult<BedStats>> {
    try {
      const stats = this.mockBeds.getStats();
      return successResult<BedStats>(stats);
    } catch (error) {
      return errorResult(error instanceof Error ? error.message : 'Unknown error fetching bed statistics');
    }
  }

  /**
   * Update a bed's status.
   */
  async getAvailabilityStats(): Promise<ToolResult<BedStats>> {
    return this.getStats();
  }

  async updateBedStatus(
    bedId: string,
    status: BedStatus['status'],
    patientId?: string
  ): Promise<ToolResult<BedStatus>> {
    try {
      if (!bedId || bedId.trim().length === 0) {
        return errorResult('Bed ID is required');
      }

      const updated = this.mockBeds.updateBedStatus(bedId, status, patientId);

      if (!updated) {
        return errorResult(`Bed not found: ${bedId}`);
      }

      return successResult<BedStatus>(updated);
    } catch (error) {
      return errorResult(error instanceof Error ? error.message : 'Unknown error updating bed status');
    }
  }
}
