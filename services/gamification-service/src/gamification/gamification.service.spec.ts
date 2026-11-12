import { GamificationRepository } from './gamification.repository';
import { GamificationService } from './gamification.service';

describe('GamificationService', () => {
  let repository: GamificationRepository;
  let service: GamificationService;

  beforeEach(() => {
    repository = new GamificationRepository();
    service = new GamificationService(repository);
  });

  it('lists the 7 official mission templates from the seed specification', () => {
    const catalog = service.listCatalog();
    expect(catalog).toHaveLength(7);
    expect(catalog.map((m) => m.code)).toEqual([
      'MIS-PLAN-01',
      'MIS-PLAN-02',
      'MIS-HAB-01',
      'MIS-HAB-02',
      'MIS-SUP-01',
      'MIS-WEL-01',
      'MIS-REC-01',
    ]);
  });

  it('returns seeded progress for usr-stu-001 at Level 1 with 2 completed missions and upgrades to Level 2 upon completing a 3rd mission', () => {
    const initialProgress = service.getStudentProgress('usr-stu-001');
    expect(initialProgress.levelNumber).toBe(1);
    expect(initialProgress.levelCode).toBe('EXPLORATION');
    expect(initialProgress.completedMissionsCount).toBe(2);

    const completion = service.completeMission('usr-stu-001', 'MIS-PLAN-02', {
      reflectionNote: 'Reservé martes y jueves a las 4 pm.',
      clientEventId: 'evt-complete-plan-02',
      correlationId: 'corr-gam-01',
    });

    expect(completion.idempotentReplay).toBe(false);
    expect(completion.mission.assignment.status).toBe('completed');
    expect(completion.progress.completedMissionsCount).toBe(3);
    expect(completion.progress.levelNumber).toBe(2);
    expect(completion.progress.levelCode).toBe('INITIAL_CONSISTENCY');
    expect(completion.feedback?.unlockedAchievement?.achievementCode).toBe(
      'ACH-INITIAL-CONSISTENCY',
    );

    const events = repository.getEmittedEvents();
    expect(events).toHaveLength(1);
    expect(events[0]?.eventType).toBe('mission.completed.v1');
    expect(events[0]?.subjectId).toBe('sub-anon-stu-001');
  });

  it('guarantees idempotency when repeating completeMission with the same clientEventId', () => {
    const first = service.completeMission('usr-stu-001', 'MIS-SUP-01', {
      clientEventId: 'evt-idem-001',
    });
    const second = service.completeMission('usr-stu-001', 'MIS-SUP-01', {
      clientEventId: 'evt-idem-001',
    });

    expect(first.idempotentReplay).toBe(false);
    expect(second.idempotentReplay).toBe(true);
    expect(second.progress.completedMissionsCount).toBe(3);
    expect(repository.getEmittedEvents()).toHaveLength(1);
  });

  it('allows pausing and skipping a mission without penalizing progress or level', () => {
    service.acceptMission('usr-stu-001', 'MIS-HAB-01');
    service.startMission('usr-stu-001', 'MIS-HAB-01');

    const paused = service.pauseMission('usr-stu-001', 'MIS-HAB-01');
    expect(paused.mission.assignment.status).toBe('paused');
    expect(paused.progress.completedMissionsCount).toBe(2);

    const skipped = service.skipMission('usr-stu-001', 'MIS-HAB-01', {
      reason: 'Esta semana priorizaré una misión más corta',
    });
    expect(skipped.mission.assignment.status).toBe('skipped');
    expect(skipped.progress.completedMissionsCount).toBe(2);
    expect(skipped.progress.levelNumber).toBe(1);
  });

  it('activates non-punitive recovery mode (STU-15), returns only LOW-effort recovery-eligible missions, and emits recovery.activated.v1', () => {
    const state = service.activateRecovery('usr-stu-002', 'MICRO_MISSION_5M', {
      clientEventId: 'evt-rec-001',
    });

    expect(state.isRecoveryActive).toBe(true);
    expect(state.selectedChoice).toBe('MICRO_MISSION_5M');
    expect(state.recommendedRecoveryMissionCodes).toContain('MIS-REC-01');
    expect(state.recommendedRecoveryMissionCodes).not.toContain('MIS-PLAN-02');

    const events = repository.getEmittedEvents();
    expect(events[0]?.eventType).toBe('recovery.activated.v1');
    expect(events[0]?.subjectId).toBe('sub-anon-stu-002');
  });
});

