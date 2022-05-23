import { EventEmitter } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';

export class ShoppingListService {
  private ingredients: Ingredient[] = [
    new Ingredient('Apple', 5),
    new Ingredient('Bananna', 4),
  ];

  IngredientUpdated = new EventEmitter<Ingredient[]>();

  addIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
    this.IngredientUpdated.emit(this.ingredients.slice());
  }

  //   to get a copy of my ingredients list not the original one
  getIngredients() {
    return this.ingredients.slice();
  }
}
