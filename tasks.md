# GlowOps Mobile — Agent Task List

> **Companion to `mobile_app.md`.** This file decomposes the build into discrete tickets. Each ticket has a single owner (the agent), explicit inputs, explicit outputs, and a verification step. Tickets are ordered by dependency — do not start a ticket whose predecessors are not complete and verified.

> **How to use:** Pick the lowest-numbered unfinished ticket. Read its `Inputs`. Produce its `Outputs`. Run its `Verify` command. Only then move to the next ticket. If `Verify` fails, fix before proceeding — do not accumulate broken state.

> **Project state when the agent starts.** The repo root is the project root. A blank Expo TypeScript scaffold has already been created (`npx create-expo-app@latest glowops --template blank-typescript`) and the dependency list from `mobile_app.md` §3 is already installed. `mobile_app.md` and `tasks.md` live at the repo root alongside `package.json`. The agent's first task is to adapt this scaffold to match the spec — NOT to re-initialize the project.

> **Conventions for every ticket:**
> - `Inputs` = files you must read before starting (always includes the relevant section of `mobile_app.md`).
> - `Outputs` = files you must create or modify, with exact paths.
> - `Verify` = the exact shell command(s) that must exit 0, plus any manual check.
> - `Done when` = the binary condition that means the ticket is closed.

---

## Phase 0 — Project Foundation

### TASK-001 — Configure project scaffold for Expo Router and strict TS

**Inputs:**
- `mobile_app.md` §3 (verify dependency list)
- `mobile_app.md` §4 (project structure target)
- `mobile_app.md` §5 (conventions, particularly path aliases)

**Pre-checks (do these first; if any fail, fix before continuing):**

```bash
# Confirm we're in the project root
test -f app.json && test -f package.json && test -f tsconfig.json || { echo "Not in project root"; exit 1; }

# Confirm core deps installed
node -e "const p=require('./package.json').dependencies; const req=['expo','expo-router','react-native','@tanstack/react-query','zustand','react-hook-form','zod','lucide-react-native','expo-image','expo-image-picker','expo-camera','expo-secure-store','expo-haptics','@react-native-async-storage/async-storage']; const missing=req.filter(r=>!p[r]); if(missing.length){console.error('MISSING:',missing.join(', '));process.exit(1)}else{console.log('OK')}"
```

If deps are missing, install via `npx expo install <pkg>` (for Expo-managed) or `npm install <pkg>`. **Never run `npx create-expo-app` again — it wipes the project.**

**Outputs:**

1. **`tsconfig.json`** — extend the Expo base, enable strict mode, configure the `@/*` path alias:
   ```json
   {
     "extends": "expo/tsconfig.base",
     "compilerOptions": {
       "strict": true,
       "baseUrl": ".",
       "paths": { "@/*": ["./src/*"] }
     },
     "include": ["**/*.ts", "**/*.tsx", ".expo/types/**/*.ts", "expo-env.d.ts"]
   }
   ```

2. **`app.json`** — add Expo Router config:
   - Set `expo.scheme` to `"glowops"`
   - Add `"expo-router"` to `expo.plugins`
   - Set `expo.experiments.typedRoutes` to `true`

3. **`package.json`** — change `"main"` from the default `"node_modules/expo/AppEntry.js"` (or `"index.ts"`) to `"expo-router/entry"`. This is required by Expo Router.

4. **`babel.config.js`** — confirm it uses `babel-preset-expo`. The default Expo Router config does not need additional plugins, but if Reanimated is in use add `'react-native-reanimated/plugin'` as the LAST plugin.

5. **`.env`** — create at the project root with `USE_MOCKS=true`. Note: Expo only reads env vars prefixed with `EXPO_PUBLIC_` into the client bundle. For internal flags read in code (like `USE_MOCKS`), the value is read directly from the `src/config/env.ts` module and not from `process.env` at runtime — the `.env` file is informational for now and will become operationally meaningful at backend cutover.

6. **`.eslintrc.js`** — extend `eslint-config-expo`:
   ```js
   module.exports = { extends: ['expo'], ignorePatterns: ['/dist/*'] };
   ```

7. **`.prettierrc`** — minimal:
   ```json
   { "singleQuote": true, "trailingComma": "all", "printWidth": 100 }
   ```

8. **Delete `App.tsx`** at the project root if it exists (Expo Router replaces it with `app/_layout.tsx`, which TASK-030 will create).

**Verify:**
```bash
# TypeScript strict mode and alias resolution:
npx tsc --noEmit
# Confirm app.json has expo-router plugin:
node -e "const c=require('./app.json'); const ok=c.expo.plugins?.some(p=>p==='expo-router'||(Array.isArray(p)&&p[0]==='expo-router')); console.log(ok?'OK':'FAIL')"
# Confirm main entry:
node -e "console.log(require('./package.json').main==='expo-router/entry'?'OK':'FAIL')"
# App boots without runtime error (Ctrl+C immediately after the QR appears):
# npx expo start
```

**Done when:** All four shell checks pass and `npx expo start` displays the dev server prompt without errors. (Manual visual check on the dev server prompt is acceptable; the spec does not require launching to a device at this stage.)

---

### TASK-002 — Create directory skeleton

**Inputs:**
- `mobile_app.md` §4 (Project Structure)

**Outputs:**
- Every directory listed in §4 exists
- Empty directories contain a `.gitkeep` file
- `assets/images/placeholder.png` exists (1×1 transparent PNG — generate with imagemagick or download a known transparent PNG)

**Verify:**
```bash
find . -type d -not -path '*/node_modules/*' -not -path '*/.git/*' | sort
```
Output must include every directory from §4.

**Done when:** `tree -L 3 -I node_modules` matches the structure in §4.

---

### TASK-003 — Theme module

**Inputs:**
- `mobile_app.md` §10 (Theme System)

**Outputs:**
- `src/theme/colors.ts` — verbatim from §10.1
- `src/theme/typography.ts` — verbatim from §10.2
- `src/theme/spacing.ts` — verbatim from §10.3
- `src/theme/radius.ts` — verbatim from §10.4
- `src/theme/shadows.ts` — verbatim from §10.5
- `src/theme/index.ts` — verbatim from §10.6
- `src/hooks/useTheme.ts` — verbatim from §10.7

**Verify:**
```bash
npx tsc --noEmit
```
Must exit 0.

**Done when:** Importing `import { theme } from '@/theme'` in any file resolves and contains `colors`, `textStyles`, `spacing`, `radius`, `shadows` keys.

---

## Phase 1 — Contracts

