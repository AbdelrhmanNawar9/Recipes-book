import { User } from '../user.model';
import * as AuthActions from './auth.actions';

export interface State {
  user: User | null;
  authError: string;
  loading: boolean;
}
const initialState: State = {
  user: null,
  authError: '',
  loading: false,
};
export function authReducer(
  state = initialState,
  action: AuthActions.AuthActions
) {
  switch (action.type) {
    case AuthActions.AUTHENTICATE_SUCCESS:
      const user = new User(
        action.payload.email,
        action.payload.userId,
        action.payload.token,
        action.payload.expirationDate
      );
      return {
        ...state,
        authError: '',
        user: user,
        loading: false,
      };
    case AuthActions.LOGOUT:
      return {
        ...state,
        user: null,
      };

    // group multipule cases(theexecution will happen if any case of the group case is matched to the switch case )
    case AuthActions.LOGIN_START:
    case AuthActions.SIGNUP_START:
      return {
        ...state,
        authError: '',
        loading: true,
      };
    case AuthActions.AUTHENTICATE_FAIL:
      return {
        ...state,
        user: null,
        authError: action.payload,
        loading: false,
      };

    case AuthActions.CLEAR_ERROR:
      return {
        ...state,
        authError: '',
      };
    default:
      return state;
  }
}
