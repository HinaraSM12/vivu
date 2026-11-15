import { defaultGamificationClient } from '../gamification/gamification-client';
import { defaultSprint4Client } from '../resources-surveys-recovery/sprint4-client';
import { defaultStudentContextClient } from '../student/student-context-client';

export type RecommendationLlmMode =
  | 'contextual'
  | 'disabled'
  | 'simulate_failure';

export type RecommendationSource =
  | 'ONLINE_RULES'
  | 'ONLINE_AI'
  | 'OFFLINE_RULES';

export type RecommendationReasonCode =
  | 'PRIORITY_ALIGNMENT'
  | 'TIME_FIT'
  | 'RECOVERY_LIGHT_LOAD'
  | 'VERIFIED_RESOURCE_MATCH'
  | 'CONTINUITY_REENGAGEMENT';

export type StudentRecommendationAction =
  | 'ACCEPT'
  | 'REJECT'
  | 'POSTPONE'
  | 'EDIT'
  | 'DISMISS_SIMILAR';

export interface RecommendationScoreBreakdownView {
  needFit: number;
  timeFit: number;
  difficultyFit: number;
  continuityFit: number;
  resourceFit: number;
  diversityFit: number;
}

export interface RecommendationView {
  recommendationId: string;
  studentId: string;
  participantIdPseudonym: string;
  missionId: string;
  resourceId: string | null;
  resourceTitle: string | null;
  category: string;
  effort: 'LOW' | 'MEDIUM' | 'HIGH';
  estimatedMinutes: number;
  title: string;
  summary: string;
  whyThisRecommendation: string;
  reasonCode: RecommendationReasonCode;
  score: number;
  scoreBreakdown: RecommendationScoreBreakdownView;
  source: RecommendationSource;
  ruleVersion: string;
  promptVersion: string | null;
  modelVersion: string | null;
  fallbackUsed: boolean;
  studentAction: StudentRecommendationAction | null;
  editedNotes: string | null;
  postponedUntil: string | null;
  shownAt: string;
  actedAt: string | null;
}

const STORAGE_KEY_RECOMMENDATIONS = 'vivu.sprint5.recommendations.v1';

interface StoredRecommendationState {
  byStudent: Record<string, RecommendationView[]>;
}

const CATEGORY_MAP: Record<string, string> = {
  PLANNING: 'ACADEMIC_PLANNING',
  STUDY_HABITS: 'STUDY_HABITS',
  ACADEMIC_SUPPORT: 'INSTITUTIONAL_RESOURCES',
  WELLBEING_BALANCE: 'WELLBEING_HABITS',
  CAMPUS_INTEGRATION: 'RECOVERY_REENGAGEMENT',
};

const RESOURCE_BY_CATEGORY: Record<string, string> = {
  ACADEMIC_PLANNING: 'RES-ACAD-01',
  STUDY_HABITS: 'RES-ACAD-02',
  INSTITUTIONAL_RESOURCES: 'RES-ACA-03',
  WELLBEING_HABITS: 'RES-WEL-01',
  RECOVERY_REENGAGEMENT: 'RES-WEL-01',
};

const FORBIDDEN_STIGMATIZING_TERMS = [
  'desertor',
  'deserción inminente',
  'alto riesgo de abandono',
  'estudiante en riesgo',
  'fracaso académico',
  'incapaz',
] as const;

function computeWeightedScore(
  breakdown: RecommendationScoreBreakdownView,
): number {
  const raw =
    0.3 * breakdown.needFit +
    0.2 * breakdown.timeFit +
    0.15 * breakdown.difficultyFit +
    0.15 * breakdown.continuityFit +
    0.15 * breakdown.resourceFit +
    0.05 * breakdown.diversityFit;
  return Math.round(raw * 1000) / 1000;
}

function isNonStigmatizing(text: string): boolean {
  const lowered = text.toLowerCase();
  return FORBIDDEN_STIGMATIZING_TERMS.every((term) => !lowered.includes(term));
}