### TASK-004 — Type contracts

**Inputs:**
- `mobile_app.md` §6 (Type Contracts)

**Outputs:**
- `src/types/api.types.ts` — verbatim from §6.1
- `src/types/user.types.ts` — verbatim from §6.2
- `src/types/photo.types.ts` — verbatim from §6.3
- `src/types/scan.types.ts` — verbatim from §6.4
- `src/types/audit.types.ts` — verbatim from §6.5
- `src/types/protocol.types.ts` — verbatim from §6.6
- `src/types/mission.types.ts` — verbatim from §6.7
- `src/types/progress.types.ts` — verbatim from §6.8
- `src/types/report.types.ts` — verbatim from §6.9
- `src/types/subscription.types.ts` — verbatim from §6.10
- `src/types/index.ts` — verbatim from §6.11 (barrel)

**Verify:**
```bash
npx tsc --noEmit
```
Must exit 0.

**Done when:** `import { User, Audit, Mission, Protocol, Report } from '@/types'` resolves with no errors in a scratch file.

---

### TASK-005 — Config and environment

**Inputs:**
- `mobile_app.md` §7.2 (env)

**Outputs:**
- `src/config/env.ts` — verbatim from §7.2
- `src/config/constants.ts` — exports `PROTOCOL_LENGTHS = ['14_DAY', '30_DAY', '90_DAY'] as const` and `MISSION_CATEGORIES` (the full `ImprovementCategory` union as a runtime array)

**Verify:**
```bash
npx tsc --noEmit
```

**Done when:** `env.USE_MOCKS` is `true` at runtime.

---

### TASK-006 — Utility modules

**Inputs:** None new — implement to support later tasks.

**Outputs:**
- `src/utils/id.ts` — exports `generateId(prefix: string): string` returning `${prefix}_${random12chars}`. No external deps; use `Math.random()` + `Date.now()`.
- `src/utils/date.ts` — exports `formatDate(iso: string): string` (e.g. "Apr 24, 2026"), `formatDateShort(iso: string): string` ("4/24"), `daysBetween(a: string, b: string): number`, `todayYmd(): string` ("YYYY-MM-DD").
- `src/utils/format.ts` — exports `formatScore(n: number): string` (zero-padded, e.g. "07"), `formatDuration(minutes: number): string` ("5 min", "1 hr 20 min"), `formatStreak(days: number): string` ("12-day streak").
- `src/utils/validation.ts` — exports zod schemas: `signUpSchema`, `signInSchema`, `displayNameSchema`. Email + password (min 8) for the first two.

**Verify:**
```bash
npx tsc --noEmit
```

**Done when:** All four files exist and compile.

---

## Phase 2 — Mock Data

### TASK-007 — Mock data fixtures

**Inputs:**
- `mobile_app.md` §8 (Mock Data Specifications)
- `mobile_app.md` §13 (Voice/Tone — copy must comply)

**Outputs:**
- `src/mocks/users.mock.ts` — verbatim from §8.1
- `src/mocks/audits.mock.ts` — verbatim from §8.2
- `src/mocks/protocols.mock.ts` — must include one `MOCK_PROTOCOL: Protocol` of type `30_DAY`, status `ACTIVE`, with 3 phases (days 1–10, 11–20, 21–30) covering focusAreas pulled from §8.2's audit
- `src/mocks/missions.mock.ts` — must export `MOCK_TODAY_MISSIONS: Mission[]` with at least 4 missions for `todayYmd()`, statuses mixed (3 PENDING, 1 COMPLETED), titles drawn only from §8.4's approved list
- `src/mocks/scans.mock.ts` — three scans: `MOCK_SCAN_READY`, `MOCK_SCAN_PROCESSING`, `MOCK_SCAN_FAILED` per §8.6
- `src/mocks/reports.mock.ts` — `MOCK_INITIAL_REPORT` and `MOCK_WEEKLY_REPORT` per §8.5; both have `categoryScores` populated with 5 categories scoring 40–80
- `src/mocks/subscriptions.mock.ts` — verbatim from §8.7

**Verify:**
```bash
npx tsc --noEmit
# Then verify no forbidden vocabulary leaked in:
grep -rE "(ugly|subhuman|low value|incel|chad|mogged|PSL|weak jaw)" src/mocks/ && echo "FAIL: forbidden vocab found" || echo "OK"
```

**Done when:** All mocks compile, conform to their types, and grep returns "OK".

---

## Phase 3 — Service Layer

### TASK-008 — HTTP infrastructure

**Inputs:**
- `mobile_app.md` §7.1, §7.3, §7.4

**Outputs:**
- `src/services/http/mock-delay.ts` — verbatim from §7.3
- `src/services/http/client.ts` — verbatim from §7.4

**Verify:**
```bash
npx tsc --noEmit
```

**Done when:** Both files compile. `mockDelay()` returns a Promise that resolves after the configured delay.

---

### TASK-009 — Auth service

**Inputs:**
- `mobile_app.md` §7.1 (template), §7.5 (`auth.service.ts` signatures)
- `src/mocks/users.mock.ts`

**Outputs:**
- `src/services/auth.service.ts` exporting `signUp`, `signIn`, `signOut`, `refreshToken`. Each follows the §7.1 template (mock + real impl, dispatch on `env.USE_MOCKS`).

Mock behavior:
- `signUp`/`signIn` return `MOCK_AUTH_RESPONSE` after `mockDelay()`.
- `signOut` returns `{ ok: true, data: undefined }`.
- `refreshToken` returns `MOCK_AUTH_RESPONSE`.

**Verify:**
```bash
npx tsc --noEmit
```

**Done when:** Calling each function in a scratch script returns the expected shape.

---

### TASK-010 — User service

**Inputs:**
- `mobile_app.md` §7.5 (`user.service.ts` signatures)

**Outputs:**
- `src/services/user.service.ts` exporting `getCurrentUser`, `updateUser`, `deleteAccount`. Mock returns `MOCK_USER` (with patch applied for `updateUser`). `deleteAccount` returns `{ ok: true, data: undefined }`.

**Verify:**
```bash
npx tsc --noEmit
```

**Done when:** Functions return mock data conforming to `User` type.

---

### TASK-011 — Photo service

**Inputs:**
- `mobile_app.md` §7.5 (`photo.service.ts`)

**Outputs:**
- `src/services/photo.service.ts` exporting `uploadPhoto`, `deletePhoto`, `listUserPhotos`.

