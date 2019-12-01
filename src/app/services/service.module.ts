import { ModuleWithProviders, NgModule, Type } from '@angular/core';
import { ConfigService, ServiceConfig } from './service.config';

@NgModule({
  imports: [
  ],
  providers: []
})
export class ServiceModule {
  static forRoot(config: Type<ServiceConfig>): ModuleWithProviders {
    return {
      ngModule: ServiceModule,
      providers: [
        { provide: ServiceConfig, useClass: config },
        { provide: ConfigService, useClass: ConfigService, deps: [ServiceConfig] }
      ]
    }
  }
}

export {
  ConfigService, ServiceConfig
}
