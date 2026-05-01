export type ImprovementCategory =
  | 'hair'
  | 'skin'
  | 'beard'
  | 'fitness'
  | 'style'
  | 'photos'
  | 'sleep'
  | 'grooming'
  | 'posture';

export type FixabilityLevel = 'low' | 'medium' | 'high' | 'very_high';

export type AuditCategoryResult = {
  category: ImprovementCategory;
  currentStateLabel: string;
  fixability: FixabilityLevel;
  estimatedTimeLabel: string;
  rank: number;
  guidance: string;
};

export type ProtocolType = '14_DAY' | '30_DAY' | '90_DAY';

export type Audit = {
  auditId: string;
  scanId: string;
  topImprovements: AuditCategoryResult[];
  recommendedProtocolType: ProtocolType;
  generatedAt: string;
  promptVersion: string;
  modelVersion: string;
};