Mock behavior:
- `uploadPhoto`: generate a `photoId` via `generateId('pho')`, return a `Photo` echoing the request fields with `uploadedAt = new Date().toISOString()`.
- `deletePhoto`: return `{ ok: true, data: undefined }`.
- `listUserPhotos`: return `[]` for the empty case.

**Verify:**
```bash
npx tsc --noEmit
```

**Done when:** Mock photo upload returns a `Photo` with all fields populated.

---

### TASK-012 — Scan, audit, protocol, mission, progress, report services

**Inputs:**
- `mobile_app.md` §7.5 (all remaining service signatures)
- All mock files from TASK-007

**Outputs:**
- `src/services/scan.service.ts` — `createScan` returns `MOCK_SCAN_PROCESSING` with new `scanId`; `getScan(id)` returns `MOCK_SCAN_READY`; `getLatestScan` returns `MOCK_SCAN_READY`.
- `src/services/audit.service.ts` — `getAuditByScan` returns `MOCK_AUDIT`.
- `src/services/protocol.service.ts` — `startProtocol` returns `MOCK_PROTOCOL`; `getActiveProtocol` returns `MOCK_PROTOCOL`; `pause`/`resume` toggle the `status` field of a copy.
- `src/services/mission.service.ts` — `getTodayMissions` returns `MOCK_TODAY_MISSIONS`; `getMission(id)` returns the matching mission or first mock; `completeMission` returns the mission with `status: 'COMPLETED'` and `newStreakDays: 7`; `skipMission` returns with `status: 'SKIPPED'`; `getMissionHistory` returns `MOCK_TODAY_MISSIONS` (acceptable for mock).
- `src/services/progress.service.ts` — `getProgressOverview` returns a `ProgressOverview` with `currentDays: 7`, 4 weeks of `WeeklyProgress`, and category scores for all 5 categories used in audit. `getStreak` returns the streak portion.
- `src/services/report.service.ts` — `getReport` returns `MOCK_INITIAL_REPORT`; `listReports` returns both mock reports; `generateShareCard` returns `{ url: 'https://mock.glowops.app/cards/mock.png' }`.

**Verify:**
```bash
npx tsc --noEmit
```

**Done when:** All six service files exist, compile, and return mock data on every function.

---

### TASK-013 — Subscription and analytics services

**Inputs:**
- `mobile_app.md` §7.5 (`subscription.service.ts`, `analytics.service.ts`)
- `mobile_app.md` §14 (Analytics Events for the `AnalyticsEvent` union)
- `mobile_app.md` §6.10 (note `PurchaseRequest.receiptToken` and `SubscriptionEntitlement.provisional`)

**Outputs:**
- `src/services/subscription.service.ts` — `getEntitlement` returns `MOCK_FREE_ENTITLEMENT`; `getPaywallOffering` returns `MOCK_PAYWALL_OFFERING`; `purchase(req)` accepts `{ productId, receiptToken }` and returns `{ entitlement: MOCK_PRO_ENTITLEMENT, receipt: req.receiptToken }`; `restorePurchases` returns `MOCK_PRO_ENTITLEMENT`. The mock service must read `receiptToken` from the request even though it does nothing with it — this enforces the contract at compile time.
- `src/services/analytics.service.ts` — exports `AnalyticsEvent` union (verbatim from §14), and `track`, `identify`, `reset` functions. Mock implementation: `console.log('[analytics]', event, properties)` for `track`, similar for the others. Synchronous (returns `void`, not `Promise`).

**Verify:**
```bash
npx tsc --noEmit
# Confirm receiptToken is in the contract:
grep -F "receiptToken" src/services/subscription.service.ts && echo OK
# Confirm provisional flag is on the entitlement type:
grep -F "provisional" src/types/subscription.types.ts && echo OK
```

**Done when:** Both services exist; `analyticsService.track('app_opened')` logs to console; `subscriptionService.purchase({ productId: 'x', receiptToken: 'y' })` returns a valid `PurchaseResponse`.

---

### TASK-014 — Service barrel

**Inputs:**
- `mobile_app.md` §7.6

**Outputs:**
- `src/services/index.ts` — verbatim from §7.6.

**Verify:**
```bash
npx tsc --noEmit
# Confirm the no-mock-leakage rule:
grep -rE "from ['\"]@/mocks" src/components src/hooks app && echo "FAIL: components/hooks importing mocks" || echo "OK"
```

**Done when:** Barrel exports all 11 services. Grep returns "OK".

---

## Phase 4 — State

### TASK-015 — Zustand stores

**Inputs:**
- `mobile_app.md` §9.4 (Client state)

**Outputs:**
- `src/stores/auth.store.ts` — verbatim from §9.4 (auth store)
- `src/stores/onboarding.store.ts` — implement to the §9.4 contract (state, setStep, addPhotoId, reset)
- `src/stores/ui.store.ts` — modal/sheet/toast visibility flags. Minimum implementation: `{ activeToast: { message: string; tone: 'success' | 'error' | 'info' } | null; showToast(t): void; hideToast(): void }`

**Verify:**
```bash
npx tsc --noEmit
```

**Done when:** Stores instantiate without error; `useAuthStore.getState().hydrate()` is callable.

---

### TASK-016 — Query hooks

**Inputs:**
- `mobile_app.md` §9.3 (Hook implementation pattern)
- `mobile_app.md` §9.2 (Query key conventions)

**Outputs:**
- `src/hooks/queries/useUser.ts` — `useQuery(['user', 'me'], userService.getCurrentUser)`
- `src/hooks/queries/useLatestScan.ts` — `useQuery(['scan', 'latest'], ...)`
- `src/hooks/queries/useActiveProtocol.ts` — `useQuery(['protocol', 'active'], ...)`
- `src/hooks/queries/useTodayMissions.ts` — verbatim from §9.3
- `src/hooks/queries/useReport.ts` — accepts `reportId` arg, key `['report', reportId]`
- `src/hooks/queries/useSubscription.ts` — `useQuery(['subscription', 'entitlement'], ...)`
- `src/hooks/queries/useProgress.ts` — `useQuery(['progress', 'overview'], ...)` (added because dashboard needs it)
- `src/hooks/queries/usePaywallOffering.ts` — `useQuery(['subscription', 'paywall'], ...)`
- `src/hooks/queries/useAudit.ts` — accepts `scanId` arg, key `['audit', 'byScan', scanId]`

Each hook unwraps `ApiResult` per the §9.3 template — on `!ok`, throw `new Error(error.message)`.

**Verify:**
```bash
npx tsc --noEmit
```

**Done when:** All 9 query hooks exist and compile.

---

### TASK-017 — Mutation hooks

