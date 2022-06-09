import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

import { HeaderComponent } from './header/header.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core.module';

@NgModule({
  declarations: [AppComponent, HeaderComponent, PageNotFoundComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    HttpClientModule,
    AppRoutingModule,
    SharedModule,
    CoreModule,
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
