import { BedStatus, BedStats } from '../models/BedStatus.js';

/**
 * Mock in-memory bed database for testing.
 */
export class MockBedsService {
  private beds: BedStatus[] = [
    {
      bedId: 'ICU-001',
      ward: 'ICU',
      status: 'occupied',
      patientId: 'P001',
      lastUpdated: new Date().toISOString(),
      notes: 'Post-operative monitoring',
    },
    {
      bedId: 'ICU-002',
      ward: 'ICU',
      status: 'available',
      lastUpdated: new Date().toISOString(),
    },
    {
      bedId: 'ICU-003',
      ward: 'ICU',
      status: 'maintenance',
      lastUpdated: new Date().toISOString(),
      notes: 'Equipment calibration',
    },
    {
      bedId: 'WARD-A-001',
      ward: 'Ward A',
      status: 'occupied',
      patientId: 'P002',
      lastUpdated: new Date().toISOString(),
    },
    {
      bedId: 'WARD-A-002',
      ward: 'Ward A',
      status: 'available',
      lastUpdated: new Date().toISOString(),
    },
    {
      bedId: 'WARD-A-003',
      ward: 'Ward A',
      status: 'available',
      lastUpdated: new Date().toISOString(),
    },
    {
      bedId: 'WARD-B-001',
      ward: 'Ward B',
      status: 'occupied',
      patientId: 'P003',
      lastUpdated: new Date().toISOString(),
    },
    {
      bedId: 'WARD-B-002',
      ward: 'Ward B',
      status: 'reserved',
      lastUpdated: new Date().toISOString(),
      notes: 'Reserved for scheduled admission',
    },
  ];

  /**
   * Get all beds, optionally filtered by ward.
   */
  getBeds(ward?: string): BedStatus[] {
    if (!ward) {
      return this.beds;
    }
    return this.beds.filter((bed) => bed.ward.toLowerCase() === ward.toLowerCase());
  }

  /**
   * Get available beds, optionally filtered by ward.
   */
  getAvailableBeds(ward?: string, count?: number): BedStatus[] {
    let available = this.beds.filter((bed) => bed.status === 'available');
    if (ward) {
      available = available.filter((bed) => bed.ward.toLowerCase() === ward.toLowerCase());
    }
    if (count && count > 0) {
      available = available.slice(0, count);
    }
    return available;
  }

  /**
   * Get bed availability statistics.
   */
  getStats(): BedStats {
    const stats: BedStats = {
      total: this.beds.length,
      available: 0,
      occupied: 0,
      maintenance: 0,
      reserved: 0,
    };

    this.beds.forEach((bed) => {
      switch (bed.status) {
        case 'available':
          stats.available++;
          break;
        case 'occupied':
          stats.occupied++;
          break;
        case 'maintenance':
          stats.maintenance++;
          break;
        case 'reserved':
          stats.reserved++;
          break;
      }
    });

    return stats;
  }

  /**
   * Update a bed's status.
   */
  updateBedStatus(bedId: string, status: BedStatus['status'], patientId?: string): BedStatus | null {
    const bed = this.beds.find((b) => b.bedId === bedId);
    if (!bed) {
      return null;
    }
    bed.status = status;
    bed.patientId = patientId;
    bed.lastUpdated = new Date().toISOString();
    return bed;
  }
}
