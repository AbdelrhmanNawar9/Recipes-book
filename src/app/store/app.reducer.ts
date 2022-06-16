import * as fromShoppingList from '../shopping-list/store/shopping-list.reducer';

import { ActionReducerMap } from '@ngrx/store';
import * as fromAuth from 'src/app/auth/store/auth.reducer';

import * as fromRecipes from '../recipes/store/recipe.reducer';

// export const rootReducer = {};

export interface AppState {
  shoppingList: fromShoppingList.State;
  auth: fromAuth.State;
  recipes: fromRecipes.State;
}

// This is a map (object) to tell NgRx which reducers we have in our application

// The state of our application is made of reducers and the state that they generate
export const appReducers: ActionReducerMap<AppState, any> = {
  shoppingList: fromShoppingList.shoppingListReducer,
  auth: fromAuth.authReducer,
  recipes: fromRecipes.recipeReducer,
};
