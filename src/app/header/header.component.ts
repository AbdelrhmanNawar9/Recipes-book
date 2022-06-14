import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { DataStorageService } from '../shared/data-storage.service';

import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  subscription!: Subscription;
  isAuthenticated = false;
  constructor(
    private dataStorageService: DataStorageService,
    private authService: AuthService,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.subscription = this.store
      .select('auth')
      .pipe(map((authState) => authState.user))
      .subscribe((user) => {
        // this.isAuthenticated = !user ? false : true;
        // Trick to convert the user value to true or false(if user undefined or null  for example)
        this.isAuthenticated = !!user;
      });
  }

  onSaveData() {
    this.dataStorageService.storeRecipes().subscribe((res) => {
      console.log('Saved');
    });
  }

  onFetchData() {
    this.dataStorageService.fetchRecipes().subscribe((res) => {
      console.log('Fetched');
    });
  }

  onLogout() {
    this.store.dispatch(new AuthActions.Logout());
  }

  onDestroy() {
    this.subscription.unsubscribe();
  }
}
