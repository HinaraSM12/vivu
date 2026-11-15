import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GatewayGamificationService } from '../gamification/gateway-gamification.service';
import { GatewayResourceService } from '../resource/gateway-resource.service';
import { GatewayStudentService } from '../student/gateway-student.service';

export type GatewayRecommendationSource =
  | 'ONLINE_RULES'
  | 'ONLINE_AI'
  | 'OFFLINE_RULES';

export type GatewayRecommendationReasonCode =
  | 'PRIORITY_ALIGNMENT'
  | 'TIME_FIT'
  | 'RECOVERY_LIGHT_LOAD'
  | 'VERIFIED_RESOURCE_MATCH'
  | 'CONTINUITY_REENGAGEMENT';

export type GatewayStudentRecommendationAction =
  | 'ACCEPT'
  | 'REJECT'
  | 'POSTPONE'
  | 'EDIT'
  | 'DISMISS_SIMILAR';

export const GATEWAY_STUDENT_RECOMMENDATION_ACTIONS: readonly GatewayStudentRecommendationAction[] =
  ['ACCEPT', 'REJECT', 'POSTPONE', 'EDIT', 'DISMISS_SIMILAR'] as const;

export interface GatewayRecommendationScoreBreakdown {
  needFit: number;
  timeFit: number;
  difficultyFit: number;
  continuityFit: number;
  resourceFit: number;
  diversityFit: number;
}

export interface GatewayRecommendationItem {
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
  reasonCode: GatewayRecommendationReasonCode;
  score: number;
  scoreBreakdown: GatewayRecommendationScoreBreakdown;
  source: GatewayRecommendationSource;
  ruleVersion: string;
  promptVersion: string | null;
  modelVersion: string | null;
  fallbackUsed: boolean;
  studentAction: GatewayStudentRecommendationAction | null;
  editedNotes: string | null;
  postponedUntil: string | null;
  shownAt: string;
  actedAt: string | null;
}

export interface GatewayRecommendationTraceRecord {
  recommendationId: string;
  participantIdPseudonym: string;
  resourceId: string | null;
  missionId: string | null;
  reasonCode: GatewayRecommendationReasonCode;
  ruleVersion: string;
  promptVersion: string | null;
  modelVersion: string | null;
  shownAt: string;
  studentAction: GatewayStudentRecommendationAction | null;
}

export interface GatewayRecordRecommendationActionRequest {
  action: GatewayStudentRecommendationAction;
  editedNotes?: string;
  postponedUntil?: string;
  clientEventId?: string;
}

export interface GenerateGatewayRecommendationsOptions {
  llmMode?: 'disabled' | 'contextual' | 'simulate_failure';
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
  breakdown: GatewayRecommendationScoreBreakdown,
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

function isNonStigmatizingRationale(text: string): boolean {
  const lowered = text.toLowerCase();
  return FORBIDDEN_STIGMATIZING_TERMS.every((term) => !lowered.includes(term));
}

@Injectable()
export class GatewayRecommendationService {
  private readonly itemsById = new Map<string, GatewayRecommendationItem>();
  private readonly idsByStudent = new Map<string, string[]>();
  private readonly traces: GatewayRecommendationTraceRecord[] = [];

  constructor(
    @Inject(GatewayGamificationService)
    private readonly gamificationService: GatewayGamificationService,
    @Inject(GatewayResourceService)
    private readonly resourceService: GatewayResourceService,
    @Inject(GatewayStudentService)
    private readonly studentService: GatewayStudentService,
  ) {}

  listForStudent(studentId: string): GatewayRecommendationItem[] {
    const existingIds = this.idsByStudent.get(studentId);
    if (!existingIds || existingIds.length === 0) {
      return this.generateForStudent(studentId, { llmMode: 'contextual' });
    }
    return existingIds
      .map((id) => this.itemsById.get(id))
      .filter((item): item is GatewayRecommendationItem => Boolean(item));
  }

