import { Subject } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';

export class ShoppingListService {
  private ingredients: Ingredient[] = [
    new Ingredient('Apple', 5),
    new Ingredient('Bananna', 4),
  ];

  IngredientUpdated = new Subject<Ingredient[]>();
  startedEditing = new Subject<number>();

  addIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
    this.IngredientUpdated.next(this.ingredients.slice());
  }
  addIngredients(ingredients: Ingredient[]) {
    // for (let ingredient of ingredients) {
    //   this.addIngredient(ingredient);
    // }

    this.ingredients.push(...ingredients);
    this.IngredientUpdated.next(this.ingredients.slice());
  }
  updateIngredient(index: number, newIngredient: Ingredient) {
    this.ingredients[index] = newIngredient;
    this.IngredientUpdated.next(this.ingredients.slice());
  }

  //   to get a copy of my ingredients list not the original one
  getIngredients() {
    return this.ingredients.slice();
  }

  getIngredient(index: number) {
    return this.ingredients[index];
  }

  deleteIngredient(index: number) {
    this.ingredients.splice(index, 1);
    this.IngredientUpdated.next(this.ingredients.slice());
  }
}
