import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  constructor(private http: HttpClient, private recipeService: RecipeService) {}

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    // console.log('will store', recipes);

    return this.http.put(
      'https://recipe-book-5e0b8-default-rtdb.firebaseio.com/recipes.json',
      recipes
    );
  }

  fetchRecipes() {
    return this.http
      .get<Recipe[]>(
        '  https://recipe-book-5e0b8-default-rtdb.firebaseio.com/recipes.json'
      )
      .pipe(
        //   TO MAKE SURE THAT IF A RECIPE DOESN'T HAVE INGREDIENTS (UNDEFINED) MAKE IT AN EMPTY ARRAY
        map((recipes) => {
          return recipes.map((recipe) => {
            return {
              ...recipe,
              ingredients: recipe.ingredients ? recipe.ingredients : [],
            };
          });
        }),
        //   tap operator to apply some logic to update the recipes array with the fetched one
        tap((recipes) => {
          // console.log('fetched recipes ', recipes);
          this.recipeService.setRecipes(recipes);
        })
      );
  }
}
