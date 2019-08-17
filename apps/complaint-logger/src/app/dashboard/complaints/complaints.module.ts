import { NgModule } from '@angular/core';
import { ComplaintsComponent } from './complaints.component';
import { ComplaintsListComponent } from './complaints-list/complaints-list.component';
import { RaiseComplaintComponent } from './raise-complaint/raise-complaint.component';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { MatInputModule, MatButtonModule, MatSelectModule, MatExpansionModule, MatTabsModule, MatPaginatorModule, MatDividerModule } from '@angular/material';
import { ComplaintsListFilter } from './complaints-list/complaints-list-filter.pipe';

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
  declarations: [ComplaintsComponent,
    ComplaintsListComponent,
    RaiseComplaintComponent,
    ComplaintsListFilter
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatExpansionModule,
    MatTabsModule,
    MatPaginatorModule,
    MatDividerModule
  ]
})
export class ComplaintsModule { }
