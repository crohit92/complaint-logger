import { NgModule } from '@angular/core';
import { LoginComponent } from './login.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { MatSelectModule, MatInputModule } from '@angular/material';
import { MatButtonModule } from "@angular/material/button";


const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  }
];

@NgModule({
  declarations: [LoginComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    MatSelectModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class LoginModule { }
