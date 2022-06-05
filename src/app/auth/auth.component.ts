import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, subscribeOn, Subscription } from 'rxjs';
import { AlertComponent } from '../shared/alert/alert.component';
import { AuthResponseData, AuthService } from './auth.service';
import { PlaceHolderDirective } from './placeHolder.directive';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  isLoginMode = true;
  isLoading = false;
  error: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    let authObs: Observable<AuthResponseData>;

    this.isLoading = true;
    if (this.isLoginMode) {
      // Login
      authObs = this.authService.login(email, password);
    } else {
      // Sign Up login
      authObs = this.authService.signUp(email, password);
    }

    authObs.subscribe({
      next: (resData) => {
        this.isLoading = false;
        this.router.navigate(['/recipes']);
      },
      error: (errorMessage) => {
        this.isLoading = false;
        this.error = errorMessage;
        // this.showErrorAlert(errorMessage);
        this.showErrorAlert();
      },
    });

    form.reset();
  }

  onHandleError() {
    this.error = '';
  }

  @ViewChild(PlaceHolderDirective, { static: true })
  alertHost!: PlaceHolderDirective;
  closeSub!: Subscription;

  private showErrorAlert() {
    const viewContainerRef = this.alertHost.viewContainerRef;
    viewContainerRef.clear();

    const componentRef =
      viewContainerRef.createComponent<AlertComponent>(AlertComponent);

    componentRef.instance.message = this.error;
    this.closeSub = componentRef.instance.close.subscribe(() => {
      this.closeSub.unsubscribe();
      viewContainerRef.clear();
      this.error = '';
    });
  }

  onDestroy() {
    if (this.closeSub) {
      this.closeSub.unsubscribe();
    }
  }
}
