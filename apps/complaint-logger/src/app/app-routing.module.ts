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
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
    }
]
@NgModule({
    imports: [RouterModule.forRoot(APP_ROUTES)],
    exports: [RouterModule]
})
export class AppRoutingModule {

}