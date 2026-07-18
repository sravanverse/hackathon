export interface BedStatus {
  bedId: string;
  ward: string;
  status: 'available' | 'occupied' | 'maintenance' | 'reserved';
  lastUpdated: string;
  patientId?: string;
  patientName?: string;
  notes?: string;
}

export interface BedStats {
  total: number;
  available: number;
  occupied: number;
  maintenance: number;
  reserved: number;
}
