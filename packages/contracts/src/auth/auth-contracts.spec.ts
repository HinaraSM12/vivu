import { describe, expect, it } from 'vitest';
import {
  buildCapabilitiesForRoles,
  isValidRoleCode,
  ROLE_CODES,
} from './auth-contracts';

describe('auth-contracts', () => {
  it('permite los roles aprobados (STUDENT, PROFESSOR, FACILITATOR, ADMIN) y rechaza roles desconocidos', () => {
    expect(ROLE_CODES).toEqual([
      'STUDENT',
      'PROFESSOR',
      'FACILITATOR',
      'ADMIN',
    ]);
    expect(isValidRoleCode('STUDENT')).toBe(true);
    expect(isValidRoleCode('PROFESSOR')).toBe(true);
    expect(isValidRoleCode('FACILITATOR')).toBe(true);
    expect(isValidRoleCode('ADMIN')).toBe(true);
    expect(isValidRoleCode('SUPERUSER')).toBe(false);
  });

  it('deriva capacidades por rol respetando las políticas online/offline y de contribución de recursos', () => {
    const studentCaps = buildCapabilitiesForRoles(['STUDENT']);
    expect(studentCaps.canSelfManageProfile).toBe(true);
    expect(studentCaps.canCompleteMissions).toBe(true);
    expect(studentCaps.canOperateOffline).toBe(true);
    expect(studentCaps.canContributeResourcesOnline).toBe(false);
    expect(studentCaps.canViewAssignedStudents).toBe(false);
    expect(studentCaps.canManageCatalogsAndRulesOnline).toBe(false);

    const professorCaps = buildCapabilitiesForRoles(['PROFESSOR']);
    expect(professorCaps.canContributeResourcesOnline).toBe(true);
    expect(professorCaps.canOperateOffline).toBe(false);
    expect(professorCaps.canManageCatalogsAndRulesOnline).toBe(false);

    const facilitatorCaps = buildCapabilitiesForRoles(['FACILITATOR']);
    expect(facilitatorCaps.canViewAssignedStudents).toBe(true);
    expect(facilitatorCaps.canWriteSupportNotesOnline).toBe(true);
    expect(facilitatorCaps.canOperateOffline).toBe(false);
    expect(facilitatorCaps.canManageCatalogsAndRulesOnline).toBe(false);

    const adminCaps = buildCapabilitiesForRoles(['ADMIN']);
    expect(adminCaps.canContributeResourcesOnline).toBe(true);
    expect(adminCaps.canManageCatalogsAndRulesOnline).toBe(true);
    expect(adminCaps.canExportAnonymizedDataOnline).toBe(true);
    expect(adminCaps.canOperateOffline).toBe(false);
  });
});