**Inputs:**
- `mobile_app.md` §9.3 (mutation template)

**Outputs:**
- `src/hooks/mutations/useSignIn.ts` — calls `authService.signIn`; on success, calls `useAuthStore.setSession`
- `src/hooks/mutations/useSignUp.ts` — same pattern with `authService.signUp`
- `src/hooks/mutations/useSignOut.ts` — calls `authService.signOut`; on success, calls `useAuthStore.clearSession`; invalidates all queries
- `src/hooks/mutations/useUploadPhoto.ts` — calls `photoService.uploadPhoto`
- `src/hooks/mutations/useStartScan.ts` — calls `scanService.createScan`; invalidates `['scan', 'latest']`
- `src/hooks/mutations/useCompleteMission.ts` — verbatim from §9.3
- `src/hooks/mutations/useSkipMission.ts` — same pattern, calls `missionService.skipMission`
- `src/hooks/mutations/useStartProtocol.ts` — calls `protocolService.startProtocol`; invalidates `['protocol', 'active']`
- `src/hooks/mutations/usePurchase.ts` — calls `subscriptionService.purchase`; invalidates `['subscription', 'entitlement']`; on success, sends `analyticsService.track('subscription_started', { productId })`
- `src/hooks/mutations/useUpdateUser.ts` — calls `userService.updateUser`; invalidates `['user', 'me']`

**Verify:**
```bash
npx tsc --noEmit
```

**Done when:** All 10 mutation hooks exist and compile.

---

### TASK-018 — Custom hooks

**Inputs:** None new.

**Outputs:**
- `src/hooks/useAuth.ts` — re-export of `useAuthStore` plus a derived `isAuthenticated: boolean` selector via a small wrapper hook
- `src/hooks/useHaptics.ts` — wraps `expo-haptics`. Exports `{ light(), medium(), heavy(), success(), warning(), error(), selection() }`. All are no-ops when running on web.

**Verify:**
```bash
npx tsc --noEmit
```

**Done when:** Both hooks exist; `useHaptics().light()` is callable from a component.

---

## Phase 5 — Component Primitives

### TASK-019 — Layout primitives

**Inputs:**
- `mobile_app.md` §11.1 (Primitives)
- `mobile_app.md` §11.3 (Component implementation rules)

**Outputs:**
- `src/components/primitives/Screen.tsx` — wraps `SafeAreaView`, applies `colors.obsidian` background, status bar style `light`. Props: `children`, `scrollable?: boolean` (wraps in `ScrollView` when true), `padding?: SpacingToken` (default `base`).
- `src/components/primitives/Stack.tsx` — vertical flex. Props: `children`, `gap?: SpacingToken` (default `none`), `align?: 'start' | 'center' | 'end' | 'stretch'`, `justify?: 'start' | 'center' | 'end' | 'between'`.
- `src/components/primitives/Row.tsx` — horizontal flex. Same prop API as Stack.
- `src/components/primitives/Spacer.tsx` — single prop `size: SpacingToken`. Renders empty View.
- `src/components/primitives/Divider.tsx` — 1px line, `colors.border`. Optional `vertical: boolean`.

**Verify:**
```bash
npx tsc --noEmit
```

Manual check: render `<Screen><Stack gap="base"><Text variant="h1">Hi</Text></Stack></Screen>` in a scratch screen — must render without error.

**Done when:** All five primitives exist, compile, and accept the documented props.

---

### TASK-020 — Text primitive

**Inputs:**
- `mobile_app.md` §11.1 (`Text.tsx`)
- `mobile_app.md` §10.2 (typography variants)

**Outputs:**
- `src/components/primitives/Text.tsx` — wraps RN `Text`. Required `variant: TextStyleVariant`. Optional `color: ColorToken` (default `platinum`), `align: 'left' | 'center' | 'right'`, `numberOfLines: number`. Internally applies `theme.textStyles[variant]` and `theme.colors[color]`.

**Verify:**
```bash
npx tsc --noEmit
# Lint rule: no other component should use raw <Text> after this exists.
grep -rE "from 'react-native'" src/components --include='*.tsx' | grep -v primitives | xargs -I{} grep -l "import.*Text.*from 'react-native'" {} 2>/dev/null && echo "FAIL: raw RN Text imported" || echo "OK"
```

**Done when:** `<Text variant="h1" color="platinum">Hi</Text>` renders.

---

### TASK-021 — Button, IconButton

**Inputs:**
- `mobile_app.md` §11.1 (`Button.tsx`, `IconButton.tsx`)
- `mobile_app.md` §11.3 (haptics, 44pt minimum)

**Outputs:**
- `src/components/primitives/Button.tsx` — props: `label: string`, `onPress: () => void`, `variant?: 'primary' | 'secondary' | 'ghost' | 'destructive'` (default `primary`), `size?: 'sm' | 'md' | 'lg'` (default `md`), `loading?: boolean`, `disabled?: boolean`, `iconLeft?: LucideIcon`, `iconRight?: LucideIcon`, `fullWidth?: boolean`. Triggers `useHaptics().light()` on press. Loading state shows `ActivityIndicator` and disables press.
  - Variant styles:
    - `primary`: bg `electricBlue`, text `obsidian`
    - `secondary`: bg `gunmetal`, border `border`, text `platinum`
    - `ghost`: transparent bg, text `platinum`
    - `destructive`: bg `crimson`, text `platinum`
- `src/components/primitives/IconButton.tsx` — props: `icon: LucideIcon`, `onPress: () => void`, `size?: number` (default 24), `color?: ColorToken` (default `platinum`). Hit slop expanded to 44×44.

**Verify:**
```bash
npx tsc --noEmit
```

Manual: `<Button label="Continue" onPress={() => {}} />` renders with primary styling.

**Done when:** Both components support all listed variants and trigger haptics on press.

---

### TASK-022 — Card, Input, Badge

**Inputs:**
- `mobile_app.md` §11.1

**Outputs:**
- `src/components/primitives/Card.tsx` — bg `gunmetal`, `radius.lg`, optional `shadows.card`. Props: `children`, `padding?: SpacingToken` (default `base`), `onPress?: () => void` (becomes `Pressable` when provided), `shadow?: boolean`.
- `src/components/primitives/Input.tsx` — wraps `TextInput`. Props: `label?: string`, `value: string`, `onChangeText: (v: string) => void`, `placeholder?: string`, `error?: string`, `secureTextEntry?: boolean`, `keyboardType?: KeyboardTypeOptions`, `autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters'`. Renders label above, error below in `crimson`. Border `border` color, `radius.md`, `padding.base`.
- `src/components/primitives/Badge.tsx` — pill. Props: `label: string`, `variant?: 'success' | 'warning' | 'error' | 'neutral' | 'info'` (default `neutral`).
  - `success`: bg with 15% `signalGreen`, text `signalGreen`
  - `warning`: bg with 15% `amber`, text `amber`
  - `error`: bg with 15% `crimson`, text `crimson`
  - `info`: bg with 15% `electricBlue`, text `electricBlue`
  - `neutral`: bg `slate`, text `steel`

