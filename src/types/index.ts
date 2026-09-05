export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  department: string;
}

export interface RiskContribution {
  factor: string;
  points: number;
  desc: string;
}

export interface RiskData {
  overallScore: number;
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  anomalyScore: number;
  costScore: number;
  delayScore: number;
  duplicateScore: number;
  paymentScore: number;
  geoScore: number;
  reasons: string[];
  contributions: RiskContribution[];
  recommendedAction: string;
  modelVersion: string;
}

export interface State {
  id: string;
  name: string;
  code: string;
}

export interface District {
  id: string;
  name: string;
  code: string;
}

export interface ImplementingAgency {
  id: string;
  name: string;
  code: string;
}

export interface Work {
  id: string;
  workId: string;
  workName: string;
  description: string;
  category: string;
  state: State;
  district: District;
  agency: ImplementingAgency;
  sanctionDate: string;
  startDate?: string;
  expectedCompletionDate: string;
  actualCompletionDate?: string;
  status: 'ONGOING' | 'COMPLETED' | 'DELAYED' | 'SANCTIONED';
  sanctionAmount: number;
  estimatedCost: number;
  expenditureAmount: number;
  physicalProgress: number;
  financialProgress: number;
  latitude: number;
  longitude: number;
  address: string;
  village?: string;
  isHeroCase: boolean;
  isSimilarPair: boolean;
  peerBenchmarkCost?: number;
  risk?: RiskData | null;
}

export interface SimilarWorkItem {
  id: string;
  workId: string;
  idRef: string;
  workName: string;
  category: string;
  sanctionAmount: number;
  district: string;
  similarityScore: number;
  distanceKm: number;
  costSimilarity: number;
  categoryMatch: boolean;
  reasons: string;
  latitude: number;
  longitude: number;
  riskScore: number;
}

export interface ComplianceCheck {
  id: string;
  title: string;
  status: 'PASSED' | 'REQUIRES_REVIEW' | 'VIOLATION';
  details: string;
}

export interface AuditLogItem {
  id: string;
  entityType: string;
  entityId: string;
  action: string;
  performedBy: string;
  details: string;
  timestamp: string;
}

export interface AlertItem {
  id: string;
  title: string;
  description: string;
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  alertType: string;
  status: 'NEW' | 'UNDER_REVIEW' | 'RESOLVED' | 'DISMISSED';
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
  work: {
    id: string;
    workId: string;
    workName: string;
    category: string;
    district: string;
    state: string;
    sanctionAmount: number;
    riskScore: number;
    isHeroCase: boolean;
  };
}

export interface InspectionItem {
  id: string;
  workId: string;
  workName: string;
  category: string;
  district: string;
  state: string;
  riskScore: number;
  riskLevel: string;
  officerName: string;
  officerRole: string;
  status: string;
  remarks: string;
  evidenceUrl?: string;
  evidenceHash?: string;
  latitude?: number;
  longitude?: number;
  verifiedAt: string;
  createdAt: string;
}

export interface DashboardData {
  kpis: {
    totalWorks: number;
    highRiskCount: number;
    mediumRiskCount: number;
    lowRiskCount: number;
    totalSanctioned: number;
    totalExpenditure: number;
    utilizationRate: number;
    avgPhysicalProgress: number;
    avgFinancialProgress: number;
    ongoingCount: number;
    delayedCount: number;
    completedCount: number;
    activeAlertsCount: number;
  };
  riskDistribution: { name: string; count: number; percentage: number; color: string }[];
  categoryRiskDistribution: {
    category: string;
    totalWorks: number;
    totalSanctioned: number;
    totalExpenditure: number;
    highRisk: number;
    mediumRisk: number;
    lowRisk: number;
  }[];
  stateAnalytics: {
    id: string;
    stateName: string;
    stateCode: string;
    totalWorks: number;
    highRisk: number;
    mediumRisk: number;
    lowRisk: number;
    sanctioned: number;
    expenditure: number;
    utilizationRate: number;
    averageRiskScore: number;
  }[];
  priorityQueue: {
    id: string;
    workId: string;
    workName: string;
    category: string;
    district: string;
    state: string;
    agency: string;
    sanctionAmount: number;
    expenditureAmount: number;
    physicalProgress: number;
    financialProgress: number;
    status: string;
    riskScore: number;
    riskLevel: string;
    primaryReason: string;
    recommendedAction: string;
    isHeroCase: boolean;
  }[];
  trendData: { month: string; highRisk: number; mediumRisk: number; lowRisk: number; avgScore: number }[];
}
