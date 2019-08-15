import { NgModule } from '@angular/core';
import { ComplaintsComponent } from './complaints.component';
import { ComplaintsListComponent } from './complaints-list/complaints-list.component';
import { RaiseComplaintComponent } from './raise-complaint/raise-complaint.component';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { MatFormFieldModule, MatInputModule, MatButtonModule } from '@angular/material';

const routes: Routes = [
  {
    path: '',
    component: ComplaintsComponent,
    children: [
      {
        path: 'list',
        component: ComplaintsListComponent
      },
      {
        path: 'raise',
        component: RaiseComplaintComponent
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'list'
      }
    ]
  }

]

@NgModule({
  declarations: [ComplaintsComponent, ComplaintsListComponent, RaiseComplaintComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    MatInputModule,
    MatButtonModule
  ]
})
export class ComplaintsModule { }
