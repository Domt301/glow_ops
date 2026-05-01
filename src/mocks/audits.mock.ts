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
      guidance:
        'Photo quality is the fastest unlock. Better lighting and angle selection will improve first impression faster than any product.',
    },
    {
      category: 'hair',
      currentStateLabel: 'Shape could be tighter',
      fixability: 'high',
      estimatedTimeLabel: '1 week',
      rank: 2,
      guidance:
        'A cleaner shape and tighter sides would immediately improve presentation. This is highly fixable with the right cut.',
    },
    {
      category: 'style',
      currentStateLabel: 'Fit and color coordination',
      fixability: 'very_high',
      estimatedTimeLabel: '48 hours',
      rank: 3,
      guidance:
        'Better-fitting basics in a tighter color palette will outperform expensive pieces that fit poorly.',
    },
    {
      category: 'skin',
      currentStateLabel: 'Texture and consistency',
      fixability: 'medium',
      estimatedTimeLabel: '4–8 weeks',
      rank: 4,
      guidance:
        'A consistent three-step routine compounds. Cleanser, moisturizer, SPF — daily, no exceptions.',
    },
    {
      category: 'fitness',
      currentStateLabel: 'Moderate improvement potential',
      fixability: 'high',
      estimatedTimeLabel: '8–12 weeks',
      rank: 5,
      guidance:
        'You do not need a full reinvention. Steady protein and a consistent training week will move the needle.',
    },
  ],
  recommendedProtocolType: '30_DAY',
  generatedAt: '2026-04-24T08:35:00Z',
  promptVersion: 'v1.0.0',
  modelVersion: 'mock-vision-v1',
};
