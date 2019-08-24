import { NgModule } from "@angular/core";
import { SharedModule } from '../shared/shared.module';
import { AdminComponent } from './admin.component';
import { Routes, RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

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
        RouterModule.forChild(ROUTES),
        MatSidenavModule,
        MatIconModule,
        MatToolbarModule,
        MatButtonModule,
        MatDividerModule
    ],
    declarations: [AdminComponent]
})
export class AdminModule { }