import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../layouts/layout.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
    { path: '', redirectTo: 'home' },
    { path: 'home', component: DashboardComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'master', loadChildren: () => import('./master/master.module').then(m => m.MasterModule) },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule { }
