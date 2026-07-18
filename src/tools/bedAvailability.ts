import { z } from 'zod';
import { ToolDecorator, ExecutionContext, Injectable, ControllerDecorator } from '@nitrostack/core';
import { ToolCoordinator } from '../coordinator/tool-coordinator.js';
import { ToolResult } from '../models/ToolResult.js';
import { BedStatus } from '../models/BedStatus.js';
import { BedAvailabilityResult, BedStats } from '../agents/types.js';

/**
 * Input schema for finding available beds.
 */
const FindAvailableBedsInputSchema = z.object({
  ward: z.string().optional(),
  count: z.number().int().positive().optional(),
});

type FindAvailableBedsInput = z.infer<typeof FindAvailableBedsInputSchema>;

/**
 * MCP Tool for checking bed availability.
 */
@ControllerDecorator()
@Injectable({ deps: [ToolCoordinator] })
export class BedAvailabilityTool {
  constructor(private coordinator: ToolCoordinator) {}

  @ToolDecorator({
    name: 'find-available-beds',
    description: 'Find available beds in the hospital, optionally filtered by ward',
    inputSchema: FindAvailableBedsInputSchema,
  })
  async findAvailableBeds(
    input: FindAvailableBedsInput,
    ctx: ExecutionContext
  ): Promise<ToolResult<BedAvailabilityResult>> {
    return this.coordinator.findAvailableBeds(input.ward, input.count);
  }

  @ToolDecorator({
    name: 'get-beds-by-ward',
    description: 'Get all beds in a specific ward',
    inputSchema: z.object({
      ward: z.string().min(1, 'Ward name is required'),
    }),
  })
  async getBedsByWard(
    input: { ward: string },
    ctx: ExecutionContext
  ): Promise<ToolResult<BedStatus[]>> {
    return this.coordinator.getBedsByWard(input.ward);
  }

  @ToolDecorator({
    name: 'get-availability-stats',
    description: 'Get hospital bed availability statistics',
    inputSchema: z.object({}),
  })
  async getAvailabilityStats(
    input: Record<string, never>,
    ctx: ExecutionContext
  ): Promise<ToolResult<BedStats>> {
    return this.coordinator.getAvailabilityStats();
  }
}
