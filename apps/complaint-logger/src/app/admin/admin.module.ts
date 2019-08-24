import { NgModule } from "@angular/core";
import { SharedModule } from '../shared/shared.module';
import { AdminComponent } from './admin.component';
import { Routes, RouterModule } from '@angular/router';

const ROUTES: Routes = [
    {
        path: '',
        component: AdminComponent,
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
]
@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(ROUTES)
    ],
    declarations: [AdminComponent]
})
export class AdminModule { }