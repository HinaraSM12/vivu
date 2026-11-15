import { BadRequestException } from '@nestjs/common';
import { AnalyticsRepository } from './analytics.repository';
import { AnalyticsService } from './analytics.service';

describe('AnalyticsService (Sprint 9)', () => {
  let service: AnalyticsService;

  beforeEach(() => {
    service = new AnalyticsService(new AnalyticsRepository());
  });

  it('seeds all 16 canonical telemetry events and returns complete longitudinal KPIs (Usage, Recommendations, QoE, QoS, LLM Quality) and readiness checks', () => {
    const dashboard = service.getPilotEvaluationDashboard();
    expect(dashboard.canonicalEventsCount).toBeGreaterThanOrEqual(16);
    expect(dashboard.allReadinessChecksPassed).toBe(true);
    expect(dashboard.llmQuality.hallucinationCount).toBe(0);
    expect(dashboard.llmQuality.groundednessRate).toBe(1.0);
    expect(dashboard.usageAndContinuity.retentionWeek10Rate).toBeGreaterThan(0);
  });

  it('ingests pseudonymized canonical telemetry events and rejects PII or unknown event names', () => {
    const created = service.ingestEvent({
      eventName: 'mission.completed.v1',
      participantIdPseudonym: 'pseudo-stu-001',
      payload: { missionCode: 'MIS-PLAN-01' },
    });
    expect(created.schemaVersion).toBe('1.0.0');

    expect(() =>
      service.ingestEvent({
        eventName: 'mission.completed.v1',
        participantIdPseudonym: 'est.activo@vivu.local',
      }),
    ).toThrow(BadRequestException);

    expect(() =>
      service.ingestEvent({
        eventName: 'mission.completed.v1',
        participantIdPseudonym: 'pseudo-stu-001',
        payload: { email: 'est.activo@vivu.local' },
      }),
    ).toThrow(BadRequestException);
  });
});

