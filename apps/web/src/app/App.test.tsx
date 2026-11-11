import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { defaultAuthClient } from '../features/auth/auth-client';
import { defaultStudentContextClient } from '../features/student/student-context-client';
import { App } from './App';

describe('App (Sprints 1 & 2 — Identity, Consent, 5-Step Onboarding & Editable Profile)', () => {
  beforeEach(() => {
    defaultAuthClient.resetAccounts();
    defaultStudentContextClient.reset();
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
});
