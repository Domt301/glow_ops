# GlowOps Mobile App — Build Specification

> **Audience:** This document is written for an autonomous coding agent. Follow it literally. When a section says "create file X with contents Y," create file X with contents Y. When a section says "the contract for object Z is the following," do not invent additional fields. If something is ambiguous, prefer the choice that minimizes assumptions and leaves a `// TODO(agent):` comment explaining what was assumed.

> **Critical constraint — Mocked API:** The backend does not exist yet. Every network call must go through a service layer (`src/services/`) whose concrete implementation returns hard-coded fake data after a simulated delay. The service layer must be structured so that swapping mock implementations for real HTTP calls later is a one-file change per service. **Components must never import mock data directly** — they call services, which internally decide whether to mock or fetch.

> **On-disk location of these docs.** This document and `tasks.md` live at the repo root alongside `package.json`, `app.json`, `tsconfig.json`. The agent does not need to fetch them from anywhere — they are already on disk. Do not commit them into a `docs/` subdirectory; keep them at root so they show up in any IDE or PR review without hunting.

> **Project state when the agent starts.** A blank Expo TypeScript project has already been initialized (via `npx create-expo-app@latest glowops --template blank-typescript`) with the dependency list from §3 already installed. The agent's first task therefore skips project init and begins by adapting the scaffolded project to this spec. See `tasks.md` TASK-001 for the exact starting state.

---

## 0. Agent Operating Instructions

1. **Work top-to-bottom.** Sections are ordered by build dependency. Do not skip ahead.
2. **Create the directory skeleton first** (Section 4 — the `src/`, `app/`, `assets/` tree on top of the existing scaffold), then types (Section 6), then services (Section 7), then state (Section 9), then UI (Sections 10–12).
3. **Run `npm run typecheck` after every section.** Do not proceed if it fails.
4. **Do not install packages not listed in Section 3.** If you believe one is needed, add a `// TODO(agent):` comment requesting it.
5. **All TypeScript must be strict.** No `any` except where this document explicitly permits it.
6. **All exports must be named.** No default exports anywhere except where required by the framework (`app/` route files in Expo Router).
7. **Definition of done for the whole build:**
   - `npm run typecheck` passes with zero errors.
   - `npm run lint` passes with zero errors.
   - `npx expo start` launches without runtime errors.
   - Every screen listed in Section 11 is reachable via navigation.
   - Every service in Section 7 returns mock data when called from a screen.
   - The complete user flow `Onboarding → Photo Upload → Audit → Paywall → Protocol → Mission → Progress` is clickable end-to-end with no dead ends.

---

## 1. Product Context (Read Once, Then Build)

GlowOps is a private AI appearance coach for men. The mobile app's job is to take a user from onboarding to a paid subscription via this loop:

```
Sign up → Upload photos → AI audit → See partial result → Hit paywall →
Subscribe → Get protocol → Complete daily missions → Track progress → Share report card
```

The app must feel **tactical, premium, masculine, calm**. Reference brands: WHOOP, Linear, Arc, Nike Training Club. Dark mode only for MVP. No emojis in product copy. No shaming language. Never display attractiveness scores as a single number — always frame as "highest-ROI improvement areas."

---

## 2. Technical Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Expo SDK 52 (managed workflow) | Fastest iteration, OTA updates, camera/image APIs built-in |
| Language | TypeScript 5.3+ (strict mode) | Contract enforcement is non-negotiable for a mocked-then-real backend |
| Navigation | Expo Router v4 (file-based) | Matches Next.js mental model, deep-linkable, type-safe |
| State (server) | TanStack Query v5 | Cache invalidation, retries, loading states for free |
| State (client) | Zustand v4 | Auth state, onboarding state, theme — no Redux boilerplate |
| Styling | StyleSheet + design tokens module | No third-party styling system; tokens enforce consistency |
| Forms | react-hook-form v7 + zod v3 | Same validation schema as future backend contracts |
| Icons | lucide-react-native | Matches the tactical brand feel |
| Images | expo-image | Better performance and caching than RN Image |
| Camera | expo-camera, expo-image-picker | Photo capture and library access |
| Storage | expo-secure-store (auth), AsyncStorage (cache) | Tokens secured, non-sensitive cached |
| Subscriptions | react-native-purchases (RevenueCat) — **stubbed for MVP** | Real integration deferred; stub the interface |
| Analytics | posthog-react-native — **stubbed for MVP** | Same — stub the interface |
| Fonts | @expo-google-fonts/inter, /sora, /jetbrains-mono | Matches brand spec |

---

## 3. Exact Dependency List

Install exactly these packages. Do not add others without leaving a TODO comment.

### `package.json` dependencies

```json
{
  "dependencies": {
    "expo": "~52.0.0",
    "expo-router": "~4.0.0",
    "expo-status-bar": "~2.0.0",
    "expo-splash-screen": "~0.29.0",
    "expo-font": "~13.0.0",
    "expo-image": "~2.0.0",
    "expo-image-picker": "~16.0.0",
    "expo-camera": "~16.0.0",
    "expo-secure-store": "~14.0.0",
    "expo-haptics": "~14.0.0",
    "expo-linear-gradient": "~14.0.0",
    "expo-blur": "~14.0.0",
    "react": "18.3.1",
    "react-native": "0.76.0",
    "react-native-safe-area-context": "4.12.0",
    "react-native-screens": "~4.0.0",
    "react-native-gesture-handler": "~2.20.0",
    "react-native-reanimated": "~3.16.0",
    "react-native-svg": "15.8.0",
    "@react-native-async-storage/async-storage": "1.23.1",
    "@tanstack/react-query": "^5.59.0",
    "zustand": "^4.5.0",
    "react-hook-form": "^7.53.0",
    "zod": "^3.23.0",
    "lucide-react-native": "^0.460.0",
    "@expo-google-fonts/inter": "^0.2.3",
    "@expo-google-fonts/sora": "^0.2.3",
    "@expo-google-fonts/jetbrains-mono": "^0.2.3"
  },
  "devDependencies": {
    "@babel/core": "^7.25.0",
    "@types/react": "~18.3.12",
    "typescript": "~5.3.3",
    "eslint": "^9.0.0",
    "eslint-config-expo": "~8.0.0",
    "prettier": "^3.3.0"
  }
}
```

### Verifying the pre-initialized state

The project should already be initialized when the agent starts. To verify, from the project root:

```bash
# Confirm we're in an Expo TS project
test -f app.json && test -f tsconfig.json && grep -q '"expo":' package.json && echo OK

# Confirm key deps are installed
node -e "const p = require('./package.json').dependencies; const required = ['expo', 'expo-router', 'react-native', '@tanstack/react-query', 'zustand', 'react-hook-form', 'zod']; const missing = required.filter(r => !p[r]); console.log(missing.length ? 'MISSING: ' + missing.join(', ') : 'OK');"
```

If anything is missing, install per the dependency list above using `npx expo install <expo-package>` for Expo-managed packages and `npm install <pkg>` for the rest. **Do NOT run `npx create-expo-app` again — that would wipe the project.**

---

## 4. Project Structure

Create exactly this directory tree. Empty directories should contain a `.gitkeep` file.

