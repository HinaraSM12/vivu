import { type FormEvent, useState } from 'react';
import {
  AuthClientError,
  type AuthSession,
  defaultAuthClient,
  SEED_DEMO_PASSWORD,
} from '../features/auth/auth-client';
import {
  defaultGamificationClient,
  type MissionCategoryCode,
  type MissionFeedbackBannerView,
  type MissionListFilter,
  type StudentMissionView,
  type StudentProgressSummaryView,
} from '../features/gamification/gamification-client';
import {
  defaultRecommendationClient,
  type RecommendationLlmMode,
  type RecommendationView,
  type StudentRecommendationAction,
} from '../features/recommendations/recommendation-client';
import {
  defaultSprint4Client,
  type InstitutionalResourceView,
  type RecoveryChoiceCode,
  type RecoveryStateView,
  type ResourceCategoryCode,
} from '../features/resources-surveys-recovery/sprint4-client';
import {
  defaultStudentContextClient,
  type PerceivedLoad,
  type PreferredTone,
  type StudentConsentRecord,
  type StudentPersonalizationPreferences,
  type StudentProfileRecord,
} from '../features/student/student-context-client';
import type { RoleCode } from '../local-data/session-snapshot';

type AuthScreenMode = 'login' | 'register';

const STUDENT_DESTINATIONS = [
  'Inicio',
  'Misiones',
  'Recomendaciones',
  'Progreso',
  'Recursos',
  'Perfil',
] as const;

const FACILITATOR_DESTINATIONS = [
  'Resumen',
  'Estudiantes asignados',
  'Seguimientos',
  'Recursos',
  'Perfil',
] as const;

const PROFESSOR_DESTINATIONS = [
  'Resumen',
  'Mis recursos registrados',
  'Registrar nuevo apoyo',
  'Estado de moderación',
  'Perfil',
] as const;

const ADMIN_DESTINATIONS = [
  'Resumen',
  'Usuarios y asignaciones',
  'Misiones',
  'Recursos',
  'Reglas de ludificación',
  'Recomendaciones / IA',
  'Microcuestionarios',
  'Analítica',
  'Exportaciones',
] as const;

