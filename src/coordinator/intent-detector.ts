import { Injectable } from '@nitrostack/core';

/**
 * Intent detection for routing user queries to the correct tool.
 */

export type Intent = 'drug-interaction' | 'bed-availability' | 'unknown';

@Injectable()
export class IntentDetector {
  private readonly drugKeywords = [
    'drug',
    'medication',
    'medicine',
    'interaction',
    'contraindication',
    'adverse',
    'side effect',
    'allergy',
    'allergic',
  ];

  private readonly bedKeywords = [
    'bed',
    'available',
    'availability',
    'ward',
    'room',
    'admission',
    'discharge',
    'occupancy',
    'icu',
    'cardiology',
    'general',
  ];

  /**
   * Detect the intent of a query.
   * @param query User query string
   * @returns Detected intent
   */
  detect(query: string): Intent {
    if (!query || typeof query !== 'string') {
      return 'unknown';
    }

    const normalized = query.toLowerCase();

    // Count keyword matches for each intent
    const drugMatches = this.drugKeywords.filter((kw) =>
      normalized.includes(kw)
    ).length;

    const bedMatches = this.bedKeywords.filter((kw) =>
      normalized.includes(kw)
    ).length;

    // Return the intent with the most matches
    if (drugMatches > bedMatches && drugMatches > 0) {
      return 'drug-interaction';
    }

    if (bedMatches > drugMatches && bedMatches > 0) {
      return 'bed-availability';
    }

    // If equal or no matches, return unknown
    return 'unknown';
  }

  /**
   * Check if a query is about drug interactions.
   * @param query User query string
   * @returns True if query is about drug interactions
   */
  isDrugQuery(query: string): boolean {
    return this.detect(query) === 'drug-interaction';
  }

  /**
   * Check if a query is about bed availability.
   * @param query User query string
   * @returns True if query is about bed availability
   */
  isBedQuery(query: string): boolean {
    return this.detect(query) === 'bed-availability';
  }
}