```
glowops/
├── app/                              # Expo Router file-based routes
│   ├── _layout.tsx                   # Root layout: providers, fonts, splash
│   ├── index.tsx                     # Entry redirect (auth gate)
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   ├── sign-in.tsx
│   │   └── sign-up.tsx
│   ├── (onboarding)/
│   │   ├── _layout.tsx
│   │   ├── welcome.tsx
│   │   ├── age-gate.tsx
│   │   ├── safety.tsx
│   │   ├── photo-upload.tsx
│   │   └── audit-loading.tsx
│   ├── (app)/
│   │   ├── _layout.tsx               # Tab bar layout
│   │   ├── home.tsx
│   │   ├── protocol.tsx
│   │   ├── camera.tsx
│   │   ├── progress.tsx
│   │   └── profile.tsx
│   ├── audit-result.tsx              # Modal-style screen post-audit
│   ├── paywall.tsx                   # Modal-style screen
│   ├── mission/[id].tsx              # Mission detail
│   └── report/[id].tsx               # Report card detail
│
├── src/
│   ├── components/                   # All reusable UI components
│   │   ├── primitives/               # Button, Card, Text, Input, etc.
│   │   ├── layout/                   # Screen, Stack, Row, Spacer
│   │   ├── audit/                    # AuditCategoryCard, FixabilityBadge
│   │   ├── protocol/                 # ProtocolTimeline, PhaseCard
│   │   ├── mission/                  # MissionCard, MissionChecklist, StreakBar
│   │   ├── progress/                 # BeforeAfterSlider, ProgressRing, ScoreTrend
│   │   ├── photo/                    # PhotoUploadSlot, PhotoGrid
│   │   └── paywall/                  # TierCard, PaywallSheet
│   │
│   ├── services/                     # API layer (mocked)
│   │   ├── http/
│   │   │   ├── client.ts             # Future real HTTP client (stubbed)
│   │   │   └── mock-delay.ts         # Simulated network latency
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   ├── scan.service.ts
│   │   ├── audit.service.ts
│   │   ├── protocol.service.ts
│   │   ├── mission.service.ts
│   │   ├── progress.service.ts
│   │   ├── report.service.ts
│   │   ├── subscription.service.ts
│   │   ├── photo.service.ts
│   │   ├── analytics.service.ts
│   │   └── index.ts                  # Barrel export
│   │
│   ├── mocks/                        # Fake data — only services import this
│   │   ├── users.mock.ts
│   │   ├── scans.mock.ts
│   │   ├── audits.mock.ts
│   │   ├── protocols.mock.ts
│   │   ├── missions.mock.ts
│   │   ├── reports.mock.ts
│   │   └── subscriptions.mock.ts
│   │
│   ├── types/                        # All shared type contracts
│   │   ├── user.types.ts
│   │   ├── scan.types.ts
│   │   ├── audit.types.ts
│   │   ├── protocol.types.ts
│   │   ├── mission.types.ts
│   │   ├── progress.types.ts
│   │   ├── report.types.ts
│   │   ├── subscription.types.ts
│   │   ├── photo.types.ts
│   │   ├── api.types.ts              # ApiResult, ApiError, Pagination
│   │   └── index.ts                  # Barrel export
│   │
│   ├── hooks/                        # React Query wrappers + custom hooks
│   │   ├── queries/
│   │   │   ├── useUser.ts
│   │   │   ├── useLatestScan.ts
│   │   │   ├── useActiveProtocol.ts
│   │   │   ├── useTodayMissions.ts
│   │   │   ├── useReport.ts
│   │   │   └── useSubscription.ts
│   │   ├── mutations/
│   │   │   ├── useSignIn.ts
│   │   │   ├── useSignUp.ts
│   │   │   ├── useUploadPhoto.ts
│   │   │   ├── useStartScan.ts
│   │   │   ├── useCompleteMission.ts
│   │   │   └── useStartProtocol.ts
│   │   ├── useAuth.ts                # Auth state from Zustand
│   │   ├── useTheme.ts               # Theme tokens accessor
│   │   └── useHaptics.ts             # Wrapped expo-haptics
│   │
│   ├── stores/                       # Zustand stores (client-only state)
│   │   ├── auth.store.ts
│   │   ├── onboarding.store.ts
│   │   └── ui.store.ts               # Modals, sheets, toasts
│   │
│   ├── theme/
│   │   ├── colors.ts                 # Tactical Tech palette (Section 12)
│   │   ├── typography.ts             # Font stacks and sizes
│   │   ├── spacing.ts                # 4pt grid
│   │   ├── radius.ts                 # Border radii
│   │   ├── shadows.ts
│   │   └── index.ts                  # Theme barrel
│   │
│   ├── utils/
│   │   ├── date.ts                   # formatDate, daysBetween, etc.
│   │   ├── format.ts                 # formatScore, formatDuration
│   │   ├── validation.ts             # Zod schemas
│   │   └── id.ts                     # uuid generation for mocks
│   │
│   └── config/
│       ├── env.ts                    # USE_MOCKS, API_BASE_URL flags
│       └── constants.ts              # PROTOCOL_LENGTHS, MISSION_CATEGORIES
│
├── assets/
│   ├── fonts/                        # Empty — Google Fonts loaded at runtime
│   └── images/
│       └── placeholder.png           # 1x1 transparent for image stubs
│
├── app.json                          # Expo config
├── tsconfig.json
├── babel.config.js
├── .eslintrc.js
├── .prettierrc
├── .env                              # USE_MOCKS=true
└── package.json
```

### Path aliases

Configure `tsconfig.json` so that `@/` maps to `./src/`. All imports inside `src/` and `app/` use the alias. Never use relative imports that traverse upward more than one level (`../../`).

---

## 5. Conventions

### 5.1 File naming

- Components: `PascalCase.tsx` (e.g., `MissionCard.tsx`)
- Hooks: `camelCase.ts` starting with `use` (e.g., `useTodayMissions.ts`)
- Services: `kebab-case.service.ts` (e.g., `mission.service.ts`)
- Types: `kebab-case.types.ts`
- Mocks: `kebab-case.mock.ts`
- Stores: `kebab-case.store.ts`
- Route files: `kebab-case.tsx` (Expo Router convention)

### 5.2 Component structure

Every component file follows this template:

```tsx
import { View } from 'react-native';
import type { ComponentProps } from 'react';
import { Text } from '@/components/primitives/Text';
import { useTheme } from '@/hooks/useTheme';

export type MissionCardProps = {
  title: string;
  category: MissionCategory;
  status: MissionStatus;
  onPress: () => void;
};

export function MissionCard({ title, category, status, onPress }: MissionCardProps) {
  const theme = useTheme();
  // ... implementation
}
```

Rules:
- **Named export only.** No `export default`.
- **Props type co-located** and exported with the component.
- **No inline styles.** Use `StyleSheet.create` at the bottom of the file or theme tokens.
- **No business logic in components.** Components call hooks; hooks call services.

### 5.3 Service layer rules

- Every service is a **module of named functions**, not a class. Functions are pure with respect to their arguments — no hidden state.
- Every service function returns `Promise<ApiResult<T>>` (defined in Section 6) — never throws for expected error states.
- Every service function has a corresponding `MOCK_` constant or generator in `src/mocks/`.
- Services check `env.USE_MOCKS` at call time. If true, return mock data with simulated delay. If false, call the real HTTP client (which throws "not implemented" for now).
- **Components and screens never import from `src/mocks/`.** Only services do.

### 5.4 Type contract rules

- Every entity has a single source-of-truth type in `src/types/`.
- Service request/response types live alongside the entity type (e.g., `CreateScanRequest` and `CreateScanResponse` in `scan.types.ts`).
- Use `type` not `interface` unless extending is needed.
- All IDs are typed as branded strings: `type UserId = string & { __brand: 'UserId' }`. Provide a constructor `userId(s: string): UserId`.

### 5.5 Error handling

- Services return `ApiResult<T> = { ok: true; data: T } | { ok: false; error: ApiError }`.
- Hooks unwrap this for React Query — on `ok: false`, the hook throws so React Query treats it as an error.
- UI handles error state via the React Query `error` field with a standard `<ErrorState />` component.

### 5.6 Loading and empty states

Every screen that fetches data must handle three states explicitly:

```tsx
if (query.isLoading) return <LoadingState />;
if (query.error) return <ErrorState error={query.error} onRetry={query.refetch} />;
if (!query.data || query.data.length === 0) return <EmptyState message="..." />;
```

These three components live in `src/components/primitives/` and are mandatory.

---

## 6. Type Contracts (Source of Truth)

These types are the contract between every layer. Mock data must conform. Real backend responses (later) must conform. Components consume these types — nothing else.

### 6.1 `src/types/api.types.ts`

```typescript
export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: ApiError };

export type ApiError = {
  code: ApiErrorCode;
  message: string;
  details?: Record<string, unknown>;
};

export type ApiErrorCode =
  | 'NETWORK_ERROR'
  | 'UNAUTHORIZED'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'PAYWALL_REQUIRED'
  | 'RATE_LIMITED'
  | 'INTERNAL_ERROR';

export type Pagination = {
  cursor: string | null;
  limit: number;
};

export type Paginated<T> = {
  items: T[];
  nextCursor: string | null;
};

export type IsoDate = string; // ISO 8601, e.g. "2026-04-24T12:00:00Z"
```

### 6.2 `src/types/user.types.ts`

```typescript
import type { IsoDate } from './api.types';

export type UserId = string & { __brand: 'UserId' };
export const userId = (s: string): UserId => s as UserId;

export type SubscriptionTier = 'free' | 'basic' | 'pro' | 'elite' | 'lifetime';

export type User = {
  userId: UserId;
  email: string;
  displayName: string | null;
  createdAt: IsoDate;
  lastActiveAt: IsoDate;
  subscriptionTier: SubscriptionTier;
  onboardingComplete: boolean;
  ageGateAccepted: boolean;
  safetyAcknowledgementAccepted: boolean;
};

export type SignUpRequest = {
  email: string;
  password: string;
};

export type SignInRequest = {
  email: string;
  password: string;
};

export type AuthResponse = {
  user: User;
  accessToken: string;
  refreshToken: string;
};
```

### 6.3 `src/types/photo.types.ts`

