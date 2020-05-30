import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateEmployeeComponentComponent } from './create-employee-component.component';
import {FormsModule,ReactiveFormsModule} from '@angular/forms'
@NgModule({
  declarations: [
    AppComponent,
    CreateEmployeeComponentComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [CreateEmployeeComponentComponent]
})
export class AppModule { }
