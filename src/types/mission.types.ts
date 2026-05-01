import type { UserId } from './user.types';
import type { ProtocolId } from './protocol.types';
import type { ImprovementCategory } from './audit.types';

export type MissionId = string & { __brand: 'MissionId' };
export const missionId = (s: string): MissionId => s as MissionId;

export type MissionStatus = 'PENDING' | 'COMPLETED' | 'SKIPPED';

export type Mission = {
  missionId: MissionId;
  protocolId: ProtocolId;
  userId: UserId;
  date: string;
  category: ImprovementCategory;
  title: string;
  description: string;
  estimatedMinutes: number;
  status: MissionStatus;
  completedAt: string | null;
};

export type CompleteMissionRequest = {
  missionId: MissionId;
};

export type CompleteMissionResponse = {
  mission: Mission;
  newStreakDays: number;
};