```typescript
import type { IsoDate } from './api.types';
import type { UserId } from './user.types';

export type PhotoId = string & { __brand: 'PhotoId' };
export const photoId = (s: string): PhotoId => s as PhotoId;

export type PhotoKind =
  | 'selfie_front'
  | 'selfie_side'
  | 'full_body'
  | 'beard_hair'
  | 'dating_profile';

export type Photo = {
  photoId: PhotoId;
  userId: UserId;
  kind: PhotoKind;
  uri: string;              // local URI before upload, remote URL after
  uploadedAt: IsoDate | null;
  width: number;
  height: number;
  sizeBytes: number;
};

export type UploadPhotoRequest = {
  kind: PhotoKind;
  localUri: string;
  width: number;
  height: number;
  sizeBytes: number;
};

export type UploadPhotoResponse = {
  photo: Photo;
};
```

### 6.4 `src/types/scan.types.ts`

```typescript
import type { IsoDate } from './api.types';
import type { UserId } from './user.types';
import type { PhotoId } from './photo.types';

export type ScanId = string & { __brand: 'ScanId' };
export const scanId = (s: string): ScanId => s as ScanId;

export type ScanStatus = 'PENDING' | 'PROCESSING' | 'READY' | 'FAILED';

export type Scan = {
  scanId: ScanId;
  userId: UserId;
  status: ScanStatus;
  photoIds: PhotoId[];
  createdAt: IsoDate;
  completedAt: IsoDate | null;
  reportId: string | null;
  failureReason: string | null;
};

export type CreateScanRequest = {
  photoIds: PhotoId[];
};

export type CreateScanResponse = {
  scan: Scan;
};
```

### 6.5 `src/types/audit.types.ts`

```typescript
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
  currentStateLabel: string;        // e.g. "Needs shape/structure"
  fixability: FixabilityLevel;
  estimatedTimeLabel: string;       // e.g. "1 week"
  rank: number;                     // 1 = highest ROI
  guidance: string;                 // 1-2 sentence framing, safety-vetted
};

export type Audit = {
  auditId: string;
  scanId: string;
  topImprovements: AuditCategoryResult[];   // length 3-5
  recommendedProtocolType: ProtocolType;
  generatedAt: string;
  promptVersion: string;
  modelVersion: string;
};

// Re-imported here to avoid circular dep — defined fully in protocol.types
export type ProtocolType = '14_DAY' | '30_DAY' | '90_DAY';
```

### 6.6 `src/types/protocol.types.ts`

```typescript
import type { IsoDate } from './api.types';
import type { UserId } from './user.types';
import type { ImprovementCategory } from './audit.types';

export type ProtocolId = string & { __brand: 'ProtocolId' };
export const protocolId = (s: string): ProtocolId => s as ProtocolId;

export type ProtocolType = '14_DAY' | '30_DAY' | '90_DAY';
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
```

### 6.7 `src/types/mission.types.ts`

```typescript
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
  date: string;                  // YYYY-MM-DD
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
```

### 6.8 `src/types/progress.types.ts`

```typescript
import type { IsoDate } from './api.types';
import type { ImprovementCategory } from './audit.types';

export type Streak = {
  currentDays: number;
  longestDays: number;
  lastCompletedDate: string | null;  // YYYY-MM-DD
};

export type CategoryScore = {
  category: ImprovementCategory;
  score: number;                     // 0-100, displayed as relative trend not absolute judgment
  trend: 'up' | 'down' | 'flat';
  changeFromLastWeek: number;
};

export type WeeklyProgress = {
  weekStartDate: string;             // YYYY-MM-DD
  missionsCompleted: number;
  missionsTotal: number;
  photosUploaded: number;
  scoreTrends: CategoryScore[];
};

export type ProgressOverview = {
  streak: Streak;
  weeklyProgress: WeeklyProgress[];  // most recent first, max 12 weeks
  totalMissionsCompleted: number;
  protocolsCompleted: number;
};
```

### 6.9 `src/types/report.types.ts`

```typescript
import type { IsoDate } from './api.types';
import type { UserId } from './user.types';
import type { ImprovementCategory } from './audit.types';

export type ReportId = string & { __brand: 'ReportId' };
export const reportId = (s: string): ReportId => s as ReportId;

export type ReportType = 'INITIAL' | 'WEEKLY' | 'MONTHLY' | 'FINAL';

export type Report = {
  reportId: ReportId;
  userId: UserId;
  scanId: string | null;
  type: ReportType;
  createdAt: IsoDate;
  summary: string;
  categoryScores: Partial<Record<ImprovementCategory, number>>;
  shareCardUrl: string | null;
  beforePhotoUrl: string | null;
  afterPhotoUrl: string | null;
};
```

### 6.10 `src/types/subscription.types.ts`

```typescript
import type { SubscriptionTier } from './user.types';

export type SubscriptionEntitlement = {
  tier: SubscriptionTier;
  isActive: boolean;
  expiresAt: string | null;
  willRenew: boolean;
  productIdentifier: string | null;
  // True when the entitlement was set by the optimistic `purchase` mutation
  // and the authoritative RevenueCat webhook has not yet arrived. Cleared
  // (or overwritten) once the webhook reconciles. UI may show a subtle
  // "Confirming..." state when true; functionally treat as the real tier.
  provisional: boolean;
};

export type PricingOption = {
  productId: string;
  tier: SubscriptionTier;
  displayPrice: string;            // e.g. "$14.99/month"
  pricePerMonth: number;
  billingPeriod: 'monthly' | 'annual' | 'lifetime' | 'one_time';
  trialDays: number | null;
  features: string[];
  isRecommended: boolean;
};

export type PaywallOffering = {
  offeringId: string;
  options: PricingOption[];
};

export type PurchaseRequest = {
  productId: string;
  // Receipt token from the RevenueCat SDK after a successful in-app purchase.
  // The backend uses this to write a *provisional* entitlement immediately;
  // the authoritative state arrives 1-5s later via RevenueCat's webhook.
  // Until cutover (see §15), the mock service ignores this field.
  receiptToken: string;
};

export type PurchaseResponse = {
  entitlement: SubscriptionEntitlement;
  // Echo of the submitted receiptToken, or 'optimistic' for the provisional path.
  receipt: string;
};
```

### 6.11 `src/types/index.ts`

```typescript
export * from './api.types';
export * from './user.types';
export * from './photo.types';
export * from './scan.types';
export * from './audit.types';
export * from './protocol.types';
export * from './mission.types';
export * from './progress.types';
export * from './report.types';
export * from './subscription.types';
```

---

## 7. Service Layer (Mocked API)

### 7.1 The mock contract

Every service file follows this exact pattern. The split between `_mockImpl` and `_realImpl` is what makes the future swap trivial.

```typescript
// src/services/example.service.ts
import { env } from '@/config/env';
import { mockDelay } from './http/mock-delay';
import { httpClient } from './http/client';
import type { ApiResult, ExampleEntity, GetExampleRequest } from '@/types';
import { MOCK_EXAMPLE } from '@/mocks/example.mock';

async function _mockImpl(req: GetExampleRequest): Promise<ApiResult<ExampleEntity>> {
  await mockDelay();
  return { ok: true, data: MOCK_EXAMPLE };
}

async function _realImpl(req: GetExampleRequest): Promise<ApiResult<ExampleEntity>> {
  return httpClient.get<ExampleEntity>(`/example/${req.id}`);
}

export async function getExample(req: GetExampleRequest): Promise<ApiResult<ExampleEntity>> {
  return env.USE_MOCKS ? _mockImpl(req) : _realImpl(req);
}
```

When the backend exists, the only change is `env.USE_MOCKS = false`. No component, hook, or screen changes.

### 7.2 `src/config/env.ts`

```typescript
export const env = {
  USE_MOCKS: true,                            // Flip to false when backend ready
  API_BASE_URL: 'https://api.glowops.app',    // Placeholder
  MOCK_LATENCY_MS: 600,                       // Simulated network delay
  MOCK_FAILURE_RATE: 0,                       // 0..1; set >0 to test error paths
} as const;
```

### 7.3 `src/services/http/mock-delay.ts`

```typescript
import { env } from '@/config/env';
import type { ApiResult, ApiError } from '@/types';

export async function mockDelay(ms: number = env.MOCK_LATENCY_MS): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export function maybeFail<T>(success: T): ApiResult<T> {
  if (Math.random() < env.MOCK_FAILURE_RATE) {
    const error: ApiError = {
      code: 'NETWORK_ERROR',
      message: 'Simulated mock failure',
    };
    return { ok: false, error };
  }
  return { ok: true, data: success };
}
```

### 7.4 `src/services/http/client.ts`

