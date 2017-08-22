import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'

import { AppComponent } from './app.component';
import { MainComponent } from './components/maincomponent/main.component';
import { LoginComponent } from './components/login/login.component';


@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot([
      { path: 'login', component: LoginComponent},
      { path: 'main', component: MainComponent},
      { path: '**', redirectTo: 'login'}
      ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
