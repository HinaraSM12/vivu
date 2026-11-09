import { type FormEvent, useState } from 'react';
import {
  AuthClientError,
  type AuthSession,
  defaultAuthClient,
  SEED_DEMO_PASSWORD,
} from '../features/auth/auth-client';
import type { RoleCode } from '../local-data/session-snapshot';

type AuthScreenMode = 'login' | 'register';

const STUDENT_DESTINATIONS = [
  'Inicio',
  'Misiones',
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

  const handleLoginSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    try {
      const established = defaultAuthClient.login({ email, password });
      const primaryRole = established.user.roles[0] ?? 'STUDENT';
      setSession(established);
      setActiveViewRole(primaryRole);
      setActiveSection(primaryRole === 'STUDENT' ? 'Inicio' : 'Resumen');
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
      setSession(established);
      setActiveViewRole('STUDENT');
      setActiveSection('Inicio');
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
    const primaryRole = established.user.roles[0] ?? 'STUDENT';
    setSession(established);
    setActiveViewRole(primaryRole);
    setActiveSection(primaryRole === 'STUDENT' ? 'Inicio' : 'Resumen');
  };

  const handleLogout = () => {
    defaultAuthClient.logout();
    setSession(null);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setErrorMessage(null);
    setAuthMode('login');
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
                  <label htmlFor="login-email">Correo institucional o de prueba</label>
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

              <p className="subtitle" style={{ marginTop: '1rem', marginBottom: '0.25rem' }}>
                Accesos sintéticos de prueba (Sprint 1):
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
    (activeViewRole === 'FACILITATOR' && userRoles.includes('ADMIN'));

  const destinations =
    activeViewRole === 'STUDENT'
      ? STUDENT_DESTINATIONS
      : activeViewRole === 'FACILITATOR'
        ? FACILITATOR_DESTINATIONS
        : ADMIN_DESTINATIONS;

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

          {activeViewRole === 'STUDENT' ? (
            <div>
              <h2>Espacio del Estudiante — {activeSection}</h2>
              <p className="subtitle">
                Elige una misión que encaje con tu semana. Tu progreso es
                personal, sin rankings públicos ni comparaciones competitivas.
              </p>
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
