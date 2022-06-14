import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import * as AuthActions from './auth.actions';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

const handleAuthentication = (
  expiresIn: number,
  email: string,
  userId: string,
  token: string
) => {
  const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000);
  return new AuthActions.AuthenticateSuccess({
    email: email,
    userId: userId,
    token: token,
    expirationDate: expirationDate,
  });
};

const handleError = (errorRes: any) => {
  // handle error and must return a non error observable so that the overall stream doesn't die
  let errorMessage = 'An unkown error occured!';
  if (!errorRes.error || !errorRes.error.error) {
    //    we use of to create an observable for a certain value
    return of(new AuthActions.AuthenticateFail(errorMessage));
  } else {
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists already!';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email does not Exist!';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'This password is not correct!';
        break;
    }
  }
  return of(new AuthActions.AuthenticateFail(errorMessage));
};

@Injectable()
export class AuthEffects {
  authSignup = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.SIGNUP_START),
      switchMap((signupAction: AuthActions.SignupStart) => {
        return this.http
          .post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' +
              environment.firebaseAPIKey,
            {
              email: signupAction.payload.email,
              password: signupAction.payload.password,
              returnSecureToken: true,
            }
          ) // Handling the success and error case for the request
          .pipe(
            // must return a non error observable so that the overall stream doesn't die
            // map wrapps its return value into an observable
            map((resData) => {
              return handleAuthentication(
                +resData.expiresIn,
                resData.email,
                resData.localId,
                resData.idToken
              );
            }),
            // althoough catchError is after map but if an error happen in the chain catchError will run before map
            //  we will need to wrap the return value of catch error into observabel
            catchError((errorRes) => {
              return handleError(errorRes);
            })
          );
      })
    );
  });

  //Effect is an action handler
  //   createEffect accepts two parameters (callback that return an observable,config)
  authLogin = createEffect(() => {
    //    actions$ returns an observable NgRx will subscribe to automatically use pipe directly
    return this.actions$.pipe(
      // Only catch the lOGIN_START actions(ofType filters an Observable of Actions into an Observable of the actions whose type strings are passed to it.)
      ofType(AuthActions.LOGIN_START),
      switchMap((authData: AuthActions.LoginStart) => {
        return (
          this.http
            .post<AuthResponseData>(
              'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' +
                environment.firebaseAPIKey,
              {
                email: authData.payload.email,
                password: authData.payload.password,
                returnSecureToken: true,
              }
            )
            // Handling the success and error case for the request
            .pipe(
              // must return a non error observable so that the overall stream doesn't die
              // map wrapps its return value into an observable
              map((resData) => {
                return handleAuthentication(
                  +resData.expiresIn,
                  resData.email,
                  resData.localId,
                  resData.idToken
                );
              }),
              // althoough catchError is after map but if an error happen in the chain catchError will run before map
              //  we will need to wrap the return value of catch error into observabel
              catchError((errorRes) => {
                // handle error and must return a non error observable so that the overall stream doesn't die
                return handleError(errorRes);
              })
            )
        );
      })
    );
  });

  // The first argument of createEffect function is a callback and it should return an action
  // The seconde augument of createEffect function is a config object whether you want to auto dispatch the returned action from the first parameter callback
  authSuccess = createEffect(
    () => {
      //    actions$ returns an action(observable) and NgRx will subscribe to automatically use pipe directly
      return this.actions$.pipe(
        // Only catch the lOGIN_START actions(ofType filters an Observable of Actions into an Observable of the actions whose type strings are passed to it.)
        ofType(AuthActions.AUTHENTICATE_SUCCESS),
        tap(() => {
          this.router.navigate(['/']);
        })
      );
    },
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router
  ) {}
}