export class RecommendationClient {
  private loadState(): StoredRecommendationState {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY_RECOMMENDATIONS);
      if (!raw) {
        return { byStudent: {} };
      }
      return JSON.parse(raw) as StoredRecommendationState;
    } catch {
      return { byStudent: {} };
    }
  }

  private saveState(state: StoredRecommendationState): void {
    try {
      window.localStorage.setItem(
        STORAGE_KEY_RECOMMENDATIONS,
        JSON.stringify(state),
      );
    } catch {
      // Ignore storage quota errors in test/sandbox environments
    }
  }

  listRecommendations(
    studentId: string,
    llmMode: RecommendationLlmMode = 'contextual',
  ): RecommendationView[] {
    const state = this.loadState();
    const existing = state.byStudent[studentId];
    if (existing && existing.length > 0) {
      return existing;
    }
    return this.refreshRecommendations(studentId, llmMode);
  }

  refreshRecommendations(
    studentId: string,
    llmMode: RecommendationLlmMode = 'contextual',
  ): RecommendationView[] {
    const state = this.loadState();
    const previous = state.byStudent[studentId] ?? [];
    const dismissedMissions = new Set(
      previous
        .filter((item) => item.studentAction === 'DISMISS_SIMILAR')
        .map((item) => item.missionId),
    );

    const recovery = defaultSprint4Client.getRecoveryState(studentId);
    const profile = defaultStudentContextClient.getProfile(studentId);
    const missions = defaultGamificationClient.listStudentMissions(
      studentId,
      'all',
      'ALL',
    );
    const publishedResources =
      defaultSprint4Client.listPublishedResources('ALL');
    const resourcesById = new Map(publishedResources.map((r) => [r.code, r]));

    const eligibleMissions = missions.filter(({ template, assignment }) => {
      if (assignment.status === 'completed') {
        return false;
      }
      if (dismissedMissions.has(template.code)) {
        return false;
      }
      if (recovery.isRecoveryActive) {
        return template.isRecoveryEligible && template.effort === 'LOW';
      }
      return true;
    });

    const dailyAvailableMinutes = Math.max(
      10,
      Math.round((profile.weeklyAvailabilityMinutes || 120) / 5),
    );

    const scored = eligibleMissions.map(({ template }) => {
      const canonicalCategory =
        CATEGORY_MAP[template.category] ?? 'ACADEMIC_PLANNING';
      const resourceCode = RESOURCE_BY_CATEGORY[canonicalCategory];
      const verifiedResource = resourceCode
        ? resourcesById.get(resourceCode)
        : undefined;

      const needFit = recovery.isRecoveryActive
        ? template.isRecoveryEligible
          ? 1.0
          : 0.5
        : 0.95;
      const timeFit =
        template.durationMinutes <= dailyAvailableMinutes ? 1.0 : 0.65;
      const difficultyFit =
        recovery.isRecoveryActive || profile.perceivedLoad === 'high'
          ? template.effort === 'LOW'
            ? 1.0
            : 0.45
          : 0.9;
      const continuityFit = recovery.isRecoveryActive ? 1.0 : 0.85;
      const resourceFit = verifiedResource ? 1.0 : 0.5;
      const diversityFit = 0.9;

      const breakdown: RecommendationScoreBreakdownView = {
        needFit,
        timeFit,
        difficultyFit,
        continuityFit,
        resourceFit,
        diversityFit,
      };
      const score = computeWeightedScore(breakdown);

      let reasonCode: RecommendationReasonCode = 'PRIORITY_ALIGNMENT';
      if (recovery.isRecoveryActive) {
        reasonCode = 'RECOVERY_LIGHT_LOAD';
      } else if (
        verifiedResource &&
        canonicalCategory === 'INSTITUTIONAL_RESOURCES'
      ) {
        reasonCode = 'VERIFIED_RESOURCE_MATCH';
      } else if (template.durationMinutes <= 15) {
        reasonCode = 'TIME_FIT';
      }

      return {
        template,
        canonicalCategory,
        verifiedResource,
        breakdown,
        score,
        reasonCode,
      };
    });

    scored.sort(
      (a, b) =>
        b.score - a.score || a.template.code.localeCompare(b.template.code),
    );

    const top = scored.slice(0, 3);
    const nowIso = new Date().toISOString();
    const pseudonym = `pseudo-${studentId.slice(-6)}`;

    const generated: RecommendationView[] = top.map((entry, idx) => {
      const {
        template,
        canonicalCategory,
        verifiedResource,
        breakdown,
        score,
        reasonCode,
      } = entry;

      let fallbackUsed = false;
      let source: RecommendationSource = 'ONLINE_RULES';
      let promptVersion: string | null = null;
      let modelVersion: string | null = null;

      const resourceClause = verifiedResource
        ? ` Conecta con el apoyo institucional verificado «${verifiedResource.title}».`
        : '';

      const deterministicRationale = recovery.isRecoveryActive
        ? `Priorizada por regla determinista de modo recuperación: acción breve de ${template.durationMinutes} min y esfuerzo ligero sin penalización.${resourceClause}`
        : `Sugerida por coincidencia con tus prioridades semanales y tu disponibilidad de ${dailyAvailableMinutes} min diarios.${resourceClause}`;

      let rationale = deterministicRationale;

      if (llmMode === 'simulate_failure') {
        fallbackUsed = true;
        source = 'ONLINE_RULES';
      } else if (llmMode === 'contextual') {
        const candidateAiRationale = recovery.isRecoveryActive
          ? `Te proponemos «${template.title}» (${template.durationMinutes} min) porque activaste el modo recuperación y priorizamos un micro-paso ligero sin presión.${resourceClause}`
          : `Seleccionamos «${template.title}» (${template.durationMinutes} min) porque apoya tus objetivos actuales respetando tu ritmo de la semana.${resourceClause}`;
        if (isNonStigmatizing(candidateAiRationale)) {
          rationale = candidateAiRationale;
          source = 'ONLINE_AI';
          promptVersion = 'prompt-rec-v1.0.0';
          modelVersion = 'gemini-2.5-flash-controlled';
        } else {
          fallbackUsed = true;
        }
      }

      return {
        recommendationId: `rec-${studentId.slice(-6)}-${template.code.toLowerCase()}-${idx + 1}`,
        studentId,
        participantIdPseudonym: pseudonym,
        missionId: template.code,
        resourceId: verifiedResource?.code ?? null,
        resourceTitle: verifiedResource?.title ?? null,
        category: canonicalCategory,
        effort: template.effort,
        estimatedMinutes: template.durationMinutes,
        title: template.title,
        summary: template.summary,
        whyThisRecommendation: rationale,
        reasonCode,
        score,
        scoreBreakdown: breakdown,
        source,
        ruleVersion: '1.0.0',
        promptVersion,
        modelVersion,
        fallbackUsed,
        studentAction: null,
        editedNotes: null,
        postponedUntil: null,
        shownAt: nowIso,
        actedAt: null,
      };
    });

    state.byStudent[studentId] = generated;
    this.saveState(state);
    return generated;
  }

  recordAction(
    studentId: string,
    recommendationId: string,
    action: StudentRecommendationAction,
    options: { editedNotes?: string; postponedUntil?: string } = {},
  ): RecommendationView[] {
    const state = this.loadState();
    const list =
      state.byStudent[studentId] ?? this.listRecommendations(studentId);
    const nowIso = new Date().toISOString();

    const updated = list.map((item) => {
      if (item.recommendationId !== recommendationId) {
        return item;
      }
      if (action === 'ACCEPT') {
        defaultGamificationClient.acceptMission(studentId, item.missionId);
      }
      return {
        ...item,
        studentAction: action,
        editedNotes: options.editedNotes?.trim() || item.editedNotes,
        postponedUntil: options.postponedUntil?.trim() || item.postponedUntil,
        actedAt: nowIso,
      };
    });

    state.byStudent[studentId] = updated;
    this.saveState(state);
    return updated;
  }
}

export const defaultRecommendationClient = new RecommendationClient();
