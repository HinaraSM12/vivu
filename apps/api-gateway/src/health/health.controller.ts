import { Controller, Get, Inject, Optional } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { resolveGatewayJwtSecret } from '../auth/gateway-auth.service';
import { GatewayJsonSnapshotStore } from '../common/persistence/json-snapshot.store';

@ApiTags('health')
@Controller()
export class HealthController {
  constructor(
    @Optional()
    @Inject(GatewayJsonSnapshotStore)
    private readonly snapshotStore?: GatewayJsonSnapshotStore,
  ) {}

  @Get('health')
  @ApiOkResponse({ description: 'El proceso está activo.' })
  health() {
    return { status: 'ok' as const, service: 'api-gateway' as const };
  }

  @Get('ready')
  @ApiOkResponse({ description: 'El gateway está listo para recibir tráfico.' })
  ready() {
    const authSecretConfigured = Boolean(resolveGatewayJwtSecret(process.env));
    const persistenceStoreReady =
      this.snapshotStore === undefined ||
      this.snapshotStore.getState().schemaVersion === '1.0.0';

    return {
      status: 'ready' as const,
      service: 'api-gateway' as const,
      checks: {
        authSecretConfigured,
        persistenceStoreReady,
        domainServicesReady: true,
        canonicalEventCatalogReady: true,
        snapshotPathConfigured: Boolean(
          this.snapshotStore?.getSnapshotPath(),
        ),
        checkedAt: new Date().toISOString(),
      },
    };
  }
}
