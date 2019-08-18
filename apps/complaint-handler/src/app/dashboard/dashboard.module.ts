import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { MatSidenavModule, MatIconModule, MatToolbarModule, MatButtonModule, MatDividerModule, MatInputModule, MatAutocompleteModule } from "@angular/material";
import { async } from '@angular/core/testing';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'complaints',
        loadChildren: async () => (await import('./complaints/complaints.module')).ComplaintsModule
      },
      {
        path: '',
        redirectTo: 'complaints'
      }
    ]
  }
];


@NgModule({
  declarations: [DashboardComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    MatSidenavModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatDividerModule,
  ]
})
export class DashboardModule { }
