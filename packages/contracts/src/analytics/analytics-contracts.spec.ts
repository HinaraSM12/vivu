import { describe, expect, it } from 'vitest';
import {
  CANONICAL_TELEMETRY_EVENT_NAMES,
  computeRecommendationAcceptanceRate,
  isCanonicalTelemetryEventName,
} from './analytics-contracts';

describe('analytics-contracts (Sprint 9)', () => {
  it('defines the 16 canonical telemetry events for longitudinal pilot evaluation', () => {
    expect(CANONICAL_TELEMETRY_EVENT_NAMES).toHaveLength(16);
    expect(isCanonicalTelemetryEventName('mission.completed.v1')).toBe(true);
    expect(isCanonicalTelemetryEventName('recommendation.generated.v1')).toBe(
      true,
    );
    expect(isCanonicalTelemetryEventName('unknown.event.v1')).toBe(false);
  });

  it('computes recommendation acceptance rate safely', () => {
    expect(computeRecommendationAcceptanceRate(6, 10)).toBe(0.6);
    expect(computeRecommendationAcceptanceRate(0, 0)).toBe(0);
  });
});