  generateForStudent(
    studentId: string,
    options: GenerateGatewayRecommendationsOptions = {},
  ): GatewayRecommendationItem[] {
    const llmMode = options.llmMode ?? 'contextual';
    const profile = this.studentService.getProfile(studentId);
    const recovery = this.gamificationService.getRecoveryState(studentId);
    const inRecoveryMode =
      recovery.isRecoveryActive ||
      recovery.continuitySignal === 'recovery_suggested';
    const missions = this.gamificationService.listStudentMissions(studentId, {
      filter: 'all',
    });
    const publishedResources = this.resourceService.listPublished();
    const resourcesByCode = new Map(
      publishedResources
        .filter((r) => r.status === 'PUBLISHED')
        .map((r) => [r.code, r]),
    );

    const availableMinutes = Math.max(
      10,
      Math.round((profile.weeklyAvailabilityMinutes || 120) / 5),
    );

    const dismissedMissions = new Set<string>();
    for (const item of this.itemsById.values()) {
      if (
        item.studentId === studentId &&
        item.studentAction === 'DISMISS_SIMILAR'
      ) {
        dismissedMissions.add(item.missionId);
      }
    }

    const candidates = missions.filter(({ template, assignment }) => {
      if (assignment.status === 'completed') {
        return false;
      }
      if (dismissedMissions.has(template.code)) {
        return false;
      }
      if (inRecoveryMode) {
        return template.isRecoveryEligible && template.effort === 'LOW';
      }
      return true;
    });

    const scored = candidates.map(({ template }) => {
      const canonicalCategory =
        CATEGORY_MAP[template.category] ?? 'ACADEMIC_PLANNING';
      const candidateResourceCode = RESOURCE_BY_CATEGORY[canonicalCategory];
      const verifiedResource = candidateResourceCode
        ? resourcesByCode.get(candidateResourceCode)
        : undefined;

      const needFit = inRecoveryMode
        ? template.isRecoveryEligible
          ? 1.0
          : 0.5
        : 0.95;
      const timeFit =
        template.durationMinutes <= availableMinutes ? 1.0 : 0.65;
      const difficultyFit =
        inRecoveryMode || profile.perceivedLoad === 'high'
          ? template.effort === 'LOW'
            ? 1.0
            : 0.45
          : 0.9;
      const continuityFit = inRecoveryMode ? 1.0 : 0.85;
      const resourceFit = verifiedResource ? 1.0 : 0.5;
      const diversityFit = 0.9;

      const breakdown: GatewayRecommendationScoreBreakdown = {
        needFit,
        timeFit,
        difficultyFit,
        continuityFit,
        resourceFit,
        diversityFit,
      };
      const score = computeWeightedScore(breakdown);

      let reasonCode: GatewayRecommendationReasonCode = 'PRIORITY_ALIGNMENT';
      if (inRecoveryMode) {
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

    const generated: GatewayRecommendationItem[] = top.map((entry, idx) => {
      const {
        template,
        canonicalCategory,
        verifiedResource,
        breakdown,
        score,
        reasonCode,
      } = entry;
      let fallbackUsed = false;
      let source: GatewayRecommendationSource = 'ONLINE_RULES';
      let promptVersion: string | null = null;
      let modelVersion: string | null = null;

      const resourceSuffix = verifiedResource
        ? ` Conecta con el recurso verificado «${verifiedResource.title}».`
        : '';

      const deterministicRationale = inRecoveryMode
        ? `Priorizada por regla determinista de modo recuperación: acción ligera de ${template.durationMinutes} min sin penalización.${resourceSuffix}`
        : `Sugerida por coincidencia con tus prioridades y tu disponibilidad de ${availableMinutes} min diarios.${resourceSuffix}`;

      let rationale = deterministicRationale;

      if (llmMode === 'simulate_failure') {
        fallbackUsed = true;
        source = 'ONLINE_RULES';
      } else if (llmMode === 'contextual') {
        const candidateAiText = inRecoveryMode
          ? `Te proponemos «${template.title}» (${template.durationMinutes} min) porque activaste el modo recuperación y priorizamos pasos breves sin presión.${resourceSuffix}`
          : `Seleccionamos «${template.title}» (${template.durationMinutes} min) porque apoya tus prioridades actuales respetando tu ritmo semanal.${resourceSuffix}`;
        if (isNonStigmatizingRationale(candidateAiText)) {
          rationale = candidateAiText;
          source = 'ONLINE_AI';
          promptVersion = 'prompt-rec-v1.0.0';
          modelVersion = 'gemini-2.5-flash-controlled';
        } else {
          fallbackUsed = true;
        }
      }

      const recommendationId = `rec-${studentId.slice(-6)}-${template.code.toLowerCase()}-${idx + 1}`;
      const item: GatewayRecommendationItem = {
        recommendationId,
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

      this.itemsById.set(recommendationId, item);
      this.traces.push({
        recommendationId,
        participantIdPseudonym: pseudonym,
        resourceId: item.resourceId,
        missionId: item.missionId,
        reasonCode,
        ruleVersion: item.ruleVersion,
        promptVersion,
        modelVersion,
        shownAt: nowIso,
        studentAction: null,
      });

      return item;
    });

    this.idsByStudent.set(
      studentId,
      generated.map((g) => g.recommendationId),
    );
    return generated;
  }

  recordAction(
    studentId: string,
    recommendationId: string,
    input: GatewayRecordRecommendationActionRequest,
  ): GatewayRecommendationItem {
    if (
      !input?.action ||
      !GATEWAY_STUDENT_RECOMMENDATION_ACTIONS.includes(input.action)
    ) {
      throw new BadRequestException(
        `Acción de recomendación inválida. Valores permitidos: ${GATEWAY_STUDENT_RECOMMENDATION_ACTIONS.join(', ')}`,
      );
    }

    let existing = this.itemsById.get(recommendationId);
    if (!existing) {
      this.listForStudent(studentId);
      existing = this.itemsById.get(recommendationId);
    }
    if (!existing || existing.studentId !== studentId) {
      throw new NotFoundException(
        `No se encontró la recomendación ${recommendationId} para el estudiante.`,
      );
    }

    const nowIso = new Date().toISOString();
    const updated: GatewayRecommendationItem = {
      ...existing,
      studentAction: input.action,
      editedNotes: input.editedNotes?.trim() || existing.editedNotes,
      postponedUntil: input.postponedUntil?.trim() || existing.postponedUntil,
      actedAt: nowIso,
    };

    this.itemsById.set(recommendationId, updated);

    for (let i = 0; i < this.traces.length; i += 1) {
      const trace = this.traces[i];
      if (trace && trace.recommendationId === recommendationId) {
        this.traces[i] = {
          ...trace,
          studentAction: input.action,
        };
      }
    }

    if (input.action === 'ACCEPT') {
      this.gamificationService.acceptMission(
        studentId,
        existing.missionId,
        input.clientEventId ?? `rec-accept-${recommendationId}`,
      );
    }

    return updated;
  }

  listTracesForStudent(studentId: string): GatewayRecommendationTraceRecord[] {
    const pseudonym = `pseudo-${studentId.slice(-6)}`;
    return this.traces.filter((t) => t.participantIdPseudonym === pseudonym);
  }
}
