import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
const routes: Routes = [
    {
        path: 'login',
        loadChildren: async () => (await import('./login/login.module')).LoginModule
    },
    {
        path: 'dashboard',
        loadChildren: async () => ((await import('./dashboard/dashboard.module')).DashboardModule)
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
    }
]
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {

}