```typescript
import type { ApiResult } from '@/types';

// Stub HTTP client. Real implementation comes when backend is live.
// Throws by design — services will not call this while USE_MOCKS=true.

class HttpClient {
  async get<T>(path: string): Promise<ApiResult<T>> {
    throw new Error(`HttpClient.get not implemented (path: ${path}). Set USE_MOCKS=true.`);
  }
  async post<T>(path: string, body: unknown): Promise<ApiResult<T>> {
    throw new Error(`HttpClient.post not implemented (path: ${path}). Set USE_MOCKS=true.`);
  }
  async put<T>(path: string, body: unknown): Promise<ApiResult<T>> {
    throw new Error(`HttpClient.put not implemented (path: ${path}). Set USE_MOCKS=true.`);
  }
  async delete<T>(path: string): Promise<ApiResult<T>> {
    throw new Error(`HttpClient.delete not implemented (path: ${path}). Set USE_MOCKS=true.`);
  }
}

export const httpClient = new HttpClient();
```

### 7.5 Service interfaces (full list)

For each service below, implement both `_mockImpl` (returns mock data) and `_realImpl` (calls `httpClient`, will throw until backend is live). The exported function dispatches based on `env.USE_MOCKS`.

#### `auth.service.ts`
```typescript
signUp(req: SignUpRequest): Promise<ApiResult<AuthResponse>>
signIn(req: SignInRequest): Promise<ApiResult<AuthResponse>>
signOut(): Promise<ApiResult<void>>
refreshToken(refreshToken: string): Promise<ApiResult<AuthResponse>>
```

#### `user.service.ts`
```typescript
getCurrentUser(): Promise<ApiResult<User>>
updateUser(updates: Partial<Pick<User, 'displayName' | 'ageGateAccepted' | 'safetyAcknowledgementAccepted'>>): Promise<ApiResult<User>>
deleteAccount(): Promise<ApiResult<void>>
```

#### `photo.service.ts`
```typescript
uploadPhoto(req: UploadPhotoRequest): Promise<ApiResult<UploadPhotoResponse>>
deletePhoto(photoId: PhotoId): Promise<ApiResult<void>>
listUserPhotos(): Promise<ApiResult<Photo[]>>
```

#### `scan.service.ts`
```typescript
createScan(req: CreateScanRequest): Promise<ApiResult<CreateScanResponse>>
getScan(scanId: ScanId): Promise<ApiResult<Scan>>
getLatestScan(): Promise<ApiResult<Scan | null>>
```

#### `audit.service.ts`
```typescript
getAuditByScan(scanId: ScanId): Promise<ApiResult<Audit>>
```

#### `protocol.service.ts`
```typescript
startProtocol(req: StartProtocolRequest): Promise<ApiResult<StartProtocolResponse>>
getActiveProtocol(): Promise<ApiResult<Protocol | null>>
pauseProtocol(protocolId: ProtocolId): Promise<ApiResult<Protocol>>
resumeProtocol(protocolId: ProtocolId): Promise<ApiResult<Protocol>>
```

#### `mission.service.ts`
```typescript
getTodayMissions(): Promise<ApiResult<Mission[]>>
getMission(missionId: MissionId): Promise<ApiResult<Mission>>
completeMission(req: CompleteMissionRequest): Promise<ApiResult<CompleteMissionResponse>>
skipMission(missionId: MissionId): Promise<ApiResult<Mission>>
getMissionHistory(fromDate: string, toDate: string): Promise<ApiResult<Mission[]>>
```

#### `progress.service.ts`
```typescript
getProgressOverview(): Promise<ApiResult<ProgressOverview>>
getStreak(): Promise<ApiResult<Streak>>
```

#### `report.service.ts`
```typescript
getReport(reportId: ReportId): Promise<ApiResult<Report>>
listReports(): Promise<ApiResult<Report[]>>
generateShareCard(reportId: ReportId): Promise<ApiResult<{ url: string }>>
```

#### `subscription.service.ts`
```typescript
getEntitlement(): Promise<ApiResult<SubscriptionEntitlement>>
getPaywallOffering(): Promise<ApiResult<PaywallOffering>>
purchase(req: PurchaseRequest): Promise<ApiResult<PurchaseResponse>>
restorePurchases(): Promise<ApiResult<SubscriptionEntitlement>>
```

#### `analytics.service.ts`
```typescript
track(event: AnalyticsEvent, properties?: Record<string, unknown>): void
identify(userId: UserId, traits?: Record<string, unknown>): void
reset(): void
```

`AnalyticsEvent` is a string union of the events listed in Section 12.

### 7.6 `src/services/index.ts`

```typescript
export * as authService from './auth.service';
export * as userService from './user.service';
export * as photoService from './photo.service';
export * as scanService from './scan.service';
export * as auditService from './audit.service';
export * as protocolService from './protocol.service';
export * as missionService from './mission.service';
export * as progressService from './progress.service';
export * as reportService from './report.service';
export * as subscriptionService from './subscription.service';
export * as analyticsService from './analytics.service';
```

---

## 8. Mock Data Specifications

Mock data must be realistic enough that the UI looks correct in screenshots. Avoid lorem ipsum. Use the safety-vetted language from Section 13.

### 8.1 `src/mocks/users.mock.ts`

```typescript
import { userId } from '@/types/user.types';
import type { User } from '@/types';

export const MOCK_USER: User = {
  userId: userId('usr_mock_001'),
  email: 'demo@glowops.app',
  displayName: 'Alex',
  createdAt: '2026-04-01T10:00:00Z',
  lastActiveAt: '2026-04-24T08:30:00Z',
  subscriptionTier: 'free',
  onboardingComplete: true,
  ageGateAccepted: true,
  safetyAcknowledgementAccepted: true,
};

export const MOCK_AUTH_RESPONSE = {
  user: MOCK_USER,
  accessToken: 'mock_access_token_abc123',
  refreshToken: 'mock_refresh_token_xyz789',
};
```

### 8.2 `src/mocks/audits.mock.ts`

Mock audit must contain exactly 5 categories ranked by ROI. Use the safety-vetted phrasing from Section 13. Example structure:

```typescript
import type { Audit } from '@/types';

export const MOCK_AUDIT: Audit = {
  auditId: 'aud_mock_001',
  scanId: 'scn_mock_001',
  topImprovements: [
    {
      category: 'photos',
      currentStateLabel: 'Lighting and angle inconsistent',
      fixability: 'very_high',
      estimatedTimeLabel: '1 day',
      rank: 1,
      guidance: 'Photo quality is the fastest unlock. Better lighting and angle selection will improve first impression faster than any product.',
    },
    {
      category: 'hair',
      currentStateLabel: 'Shape could be tighter',
      fixability: 'high',
      estimatedTimeLabel: '1 week',
      rank: 2,
      guidance: 'A cleaner shape and tighter sides would immediately improve presentation. This is highly fixable with the right cut.',
    },
    {
      category: 'style',
      currentStateLabel: 'Fit and color coordination',
      fixability: 'very_high',
      estimatedTimeLabel: '48 hours',
      rank: 3,
      guidance: 'Better-fitting basics in a tighter color palette will outperform expensive pieces that fit poorly.',
    },
    {
      category: 'skin',
      currentStateLabel: 'Texture and consistency',
      fixability: 'medium',
      estimatedTimeLabel: '4–8 weeks',
      rank: 4,
      guidance: 'A consistent three-step routine compounds. Cleanser, moisturizer, SPF — daily, no exceptions.',
    },
    {
      category: 'fitness',
      currentStateLabel: 'Moderate improvement potential',
      fixability: 'high',
      estimatedTimeLabel: '8–12 weeks',
      rank: 5,
      guidance: 'You do not need a full reinvention. Steady protein and a consistent training week will move the needle.',
    },
  ],
  recommendedProtocolType: '30_DAY',
  generatedAt: '2026-04-24T08:35:00Z',
  promptVersion: 'v1.0.0',
  modelVersion: 'mock-vision-v1',
};
```

### 8.3 `src/mocks/protocols.mock.ts`

Provide a 30-day protocol with 3 phases (Days 1–10, 11–20, 21–30), each with `focusAreas` and a `description`.

### 8.4 `src/mocks/missions.mock.ts`

Provide an array of at least 4 missions for "today" with mixed statuses (some PENDING, one COMPLETED to demonstrate state). Pull mission titles from this approved list:

- "Complete morning skincare routine"
- "Take a progress selfie"
- "Walk 8,000 steps"
- "Hit protein target (140g)"
- "Try recommended hairstyle"
- "Clean up neckline"
- "Wear one fitted outfit today"
- "Take five new dating profile photo attempts"
- "Practice posture reset for five minutes"
- "Drink water before coffee"
- "Lay out tomorrow's outfit"

### 8.5 `src/mocks/reports.mock.ts`

