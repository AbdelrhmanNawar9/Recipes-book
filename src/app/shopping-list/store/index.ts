import {
  ShoppingListState,
  shoppingListReducer,
} from './shopping-list.reducer';
import { ActionReducerMap } from '@ngrx/store';

export const rootReducer = {};

export interface AppState {
  shoppingList: ShoppingListState;
}

// This is a map (object) to tell NgRx which reducers we have in our application

// The state of our application is made of reducers and the state that they generate
export const reducers: ActionReducerMap<AppState, any> = {
  shoppingList: shoppingListReducer,
};
