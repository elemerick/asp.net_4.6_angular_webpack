﻿import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule }                 from '@angular/common';
import { ValidationService }            from './services/validation.service';
import { AuthService }                  from './services/auth.service';
import { SelectivePreloadingStrategy }  from './services/selective-preload-strategy';
import { CanDeactivateGuard }           from './services/can-deactivate-guard.service';
import { AuthGuard }                    from './services/auth-guard.service';
import { DialogService }                from './services/dialog.service';
import { AuthHttp, AuthConfig }         from 'angular2-jwt';
import { HttpModule, Http, RequestOptions } from '@angular/http';
import { SignalRModule }                from 'ng2-signalr';
import { SignalRConfiguration }         from 'ng2-signalr';
import { SignalRService }               from './services/signalr.service';

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig({
    globalHeaders: [{'Content-Type': 'application/json'}]
  }), http, options);
}

export function createConfig(): SignalRConfiguration {
  const config = new SignalRConfiguration();
  config.logging = true;
  return config;
}

@NgModule({
  imports:      [ CommonModule, HttpModule, SignalRModule.forRoot(createConfig) ],
  providers:    [ AuthService,
                  SignalRService,
                  AuthGuard,
                  DialogService,
                  SelectivePreloadingStrategy,
                  CanDeactivateGuard,
                  ValidationService,
                  {
                    provide: AuthHttp,
                    useFactory: authHttpServiceFactory,
                    deps: [Http, RequestOptions]
                  }
  ],
})
export class CoreModule {
  constructor (@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}