Include one INITIAL report and one WEEKLY report. Both have `categoryScores` populated with values 40–80. The `summary` field uses the safety-vetted tone from Section 13.

### 8.6 `src/mocks/scans.mock.ts`

Provide three scans: one `READY` (most recent), one `PROCESSING`, one `FAILED` with a `failureReason` of "Image quality too low. Retake in better lighting."

### 8.7 `src/mocks/subscriptions.mock.ts`

```typescript
import type { PaywallOffering, SubscriptionEntitlement } from '@/types';

export const MOCK_FREE_ENTITLEMENT: SubscriptionEntitlement = {
  tier: 'free',
  isActive: true,
  expiresAt: null,
  willRenew: false,
  productIdentifier: null,
  provisional: false,
};

export const MOCK_PRO_ENTITLEMENT: SubscriptionEntitlement = {
  tier: 'pro',
  isActive: true,
  expiresAt: '2027-04-24T00:00:00Z',
  willRenew: true,
  productIdentifier: 'glowops_pro_annual',
  provisional: false,
};

export const MOCK_PAYWALL_OFFERING: PaywallOffering = {
  offeringId: 'default',
  options: [
    {
      productId: 'glowops_basic_monthly',
      tier: 'basic',
      displayPrice: '$6.99/month',
      pricePerMonth: 6.99,
      billingPeriod: 'monthly',
      trialDays: null,
      features: ['Daily missions', 'Streak tracking', 'Weekly reports'],
      isRecommended: false,
    },
    {
      productId: 'glowops_pro_monthly',
      tier: 'pro',
      displayPrice: '$14.99/month',
      pricePerMonth: 14.99,
      billingPeriod: 'monthly',
      trialDays: 7,
      features: [
        'Full Glow Audit',
        '30-day Protocol',
        'Daily missions',
        'Progress tracking',
        'Dating Profile Mode',
      ],
      isRecommended: true,
    },
    {
      productId: 'glowops_elite_monthly',
      tier: 'elite',
      displayPrice: '$29.99/month',
      pricePerMonth: 29.99,
      billingPeriod: 'monthly',
      trialDays: 7,
      features: [
        'Everything in Pro',
        'Executive Presence Mode',
        '90-day Transformation Protocol',
        'Priority support',
      ],
      isRecommended: false,
    },
  ],
};
```

---

## 9. State Management

### 9.1 Server state — TanStack Query

All data that comes from the API lives in React Query. Configuration in `app/_layout.tsx`:

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60,           // 1 min
      gcTime: 1000 * 60 * 5,          // 5 min
      refetchOnWindowFocus: false,    // RN doesn't have window focus
    },
    mutations: {
      retry: 0,
    },
  },
});
```

### 9.2 Query key conventions

Keys are arrays starting with the entity name, then qualifiers:

```typescript
['user', 'me']
['scan', 'latest']
['scan', scanId]
['audit', 'byScan', scanId]
['protocol', 'active']
['missions', 'today']
['mission', missionId]
['progress', 'overview']
['report', reportId]
['subscription', 'entitlement']
['subscription', 'paywall']
```

### 9.3 Hook implementation pattern

Every query hook follows this template. Hooks unwrap `ApiResult` so React Query gets a plain promise.

```typescript
// src/hooks/queries/useTodayMissions.ts
import { useQuery } from '@tanstack/react-query';
import { missionService } from '@/services';
import type { Mission } from '@/types';

export function useTodayMissions() {
  return useQuery<Mission[], Error>({
    queryKey: ['missions', 'today'],
    queryFn: async () => {
      const result = await missionService.getTodayMissions();
      if (!result.ok) throw new Error(result.error.message);
      return result.data;
    },
  });
}
```

Mutation hook template:

```typescript
// src/hooks/mutations/useCompleteMission.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { missionService } from '@/services';
import type { CompleteMissionRequest, CompleteMissionResponse } from '@/types';

export function useCompleteMission() {
  const qc = useQueryClient();
  return useMutation<CompleteMissionResponse, Error, CompleteMissionRequest>({
    mutationFn: async (req) => {
      const result = await missionService.completeMission(req);
      if (!result.ok) throw new Error(result.error.message);
      return result.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['missions', 'today'] });
      qc.invalidateQueries({ queryKey: ['progress', 'overview'] });
    },
  });
}
```

### 9.4 Client state — Zustand

Three stores. Keep them lean. Anything fetchable belongs in React Query, not Zustand.

#### `src/stores/auth.store.ts`

```typescript
import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import type { User } from '@/types';

type AuthState = {
  user: User | null;
  accessToken: string | null;
  isHydrated: boolean;
  setSession: (user: User, accessToken: string, refreshToken: string) => Promise<void>;
  clearSession: () => Promise<void>;
  hydrate: () => Promise<void>;
};

const ACCESS_KEY = 'glowops.accessToken';
const REFRESH_KEY = 'glowops.refreshToken';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isHydrated: false,
  setSession: async (user, accessToken, refreshToken) => {
    await SecureStore.setItemAsync(ACCESS_KEY, accessToken);
    await SecureStore.setItemAsync(REFRESH_KEY, refreshToken);
    set({ user, accessToken });
  },
  clearSession: async () => {
    await SecureStore.deleteItemAsync(ACCESS_KEY);
    await SecureStore.deleteItemAsync(REFRESH_KEY);
    set({ user: null, accessToken: null });
  },
  hydrate: async () => {
    const accessToken = await SecureStore.getItemAsync(ACCESS_KEY);
    set({ accessToken, isHydrated: true });
  },
}));
```

#### `src/stores/onboarding.store.ts`

Tracks transient onboarding state (which photos uploaded, which steps completed) so a user can resume.

```typescript
type OnboardingState = {
  step: 'welcome' | 'age_gate' | 'safety' | 'photos' | 'audit' | 'done';
  uploadedPhotoIds: PhotoId[];
  setStep: (step: OnboardingState['step']) => void;
  addPhotoId: (id: PhotoId) => void;
  reset: () => void;
};
```

#### `src/stores/ui.store.ts`

Modal/sheet/toast visibility flags only. Nothing else.

---

## 10. Theme System

### 10.1 `src/theme/colors.ts`

```typescript
export const colors = {
  // Backgrounds
  obsidian: '#0B0F14',       // Primary background
  gunmetal: '#121821',       // Cards / panels
  slate: '#1E2935',          // Secondary surfaces

  // Text
  platinum: '#E6E8EB',       // Primary text
  steel: '#9AA4B2',          // Secondary text
  steelDim: '#6B7280',       // Tertiary / disabled

  // Action / status
  electricBlue: '#3B82F6',   // Primary action
  signalGreen: '#30F28A',    // Success / streaks / progress
  amber: '#F59E0B',          // Warning
  crimson: '#EF4444',        // Error

  // Utility
  border: '#2A3441',
  overlay: 'rgba(11, 15, 20, 0.85)',
  transparent: 'transparent',
} as const;

export type ColorToken = keyof typeof colors;
```

### 10.2 `src/theme/typography.ts`

```typescript
export const fontFamilies = {
  sora: 'Sora_600SemiBold',
  soraBold: 'Sora_700Bold',
  inter: 'Inter_400Regular',
  interMedium: 'Inter_500Medium',
  interSemibold: 'Inter_600SemiBold',
  mono: 'JetBrainsMono_500Medium',
  monoBold: 'JetBrainsMono_700Bold',
} as const;

export const fontSizes = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  xxl: 32,
  display: 44,
} as const;

export const lineHeights = {
  tight: 1.2,
  normal: 1.4,
  relaxed: 1.6,
} as const;

export const textStyles = {
  display: { fontFamily: fontFamilies.soraBold, fontSize: fontSizes.display, lineHeight: fontSizes.display * 1.1 },
  h1: { fontFamily: fontFamilies.soraBold, fontSize: fontSizes.xxl, lineHeight: fontSizes.xxl * 1.2 },
  h2: { fontFamily: fontFamilies.sora, fontSize: fontSizes.xl, lineHeight: fontSizes.xl * 1.25 },
  h3: { fontFamily: fontFamilies.sora, fontSize: fontSizes.lg, lineHeight: fontSizes.lg * 1.3 },
  body: { fontFamily: fontFamilies.inter, fontSize: fontSizes.base, lineHeight: fontSizes.base * 1.5 },
  bodyMedium: { fontFamily: fontFamilies.interMedium, fontSize: fontSizes.base, lineHeight: fontSizes.base * 1.5 },
  caption: { fontFamily: fontFamilies.inter, fontSize: fontSizes.sm, lineHeight: fontSizes.sm * 1.4 },
  label: { fontFamily: fontFamilies.interMedium, fontSize: fontSizes.sm, lineHeight: fontSizes.sm * 1.3 },
  button: { fontFamily: fontFamilies.interSemibold, fontSize: fontSizes.base, lineHeight: fontSizes.base * 1.2 },
  stat: { fontFamily: fontFamilies.monoBold, fontSize: fontSizes.xl, lineHeight: fontSizes.xl * 1.1 },
  statLarge: { fontFamily: fontFamilies.monoBold, fontSize: fontSizes.display, lineHeight: fontSizes.display * 1.05 },
} as const;

