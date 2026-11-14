import { SurveyRepository } from './survey.repository';
import { SurveyService } from './survey.service';

describe('SurveyService', () => {
  let repository: SurveyRepository;
  let service: SurveyService;

  beforeEach(() => {
    repository = new SurveyRepository();
    service = new SurveyService(repository);
  });

  it('lists the two official micro-survey definitions with <= 5 questions', () => {
    const defs = service.listDefinitions();
    expect(defs.map((d) => d.code)).toEqual([
      'SUR-WEEKLY-V1',
      'SUR-RECOVERY-V1',
    ]);
    for (const def of defs) {
      expect(def.questions.length).toBeLessThanOrEqual(5);
    }
  });

  it('submits a survey response idempotently via clientEventId and emits survey.submitted.v1 with pseudonymous subjectId', () => {
    const first = service.submitResponse(
      'usr-stu-001',
      'SUR-WEEKLY-V1',
      [
        { questionId: 'weekly_load_manageable', numericValue: 4 },
        { questionId: 'weekly_time_fit', numericValue: 5 },
        {
          questionId: 'weekly_concrete_step_low_pressure',
          numericValue: 5,
        },
      ],
      { clientEventId: 'evt-survey-001' },
    );

    const second = service.submitResponse(
      'usr-stu-001',
      'SUR-WEEKLY-V1',
      [
        { questionId: 'weekly_load_manageable', numericValue: 4 },
        { questionId: 'weekly_time_fit', numericValue: 5 },
        {
          questionId: 'weekly_concrete_step_low_pressure',
          numericValue: 5,
        },
      ],
      { clientEventId: 'evt-survey-001' },
    );

    expect(first.idempotentReplay).toBe(false);
    expect(second.idempotentReplay).toBe(true);
    expect(service.listStudentResponses('usr-stu-001')).toHaveLength(1);

    const events = repository.getEmittedEvents();
    expect(events).toHaveLength(1);
    expect(events[0]?.eventType).toBe('survey.submitted.v1');
    expect(events[0]?.subjectId).toBe('sub-anon-stu-001');
  });
});

