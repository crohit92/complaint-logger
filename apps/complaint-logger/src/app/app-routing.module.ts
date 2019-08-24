import { NgModule } from "@angular/core";
import { RouterModule, Route, Routes } from "@angular/router";
const APP_ROUTES: Routes = [
    {
        path: 'login',
        loadChildren: async () => (await import('./login/login.module')).LoginModule
    },
    {
        path: 'dashboard',
        loadChildren: async () => (await import('./dashboard/dashboard.module')).DashboardModule
    },
    {
        path: 'admin',
        loadChildren: async () => (await import('./admin/admin.module')).AdminModule
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