**Verify:**
```bash
npx tsc --noEmit
```

**Done when:** All three render with their documented prop APIs.

---

### TASK-023 — State components (Loading, Error, Empty, Skeleton)

**Inputs:**
- `mobile_app.md` §11.1

**Outputs:**
- `src/components/primitives/LoadingState.tsx` — centered `ActivityIndicator` (`electricBlue`), optional `message?: string` below in `body` variant.
- `src/components/primitives/ErrorState.tsx` — centered. Props: `error: Error`, `onRetry?: () => void`. Shows `AlertCircle` icon (lucide), error message, optional retry button.
- `src/components/primitives/EmptyState.tsx` — centered. Props: `icon?: LucideIcon`, `title: string`, `message?: string`, `cta?: { label: string; onPress: () => void }`.
- `src/components/primitives/Skeleton.tsx` — animated shimmer. Props: `width: number | '100%'`, `height: number`, `radius?: SpacingToken`. Use `react-native-reanimated` `useSharedValue` + `withRepeat` for the shimmer.

**Verify:**
```bash
npx tsc --noEmit
```

**Done when:** All four render. `<Skeleton width="100%" height={60} />` shows a shimmering placeholder.

---

## Phase 6 — Domain Components

### TASK-024 — Audit components

**Inputs:**
- `mobile_app.md` §11.2 (table)
- `src/types/audit.types.ts`

**Outputs:**
- `src/components/audit/FixabilityBadge.tsx` — props: `level: FixabilityLevel`. Maps to Badge variants: `low` → neutral, `medium` → info, `high` → success, `very_high` → success (with label "Very High Fixability").
- `src/components/audit/AuditCategoryCard.tsx` — props: `result: AuditCategoryResult`, `onPress?: () => void`. Layout: rank number (mono), category title (h3), `currentStateLabel` (caption), `FixabilityBadge`, `estimatedTimeLabel` (label), guidance text (body). Wraps in Card.

**Verify:**
```bash
npx tsc --noEmit
```

**Done when:** Rendering `<AuditCategoryCard result={MOCK_AUDIT.topImprovements[0]} />` shows a complete card.

---

### TASK-025 — Protocol components

**Outputs:**
- `src/components/protocol/PhaseCard.tsx` — props: `phase: ProtocolPhase`, `currentDay: number`. Shows phase number badge, title, day range, `description`, focus area chips. Highlight border in `electricBlue` if `currentDay` falls in `[startDay, endDay]`.
- `src/components/protocol/ProtocolTimeline.tsx` — props: `protocol: Protocol`. Renders `protocol.phases.map(p => <PhaseCard ...>)` in a vertical Stack with connector lines (1px `border`) between cards.

**Verify:**
```bash
npx tsc --noEmit
```

**Done when:** Protocol timeline renders all phases with current phase highlighted.

---

### TASK-026 — Mission components

**Outputs:**
- `src/components/mission/MissionCard.tsx` — props: `mission: Mission`, `onComplete: () => void`, `onPress: () => void`. Shows category badge, title, estimated minutes. Right side: checkbox-style button. When `status === 'COMPLETED'`, renders with `signalGreen` border and checkmark filled. Tapping the card body fires `onPress`; tapping the checkbox fires `onComplete` and a `medium` haptic.
- `src/components/mission/MissionChecklist.tsx` — props: `missions: Mission[]`, `onComplete: (id: MissionId) => void`. Renders Stack of MissionCards. Sorts COMPLETED to bottom.
- `src/components/mission/StreakBar.tsx` — props: `streak: Streak`. Large mono number for `currentDays`, label "day streak", subdued caption "Longest: {longestDays} days".

**Verify:**
```bash
npx tsc --noEmit
```

**Done when:** All three render with mock mission data.

---

### TASK-027 — Progress components

**Outputs:**
- `src/components/progress/ProgressRing.tsx` — props: `value: number` (0–100), `size: number`, `label?: string`, `color?: ColorToken` (default `electricBlue`). Use `react-native-svg` to draw the ring. Background ring in `slate`, foreground in `color` proportional to `value`.
- `src/components/progress/ScoreTrend.tsx` — props: `score: CategoryScore`. Row layout: category name (label), score number (mono), trend indicator (lucide `TrendingUp`/`TrendingDown`/`Minus` colored by direction), change delta (`+3` / `-2` in caption).
- `src/components/progress/BeforeAfterSlider.tsx` — props: `beforeUri: string`, `afterUri: string`. Two `expo-image` instances stacked, with a draggable vertical divider revealing the "after" image on the right side. Use `react-native-gesture-handler` `Pan`.

**Verify:**
```bash
npx tsc --noEmit
```

**Done when:** ProgressRing animates the fill on mount; BeforeAfterSlider responds to drag.

---

### TASK-028 — Photo components

**Outputs:**
- `src/components/photo/PhotoUploadSlot.tsx` — props: `kind: PhotoKind`, `photo?: Photo`, `onPick: () => void`, `uploading?: boolean`. Square Card. When no photo: dashed border, lucide `Camera` icon, kind label ("Front selfie", "Side profile", etc — map kinds to display names). When photo: shows image preview via expo-image. When `uploading`: overlay spinner.
- `src/components/photo/PhotoGrid.tsx` — props: `photos: Photo[]`, `columns?: number` (default 3). Grid layout using flexbox.

**Verify:**
```bash
npx tsc --noEmit
```

**Done when:** Empty slot tappable; populated slot shows preview.

---

### TASK-029 — Paywall components

**Outputs:**
- `src/components/paywall/TierCard.tsx` — props: `option: PricingOption`, `onSelect: () => void`, `isSelected?: boolean`. Card with tier name (h3), `displayPrice` (stat), feature list (bulleted with lucide `Check`). When `isRecommended`, show "RECOMMENDED" badge above. Selected state: border `electricBlue`.
- `src/components/paywall/PaywallSheet.tsx` — props: `offering: PaywallOffering`, `onPurchase: (productId: string) => void`, `onDismiss: () => void`. Header "Unlock your personalized Glow Protocol.", Stack of TierCards. Bottom: "Continue" button + "Restore purchases" ghost button. Tracks selected tier internally via `useState`.
- `src/components/paywall/BlurredPaywallOverlay.tsx` — props: `children: ReactNode`, `cta: string`, `onUnlock: () => void`. Wraps children in a View; overlays an `expo-blur` `BlurView` (intensity 30, tint `dark`) and a centered Button with `cta` label.

