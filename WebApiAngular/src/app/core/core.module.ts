import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule }                 from '@angular/common';
import { AuthService }                  from './services/auth.service';
import { SelectivePreloadingStrategy }  from './services/selective-preload-strategy';
import { CanDeactivateGuard }           from './services/can-deactivate-guard.service';
import { AuthGuard }                    from './services/auth-guard.service';
import { DialogService }                from './services/dialog.service';

@NgModule({
  imports:      [ CommonModule ],
  providers:    [ AuthService, AuthGuard, DialogService, SelectivePreloadingStrategy, CanDeactivateGuard],
})
export class CoreModule {
  constructor (@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}
