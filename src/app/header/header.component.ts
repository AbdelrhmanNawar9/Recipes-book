import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { DataStorageService } from '../shared/data-storage.service';

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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscription = this.authService.user.subscribe((user) => {
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
    this.authService.logout();
  }

  onDestroy() {
    this.subscription.unsubscribe();
  }
}