export type TextStyleVariant = keyof typeof textStyles;
```

### 10.3 `src/theme/spacing.ts`

```typescript
// 4pt grid
export const spacing = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  huge: 64,
} as const;

export type SpacingToken = keyof typeof spacing;
```

### 10.4 `src/theme/radius.ts`

```typescript
export const radius = {
  none: 0,
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  pill: 999,
} as const;
```

### 10.5 `src/theme/shadows.ts`

```typescript
import { Platform } from 'react-native';

export const shadows = {
  none: {},
  card: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
    },
    android: { elevation: 3 },
    default: {},
  }),
  elevated: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.35,
      shadowRadius: 16,
    },
    android: { elevation: 8 },
    default: {},
  }),
} as const;
```

### 10.6 `src/theme/index.ts`

```typescript
export { colors } from './colors';
export { fontFamilies, fontSizes, textStyles, type TextStyleVariant } from './typography';
export { spacing } from './spacing';
export { radius } from './radius';
export { shadows } from './shadows';

export const theme = {
  colors,
  textStyles,
  spacing,
  radius,
  shadows,
} as const;

export type Theme = typeof theme;
```

### 10.7 `src/hooks/useTheme.ts`

```typescript
import { theme, type Theme } from '@/theme';
export const useTheme = (): Theme => theme;
```

(For MVP the theme is static. This hook exists so that adding light mode later requires zero component changes.)

---

## 11. Component Library

### 11.1 Primitives — `src/components/primitives/`

These are the building blocks. Every other component is composed from these. Implement them first.

#### `Text.tsx`
Wraps RN `Text`. Required prop: `variant: TextStyleVariant`. Optional: `color: ColorToken`, `align`, `numberOfLines`. Never style typography directly elsewhere — always use this.

#### `Button.tsx`
Variants: `primary | secondary | ghost | destructive`. Sizes: `sm | md | lg`. Required: `label`, `onPress`. Optional: `loading`, `disabled`, `iconLeft`, `iconRight`, `fullWidth`. Triggers light haptic on press.

#### `Card.tsx`
A surface with `gunmetal` background, `radius.lg`, optional `shadows.card`. Props: `padding: SpacingToken` (default `base`), `onPress` (becomes pressable if provided).

#### `Input.tsx`
Wraps `TextInput`. Props: `label`, `value`, `onChangeText`, `placeholder`, `error`, `secureTextEntry`, `keyboardType`, `autoCapitalize`. Renders error text below in `crimson`.

#### `Screen.tsx`
Top-level wrapper. Applies `SafeAreaView`, `obsidian` background, optional `scrollable` prop. Required for every route file.

#### `Stack.tsx` / `Row.tsx`
Layout helpers. Props: `gap: SpacingToken`, `align`, `justify`. Stack is vertical, Row is horizontal.

#### `Spacer.tsx`
Single prop: `size: SpacingToken`. Renders an empty `View` of that size.

#### `Divider.tsx`
1px line in `border` color. Optional `vertical` prop.

#### `Badge.tsx`
Pill with text. Variants: `success | warning | error | neutral | info`.

#### `IconButton.tsx`
Pressable icon. Props: `icon: LucideIcon`, `onPress`, `size`, `color`.

#### `LoadingState.tsx`
Centered spinner with optional `message` prop. Use for screen-level loading.

#### `ErrorState.tsx`
Centered error display. Props: `error: Error`, `onRetry?: () => void`.

#### `EmptyState.tsx`
Centered. Props: `icon?: LucideIcon`, `title`, `message`, `cta?: { label: string; onPress: () => void }`.

#### `Skeleton.tsx`
Animated shimmer placeholder. Props: `width`, `height`, `radius`. Use inside content while data loads (e.g., placeholders for mission cards).

### 11.2 Domain components — required deliverables

Each component below must exist as its own file. Props listed are the minimum contract.

| Component | Path | Props |
|---|---|---|
| `AuditCategoryCard` | `audit/AuditCategoryCard.tsx` | `result: AuditCategoryResult`, `onPress?: () => void` |
| `FixabilityBadge` | `audit/FixabilityBadge.tsx` | `level: FixabilityLevel` |
| `ProtocolTimeline` | `protocol/ProtocolTimeline.tsx` | `protocol: Protocol` |
| `PhaseCard` | `protocol/PhaseCard.tsx` | `phase: ProtocolPhase`, `currentDay: number` |
| `MissionCard` | `mission/MissionCard.tsx` | `mission: Mission`, `onComplete: () => void`, `onPress: () => void` |
| `MissionChecklist` | `mission/MissionChecklist.tsx` | `missions: Mission[]`, `onComplete: (id: MissionId) => void` |
| `StreakBar` | `mission/StreakBar.tsx` | `streak: Streak` |
| `BeforeAfterSlider` | `progress/BeforeAfterSlider.tsx` | `beforeUri: string`, `afterUri: string` |
| `ProgressRing` | `progress/ProgressRing.tsx` | `value: number` (0–100), `size: number`, `label?: string` |
| `ScoreTrend` | `progress/ScoreTrend.tsx` | `score: CategoryScore` |
| `PhotoUploadSlot` | `photo/PhotoUploadSlot.tsx` | `kind: PhotoKind`, `photo?: Photo`, `onPick: () => void` |
| `PhotoGrid` | `photo/PhotoGrid.tsx` | `photos: Photo[]`, `columns?: number` |
| `TierCard` | `paywall/TierCard.tsx` | `option: PricingOption`, `onSelect: () => void` |
| `PaywallSheet` | `paywall/PaywallSheet.tsx` | `offering: PaywallOffering`, `onPurchase: (productId: string) => void`, `onDismiss: () => void` |
| `BlurredPaywallOverlay` | `paywall/BlurredPaywallOverlay.tsx` | `children: ReactNode`, `cta: string`, `onUnlock: () => void` |

### 11.3 Component implementation rules

1. Every component has its `Props` type exported.
2. Every component handles a missing/null/undefined prop gracefully (no crashes from optional data).
3. All async actions trigger appropriate haptics (`useHaptics`).
4. Tappable areas are minimum 44x44pt (Apple HIG).
5. All text passes through `<Text variant="..." />`. No raw RN `<Text>`.
6. All colors come from theme tokens. No hex literals in components.

---

## 12. Screens — Acceptance Criteria

Each screen below has explicit acceptance criteria. A screen is "done" when every checkbox is satisfied.

### 12.1 `app/_layout.tsx` — Root layout

Responsibilities:
- Load Google Fonts (Inter, Sora, JetBrains Mono). Show splash until loaded.
- Wrap entire tree in `QueryClientProvider`, `SafeAreaProvider`, `GestureHandlerRootView`.
- Hydrate auth store on mount.
- Render `<Stack>` from `expo-router`.

**Acceptance:**
- [ ] App launches without warnings.
- [ ] Fonts visibly loaded before first paint.
- [ ] Auth hydration completes before any auth-gated route renders.

### 12.2 `app/index.tsx` — Entry redirect

Responsibilities:
- Wait for `useAuthStore.isHydrated`.
- If no `accessToken`: `router.replace('/(auth)/sign-in')`.
- If authenticated and `!user.onboardingComplete`: `router.replace('/(onboarding)/welcome')`.
- Otherwise: `router.replace('/(app)/home')`.

### 12.3 `(auth)/sign-up.tsx` and `(auth)/sign-in.tsx`

Form fields: email, password. Use `react-hook-form` + `zod` schema. Submit calls `authService.signUp` / `signIn` via mutation hook. On success, set session via `useAuthStore.setSession`, then `router.replace('/')`.

**Acceptance:**
- [ ] Validation errors show inline.
- [ ] Submit button shows loading state during mutation.
- [ ] Failed sign-in shows toast with error message.
- [ ] Sign-in/sign-up screens link to each other.

### 12.4 `(onboarding)/welcome.tsx`

- Display: app logo, headline "Build your Glow Protocol.", subtext "Upload a few photos. Get a private appearance audit and a step-by-step improvement plan.", CTA "Start Audit".
- CTA navigates to `age-gate`.

### 12.5 `(onboarding)/age-gate.tsx`

- Headline: "Are you 18 or older?"
- Two buttons: "Yes, I'm 18+" and "No".
- "Yes" calls `userService.updateUser({ ageGateAccepted: true })`, then navigates to `safety`.
- "No" navigates to a soft-block screen with copy: "GlowOps is currently 18+." No further nav.

### 12.6 `(onboarding)/safety.tsx`

Display the safety acknowledgement (copy in Section 13). Single CTA "I understand". Calls `updateUser({ safetyAcknowledgementAccepted: true })`, then navigates to `photo-upload`.

### 12.7 `(onboarding)/photo-upload.tsx`

Four `PhotoUploadSlot`s for: front selfie, side profile, full body, optional beard/hair. CTA "Continue" enabled when at least the first three are filled.

On CTA: for each slot, call `photoService.uploadPhoto`. Then call `scanService.createScan({ photoIds })`. Navigate to `audit-loading` with the returned `scanId`.

**Acceptance:**
- [ ] Slots show preview after photo picked.
- [ ] CTA disabled until 3 required photos present.
- [ ] Upload progress visible per slot.
- [ ] Errors per-slot don't block other slots.

### 12.8 `(onboarding)/audit-loading.tsx`

Display 4 status steps from Section 12 of the product spec ("Checking photo quality" → "Mapping improvement areas" → "Ranking highest-ROI changes" → "Building your protocol"). Animate progression over ~3 seconds (mock-only — real implementation polls scan status).

When mock "completes," fetch audit via `auditService.getAuditByScan`, then navigate to `/audit-result`.

### 12.9 `app/audit-result.tsx`

Show top 3 audit categories fully (using `AuditCategoryCard`). Show categories 4–5 wrapped in `<BlurredPaywallOverlay>` with CTA "Unlock Full Protocol". CTA navigates to `/paywall`.

**Acceptance:**
- [ ] Top 3 cards readable, ranked.
- [ ] Bottom 2 cards visibly blurred.
- [ ] Paywall CTA prominent.

### 12.10 `app/paywall.tsx`

Render `<PaywallSheet>` with the offering from `usePaywallOffering()`. On tier select, the screen needs a `receiptToken` to call `purchase`. There are two regimes:

1. **Pre-cutover (mock backend, USE_MOCKS=true).** No real RevenueCat SDK is wired. Pass `receiptToken: 'mock_receipt'` to the mutation. The mock service returns `MOCK_PRO_ENTITLEMENT` immediately.
2. **Post-cutover (real backend).** The mobile app must initialize the RevenueCat SDK at startup with `appUserID` set to the GlowOps `userId` (from `useAuthStore`). Tapping a tier calls the RevenueCat SDK's `purchaseProduct(productId)`, which returns a transaction with a token. Pass that token as `receiptToken`. See §15 (Backend Cutover) for the full cutover steps.

In both regimes, after `purchase` resolves successfully:
- Update the entitlement query (the `usePurchase` mutation already invalidates `['subscription', 'entitlement']`).
- `router.replace('/(app)/home')`.
- Track `subscription_started`.

**On `provisional` entitlement state.** The backend writes a provisional row immediately on `purchase` and reconciles via webhook within 1–5 seconds. The mobile app treats provisional and authoritative tiers identically for gating features — a `pro` provisional entitlement unlocks Pro features. The only place provisional matters in the UI is the Profile screen subscription row (see §12.16), which can show a subtle "Confirming…" suffix while `entitlement.provisional === true`.

Include "Restore purchases" link calling `restorePurchases`. Pre-cutover this is a no-op returning `MOCK_PRO_ENTITLEMENT`. Post-cutover it triggers the RevenueCat SDK's restore flow, which itself fires a webhook to our backend if missing entitlements are discovered.

### 12.11 `(app)/_layout.tsx` — Tab bar

Five tabs: Home, Protocol, Camera, Progress, Profile. Use lucide icons: `Home`, `ListChecks`, `Camera`, `TrendingUp`, `User`. Active color `electricBlue`, inactive `steel`.

### 12.12 `(app)/home.tsx`

Sections (in order):
1. Greeting: "Good morning, {displayName}." (time-of-day aware)
2. `StreakBar` showing current streak.
3. "Today's missions" — `MissionChecklist` with `useTodayMissions`.
4. "Active protocol" — small card with `ProgressRing` (currentDay / totalDays).
5. "Weekly insight" — top score trend card.

### 12.13 `(app)/protocol.tsx`

- Top: type + status + day count (e.g., "30-Day Glow-Up · Day 12 of 30").
- `ProtocolTimeline` showing all phases.
- Tappable `PhaseCard` for each phase — current phase highlighted.
- Empty state if no active protocol with CTA "Start your protocol" → `/audit-result`.

### 12.14 `(app)/camera.tsx`

Three options as large cards:
1. "Take progress photo" — opens camera, on capture calls `photoService.uploadPhoto` with kind `selfie_front`.
2. "Upload dating profile photos" — opens picker (multi-select).
3. "Compare before / after" — navigates to a sub-screen with `BeforeAfterSlider`.

### 12.15 `(app)/progress.tsx`

Sections:
1. Streak (large mono number).
2. Weekly progress chart — list of `WeeklyProgress` items with mission completion bar.
3. Score trends — `ScoreTrend` per category.
4. Reports — list of past reports (`useQuery(['reports'])`), tappable to `/report/[id]`.

### 12.16 `(app)/profile.tsx`

Rows (each tappable, no-op or stub navigation acceptable for MVP):
- Subscription — shows current tier from `useSubscription()`. Format: `"Subscription · Pro"` for active paid tiers, `"Subscription · Free"` for free, `"Subscription · Pro · Confirming…"` when `entitlement.provisional === true`. Tapping the row when tier is `'free'` opens `/paywall`; otherwise no-op for MVP (real "manage subscription" flow opens the platform's subscription management screen — defer per §17).
- Notifications
- Privacy & data
- Safety settings
- Sign out (calls `clearSession`, redirects to sign-in)
- Delete account (confirmation modal → `userService.deleteAccount`)

**On the "Confirming…" suffix.** When the user just bought Pro via the optimistic path, `provisional` is `true` for 1–5 seconds before the webhook reconciles. The Profile row is the only screen that surfaces this state. Refetch the entitlement query every 5 seconds (via `useSubscription`'s `refetchInterval` option, but only while `provisional === true`) so the suffix disappears once the webhook lands. Do not block any feature gates on `provisional` — a provisional `pro` entitlement unlocks all Pro features identically.

**On `deleteAccount`.** This call destroys the user's data on the backend (DDB rows, S3 prefix, Cognito user — see backend.md §11.3) and is irreversible. The confirmation modal must use the destructive-action pattern: red CTA labeled "Permanently delete account", secondary "Cancel". After `userService.deleteAccount` resolves, immediately call `useAuthStore.clearSession()` and `router.replace('/')` — do not show a success toast (the user is gone; nothing to confirm to).

### 12.17 `app/mission/[id].tsx`

- Shows mission title, description, category badge, estimated minutes.
- Two CTAs: "Mark complete" (calls `useCompleteMission`, on success show "+1% better. Keep stacking." haptic notification, then `router.back()`) and "Skip for today".

### 12.18 `app/report/[id].tsx`

- Render summary, category scores as horizontal bars.
- "Share" button calls `reportService.generateShareCard` and opens native share sheet.

---

## 13. Voice, Tone, and Safety Copy

These exact phrases must appear in mock data and copy. The agent must not rewrite them.

### 13.1 Allowed vocabulary
- "Highest-ROI improvement area"
- "Presentation score"
- "Photo quality"
- "Grooming consistency"
- "Style fit"
- "Hair shape opportunity"
- "First impression improvement"
- "Highly fixable"
- "Small wins compound"

### 13.2 Forbidden vocabulary
The following strings must not appear anywhere in the codebase, including mock data, comments, and placeholder text:
- Any rating like "X/10" applied to a person
- "ugly", "unattractive", "low value", "subhuman", "incel", "chad", "mogged", "PSL"
- "You need surgery"
- "Your genetics are bad"
- "weak jawline", "weak chin"

### 13.3 Approved tone examples
Use these as templates for any new mock copy:
- "Your photo quality is the biggest unlock. Better lighting and angle selection will improve first impression faster than any product."
- "This is highly fixable. Start with the 14-day reset."
- "You do not need a full reinvention. You need better execution."
- "Mission complete. Small wins compound."
- "+1% better. Keep stacking."

### 13.4 Safety acknowledgement copy (for `safety.tsx`)
```
GlowOps gives you guidance, not medical advice.

