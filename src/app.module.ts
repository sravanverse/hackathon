import { McpApp, Module } from '@nitrostack/core';
import { DrugInteractionTool } from './tools/drugInteraction.js';
import { BedAvailabilityTool } from './tools/bedAvailability.js';
import { ToolCoordinator } from './coordinator/tool-coordinator.js';
import { IntentDetector } from './coordinator/intent-detector.js';
import { DrugService } from './services/drug.service.js';
import { BedService } from './services/bed.service.js';

@McpApp({
  module: AppModule,
  server: {
    name: 'healthcare-mcp-server',
    version: '1.0.0',
  },
})
@Module({
  name: 'app',
  description: 'Healthcare MCP server tools',
  controllers: [DrugInteractionTool, BedAvailabilityTool],
  providers: [ToolCoordinator, IntentDetector, DrugService, BedService],
  imports: [],
})
export class AppModule {}
