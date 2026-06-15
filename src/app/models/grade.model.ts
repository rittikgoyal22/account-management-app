// ─── Grade Models ─────────────────────────────────────────────────────────────
// Grade-1 (id=1) = Most senior = ₹15,000/day
// Grade-2 (id=2) = Mid         = ₹12,500/day
// Grade-3 (id=3) = Most junior = ₹10,000/day
// Lower id = higher seniority

export interface GradeResponseDTO {
  id: number;
  gradeName: string;
  maxBudgetPerDay: number;
}