**Verify:**
```bash
npx tsc --noEmit
```

**Done when:** PaywallSheet displays all tiers from `MOCK_PAYWALL_OFFERING`; BlurredPaywallOverlay obscures children visually.

---

## Phase 7 — Routing and Screens

### TASK-030 — Root layout

**Inputs:**
- `mobile_app.md` §12.1
- `mobile_app.md` §9.1 (QueryClient config)

**Outputs:**
- `app/_layout.tsx` — wraps tree in this order (outer → inner): `GestureHandlerRootView` → `SafeAreaProvider` → `QueryClientProvider`. Loads Google Fonts (Inter 400/500/600, Sora 600/700, JetBrains Mono 500/700). Calls `SplashScreen.preventAutoHideAsync()` at module load and `hideAsync()` after fonts load AND after `useAuthStore.getState().hydrate()` resolves. Renders `<Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.obsidian } }} />`.

**Verify:**
```bash
npx expo start --no-dev --minify
# Manually: app launches without errors, splash hides cleanly.
```

**Done when:** App launches, fonts visibly applied, no console warnings.

---

### TASK-031 — Entry redirect

**Inputs:**
- `mobile_app.md` §12.2

**Outputs:**
- `app/index.tsx` — Reads `useAuthStore` and `useUser` (only when token present). While `!isHydrated`, returns `<LoadingState />`. Otherwise routes per §12.2 logic.

**Verify:**
```bash
npx tsc --noEmit
```

Manual: with no token, app lands on sign-in; with mock token but `onboardingComplete=false`, app lands on onboarding welcome; with mock token and onboarding complete, app lands on home.

**Done when:** All three redirect paths verified manually by toggling mock state.

---

### TASK-032 — Auth screens

**Inputs:**
- `mobile_app.md` §12.3
- `src/utils/validation.ts` (zod schemas)

**Outputs:**
- `app/(auth)/_layout.tsx` — minimal `<Stack screenOptions={{ headerShown: false }} />`
- `app/(auth)/sign-in.tsx` — Screen with email + password Input, "Sign In" Button (loading state via mutation `isPending`), link to sign-up at the bottom. Uses `react-hook-form` with `signInSchema`. On success, mutation already calls `setSession`; component then `router.replace('/')`.
- `app/(auth)/sign-up.tsx` — Same pattern with `signUpSchema`. After success, fire `analyticsService.track('sign_up_completed')`.

Toast errors via `useUiStore` on mutation failure.

**Verify:**
```bash
npx tsc --noEmit
```

Manual: form errors show inline; submit triggers mutation; success advances to next route.

**Done when:** Both screens function with mock auth.

---

### TASK-033 — Onboarding layout + welcome

**Inputs:**
- `mobile_app.md` §12.4

**Outputs:**
- `app/(onboarding)/_layout.tsx` — `<Stack screenOptions={{ headerShown: false }} />`
- `app/(onboarding)/welcome.tsx` — Screen centered. Logo placeholder (Text "GlowOps" in `display` variant). Headline: "Build your Glow Protocol." (h1). Subtext: "Upload a few photos. Get a private appearance audit and a step-by-step improvement plan." (body, color `steel`). Button: "Start Audit" → `router.push('/(onboarding)/age-gate')`. Track `onboarding_started` on mount.

**Verify:**
```bash
npx tsc --noEmit
```

**Done when:** Welcome screen renders with exact copy from spec.

---

### TASK-034 — Age gate + safety + soft block

**Inputs:**
- `mobile_app.md` §12.5, §12.6, §13.4

**Outputs:**
- `app/(onboarding)/age-gate.tsx` — Headline "Are you 18 or older?". Two Buttons stacked: "Yes, I'm 18+" (primary) → calls `useUpdateUser({ ageGateAccepted: true })`, on success tracks `age_gate_accepted` and pushes `/safety`. "No" (ghost) → tracks `age_gate_declined`, pushes `/(onboarding)/soft-block`.
- `app/(onboarding)/soft-block.tsx` — Headline "GlowOps is currently 18+." Body "Come back when you're 18 or older. We're not going anywhere." No CTA.
- `app/(onboarding)/safety.tsx` — Renders the §13.4 safety acknowledgement copy verbatim (multi-paragraph). Single Button "I understand" → calls `useUpdateUser({ safetyAcknowledgementAccepted: true })`, tracks `safety_acknowledged`, pushes `/photo-upload`.

**Verify:**
```bash
npx tsc --noEmit
# Confirm exact safety copy:
grep -F "GlowOps gives you guidance, not medical advice." app/\(onboarding\)/safety.tsx && echo OK
```

**Done when:** Both flows reachable; declining age gate hits the soft block.

---

### TASK-035 — Photo upload screen

**Inputs:**
- `mobile_app.md` §12.7

**Outputs:**
- `app/(onboarding)/photo-upload.tsx` — Screen with header "Upload your photos." (h1) and subtext "These stay private." Renders 4 PhotoUploadSlots in a 2×2 grid: `selfie_front`, `selfie_side`, `full_body`, `beard_hair`. Tapping a slot opens `expo-image-picker` (use `launchImageLibraryAsync` with `mediaTypes: 'images'`). On selection, call `useUploadPhoto`, store the resulting `photoId` in `useOnboardingStore.addPhotoId`. Slot `uploading` prop bound to mutation `isPending`.

CTA "Continue" — disabled until `useOnboardingStore.uploadedPhotoIds.length >= 3` (the first 3 are required, beard/hair optional). On press: `useStartScan({ photoIds: store.uploadedPhotoIds })`, on success push `/(onboarding)/audit-loading?scanId={returned id}`.

Track `photo_picked` on each picker open and `scan_created` on submit.

**Verify:**
```bash
npx tsc --noEmit
```

Manual: pick 3 photos from device library, slots show previews, Continue enables.

**Done when:** Photo upload flow completes with mock photoIds in the onboarding store.

---

### TASK-036 — Audit loading screen

**Inputs:**
- `mobile_app.md` §12.8