export function App() {
  const [authMode, setAuthMode] = useState<AuthScreenMode>('login');
  const [session, setSession] = useState<AuthSession | null>(null);
  const [activeViewRole, setActiveViewRole] = useState<RoleCode>('STUDENT');
  const [activeSection, setActiveSection] = useState<string>('Inicio');

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusBanner, setStatusBanner] = useState<string | null>(null);

  // Sprint 2: Consentimiento, Onboarding y Perfil
  const [consent, setConsent] = useState<StudentConsentRecord | null>(null);
  const [preferences, setPreferences] =
    useState<StudentPersonalizationPreferences | null>(null);
  const [profile, setProfile] = useState<StudentProfileRecord | null>(null);
  const [consentChecked, setConsentChecked] = useState<boolean>(false);
  const [allowOptionalWellbeing, setAllowOptionalWellbeing] =
    useState<boolean>(true);
  const [onboardingStep, setOnboardingStep] = useState<number>(1);

  // Campos de formulario de Onboarding / Perfil
  const [programInput, setProgramInput] = useState<string>(
    'Ingeniería de Sistemas e Informática',
  );
  const [semesterInput, setSemesterInput] = useState<number>(1);
  const [loadInput, setLoadInput] = useState<PerceivedLoad>('moderate');
  const [subjectsInput, setSubjectsInput] = useState<string>('Cálculo Diferencial');
  const [availabilityInput, setAvailabilityInput] = useState<number>(120);
  const [responsibilitiesInput, setResponsibilitiesInput] =
    useState<string>('familia');
  const [practicesInput, setPracticesInput] = useState<string>(
    'planificacion_semanal',
  );
  const [interestsInput, setInterestsInput] =
    useState<string>('organizacion, monitorias');
  const [motivationInput, setMotivationInput] = useState<1 | 2 | 3 | 4 | 5>(4);
  const [goalInput, setGoalInput] = useState<string>(
    'Avanzar con pasos pequeños y realistas cada semana',
  );
  const [preferredToneInput, setPreferredToneInput] =
    useState<PreferredTone>('warm');

  // Sprint 3: Misiones, Ludificación No Competitiva y Progreso
  const [missions, setMissions] = useState<StudentMissionView[]>([]);
  const [progressSummary, setProgressSummary] =
    useState<StudentProgressSummaryView | null>(null);
  const [missionFilter, setMissionFilter] = useState<MissionListFilter>('all');
  const [missionCategoryFilter, setMissionCategoryFilter] = useState<
    MissionCategoryCode | 'ALL'
  >('ALL');
  const [selectedMissionCode, setSelectedMissionCode] = useState<string | null>(
    null,
  );
  const [reflectionNoteInput, setReflectionNoteInput] = useState<string>('');
  const [skipReasonInput, setSkipReasonInput] = useState<string>('');
  const [completionFeedback, setCompletionFeedback] =
    useState<MissionFeedbackBannerView | null>(null);

  // Sprint 4: Recursos Institucionales, Microcuestionarios y Modo Recuperación
  const [publishedResources, setPublishedResources] = useState<
    InstitutionalResourceView[]
  >([]);
  const [recoveryState, setRecoveryState] = useState<RecoveryStateView | null>(
    null,
  );
  const [submittedSurveyCodes, setSubmittedSurveyCodes] = useState<string[]>(
    [],
  );
  const [contribTitleInput, setContribTitleInput] = useState<string>('');
  const [contribSummaryInput, setContribSummaryInput] = useState<string>('');
  const [contribCategoryInput, setContribCategoryInput] =
    useState<ResourceCategoryCode>('ACADEMIC_SUPPORT');
  const [contribUnitInput, setContribUnitInput] = useState<string>(
    'Departamento de Ingeniería de Sistemas',
  );

  // Sprint 5: Recomendador V1 Online (Híbrido Determinista + LLM Instrumental)
  const [recommendations, setRecommendations] = useState<RecommendationView[]>(
    [],
  );
  const [llmMode, setLlmMode] = useState<RecommendationLlmMode>('contextual');
  const [editRecNoteInput, setEditRecNoteInput] = useState<string>('');

  const syncGamificationState = (
    studentId: string,
    filter: MissionListFilter = missionFilter,
    category: MissionCategoryCode | 'ALL' = missionCategoryFilter,
  ) => {
    setMissions(
      defaultGamificationClient.listStudentMissions(
        studentId,
        filter,
        category,
      ),
    );
    setProgressSummary(defaultGamificationClient.getStudentProgress(studentId));
    setPublishedResources(defaultSprint4Client.listPublishedResources('ALL'));
    setRecoveryState(defaultSprint4Client.getRecoveryState(studentId));
    setSubmittedSurveyCodes(
      defaultSprint4Client.getSubmittedSurveys(studentId),
    );
    setRecommendations(
      defaultRecommendationClient.listRecommendations(studentId, llmMode),
    );
  };

  const syncStudentStateFromStore = (studentId: string) => {
    const loadedConsent = defaultStudentContextClient.getConsent(studentId);
    const loadedPrefs = defaultStudentContextClient.getPreferences(studentId);
    const loadedProfile = defaultStudentContextClient.getProfile(studentId);

    setConsent(loadedConsent);
    setPreferences(loadedPrefs);
    setProfile(loadedProfile);
    setConsentChecked(loadedConsent.status === 'accepted');
    setAllowOptionalWellbeing(loadedPrefs.allowOptionalWellbeingContext);
    setPreferredToneInput(loadedPrefs.preferredTone);

    setProgramInput(
      loadedProfile.engineeringProgram ||
        'Ingeniería de Sistemas e Informática',
    );
    setSemesterInput(loadedProfile.semester || 1);
    setLoadInput(loadedProfile.perceivedLoad || 'moderate');
    setSubjectsInput(loadedProfile.difficultSubjects.join(', '));
    setAvailabilityInput(loadedProfile.weeklyAvailabilityMinutes || 120);
    setResponsibilitiesInput(
      loadedProfile.externalResponsibilities.join(', '),
    );
    setPracticesInput(loadedProfile.studyPractices.join(', '));
    setInterestsInput(loadedProfile.interests.join(', '));
    setMotivationInput(loadedProfile.wellbeingInputs?.motivationLevel ?? 4);
    setGoalInput(
      loadedProfile.wellbeingInputs?.preferredSupportGoal ??
        'Avanzar con pasos pequeños y realistas cada semana',
    );
    setOnboardingStep(1);
    syncGamificationState(studentId, 'all', 'ALL');
  };

  const applyAuthenticatedSession = (established: AuthSession) => {
    const primaryRole = established.user.roles[0] ?? 'STUDENT';
    setSession(established);
    setActiveViewRole(primaryRole);
    setActiveSection(primaryRole === 'STUDENT' ? 'Inicio' : 'Resumen');
    setStatusBanner(null);

    if (primaryRole === 'STUDENT') {
      syncStudentStateFromStore(established.user.userId);
    }
  };

  const handleLoginSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    try {
      const established = defaultAuthClient.login({ email, password });
      applyAuthenticatedSession(established);
    } catch (error) {
      if (error instanceof AuthClientError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('No fue posible iniciar sesión en este momento.');
      }
    }
  };

  const handleRegisterSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    try {
      const established = defaultAuthClient.registerStudent({
        email,
        password,
        confirmPassword,
      });
      applyAuthenticatedSession(established);
    } catch (error) {
      if (error instanceof AuthClientError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('No fue posible crear la cuenta en este momento.');
      }
    }
  };

  const handleQuickDemoLogin = (demoEmail: string) => {
    setErrorMessage(null);
    const established = defaultAuthClient.login({
      email: demoEmail,
      password: SEED_DEMO_PASSWORD,
    });
    applyAuthenticatedSession(established);
  };

  const handleLogout = () => {
    defaultAuthClient.logout();
    setSession(null);
    setConsent(null);
    setPreferences(null);
    setProfile(null);
    setMissions([]);
    setProgressSummary(null);
    setSelectedMissionCode(null);
    setCompletionFeedback(null);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setErrorMessage(null);
    setStatusBanner(null);
    setAuthMode('login');
  };

  const handleFilterChange = (
    newFilter: MissionListFilter,
    newCategory: MissionCategoryCode | 'ALL' = missionCategoryFilter,
  ) => {
    setMissionFilter(newFilter);
    setMissionCategoryFilter(newCategory);
    if (session) {
      syncGamificationState(session.user.userId, newFilter, newCategory);
    }
  };

  const handleAcceptMission = (missionCode: string) => {
    if (!session) return;
    defaultGamificationClient.acceptMission(session.user.userId, missionCode);
    syncGamificationState(session.user.userId);
    setSelectedMissionCode(missionCode);
    setCompletionFeedback(null);
    setStatusBanner(
      'Misión aceptada. Puedes empezarla ahora o retomarla cuando mejor se ajuste a tu día.',
    );
  };

  const handleStartMission = (missionCode: string) => {
    if (!session) return;
    defaultGamificationClient.startMission(session.user.userId, missionCode);
    syncGamificationState(session.user.userId);
    setSelectedMissionCode(missionCode);
    setCompletionFeedback(null);
  };

  const handlePauseMission = (missionCode: string) => {
    if (!session) return;
    defaultGamificationClient.pauseMission(session.user.userId, missionCode);
    syncGamificationState(session.user.userId);
    setStatusBanner(
      'Misión en pausa. Tu avance se conserva sin ningún tipo de penalización.',
    );
  };

  const handleSkipMission = (missionCode: string) => {
    if (!session) return;
    defaultGamificationClient.skipMission(
      session.user.userId,
      missionCode,
      skipReasonInput,
    );
    syncGamificationState(session.user.userId);
    setSkipReasonInput('');
    setSelectedMissionCode(null);
    setStatusBanner(
      'Misión pospuesta para otro momento sin afectar tu nivel ni tus logros.',
    );
  };

  const handleCompleteMission = (missionCode: string) => {
    if (!session) return;
    const result = defaultGamificationClient.completeMission(
      session.user.userId,
      missionCode,
      reflectionNoteInput,
    );
    syncGamificationState(session.user.userId);
    setReflectionNoteInput('');
    setCompletionFeedback(result.feedback ?? null);
  };

  const handleActivateRecovery = (choice: RecoveryChoiceCode) => {
    if (!session) return;
    const updated = defaultSprint4Client.activateRecovery(
      session.user.userId,
      choice,
    );
    setRecoveryState(updated);
    setRecommendations(
      defaultRecommendationClient.refreshRecommendations(
        session.user.userId,
        llmMode,
      ),
    );
    setStatusBanner(
      'Modo recuperación activado sin penalización. Retomar con algo pequeño también cuenta.',
    );
  };

  const handleRefreshRecommendations = (mode: RecommendationLlmMode) => {
    if (!session) return;
    setLlmMode(mode);
    const refreshed = defaultRecommendationClient.refreshRecommendations(
      session.user.userId,
      mode,
    );
    setRecommendations(refreshed);
    setStatusBanner(
      mode === 'simulate_failure'
        ? 'Fallback determinista activado (ONLINE_RULES) tras indisponibilidad del componente LLM.'
        : 'Recomendaciones actualizadas con reglas deterministas v1.0.0.',
    );
  };

  const handleRecommendationAction = (
    recommendationId: string,
    action: StudentRecommendationAction,
  ) => {
    if (!session) return;
    const updated = defaultRecommendationClient.recordAction(
      session.user.userId,
      recommendationId,
      action,
      {
        editedNotes:
          action === 'EDIT'
            ? editRecNoteInput || 'Meta ajustada a mi ritmo semanal'
            : undefined,
        postponedUntil: action === 'POSTPONE' ? 'Próxima semana' : undefined,
      },
    );
    setRecommendations(updated);
    syncGamificationState(session.user.userId);
    setEditRecNoteInput('');
    setStatusBanner(
      `Acción de agencia «${action}» registrada sobre la recomendación con trazabilidad completa.`,
    );
  };

  const handleSubmitMicroSurvey = (surveyCode: string) => {
    if (!session) return;
    const submitted = defaultSprint4Client.submitSurvey(
      session.user.userId,
      surveyCode,
    );
    setSubmittedSurveyCodes(submitted);
    setStatusBanner(
      `Microcuestionario ${surveyCode} registrado. ¡Gracias por compartir tu experiencia esta semana!`,
    );
  };

  const handleSubmitProfessorResource = () => {
    if (!contribTitleInput.trim() || !contribSummaryInput.trim()) {
      setErrorMessage(
        'Completa el título y el resumen del recurso institucional.',
      );
      return;
    }
    setErrorMessage(null);
    const created = defaultSprint4Client.submitResourceProposal({
      title: contribTitleInput,
      summary: contribSummaryInput,
      category: contribCategoryInput,
      organizerUnit: contribUnitInput,
    });
    setContribTitleInput('');
    setContribSummaryInput('');
    setStatusBanner(
      `Propuesta de recurso "${created.title}" (${created.code}) enviada en estado ${created.status} para revisión humana.`,
    );
  };

  const handleAcceptConsent = () => {
    if (!session) {
      return;
    }
    if (!consentChecked) {
      setErrorMessage(
        'Para continuar con el onboarding del piloto debes marcar la casilla de aceptación voluntaria.',
      );
      return;
    }

    setErrorMessage(null);
    const result = defaultStudentContextClient.acceptConsent(
      session.user.userId,
      {
        allowPersonalization: true,
        allowOptionalWellbeingContext: allowOptionalWellbeing,
        preferredTone: preferredToneInput,
      },
    );
    setConsent(result.consent);
    setPreferences(result.preferences);
    setOnboardingStep(1);
    setStatusBanner(
      'Consentimiento informado v1.0 registrado. Ahora configuremos tu contexto inicial.',
    );
  };

  const handleWithdrawConsent = () => {
    if (!session) {
      return;
    }
    const result = defaultStudentContextClient.withdrawConsent(
      session.user.userId,
    );
    setConsent(result.consent);
    setPreferences(result.preferences);
    setProfile(defaultStudentContextClient.getProfile(session.user.userId));
    setConsentChecked(false);
    setStatusBanner(
      'Has retirado tu consentimiento. Se detuvo la personalización y se limpió el contexto opcional de bienestar sin ninguna consecuencia académica.',
    );
  };

  const handleSaveStudentProfile = (skipOptionalWellbeing = false) => {
    if (!session) {
      return;
    }
    setErrorMessage(null);

    try {
      defaultStudentContextClient.updatePreferences(session.user.userId, {
        allowPersonalization: preferences?.allowPersonalization ?? true,
        allowOptionalWellbeingContext: skipOptionalWellbeing
          ? false
          : allowOptionalWellbeing,
        preferredTone: preferredToneInput,
      });

      const saved = defaultStudentContextClient.saveProfile(
        session.user.userId,
        {
          engineeringProgram: programInput,
          semester: Number(semesterInput),
          perceivedLoad: loadInput,
          difficultSubjects: subjectsInput
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
          weeklyAvailabilityMinutes: Number(availabilityInput),
          externalResponsibilities: responsibilitiesInput
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
          studyPractices: practicesInput
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
          interests: interestsInput
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
          wellbeingInputs:
            !skipOptionalWellbeing && allowOptionalWellbeing
              ? {
                  motivationLevel: motivationInput,
                  stressPerception: loadInput,
                  preferredSupportGoal: goalInput,
                }
              : null,
        },
      );

      setProfile(saved);
      setPreferences(
        defaultStudentContextClient.getPreferences(session.user.userId),
      );
      setActiveSection('Inicio');
      setStatusBanner(
        'Tu contexto y preferencias fueron actualizados. Puedes modificarlos cuando quieras.',
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'No fue posible guardar el perfil.',
      );
    }
  };

  if (!session) {
    return (
      <main className="platform-shell">
        <div className="auth-layout">
          <p className="eyebrow">Vivu</p>
          <h1>Acompañamiento académico</h1>
          <p className="subtitle">
            {authMode === 'login'
              ? 'Vuelve a tus próximos pasos. Una base de baja presión para convertir objetivos académicos en pasos pequeños y alcanzables.'
              : 'Crea tu cuenta de estudiante para comenzar tu acompañamiento académico.'}
          </p>

          <section
            className="vivu-card"
            aria-label={
              authMode === 'login'
                ? 'Formulario de inicio de sesión'
                : 'Formulario de registro de estudiante'
            }
          >
            <h2>{authMode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}</h2>

            {errorMessage ? (
              <div className="alert-error" role="alert">
                {errorMessage}
              </div>
            ) : null}

            {authMode === 'login' ? (
              <form onSubmit={handleLoginSubmit} noValidate>
                <div className="form-field">
                  <label htmlFor="login-email">
                    Correo institucional o de prueba
                  </label>
                  <input
                    id="login-email"
                    className="vivu-input"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="est.activo@vivu.local"
                    required
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="login-password">Contraseña</label>
                  <div className="input-row">
                    <input
                      id="login-password"
                      className="vivu-input"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-tertiary"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? 'Ocultar' : 'Mostrar'}
                    </button>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-full">
                  Entrar
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} noValidate>
                <div className="alert-info">
                  El autoregistro crea únicamente una cuenta con rol{' '}
                  <strong>STUDENT</strong>. El consentimiento informado y tu
                  contexto inicial se configurarán en el siguiente paso.
                </div>

                <div className="form-field">
                  <label htmlFor="register-email">Correo electrónico</label>
                  <input
                    id="register-email"
                    className="vivu-input"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu.correo@vivu.local"
                    required
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="register-password">
                    Contraseña (mínimo 8 caracteres)
                  </label>
                  <input
                    id="register-password"
                    className="vivu-input"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="register-confirm-password">
                    Confirmar contraseña
                  </label>
                  <input
                    id="register-confirm-password"
                    className="vivu-input"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-full">
                  Crear cuenta
                </button>
              </form>
            )}

            <div className="demo-box">
              {authMode === 'login' ? (
                <button
                  type="button"
                  className="btn btn-secondary btn-full"
                  onClick={() => {
                    setErrorMessage(null);
                    setAuthMode('register');
                  }}
                >
                  ¿Aún no tienes cuenta? Crear cuenta de estudiante
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-secondary btn-full"
                  onClick={() => {
                    setErrorMessage(null);
                    setAuthMode('login');
                  }}
                >
                  ¿Ya tienes cuenta? Volver a iniciar sesión
                </button>
              )}

              <p
                className="subtitle"
                style={{ marginTop: '1rem', marginBottom: '0.25rem' }}
              >
                Accesos sintéticos de prueba (Sprints 1 y 2):
              </p>
              <div className="demo-buttons">
                <button
                  type="button"
                  className="btn btn-tertiary"
                  onClick={() => handleQuickDemoLogin('est.activo@vivu.local')}
                >
                  Entrar como STUDENT
                </button>
                <button
                  type="button"
                  className="btn btn-tertiary"
                  onClick={() =>
                    handleQuickDemoLogin('profesor.ingenieria@vivu.local')
                  }
                >
                  Entrar como PROFESSOR
                </button>
                <button
                  type="button"
                  className="btn btn-tertiary"
                  onClick={() =>
                    handleQuickDemoLogin('facilitador.ingenieria@vivu.local')
                  }
                >
                  Entrar como FACILITATOR
                </button>
                <button
                  type="button"
                  className="btn btn-tertiary"
                  onClick={() => handleQuickDemoLogin('admin.piloto@vivu.local')}
                >
                  Entrar como ADMIN
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  }

  const userRoles = session.user.roles;
  const primaryRole = userRoles[0] ?? 'STUDENT';
  const isAuthorizedForActiveView =
    userRoles.includes(activeViewRole) ||
    ((activeViewRole === 'FACILITATOR' || activeViewRole === 'PROFESSOR') &&
      userRoles.includes('ADMIN'));

  const destinations =
    activeViewRole === 'STUDENT'
      ? STUDENT_DESTINATIONS
      : activeViewRole === 'PROFESSOR'
        ? PROFESSOR_DESTINATIONS
        : activeViewRole === 'FACILITATOR'
          ? FACILITATOR_DESTINATIONS
          : ADMIN_DESTINATIONS;

  const needsConsentGate =
    activeViewRole === 'STUDENT' && consent?.status !== 'accepted';
  const needsOnboardingGate =
    activeViewRole === 'STUDENT' &&
    consent?.status === 'accepted' &&
    !profile?.onboardingCompleted;

  return (
    <main className="platform-shell">
      <header className="role-header">
        <div>
          <p className="eyebrow">Vivu</p>
          <h1>Acompañamiento académico</h1>
          <p className="subtitle" style={{ marginBottom: 0 }}>
            Sesión iniciada como <strong>{session.user.email}</strong> · Rol{' '}
            <span className="role-chip">{primaryRole}</span>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span className="sync-pill">
            {session.user.capabilities.canOperateOffline
              ? 'Conectado · Sesión preparada para modo offline futuro'
              : 'Conectado · Operación online requerida'}
          </span>
          <button
            type="button"
            className="btn btn-tertiary"
            onClick={handleLogout}
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      {statusBanner ? (
        <div className="alert-info" role="status">
          {statusBanner}
        </div>
      ) : null}

      {errorMessage ? (
        <div className="alert-error" role="alert">
          {errorMessage}
        </div>
      ) : null}

      {!isAuthorizedForActiveView ? (
        <section className="vivu-card" role="alert">
          <h2>Acceso no autorizado (403)</h2>
          <p className="subtitle">
            Tu cuenta con rol <strong>{primaryRole}</strong> no tiene permisos
            para acceder al panel de <strong>{activeViewRole}</strong>.
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setActiveViewRole(primaryRole);
              setActiveSection(
                primaryRole === 'STUDENT' ? 'Inicio' : 'Resumen',
              );
            }}
          >
            Volver a mi panel ({primaryRole})
          </button>
        </section>
      ) : needsConsentGate ? (
        <section
          className="vivu-card"
          aria-label="Consentimiento informado y participación"
        >
          <h2>Consentimiento informado y participación (v1.0)</h2>
          <p className="subtitle">
            Tu participación en el piloto de Vivu es completamente voluntaria.
            No recolectamos calificaciones oficiales, historia académica
            restringida ni realizamos diagnósticos clínicos.
          </p>
          <div className="alert-info">
            <p style={{ margin: '0 0 0.5rem' }}>
              <strong>¿Cómo se usan tus datos y la IA?</strong>
            </p>
            <p style={{ margin: 0 }}>
              Usamos tu contexto autorreportado (programa, semestre,
              disponibilidad y prácticas) junto con reglas de Vivu y apoyo de IA
              solo para explicarte y sugerirte misiones y recursos
              institucionales autorizados. Puedes retirar tu consentimiento en
              cualquier momento desde tu Perfil.
            </p>
          </div>

          <div className="form-field">
            <label>
              <input
                type="checkbox"
                checked={consentChecked}
                onChange={(e) => setConsentChecked(e.target.checked)}
              />{' '}
              He leído la información del estudio y acepto participar
              voluntariamente (Versión 1.0).
            </label>
          </div>

          <div className="form-field">
            <label>
              <input
                type="checkbox"
                checked={allowOptionalWellbeing}
                onChange={(e) => setAllowOptionalWellbeing(e.target.checked)}
              />{' '}
              Autorizo incluir mi autopercepción opcional de bienestar/motivación
              para ajustar mejor la carga de mis misiones.
            </label>
          </div>

          <div className="demo-buttons">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleAcceptConsent}
            >
              Aceptar consentimiento y continuar
            </button>
            <button
              type="button"
              className="btn btn-tertiary"
              onClick={handleLogout}
            >
              No aceptar por ahora y salir
            </button>
          </div>
        </section>
      ) : needsOnboardingGate ? (
        <section
          className="vivu-card"
          aria-label="Configuración inicial paso a paso"
        >
          <p className="eyebrow">Paso {onboardingStep} de 5</p>
          <h2>Configura tu semana en Vivu (Onboarding)</h2>
          <p className="subtitle">
            Puedes cambiar esta información cuando quieras desde tu perfil.
          </p>

          {onboardingStep === 1 ? (
            <div>
              <h3>1. Contexto académico mínimo</h3>
              <div className="form-field">
                <label htmlFor="onb-program">Programa de ingeniería</label>
                <input
                  id="onb-program"
                  className="vivu-input"
                  value={programInput}
                  onChange={(e) => setProgramInput(e.target.value)}
                />
              </div>
              <div className="form-field">
                <label htmlFor="onb-semester">Semestre actual (1 a 12)</label>
                <input
                  id="onb-semester"
                  className="vivu-input"
                  type="number"
                  min={1}
                  max={12}
                  value={semesterInput}
                  onChange={(e) => setSemesterInput(Number(e.target.value))}
                />
              </div>
            </div>
          ) : null}

          {onboardingStep === 2 ? (
            <div>
              <h3>2. Carga y asignaturas retadoras</h3>
              <div className="form-field">
                <label htmlFor="onb-load">Carga académica percibida</label>
                <select
                  id="onb-load"
                  className="vivu-input"
                  value={loadInput}
                  onChange={(e) =>
                    setLoadInput(e.target.value as PerceivedLoad)
                  }
                >
                  <option value="low">Baja / manejable</option>
                  <option value="moderate">Moderada</option>
                  <option value="high">Alta / semana exigente</option>
                </select>
              </div>
              <div className="form-field">
                <label htmlFor="onb-subjects">
                  Materias o áreas que sientes más retadoras (separadas por coma,
                  sin calificaciones)
                </label>
                <input
                  id="onb-subjects"
                  className="vivu-input"
                  value={subjectsInput}
                  onChange={(e) => setSubjectsInput(e.target.value)}
                />
              </div>
            </div>
          ) : null}

          {onboardingStep === 3 ? (
            <div>
              <h3>3. Disponibilidad y responsabilidades</h3>
              <div className="form-field">
                <label htmlFor="onb-availability">
                  Minutos semanales disponibles para microacciones (15 a 1200)
                </label>
                <input
                  id="onb-availability"
                  className="vivu-input"
                  type="number"
                  min={15}
                  max={1200}
                  value={availabilityInput}
                  onChange={(e) =>
                    setAvailabilityInput(Number(e.target.value))
                  }
                />
              </div>
              <div className="form-field">
                <label htmlFor="onb-resp">
                  Responsabilidades externas (trabajo, familia, transporte, etc.)
                </label>
                <input
                  id="onb-resp"
                  className="vivu-input"
                  value={responsibilitiesInput}
                  onChange={(e) => setResponsibilitiesInput(e.target.value)}
                />
              </div>
            </div>
          ) : null}

          {onboardingStep === 4 ? (
            <div>
              <h3>4. Prácticas de estudio e intereses</h3>
              <div className="form-field">
                <label htmlFor="onb-practices">
                  Prácticas de estudio actuales (separadas por coma)
                </label>
                <input
                  id="onb-practices"
                  className="vivu-input"
                  value={practicesInput}
                  onChange={(e) => setPracticesInput(e.target.value)}
                />
              </div>
              <div className="form-field">
                <label htmlFor="onb-interests">
                  Intereses o apoyos que te llaman la atención
                </label>
                <input
                  id="onb-interests"
                  className="vivu-input"
                  value={interestsInput}
                  onChange={(e) => setInterestsInput(e.target.value)}
                />
              </div>
            </div>
          ) : null}

          {onboardingStep === 5 ? (
            <div>
              <h3>5. Organización del tiempo y meta de autorregulación (Opcional)</h3>
              <div className="form-field">
                <label htmlFor="onb-motivation">
                  ¿Cómo percibes tu disposición para organizar el estudio esta semana? (1 a 5)
                </label>
                <input
                  id="onb-motivation"
                  className="vivu-input"
                  type="number"
                  min={1}
                  max={5}
                  value={motivationInput}
                  onChange={(e) =>
                    setMotivationInput(
                      Number(e.target.value) as 1 | 2 | 3 | 4 | 5,
                    )
                  }
                />
              </div>
              <div className="form-field">
                <label htmlFor="onb-goal">
                  ¿Qué acción de autorregulación u organización te gustaría lograr con el apoyo de Vivu?
                </label>
                <input
                  id="onb-goal"
                  className="vivu-input"
                  value={goalInput}
                  onChange={(e) => setGoalInput(e.target.value)}
                />
              </div>
            </div>
          ) : null}

          <div className="demo-buttons" style={{ marginTop: '1rem' }}>
            {onboardingStep > 1 ? (
              <button
                type="button"
                className="btn btn-tertiary"
                onClick={() => setOnboardingStep((prev) => prev - 1)}
              >
                Paso anterior
              </button>
            ) : null}

            {onboardingStep < 5 ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setOnboardingStep((prev) => prev + 1)}
              >
                Siguiente paso
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleSaveStudentProfile(false)}
                >
                  Finalizar onboarding y guardar perfil
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => handleSaveStudentProfile(true)}
                >
                  Omitir paso opcional y guardar
                </button>
              </>
            )}
          </div>
        </section>
      ) : (
        <section className="vivu-card">
          <nav aria-label={`Navegación principal ${activeViewRole}`}>
            <ul className="nav-list">
              {destinations.map((dest) => (
                <li key={dest}>
                  <button
                    type="button"
                    className={
                      activeSection === dest
                        ? 'btn btn-primary'
                        : 'btn btn-tertiary'
                    }
                    onClick={() => setActiveSection(dest)}
                  >
                    {dest}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {activeViewRole === 'STUDENT' && activeSection !== 'Perfil' ? (
            <div>
              <h2>Espacio del Estudiante — {activeSection}</h2>
              <p className="subtitle">
                Elige una misión que encaje con tu semana. Tu progreso es
                personal, sin rankings públicos ni comparaciones competitivas.
              </p>
              {profile ? (
                <div className="alert-info">
                  Contexto activo: <strong>{profile.engineeringProgram}</strong>{' '}
                  · Semestre {profile.semester} · Disponibilidad semanal:{' '}
                  {profile.weeklyAvailabilityMinutes} min · Versión de perfil v
                  {profile.version}
                </div>
              ) : null}

              {completionFeedback ? (
                <div
                  className="alert-info"
                  role="status"
                  style={{ marginTop: '0.75rem' }}
                >
                  <h3>
                    Misión completada: {completionFeedback.missionTitle}
                  </h3>
                  <p>{completionFeedback.encouragingMessage}</p>
                  <p>
                    <strong>{completionFeedback.levelProgressSummary}</strong>
                  </p>
                  {completionFeedback.unlockedAchievement ? (
                    <p>
                      Logro personal desbloqueado:{' '}
                      <strong>
                        {completionFeedback.unlockedAchievement.title}
                      </strong>{' '}
                      — {completionFeedback.unlockedAchievement.description}
                    </p>
                  ) : null}
                  <div className="demo-buttons" style={{ marginTop: '0.5rem' }}>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        setCompletionFeedback(null);
                        setSelectedMissionCode(null);
                        setActiveSection('Progreso');
                      }}
                    >
                      Ver progreso
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setCompletionFeedback(null);
                        setSelectedMissionCode(null);
                        setActiveSection('Misiones');
                      }}
                    >
                      Elegir otra misión
                    </button>
                  </div>
                </div>
              ) : null}

              {activeSection === 'Inicio' && progressSummary ? (
                <div style={{ marginTop: '1rem' }}>
                  <div className="demo-box">
                    <h3>
                      Tu semana · Nivel {progressSummary.levelNumber}:{' '}
                      {progressSummary.levelTitle}
                    </h3>
                    <p>{progressSummary.supportiveFeedback}</p>
                    <p className="subtitle">
                      {progressSummary.continuityMessage}
                    </p>
                    <div className="demo-buttons">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => setActiveSection('Misiones')}
                      >
                        Explorar misiones de la semana
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setActiveSection('Progreso')}
                      >
                        Ver mi progreso personal
                      </button>
                    </div>
                  </div>

                  {recoveryState ? (
                    <div className="demo-box" style={{ marginTop: '0.75rem' }}>
                      <h3>
                        Modo recuperación sin castigo ·{' '}
                        {recoveryState.headline}
                      </h3>
                      <p>{recoveryState.supportiveCopy}</p>
                      {recoveryState.isRecoveryActive ? (
                        <p>
                          <strong>
                            Estado: Modo recuperación activo (opción elegida:{' '}
                            {recoveryState.selectedChoice})
                          </strong>
                        </p>
                      ) : null}
                      <div className="demo-buttons">
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() =>
                            handleActivateRecovery('MICRO_MISSION_5M')
                          }
                        >
                          Retomar con microacción de 5 min
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() =>
                            handleActivateRecovery('CONSULT_RESOURCE')
                          }
                        >
                          Consultar un apoyo institucional
                        </button>
                      </div>
                    </div>
                  ) : null}

                  <div className="demo-box" style={{ marginTop: '0.75rem' }}>
                    <h3>
                      Check-in semanal de autorregulación (SUR-WEEKLY-V1)
                    </h3>
                    <p className="subtitle">
                      Breve pulso de 4 preguntas (menos de 2 minutos) sobre tu
                      semana.
                    </p>
                    {submittedSurveyCodes.includes('SUR-WEEKLY-V1') ? (
                      <p>
                        <strong>
                          Check-in semanal completado esta semana.
                        </strong>
                      </p>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => handleSubmitMicroSurvey('SUR-WEEKLY-V1')}
                      >
                        Responder check-in semanal (SUR-WEEKLY-V1)
                      </button>
                    )}
                  </div>
                </div>
              ) : null}

              {activeSection === 'Misiones' ? (
                <div style={{ marginTop: '1rem' }}>
                  <div
                    className="demo-buttons"
                    role="group"
                    aria-label="Filtros de misiones"
                  >
                    {(
                      [
                        { id: 'all', label: 'Todas' },
                        { id: 'today', label: 'Hoy' },
                        { id: 'week', label: 'Esta semana' },
                        { id: 'completed', label: 'Completadas' },
                      ] as const
                    ).map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        className={
                          missionFilter === f.id
                            ? 'btn btn-primary'
                            : 'btn btn-tertiary'
                        }
                        onClick={() => handleFilterChange(f.id)}
                      >
                        Filtro: {f.label}
                      </button>
                    ))}
                  </div>

                  {selectedMissionCode && session ? (
                    (() => {
                      const detail =
                        defaultGamificationClient.getMissionDetail(
                          session.user.userId,
                          selectedMissionCode,
                        );
                      return (
                        <div
                          className="demo-box"
                          style={{ marginTop: '1rem' }}
                        >
                          <h3>
                            Detalle de misión: {detail.template.title} (
                            {detail.template.code})
                          </h3>
                          <p>
                            <strong>¿Qué tengo que hacer?</strong>{' '}
                            {detail.template.summary}
                          </p>
                          <p>
                            <strong>¿Por qué puede servirme?</strong>{' '}
                            {detail.template.whyItHelps}
                          </p>
                          <p>
                            <strong>¿Cuánto tarda?</strong>{' '}
                            {detail.template.durationMinutes} min · Esfuerzo:{' '}
                            {detail.template.effort}
                          </p>
                          <p>
                            <strong>¿Qué necesito?</strong>{' '}
                            {detail.template.whatYouNeed}
                          </p>
                          {detail.template.relatedResourceTitle ? (
                            <p>
                              <strong>Recurso institucional relacionado:</strong>{' '}
                              {detail.template.relatedResourceTitle}
                            </p>
                          ) : null}
                          <h4>Pasos mínimos sugeridos:</h4>
                          <ol>
                            {detail.template.steps.map((step) => (
                              <li key={step}>{step}</li>
                            ))}
                          </ol>

                          {detail.assignment.status !== 'completed' ? (
                            <div
                              className="form-field"
                              style={{ marginTop: '0.75rem' }}
                            >
                              <label htmlFor="mission-reflection">
                                Nota breve o reflexión personal al completar
                                (opcional)
                              </label>
                              <input
                                id="mission-reflection"
                                className="vivu-input"
                                value={reflectionNoteInput}
                                onChange={(e) =>
                                  setReflectionNoteInput(e.target.value)
                                }
                                placeholder="Ej. Reservé martes y jueves a las 4 pm"
                              />
                            </div>
                          ) : null}

                          <div
                            className="demo-buttons"
                            style={{ marginTop: '0.75rem' }}
                          >
                            {detail.assignment.status === 'available' ||
                            detail.assignment.status === 'skipped' ? (
                              <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() =>
                                  handleAcceptMission(detail.template.code)
                                }
                              >
                                Aceptar misión
                              </button>
                            ) : null}

                            {detail.assignment.status !== 'completed' &&
                            detail.assignment.status !== 'in_progress' ? (
                              <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() =>
                                  handleStartMission(detail.template.code)
                                }
                              >
                                Empezar misión ahora
                              </button>
                            ) : null}

                            {detail.assignment.status === 'in_progress' ? (
                              <button
                                type="button"
                                className="btn btn-tertiary"
                                onClick={() =>
                                  handlePauseMission(detail.template.code)
                                }
                              >
                                Pausar sin castigo
                              </button>
                            ) : null}

                            {detail.assignment.status !== 'completed' ? (
                              <>
                                <button
                                  type="button"
                                  className="btn btn-primary"
                                  onClick={() =>
                                    handleCompleteMission(detail.template.code)
                                  }
                                >
                                  Completar misión
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-tertiary"
                                  onClick={() =>
                                    handleSkipMission(detail.template.code)
                                  }
                                >
                                  Posponer para otro momento
                                </button>
                              </>
                            ) : null}

                            <button
                              type="button"
                              className="btn btn-tertiary"
                              onClick={() => setSelectedMissionCode(null)}
                            >
                              Volver a la lista de misiones
                            </button>
                          </div>
                        </div>
                      );
                    })()
                  ) : null}

                  <div style={{ marginTop: '1rem' }}>
                    {missions.map(({ template, assignment }) => (
                      <div
                        key={template.code}
                        className="demo-box"
                        style={{ marginBottom: '0.75rem' }}
                      >
                        <h3>
                          {template.title}{' '}
                          <span className="badge-pill">{assignment.status}</span>
                        </h3>
                        <p className="subtitle">
                          Categoría: {template.category} · Duración:{' '}
                          {template.durationMinutes} min · Esfuerzo:{' '}
                          {template.effort}
                        </p>
                        <p>{template.summary}</p>
                        {assignment.recommendationReason ? (
                          <p className="subtitle">
                            <em>
                              ¿Por qué te sirve?:{' '}
                              {assignment.recommendationReason}
                            </em>
                          </p>
                        ) : null}
                        <div className="demo-buttons">
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() =>
                              setSelectedMissionCode(template.code)
                            }
                          >
                            Ver detalle ({template.code})
                          </button>
                          {assignment.status !== 'completed' ? (
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={() => handleCompleteMission(template.code)}
                            >
                              Marcar completada ({template.code})
                            </button>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {activeSection === 'Progreso' && progressSummary ? (
                <div style={{ marginTop: '1rem' }}>
                  <div className="demo-box">
                    <h3>
                      Nivel personal {progressSummary.levelNumber}:{' '}
                      {progressSummary.levelTitle}
                    </h3>
                    <p>{progressSummary.supportiveFeedback}</p>
                    <p>
                      Misiones completadas:{' '}
                      <strong>{progressSummary.completedMissionsCount}</strong>{' '}
                      · Misiones aceptadas:{' '}
                      <strong>{progressSummary.acceptedMissionsCount}</strong> ·
                      Días activos esta semana:{' '}
                      <strong>{progressSummary.weeklyActiveDays}</strong>
                    </p>
                    <p>{progressSummary.continuityMessage}</p>
                    <p>
                      Categorías trabajadas:{' '}
                      {progressSummary.workedCategories.length > 0
                        ? progressSummary.workedCategories.join(', ')
                        : 'Aún por iniciar'}
                    </p>
                  </div>

                  <div className="demo-box" style={{ marginTop: '0.75rem' }}>
                    <h3>Logros personales (sin rankings competitivos)</h3>
                    {progressSummary.achievements.length === 0 ? (
                      <p>
                        Completa tu primera misión para desbloquear tu primer
                        logro personal.
                      </p>
                    ) : (
                      <ul>
                        {progressSummary.achievements.map((ach) => (
                          <li key={ach.achievementCode}>
                            <strong>{ach.title}</strong>: {ach.description}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ) : null}

              {activeSection === 'Recomendaciones' ? (
                <div style={{ marginTop: '1rem' }}>
                  <h3>
                    Recomendaciones explicadas (Motor híbrido determinista + LLM
                    instrumental)
                  </h3>
                  <p className="subtitle">
                    Máximo 3 sugerencias priorizadas por reglas deterministas (v
                    1.0.0). Tú decides qué hacer con cada una.
                  </p>
                  <div className="demo-buttons" style={{ marginBottom: '0.75rem' }}>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => handleRefreshRecommendations('contextual')}
                    >
                      Actualizar con explicación IA (ONLINE_AI)
                    </button>
                    <button
                      type="button"
                      className="btn btn-tertiary"
                      onClick={() =>
                        handleRefreshRecommendations('simulate_failure')
                      }
                    >
                      Probar fallback determinista (ONLINE_RULES)
                    </button>
                  </div>

                  <div className="form-field" style={{ marginBottom: '0.75rem' }}>
                    <label htmlFor="rec-edit-note">
                      Nota personal si decides editar una recomendación
                      (opcional)
                    </label>
                    <input
                      id="rec-edit-note"
                      className="vivu-input"
                      value={editRecNoteInput}
                      onChange={(e) => setEditRecNoteInput(e.target.value)}
                      placeholder="Ej. Haré primero 2 entregas hoy y 1 mañana"
                    />
                  </div>

                  {recommendations.map((rec) => (
                    <div
                      key={rec.recommendationId}
                      className="demo-box"
                      style={{ marginBottom: '0.75rem' }}
                    >
                      <h4>
                        {rec.title}{' '}
                        <span className="badge-pill">{rec.missionId}</span>{' '}
                        <span className="badge-pill">{rec.source}</span>
                      </h4>
                      <p>{rec.summary}</p>
                      <p>
                        <strong>¿Por qué ves esta recomendación?</strong>{' '}
                        {rec.whyThisRecommendation}
                      </p>
                      <p className="subtitle">
                        Motivo: {rec.reasonCode} · Esfuerzo: {rec.effort} (
                        {rec.estimatedMinutes} min) · Puntaje determinista:{' '}
                        {rec.score} · Regla v{rec.ruleVersion}
                        {rec.fallbackUsed ? ' · Fallback determinista activo' : ''}
                      </p>
                      {rec.resourceTitle ? (
                        <p className="subtitle">
                          Apoyo institucional verificado (PUBLISHED):{' '}
                          <strong>{rec.resourceTitle}</strong> ({rec.resourceId})
                        </p>
                      ) : null}
                      {rec.studentAction ? (
                        <p>
                          <strong>
                            Tu decisión registrada: {rec.studentAction}
                          </strong>
                          {rec.editedNotes
                            ? ` — Nota: ${rec.editedNotes}`
                            : ''}
                        </p>
                      ) : null}
                      <div
                        className="demo-buttons"
                        style={{ marginTop: '0.5rem' }}
                      >
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() =>
                            handleRecommendationAction(
                              rec.recommendationId,
                              'ACCEPT',
                            )
                          }
                        >
                          Aceptar recomendación
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() =>
                            handleRecommendationAction(
                              rec.recommendationId,
                              'POSTPONE',
                            )
                          }
                        >
                          Posponer
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() =>
                            handleRecommendationAction(
                              rec.recommendationId,
                              'EDIT',
                            )
                          }
                        >
                          Editar meta
                        </button>
                        <button
                          type="button"
                          className="btn btn-tertiary"
                          onClick={() =>
                            handleRecommendationAction(
                              rec.recommendationId,
                              'REJECT',
                            )
                          }
                        >
                          Rechazar
                        </button>
                        <button
                          type="button"
                          className="btn btn-tertiary"
                          onClick={() =>
                            handleRecommendationAction(
                              rec.recommendationId,
                              'DISMISS_SIMILAR',
                            )
                          }
                        >
                          No quiero recomendaciones como esta
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}

              {activeSection === 'Recursos' ? (
                <div style={{ marginTop: '1rem' }}>
                  <h3>
                    Catálogo de recursos institucionales verificados (PUBLISHED)
                  </h3>
                  <p className="subtitle">
                    Únicamente se muestran recursos revisados y vigentes de la
                    Facultad de Minas / Sede Medellín.
                  </p>
                  {publishedResources.map((res) => (
                    <div
                      key={res.code}
                      className="demo-box"
                      style={{ marginBottom: '0.75rem' }}
                    >
                      <h4>
                        {res.title}{' '}
                        <span className="badge-pill">{res.code}</span>
                      </h4>
                      <p>{res.summary}</p>
                      <p className="subtitle">
                        Categoría: {res.category} · Modalidad: {res.modality} ·
                        Horario: {res.scheduleInfo} · Contacto:{' '}
                        {res.contactInfo}
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}

          {activeViewRole === 'STUDENT' && activeSection === 'Perfil' ? (
            <div>
              <h2>Espacio del Estudiante — Perfil y Privacidad</h2>
              <p className="subtitle">
                Puedes cambiar esta información cuando quieras. Separamos tu
                cuenta de los datos usados para personalizar Vivu.
              </p>

              <div className="form-field">
                <label htmlFor="profile-program">Programa de ingeniería</label>
                <input
                  id="profile-program"
                  className="vivu-input"
                  value={programInput}
                  onChange={(e) => setProgramInput(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label htmlFor="profile-semester">Semestre</label>
                <input
                  id="profile-semester"
                  className="vivu-input"
                  type="number"
                  min={1}
                  max={12}
                  value={semesterInput}
                  onChange={(e) => setSemesterInput(Number(e.target.value))}
                />
              </div>

              <div className="form-field">
                <label htmlFor="profile-availability">
                  Disponibilidad semanal (minutos)
                </label>
                <input
                  id="profile-availability"
                  className="vivu-input"
                  type="number"
                  min={15}
                  max={1200}
                  value={availabilityInput}
                  onChange={(e) =>
                    setAvailabilityInput(Number(e.target.value))
                  }
                />
              </div>

              <div className="form-field">
                <label htmlFor="profile-tone">
                  Tono preferido en mensajes y explicaciones
                </label>
                <select
                  id="profile-tone"
                  className="vivu-input"
                  value={preferredToneInput}
                  onChange={(e) =>
                    setPreferredToneInput(e.target.value as PreferredTone)
                  }
                >
                  <option value="warm">Cálido y cercano</option>
                  <option value="neutral">Neutral y directo</option>
                  <option value="concise">Breve y conciso</option>
                </select>
              </div>

              <div className="demo-buttons">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleSaveStudentProfile(false)}
                >
                  Guardar cambios de perfil
                </button>
                <button
                  type="button"
                  className="btn btn-tertiary"
                  onClick={handleWithdrawConsent}
                >
                  Retirar consentimiento del estudio
                </button>
              </div>
            </div>
          ) : null}

          {activeViewRole === 'PROFESSOR' ? (
            <div>
              <h2>
                Portal Docente / Colaborador de Recursos (Resource Contributor) —{' '}
                {activeSection}
              </h2>
              <p className="subtitle">
                Registro y actualización directa de monitorías, tutorías,
                asesorías, talleres, semilleros y actividades académicas con
                flujo de moderación (DRAFT → PENDING_REVIEW → PUBLISHED).
              </p>
              <div className="demo-box" style={{ marginTop: '0.75rem' }}>
                <h3>Proponer nuevo apoyo o recurso institucional</h3>
                <div className="form-field">
                  <label htmlFor="contrib-title">Título del recurso</label>
                  <input
                    id="contrib-title"
                    className="vivu-input"
                    value={contribTitleInput}
                    onChange={(e) => setContribTitleInput(e.target.value)}
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="contrib-summary">
                    Descripción y cómo acceder
                  </label>
                  <input
                    id="contrib-summary"
                    className="vivu-input"
                    value={contribSummaryInput}
                    onChange={(e) => setContribSummaryInput(e.target.value)}
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="contrib-category">Categoría</label>
                  <select
                    id="contrib-category"
                    className="vivu-input"
                    value={contribCategoryInput}
                    onChange={(e) =>
                      setContribCategoryInput(
                        e.target.value as ResourceCategoryCode,
                      )
                    }
                  >
                    <option value="ACADEMIC_SUPPORT">Apoyo académico</option>
                    <option value="STUDY_HABITS">Hábitos de estudio</option>
                    <option value="PLANNING">Planificación</option>
                    <option value="WELLBEING_BALANCE">Bienestar</option>
                    <option value="CAMPUS_INTEGRATION">
                      Integración universitaria
                    </option>
                  </select>
                </div>
                <div className="form-field">
                  <label htmlFor="contrib-unit">Unidad organizadora</label>
                  <input
                    id="contrib-unit"
                    className="vivu-input"
                    value={contribUnitInput}
                    onChange={(e) => setContribUnitInput(e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSubmitProfessorResource}
                >
                  Enviar recurso a moderación (PENDING_REVIEW)
                </button>
              </div>
            </div>
          ) : null}

          {activeViewRole === 'FACILITATOR' ? (
            <div>
              <h2>Panel de Acompañamiento (Facilitator) — {activeSection}</h2>
              <p className="subtitle">
                Seguimiento de estudiantes asignados y señales de continuidad,
                sin etiquetas de riesgo ni decisiones automatizadas.
              </p>
            </div>
          ) : null}

          {activeViewRole === 'ADMIN' ? (
            <div>
              <h2>Operación del Piloto y Administración — {activeSection}</h2>
              <p className="subtitle">
                Gestión de usuarios, asignaciones, catálogos de misiones y
                recursos autorizados, reglas de ludificación y exportación
                anonimizada. Todas las mutaciones requieren conexión activa.
              </p>
            </div>
          ) : null}

          <div className="demo-box">
            <p className="subtitle" style={{ marginBottom: '0.5rem' }}>
              Verificación de protección de rutas RBAC:
            </p>
            <div className="demo-buttons">
              <button
                type="button"
                className="btn btn-tertiary"
                onClick={() => setActiveViewRole('STUDENT')}
              >
                Probar ruta STUDENT
              </button>
              <button
                type="button"
                className="btn btn-tertiary"
                onClick={() => setActiveViewRole('FACILITATOR')}
              >
                Probar ruta FACILITATOR
              </button>
              <button
                type="button"
                className="btn btn-tertiary"
                onClick={() => setActiveViewRole('ADMIN')}
              >
                Probar ruta ADMIN
              </button>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