We do not recommend surgery, steroids, SARMs, extreme dieting, or any
unsafe modification. If you're struggling with body image or mental
health, please speak with a qualified professional.

Your photos stay private. We do not post, sell, or train models on
your images without explicit consent.
```

### 13.5 Privacy copy (for `profile.tsx` data section)
```
Your photos are private by default. GlowOps does not post, sell, or
expose your images. You control your data.
```

---

## 14. Analytics Events

Track via `analyticsService.track`. The full event union for `AnalyticsEvent`:

```typescript
export type AnalyticsEvent =
  | 'app_opened'
  | 'sign_up_started'
  | 'sign_up_completed'
  | 'sign_in_completed'
  | 'onboarding_started'
  | 'onboarding_step_completed'
  | 'onboarding_completed'
  | 'age_gate_accepted'
  | 'age_gate_declined'
  | 'safety_acknowledged'
  | 'photo_picked'
  | 'photo_uploaded'
  | 'scan_created'
  | 'audit_started'
  | 'audit_completed'
  | 'audit_result_viewed'
  | 'paywall_viewed'
  | 'paywall_dismissed'
  | 'tier_selected'
  | 'subscription_started'
  | 'subscription_restored'
  | 'protocol_started'
  | 'mission_viewed'
  | 'mission_completed'
  | 'mission_skipped'
  | 'streak_started'
  | 'streak_extended'
  | 'streak_broken'
  | 'progress_viewed'
  | 'report_viewed'
  | 'report_shared'
  | 'sign_out';