**Outputs:**
- `app/(onboarding)/audit-loading.tsx` — Reads `scanId` from route params. Shows headline "Analyzing your first impression." Below: 4 status rows — "Checking photo quality", "Mapping improvement areas", "Ranking highest-ROI changes", "Building your protocol". Each starts as muted, transitions to `signalGreen` checkmark progressively (one every ~750ms). After all 4, calls `useAudit(scanId)`. On data: tracks `audit_completed`, `router.replace('/audit-result?scanId={scanId}')`.

Use `useEffect` with `setTimeout` for the staged animation.

**Verify:**
```bash
npx tsc --noEmit
```

Manual: from photo upload, lands here, watches the four status steps complete, then advances to audit result.

**Done when:** Animation progresses smoothly and navigates onward.

---

### TASK-037 — Audit result screen

**Inputs:**
- `mobile_app.md` §12.9

**Outputs:**
- `app/audit-result.tsx` — Reads `scanId` from route params. Calls `useAudit(scanId)`. Header "Your top opportunities are clear." On data: render `topImprovements[0..2]` as full `AuditCategoryCard`s in a Stack. Then render `topImprovements[3..4]` wrapped in `BlurredPaywallOverlay` with cta "Unlock Full Protocol" → `router.push('/paywall')`. Track `audit_result_viewed` on mount.

**Verify:**
```bash
npx tsc --noEmit
```

Manual: top 3 cards readable; bottom 2 visibly blurred; tapping unlock CTA opens paywall.

**Done when:** All five mock audit categories present; visual blur applied to bottom 2.

---

### TASK-038 — Paywall screen

**Inputs:**
- `mobile_app.md` §12.10
- `mobile_app.md` §15 (Backend Cutover — context for why we pass a placeholder receiptToken)

**Outputs:**
- `app/paywall.tsx` — Calls `usePaywallOffering` and `usePurchase`. Shows close `IconButton` (`X` icon) top-right → `router.back()`. Renders `<PaywallSheet offering={data} onPurchase={(productId) => purchase.mutate({ productId, receiptToken: 'mock_receipt' })} onDismiss={...} />`. The `receiptToken` placeholder is correct for pre-cutover; the cutover task (§15.1 step 8) replaces this with the real RevenueCat SDK call. On purchase success: tracks `subscription_started`, `router.replace('/(app)/home')`. Track `paywall_viewed` on mount and `paywall_dismissed` on close. Leave a `// TODO(agent): replace 'mock_receipt' with RevenueCat purchaseProduct() result at cutover, see mobile_app.md §15` comment at the call site.

**Verify:**
```bash
npx tsc --noEmit
```

Manual: tier selection works; purchase mutation completes; navigates to home.

**Done when:** Paywall flow finishes at home tab; the TODO comment about RevenueCat cutover is present at the call site.

---

### TASK-039 — Tab layout

**Inputs:**
- `mobile_app.md` §12.11

**Outputs:**
- `app/(app)/_layout.tsx` — `<Tabs>` from `expo-router`. Tab bar styling: bg `gunmetal`, active tint `electricBlue`, inactive tint `steel`. Five `<Tabs.Screen>`: `home` (Home icon), `protocol` (ListChecks icon), `camera` (Camera icon), `progress` (TrendingUp icon), `profile` (User icon). All icons from `lucide-react-native`.

**Verify:**
```bash
npx tsc --noEmit
```

Manual: tab bar appears, tab switches work, active tab highlighted.

**Done when:** All 5 tabs visible and switchable.

---

### TASK-040 — Home tab

**Inputs:**
- `mobile_app.md` §12.12

**Outputs:**
- `app/(app)/home.tsx` — Screen with `scrollable`. Sections in this order:
  1. Greeting Text (h2): "Good morning, {user.displayName ?? 'there'}." (use current hour: 0–11 morning, 12–17 afternoon, 18+ evening).
  2. `<StreakBar streak={progress.streak} />` — uses `useProgress`.
  3. Section header "Today's missions" (h3) + `<MissionChecklist missions={data} onComplete={(id) => completeMutation.mutate({ missionId: id })} />` — uses `useTodayMissions` + `useCompleteMission`.
  4. Section header "Active protocol" + Card with `<ProgressRing value={protocol.currentDay / protocol.totalDays * 100} size={80} />` and protocol type label — uses `useActiveProtocol`. If null, render `EmptyState` with cta "Start your protocol" → `/audit-result`.
  5. Section header "Weekly insight" + top `ScoreTrend` card from `progress.weeklyProgress[0].scoreTrends[0]`.

Each section handles loading via Skeleton placeholders and errors via inline `ErrorState`.

**Verify:**
```bash
npx tsc --noEmit
```

Manual: home tab shows all 5 sections populated with mock data.

**Done when:** All sections render; tapping a mission's check fires the complete mutation and the mission moves to completed state.

---

### TASK-041 — Protocol tab

**Inputs:**
- `mobile_app.md` §12.13

**Outputs:**
- `app/(app)/protocol.tsx` — Screen with `scrollable`. Calls `useActiveProtocol`. On data: header "30-Day Glow-Up · Day {currentDay} of {totalDays}". `<ProtocolTimeline protocol={data} />`. On null: `<EmptyState title="No active protocol" cta={{ label: 'Start your protocol', onPress: () => router.push('/audit-result') }} />`.

**Verify:**
```bash
npx tsc --noEmit
```

**Done when:** Protocol timeline visible with all phases; current phase highlighted.

---

### TASK-042 — Camera tab

**Inputs:**
- `mobile_app.md` §12.14

**Outputs:**
- `app/(app)/camera.tsx` — Three large Cards stacked:
  1. "Take progress photo" (icon: `Camera`) — opens `expo-image-picker` `launchCameraAsync`. On capture, call `useUploadPhoto({ kind: 'selfie_front', ... })`. Show toast on success.
  2. "Upload dating profile photos" (icon: `ImagePlus`) — opens `launchImageLibraryAsync` with `allowsMultipleSelection: true`. Upload each via the same mutation with kind `dating_profile`.
  3. "Compare before / after" (icon: `Columns2`) — `router.push('/compare')` (sub-route). Build `app/compare.tsx` as a minimal screen showing `<BeforeAfterSlider beforeUri="..." afterUri="..." />` using two static asset URIs from any free CDN — acceptable for MVP since real photos require backend.

**Verify:**
```bash
npx tsc --noEmit
```

**Done when:** All three options reachable; first two trigger upload flows; third shows the compare slider.

---

### TASK-043 — Progress tab

**Inputs:**
- `mobile_app.md` §12.15

