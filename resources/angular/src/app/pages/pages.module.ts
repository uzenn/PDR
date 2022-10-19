import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, NgSelectOption, ReactiveFormsModule } from "@angular/forms";

import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { PERFECT_SCROLLBAR_CONFIG } from "ngx-perfect-scrollbar";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { NgbAlertModule, NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { PagesRoutingModule } from "./pages-routing.module";

import { DashboardComponent } from "./dashboard/dashboard.component";
import { ProfileComponent } from "./profile/profile.component";
import { LaporanMenuComponent } from "./laporan/menu/components/laporan-menu/laporan-menu.component";
import { LaporanCustomerComponent } from "./laporan/customer/components/laporan-customer/laporan-customer.component";
import { NgSelectModule } from "@ng-select/ng-select";
import { LaporanPenjualanComponent } from './laporan/penjualan/components/laporan-penjualan/laporan-penjualan.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true,
    wheelSpeed: 0.3,
};

@NgModule({
    declarations: [
        DashboardComponent,
        ProfileComponent,
        LaporanMenuComponent,
        LaporanCustomerComponent,
        LaporanPenjualanComponent,
    ],
    imports: [
        ReactiveFormsModule,
        NgbAlertModule,
        NgbModule,
        CommonModule,
        PagesRoutingModule,
        PerfectScrollbarModule,
        FormsModule,
        NgSelectModule,
    ],
    providers: [
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
        },
    ],
})
export class PagesModule {}