```

For MVP, the `analyticsService` mock implementation logs to `console.log('[analytics]', event, properties)`. No network calls.

---

## 15. Backend Cutover (Future Work — Not Part of MVP Build)

This section documents what the *next* agent does after the backend is deployed. The current build leaves `USE_MOCKS=true` and ships against fake data only. Cutover happens when `backend.md`'s smoke test (§16.3) passes.

The cutover is intentionally a small, mechanical change set. The mock/real split inside every service file in §7.1 is the seam — flipping the env flag swaps every mock implementation for a real one in one config change. The other tasks below add the real implementations.

### 15.1 Cutover steps

1. **Read backend outputs.** From the deployed backend stack, collect:
   - `GraphqlUrl` — AppSync endpoint
   - `UserPoolId` — Cognito user pool ID
   - `UserPoolClientId` — Cognito app client ID
   - `MediaBucketName` — for any direct S3 references (rare; usually only the worker Lambda touches this)

2. **Edit `src/config/env.ts`.** Set `USE_MOCKS: false`. Add fields for `COGNITO_USER_POOL_ID`, `COGNITO_CLIENT_ID`, and update `API_BASE_URL` to the AppSync URL. Read these from environment variables loaded via `expo-constants` so dev/prod can differ without code changes.

3. **Add Cognito SDK.** Install `amazon-cognito-identity-js`. Implement the `_realImpl` functions in `src/services/auth.service.ts`:
   - `signUp` → `userPool.signUp(...)`
   - `signIn` → `cognitoUser.authenticateUser(...)`
   - `signOut` → `cognitoUser.signOut()`
   - `refreshToken` → `cognitoUser.refreshSession(...)`

   On successful sign-in, the access token contains the `userId` and `subscriptionTier` claims (injected by the backend's pre-token-generation Lambda — see `backend.md` §11.2). Store the access token via `useAuthStore.setSession`.

4. **Add a real GraphQL HTTP client.** Replace the stub in `src/services/http/client.ts` with a real implementation. Recommended: a thin wrapper around native `fetch` that:
   - Posts to `env.API_BASE_URL` with content-type `application/json`
   - Adds `Authorization: <accessToken>` from `useAuthStore.getState().accessToken`
   - Sends `{ query, variables }` payloads
   - Maps GraphQL errors to the `ApiError` shape from `@/types`
   - Handles 401 by clearing the session and triggering re-auth

5. **Wire each service's `_realImpl`.** For every service in `src/services/*.service.ts`, replace the throwing stub with a call to the new HTTP client using the corresponding GraphQL query/mutation from `backend.md` §5. Type contracts already match — no new types needed.

6. **Add AppSync subscriptions.** For real-time scan updates, mission updates, and report-ready events, wire AppSync subscriptions via the `aws-appsync` SDK or a websocket library. The relevant queries are in `backend.md` §5 under `Subscription`. The audit-loading screen (§12.8) should switch from polling to subscribing when this is wired.

7. **Initialize RevenueCat SDK.** Install `react-native-purchases`. At app startup (after sign-in completes):
   ```ts
   await Purchases.configure({ apiKey: '<RevenueCat public SDK key>', appUserID: user.userId });
   ```
   The `appUserID` MUST be the GlowOps `userId` — this is what guarantees the webhook events route to the correct user on the backend (`backend.md` §11.11).

8. **Wire `purchase` in `subscription.service.ts`'s `_realImpl`.** Call `Purchases.purchaseProduct(productId)`, extract the receipt token from the result, and pass it to the GraphQL `purchase` mutation. The backend writes a provisional Subscription row immediately and the webhook reconciles within seconds.

9. **Run TASK-047 smoke test against the live backend.** Every step of the existing mobile smoke test should still pass; failures indicate a contract mismatch between mock and real that must be reconciled.

### 15.2 What does NOT change at cutover

- All `src/types/` contracts — they're already the source of truth.
- All `src/components/` — components consume types, not services directly.
- All `src/hooks/queries/` and `src/hooks/mutations/` — they wrap services; the swap is transparent.
- All screens — they use hooks, not services directly.
- All mock data files — they remain as fixtures for future testing and Storybook-style component review.

### 15.3 Rollback

If a deployed cutover misbehaves, the rollback is a one-line revert: set `USE_MOCKS: true` and ship an OTA update via Expo. The app immediately returns to mock data with no further changes needed. This is why the swap path is tested as part of TASK-048.

---

## 16. Build Order (Linear Task List)

Execute in this exact order. After each task, run `npm run typecheck`.

1. **Project config** — Adapt the pre-initialized scaffold per `tasks.md` TASK-001: enable strict TS, add `@/*` alias, wire Expo Router (`main` field, `app.json` plugin and scheme), delete `App.tsx`.
2. **Theme** — Create all files in `src/theme/`. Verify `useTheme` returns valid object.
3. **Types** — Create all files in `src/types/`. Verify barrel exports compile.
4. **Mocks** — Create all files in `src/mocks/`. Each mock conforms to its type.
5. **Services** — Create all files in `src/services/`. Wire mock + real impls per template in 7.1. Verify each service function returns correct mock when called from a Node test (`node -e` against compiled JS, or a temporary `__test__` script).
6. **Stores** — Create `src/stores/`. Verify Zustand stores instantiate without error.
7. **Query / mutation hooks** — Create `src/hooks/queries/` and `src/hooks/mutations/`.
8. **Primitives** — Build all components in `src/components/primitives/` per Section 11.1.
9. **Domain components** — Build all components listed in Section 11.2.
10. **Root layout** — Build `app/_layout.tsx` with providers, font loading, hydration.
11. **Auth screens** — Build `(auth)/sign-in.tsx`, `(auth)/sign-up.tsx`.
12. **Onboarding flow** — Build all `(onboarding)/*` screens.
13. **Audit + paywall** — Build `audit-result.tsx`, `paywall.tsx`.
14. **Tab layout + tab screens** — Build `(app)/_layout.tsx` and the five tabs.
15. **Detail screens** — Build `mission/[id].tsx`, `report/[id].tsx`.
16. **Smoke test** — Click through the entire flow listed in Section 0 acceptance criteria.

---

## 17. What Not to Build (Out of Scope for This Pass)

- Real API integration (defer until backend ready — see §15)
- Real RevenueCat setup (use mock entitlement — see §15)
- Real PostHog setup (use console.log)
- Push notifications (configuration only — no real APNs/FCM keys)
- Light mode
- Internationalization
- Accessibility audit beyond minimums (touch targets, semantic labels)
- Unit tests (typecheck + smoke test only for this pass)
- App store assets, splash variants beyond Expo defaults
- Deep links beyond Expo Router defaults

When the agent encounters a request to build any of the above, leave a `// TODO(agent): out of scope per mobile_app.md §17` comment and move on.

---

## 18. Final Handoff Checklist

Before declaring the build complete, verify:

- [ ] `npm run typecheck` exits 0.
- [ ] `npm run lint` exits 0.
- [ ] `npx expo start` opens without console errors.
- [ ] Every route in Section 4 file tree exists.
- [ ] Every type in Section 6 exists and is exported from `@/types`.
- [ ] Every service function in Section 7.5 exists and returns mock data.
- [ ] Every component in Section 11.2 exists and renders without crashing when given mock data.
- [ ] Every screen in Section 12 satisfies its acceptance criteria.
- [ ] Searching the codebase for any string from Section 13.2 (forbidden vocabulary) returns zero matches.
- [ ] Searching the codebase for `import.*from.*mocks` outside `src/services/` returns zero matches.
- [ ] Flipping `env.USE_MOCKS` to `false` causes API calls to throw (proving the swap path works).
