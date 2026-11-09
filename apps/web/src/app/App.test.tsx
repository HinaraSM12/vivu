import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { defaultAuthClient } from '../features/auth/auth-client';
import { App } from './App';

describe('App (Sprint 1 — Identity, Registration & RBAC Shells)', () => {
  beforeEach(() => {
    defaultAuthClient.resetAccounts();
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

  it('permite autoregistrarse exclusivamente como STUDENT sin selector de rol', () => {
    render(<App />);

    fireEvent.click(
      screen.getByRole('button', {
        name: /¿aún no tienes cuenta\? crear cuenta de estudiante/i,
      }),
    );

    expect(
      screen.getByRole('heading', { name: /crear cuenta/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/el autoregistro crea únicamente una cuenta con rol/i),
    ).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: 'nuevo.estudiante@vivu.local' },
    });
    fireEvent.change(screen.getByLabelText(/contraseña \(mínimo 8 caracteres\)/i), {
      target: { value: 'MiClaveSegura#2026' },
    });
    fireEvent.change(screen.getByLabelText(/confirmar contraseña/i), {
      target: { value: 'MiClaveSegura#2026' },
    });

    fireEvent.click(screen.getByRole('button', { name: /^crear cuenta$/i }));

    expect(
      screen.getByRole('heading', {
        name: /espacio del estudiante — inicio/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText('nuevo.estudiante@vivu.local')).toBeInTheDocument();
    expect(
      screen.getByText(/sesión preparada para modo offline futuro/i),
    ).toBeInTheDocument();
  });

  it('bloquea con 403 cuando un STUDENT intenta abrir rutas de ADMIN o FACILITATOR y permite cerrar sesión', () => {
    render(<App />);

    fireEvent.click(
      screen.getByRole('button', { name: /entrar como student/i }),
    );

    expect(
      screen.getByRole('heading', {
        name: /espacio del estudiante — inicio/i,
      }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /probar ruta admin/i }));

    expect(
      screen.getByRole('heading', { name: /acceso no autorizado \(403\)/i }),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', { name: /volver a mi panel \(student\)/i }),
    );
    expect(
      screen.getByRole('heading', {
        name: /espacio del estudiante — inicio/i,
      }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /cerrar sesión/i }));
    expect(
      screen.getByRole('heading', { name: /iniciar sesión/i }),
    ).toBeInTheDocument();
  });

  it('muestra los paneles correspondientes para FACILITATOR y ADMIN', () => {
    render(<App />);

    fireEvent.click(
      screen.getByRole('button', { name: /entrar como facilitator/i }),
    );
    expect(
      screen.getByRole('heading', {
        name: /panel de acompañamiento \(facilitator\) — resumen/i,
      }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /cerrar sesión/i }));

    fireEvent.click(
      screen.getByRole('button', { name: /entrar como admin/i }),
    );
    expect(
      screen.getByRole('heading', {
        name: /operación del piloto y administración — resumen/i,
      }),
    ).toBeInTheDocument();
  });
});
