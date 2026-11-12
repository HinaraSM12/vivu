import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { defaultAuthClient } from '../features/auth/auth-client';
import { defaultGamificationClient } from '../features/gamification/gamification-client';
import { defaultSprint4Client } from '../features/resources-surveys-recovery/sprint4-client';
import { defaultStudentContextClient } from '../features/student/student-context-client';
import { App } from './App';

describe('App (Sprints 1–4 — Identity, Consent, Onboarding, Missions, Resources, Surveys & Recovery)', () => {
  beforeEach(() => {
    defaultAuthClient.resetAccounts();
    defaultStudentContextClient.reset();
    defaultGamificationClient.reset();
    defaultSprint4Client.reset();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders the Vivu platform shell and Login screen by default', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', { name: /acompañamiento académico/i }),
    ).toBeInTheDocument();
    expect(screen.getByText('Vivu')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /iniciar sesión/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/vuelve a tus próximos pasos/i)).toBeInTheDocument();
  });

  it('guía a un estudiante recién registrado por Consentimiento (STU-03) y el Wizard de 5 pasos (STU-04..08) antes de llegar a Inicio', () => {
    render(<App />);

    fireEvent.click(
      screen.getByRole('button', {
        name: /¿aún no tienes cuenta\? crear cuenta de estudiante/i,
      }),
    );

    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: 'nuevo.estudiante@vivu.local' },
    });
    fireEvent.change(
      screen.getByLabelText(/contraseña \(mínimo 8 caracteres\)/i),
      {
        target: { value: 'MiClaveSegura#2026' },
      },
    );
    fireEvent.change(screen.getByLabelText(/confirmar contraseña/i), {
      target: { value: 'MiClaveSegura#2026' },
    });

    fireEvent.click(screen.getByRole('button', { name: /^crear cuenta$/i }));

    // 1. Pantalla de Consentimiento informado (STU-03)
    expect(
      screen.getByRole('heading', {
        name: /consentimiento informado y participación \(v1\.0\)/i,
      }),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByLabelText(
        /he leído la información del estudio y acepto participar voluntariamente/i,
      ),
    );
    fireEvent.click(
      screen.getByRole('button', {
        name: /aceptar consentimiento y continuar/i,
      }),
    );

    // 2. Wizard de Onboarding de 5 pasos (STU-04 a STU-08)
    expect(screen.getByText(/paso 1 de 5/i)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/programa de ingeniería/i), {
      target: { value: 'Ingeniería Química' },
    });
    fireEvent.click(screen.getByRole('button', { name: /siguiente paso/i }));

    expect(screen.getByText(/paso 2 de 5/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /siguiente paso/i }));

    expect(screen.getByText(/paso 3 de 5/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /siguiente paso/i }));

    expect(screen.getByText(/paso 4 de 5/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /siguiente paso/i }));

    expect(screen.getByText(/paso 5 de 5/i)).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole('button', {
        name: /finalizar onboarding y guardar perfil/i,
      }),
    );

    // 3. Llega al Home con su contexto activo
    expect(
      screen.getByRole('heading', {
        name: /espacio del estudiante — inicio/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/ingeniería química/i)).toBeInTheDocument();
  });

  it('permite editar el perfil (STU-19) y retirar el consentimiento voluntariamente (STU-20)', () => {
    render(<App />);

    fireEvent.click(
      screen.getByRole('button', { name: /entrar como student/i }),
    );

    expect(
      screen.getByRole('heading', {
        name: /espacio del estudiante — inicio/i,
      }),
    ).toBeInTheDocument();

    // Ir a Perfil
    fireEvent.click(screen.getByRole('button', { name: /^perfil$/i }));
    expect(
      screen.getByRole('heading', {
        name: /espacio del estudiante — perfil y privacidad/i,
      }),
    ).toBeInTheDocument();

    fireEvent.change(
      screen.getByLabelText(/disponibilidad semanal \(minutos\)/i),
      {
        target: { value: '240' },
      },
    );
    fireEvent.click(
      screen.getByRole('button', { name: /guardar cambios de perfil/i }),
    );

    expect(
      screen.getByText(/disponibilidad semanal: 240 min/i),
    ).toBeInTheDocument();

    // Volver a Perfil y retirar consentimiento
    fireEvent.click(screen.getByRole('button', { name: /^perfil$/i }));
    fireEvent.click(
      screen.getByRole('button', {
        name: /retirar consentimiento del estudio/i,
      }),
    );

    expect(
      screen.getByText(/has retirado tu consentimiento/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: /consentimiento informado y participación \(v1\.0\)/i,
      }),
    ).toBeInTheDocument();
  });

  it('bloquea con 403 cuando un STUDENT intenta abrir rutas de ADMIN o FACILITATOR y muestra shells por rol', () => {
    render(<App />);

    fireEvent.click(
      screen.getByRole('button', { name: /entrar como student/i }),
    );

    fireEvent.click(screen.getByRole('button', { name: /probar ruta admin/i }));
    expect(
      screen.getByRole('heading', { name: /acceso no autorizado \(403\)/i }),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', { name: /volver a mi panel \(student\)/i }),
    );
    fireEvent.click(screen.getByRole('button', { name: /cerrar sesión/i }));

    fireEvent.click(
      screen.getByRole('button', { name: /entrar como facilitator/i }),
    );
    expect(
      screen.getByRole('heading', {
        name: /panel de acompañamiento \(facilitator\) — resumen/i,
      }),
    ).toBeInTheDocument();
  });

  it('permite explorar misiones (STU-10), ver detalle (STU-11), completar una misión con feedback positivo (STU-13) y subir de nivel personal (STU-14)', () => {
    render(<App />);

    fireEvent.click(
      screen.getByRole('button', { name: /entrar como student/i }),
    );

    // En Inicio (STU-09) se muestra Nivel 1: Exploración (2 misiones completadas)
    expect(
      screen.getByText(/tu semana · nivel 1: exploración/i),
    ).toBeInTheDocument();

    // Ir a Misiones (STU-10)
    fireEvent.click(
      screen.getByRole('button', { name: /explorar misiones de la semana/i }),
    );
    expect(
      screen.getByRole('heading', {
        name: /espacio del estudiante — misiones/i,
      }),
    ).toBeInTheDocument();

    // Abrir detalle de MIS-PLAN-02 (STU-11)
    fireEvent.click(
      screen.getByRole('button', { name: /ver detalle \(mis-plan-02\)/i }),
    );
    expect(
      screen.getByRole('heading', {
        name: /detalle de misión: diseña dos bloques de estudio de 45 minutos \(mis-plan-02\)/i,
      }),
    ).toBeInTheDocument();

    // Completar misión y verificar feedback positivo (STU-13) + logro desbloqueado
    fireEvent.click(screen.getByRole('button', { name: /completar misión/i }));
    expect(
      screen.getByRole('heading', {
        name: /misión completada: diseña dos bloques de estudio de 45 minutos/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/constancia inicial alcanzada/i),
    ).toBeInTheDocument();

    // Ir a Progreso (STU-14) y comprobar Nivel 2: Constancia inicial con 3 misiones completadas
    fireEvent.click(screen.getByRole('button', { name: /^ver progreso$/i }));
    expect(
      screen.getByRole('heading', {
        name: /nivel personal 2: constancia inicial/i,
      }),
    ).toBeInTheDocument();
  });

  it('permite activar el modo recuperación sin castigo (STU-15), responder el check-in semanal (STU-18) y consultar recursos PUBLISHED excluyendo inactivos (STU-17)', () => {
    render(<App />);

    fireEvent.click(
      screen.getByRole('button', { name: /entrar como student/i }),
    );

    // Activar modo recuperación (STU-15)
    fireEvent.click(
      screen.getByRole('button', {
        name: /retomar con microacción de 5 min/i,
      }),
    );
    expect(
      screen.getByText(/modo recuperación activado sin penalización/i),
    ).toBeInTheDocument();

    // Responder check-in semanal (STU-18)
    fireEvent.click(
      screen.getByRole('button', {
        name: /responder check-in semanal \(sur-weekly-v1\)/i,
      }),
    );
    expect(
      screen.getByText(/check-in semanal completado esta semana/i),
    ).toBeInTheDocument();

    // Ir a Recursos (STU-17) y comprobar que aparecen los 5 recursos PUBLISHED y no RES-ARCH-01
    fireEvent.click(screen.getByRole('button', { name: /^recursos$/i }));
    expect(
      screen.getByRole('heading', {
        name: /catálogo de recursos institucionales verificados \(published\)/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/RES-ACAD-01/i)).toBeInTheDocument();
    expect(screen.queryByText(/RES-ARCH-01/i)).not.toBeInTheDocument();
  });

  it('muestra hasta 3 recomendaciones explicadas (STU-16), soporta fallback determinista (ONLINE_RULES) y registra las 5 acciones de agencia del estudiante', () => {
    render(<App />);

    fireEvent.click(
      screen.getByRole('button', { name: /entrar como student/i }),
    );

    fireEvent.click(screen.getByRole('button', { name: /^recomendaciones$/i }));
    expect(
      screen.getByRole('heading', {
        name: /recomendaciones explicadas \(motor híbrido determinista \+ llm instrumental\)/i,
      }),
    ).toBeInTheDocument();

    // Probar fallback determinista (ONLINE_RULES)
    fireEvent.click(
      screen.getByRole('button', {
        name: /probar fallback determinista \(online_rules\)/i,
      }),
    );
    expect(
      screen.getByText(/fallback determinista activado \(online_rules\)/i),
    ).toBeInTheDocument();

    // Registrar acción EDIT sobre la primera recomendación
    const editButtons = screen.getAllByRole('button', {
      name: /^editar meta$/i,
    });
    fireEvent.click(editButtons[0]!);
    expect(
      screen.getByText(/tu decisión registrada: edit/i),
    ).toBeInTheDocument();
  });
});
