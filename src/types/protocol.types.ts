import type { IsoDate } from './api.types';
import type { UserId } from './user.types';
import type { ImprovementCategory, ProtocolType } from './audit.types';

export type ProtocolId = string & { __brand: 'ProtocolId' };
export const protocolId = (s: string): ProtocolId => s as ProtocolId;

export type ProtocolStatus = 'ACTIVE' | 'COMPLETED' | 'PAUSED';

export type ProtocolPhase = {
  phaseNumber: number;
  title: string;
  startDay: number;
  endDay: number;
  focusAreas: ImprovementCategory[];
  description: string;
};

export type Protocol = {
  protocolId: ProtocolId;
  userId: UserId;
  type: ProtocolType;
  status: ProtocolStatus;
  startedAt: IsoDate;
  endsAt: IsoDate;
  focusAreas: ImprovementCategory[];
  phases: ProtocolPhase[];
  currentDay: number;
  totalDays: number;
};

export type StartProtocolRequest = {
  auditId: string;
  type: ProtocolType;
};

export type StartProtocolResponse = {
  protocol: Protocol;
};
