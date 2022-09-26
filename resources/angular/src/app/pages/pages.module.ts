import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

import { PagesRoutingModule } from './pages-routing.module';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true,
    wheelSpeed: 0.3
};

@NgModule({
    declarations: [DashboardComponent, ProfileComponent],
    imports: [
        ReactiveFormsModule,
        NgbAlertModule,
        CommonModule,
        PagesRoutingModule,
        PerfectScrollbarModule,
        FormsModule
    ],
    providers: [
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        }
    ]
})
export class PagesModule { }
