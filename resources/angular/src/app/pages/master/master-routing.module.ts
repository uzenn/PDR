import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DaftarCustomerComponent } from './customers/components/daftar-customer/daftar-customer.component';
import { DaftarDiskonComponent } from './diskon/components/daftar-diskon/daftar-diskon.component';
import { DaftarItemComponent } from './items/components/daftar-item/daftar-item.component';
import { DaftarPromoComponent } from './promo/components/daftar-promo/daftar-promo.component';
import { DaftarRolesComponent } from './roles/components/daftar-roles/daftar-roles.component';
import { DaftarUserComponent } from './users/components/daftar-user/daftar-user.component';
import { DaftarVoucherComponent } from './voucher/components/daftar-voucher/daftar-voucher.component';

const routes: Routes = [
    { path: 'users', component: DaftarUserComponent },
    { path: 'roles', component: DaftarRolesComponent },
    { path: 'customers', component: DaftarCustomerComponent },
    { path: 'items', component: DaftarItemComponent },
    { path: 'promo', component: DaftarPromoComponent },
    { path: 'diskon', component: DaftarDiskonComponent },
    { path: 'voucher', component: DaftarVoucherComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MasterRoutingModule { }