**Outputs:**
- `app/(app)/progress.tsx` — Screen with `scrollable`. Uses `useProgress`. Sections:
  1. Streak: large `statLarge` mono number for `currentDays`, label "day streak" below.
  2. "Weekly progress" header + Stack of cards, one per week from `progress.weeklyProgress` (max 4 visible). Each card: week label ("Apr 17 – Apr 23"), `missionsCompleted/missionsTotal`, a horizontal bar showing completion %.
  3. "Score trends" header + Stack of `<ScoreTrend score={s} />` from `progress.weeklyProgress[0].scoreTrends`.
  4. "Reports" header + Stack of report cards using a separate `useQuery(['reports'], () => reportService.listReports().then(unwrap))`. Each row: report type, date, tappable to `/report/[id]`.

**Verify:**
```bash
npx tsc --noEmit
```

**Done when:** All four sections render; tapping a report row navigates to detail.

---

### TASK-044 — Profile tab

**Inputs:**
- `mobile_app.md` §12.16, §13.5

**Outputs:**
- `app/(app)/profile.tsx` — Screen. Top: avatar placeholder + `user.displayName` + `user.email` (uses `useUser`). Below: list of rows (each a Card with onPress):
  - Subscription row label is computed from `useSubscription()`:
    - `tier === 'free'` → `"Subscription · Free"`, tap opens `/paywall`
    - `tier !== 'free' && provisional === true` → `"Subscription · {Tier} · Confirming…"`, tap is no-op
    - `tier !== 'free' && provisional === false` → `"Subscription · {Tier}"`, tap is no-op
    - Pass `refetchInterval: provisional ? 5000 : false` to the `useSubscription` hook so the "Confirming…" suffix clears on its own when the webhook reconciles. (Pre-cutover the mock never sets provisional=true so this is just future-proofing.)
  - "Notifications" → no-op (TODO comment)
  - "Privacy & data" → opens a sub-screen `/profile/privacy` showing the §13.5 privacy copy verbatim
  - "Safety settings" → no-op (TODO comment)
  - "Sign out" → confirmation modal (use `Alert.alert`) → `useSignOut` → `router.replace('/')`
  - "Delete account" (color `crimson`) → destructive confirmation modal with red CTA "Permanently delete account" → `userService.deleteAccount` → on success, immediately `useAuthStore.clearSession()` and `router.replace('/')` (no success toast — the user is gone)

Build `app/profile/privacy.tsx` as a minimal screen showing the §13.5 copy verbatim.

**Verify:**
```bash
npx tsc --noEmit
grep -F "Your photos are private by default." app/profile/privacy.tsx && echo OK
```

**Done when:** All rows present; sign-out completes; privacy copy matches spec verbatim; provisional state shows "Confirming…" suffix when set.

---

### TASK-045 — Mission detail screen

**Inputs:**
- `mobile_app.md` §12.17

**Outputs:**
- `app/mission/[id].tsx` — Reads `id` from route params. Calls `missionService.getMission(missionId(id))` via a one-off `useQuery(['mission', id], ...)`. Shows: category Badge, title (h1), description (body), estimated minutes ("~{n} min", caption). Two Buttons:
  - Primary: "Mark complete" → `useCompleteMission` mutation; on success, `useHaptics().success()`, show toast "+1% better. Keep stacking.", `router.back()`.
  - Ghost: "Skip for today" → `useSkipMission`; on success, `router.back()`.

Track `mission_viewed` on mount.

**Verify:**
```bash
npx tsc --noEmit
```

**Done when:** Tapping a mission from home opens this screen; both actions return to home with updated mission state.

---

### TASK-046 — Report detail screen

**Inputs:**
- `mobile_app.md` §12.18

**Outputs:**
- `app/report/[id].tsx` — Reads `id` from route params. Uses `useReport(reportId(id))`. Shows: report type Badge + date (caption), summary (body). Below: each `categoryScores` entry rendered as a labeled horizontal bar (label left, score number right via mono, bar fills proportionally to score/100, color `signalGreen`). Bottom: Button "Share" → calls `reportService.generateShareCard(reportId)`, on success opens native share via `Share.share({ url: data.url })` from `react-native`.

Track `report_viewed` on mount; `report_shared` after share resolves.

**Verify:**
```bash
npx tsc --noEmit
```

**Done when:** Report renders all category bars; share button opens native share sheet.

---

## Phase 8 — Final Verification

### TASK-047 — Smoke test the full flow

**Inputs:**
- `mobile_app.md` §0 (Definition of done)

**Outputs:** None — verification only.

**Procedure:**
1. Set `useAuthStore` to clean state (no token).
2. Launch app. Land on sign-in.
3. Sign up with any email/password. Land on onboarding welcome.
4. Walk through age gate → safety → photo upload (pick 3 photos from library) → audit loading → audit result.
5. Tap "Unlock Full Protocol". Paywall opens.
6. Select Pro tier, tap purchase. Land on home.
7. Tap a pending mission's checkbox. Mission moves to completed; streak updates.
8. Tap into a mission row. Mission detail opens. Tap "Mark complete". Toast shows. Returns to home.
9. Switch to Protocol tab. Timeline visible.
10. Switch to Progress tab. Streak, weekly cards, reports all visible.
11. Tap a report row. Detail opens with category bars.
12. Switch to Profile tab. Tap Sign Out. Confirm. Returns to sign-in.

**Verify:**
```bash
npx tsc --noEmit
npx eslint . --ext .ts,.tsx
grep -rE "(ugly|subhuman|low value|incel|chad|mogged|PSL)" src app && echo "FAIL" || echo "OK"
grep -rE "from ['\"]@/mocks" src/components src/hooks app && echo "FAIL: mock leakage" || echo "OK"
```

All four checks must pass.

**Done when:** Every step in the procedure completes without error and all four shell checks pass.

---

### TASK-048 — Verify the swap path

**Inputs:**
- `mobile_app.md` §17 (Final Handoff Checklist)

**Procedure:**
1. Open `src/config/env.ts`. Change `USE_MOCKS: true` to `USE_MOCKS: false`.
2. Run `npx expo start`.
3. Open the app. Attempt to sign in.
4. Expected: sign-in mutation throws an error from `httpClient.post` ("HttpClient.post not implemented...").
5. Toast shows the error.
6. Revert `USE_MOCKS` to `true`. App functions normally again.

**Done when:** Toggling the flag reliably switches between working mock and throwing real-impl, with no other code changes needed.

---

## Final Handoff

Before declaring complete, confirm every box in `mobile_app.md` §17 is checked.

If any item fails, file a regression note in this file under a new "## Known Issues" section and address before final delivery.
