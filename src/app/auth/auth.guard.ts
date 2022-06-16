import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Route,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { map, Observable, switchMap, take, tap } from 'rxjs';
import { AuthService } from './auth.service';

import * as fromApp from '../store/app.reducer';
import { Store } from '@ngrx/store';
import * as AuthActions from './store/auth.actions';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Promise<boolean> | Observable<boolean | UrlTree> {
    return this.store.select('auth').pipe(
      map((authState) => {
        // this.store.dispatch({ type: 'recipes Guard Started' });
        // console.log('Guard started');
        // BUG
        // The following line is to solve the problem of implementing the guard before the user is not set in the status , and do that only if there is no user
        if (!authState.user) {
          this.store.dispatch(new AuthActions.AutoLogin());
        }

        return authState.user;
      }),
      map((user) => {
        // const isAuth = user !== null ? true : false;
        const isAuth = !!user;
        if (isAuth) {
          return true;
        }
        //  To redirect to Authentication page
        return this.router.createUrlTree(['auth']);
      })
      // tap((isAuth) => {
      //   if (!isAuth) {
      //     this.router.navigate(['auth']);
      //   }
      // })
    );
  }
}
