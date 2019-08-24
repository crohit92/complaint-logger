import { NgModule } from "@angular/core";
import { RouterModule, Route, Routes } from "@angular/router";
import { UserGuard } from './core/guards/user-guard';
import { AdminGuard } from './core/guards/admin-guard';
const APP_ROUTES: Routes = [
    {
        path: 'login',
        loadChildren: async () => (await import('./login/login.module')).LoginModule
    },
    {
        path: 'dashboard',
        loadChildren: async () => (await import('./dashboard/dashboard.module')).DashboardModule,
        canActivate: [UserGuard]
    },
    {
        path: 'admin',
        loadChildren: async () => (await import('./admin/admin.module')).AdminModule,
        canActivate: [AdminGuard]
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login'
    }
]
@NgModule({
    imports: [RouterModule.forRoot(APP_ROUTES)],
    exports: [RouterModule]
})
export class AppRoutingModule {

}