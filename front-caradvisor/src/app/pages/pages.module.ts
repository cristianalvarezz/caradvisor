import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'

// Modulos
import { SharedModule } from '../shared/shared.module';

import { DashboardComponent } from './dashboard/dashboard.component';

import { PagesComponent } from './pages.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';




@NgModule({
  declarations: [
    DashboardComponent,

    PagesComponent,
    AccountSettingsComponent,
    PromesasComponent,
    RxjsComponent
  ],
  exports: [
    DashboardComponent,
    PagesComponent,
    AccountSettingsComponent,
  
  ],
  imports: [ 
    CommonModule,
    FormsModule,
    SharedModule,
    RouterModule
  ]
})
export class PagesModule { }