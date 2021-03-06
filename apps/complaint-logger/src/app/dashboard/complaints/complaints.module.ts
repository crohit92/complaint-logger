import { NgModule } from '@angular/core';
import { ComplaintsComponent } from './complaints.component';
import { ComplaintsListComponent } from './complaints-list/complaints-list.component';
import { RaiseComplaintComponent } from './raise-complaint/raise-complaint.component';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { MatInputModule, } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { MatSelectModule } from '@angular/material/select'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatTabsModule } from '@angular/material/tabs'
import { MatPaginatorModule } from '@angular/material/paginator'
import { MatDividerModule } from '@angular/material/divider'
import { MatIconModule } from '@angular/material/icon'
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
    MatDividerModule,
    MatIconModule
  ]
})
export class ComplaintsModule { }
