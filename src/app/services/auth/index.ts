import { ModuleWithProviders, NgModule, Type } from '@angular/core';

import { AuthService } from './auth.service';
import {
  AUTH_SERVICE,
  PUBLIC_FALLBACK_PAGE_URI,
  PROTECTED_FALLBACK_PAGE_URI
} from './auth.tokens';
import { AuthModule } from './auth.module';

import { IdentityStorage } from './identity-storage.service';
import { AuthenticationService } from './authentication.service';
import { ConfigService, CustomConfig } from './auth.config'

export function factory(authenticationService: AuthenticationService) {
  return authenticationService;
}

@NgModule({
  imports: [AuthModule],
  providers: [
    IdentityStorage,
    AuthenticationService,
    { provide: PROTECTED_FALLBACK_PAGE_URI, useValue: '/' },
    { provide: PUBLIC_FALLBACK_PAGE_URI, useValue: '/login' },
    {
      provide: AUTH_SERVICE,
      deps: [AuthenticationService],
      useFactory: factory
    }
  ]
})
export class AuthenticationModule {
  static forRoot(config: Type<CustomConfig>): ModuleWithProviders {
    return {
      ngModule: AuthenticationModule,
      providers: [
        { provide: CustomConfig, useClass: config },
        { provide: ConfigService, useClass: ConfigService, deps: [CustomConfig] }
      ],
    };
  }
}

export {
  AuthenticationService,
  ConfigService, CustomConfig,
};