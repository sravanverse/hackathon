import { z } from 'zod';
import { ToolDecorator, ExecutionContext, Injectable, ControllerDecorator } from '@nitrostack/core';
import { ToolCoordinator } from '../coordinator/tool-coordinator.js';
import { ToolResult } from '../models/ToolResult.js';
import { DrugInteractionResult } from '../agents/types.js';

/**
 * Input schema for drug interaction check.
 */
const DrugInteractionInputSchema = z.object({
  drug1: z.string().min(1, 'First drug name is required'),
  drug2: z.string().min(1, 'Second drug name is required'),
});

type DrugInteractionInput = z.infer<typeof DrugInteractionInputSchema>;

/**
 * MCP Tool for checking drug interactions.
 */
@ControllerDecorator()
@Injectable({ deps: [ToolCoordinator] })
export class DrugInteractionTool {
  constructor(private coordinator: ToolCoordinator) {}

  @ToolDecorator({
    name: 'check-drug-interaction',
    description: 'Check for potential interactions between two medications',
    inputSchema: DrugInteractionInputSchema,
  })
  async checkDrugInteraction(
    input: DrugInteractionInput,
    ctx: ExecutionContext
  ): Promise<ToolResult<DrugInteractionResult | null>> {
    return this.coordinator.checkDrugInteraction(input.drug1, input.drug2);
  }
}
