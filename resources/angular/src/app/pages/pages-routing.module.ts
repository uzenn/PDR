import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../layouts/layout.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { LaporanCustomerComponent } from './laporan/customer/components/laporan-customer/laporan-customer.component';
import { LaporanMenuComponent } from './laporan/menu/components/laporan-menu/laporan-menu.component';
import { LaporanPenjualanComponent } from './laporan/penjualan/components/laporan-penjualan/laporan-penjualan.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
    { path: '', redirectTo: 'home' },
    { path: 'home', component: DashboardComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'master', loadChildren: () => import('./master/master.module').then(m => m.MasterModule) },
    { path: 'laporan-menu', component: LaporanMenuComponent },
    { path: 'laporan-customer', component: LaporanCustomerComponent },
    { path: 'rekap-penjualan', component: LaporanPenjualanComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule { }
