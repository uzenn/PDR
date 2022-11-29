import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {
    ApexAxisChartSeries,
    ApexChart,
    ApexDataLabels,
    ApexTitleSubtitle,
    ApexXAxis,
} from "ng-apexcharts";
import { LandaService } from "src/app/core/services/landa.service";
import { AuthService } from "../auth/services/auth.service";
import { DashboardService } from "./services/dashboard.service";

@Component({
    selector: "app-dashboard",
    templateUrl: "./dashboard.component.html",
    styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
    listData: [] = [];
    listGrafData: [] = [];
    listYears: number[] = [];
    grafData: number[];
    filter: { tahun: number };
    chartOptions: {
        series: ApexAxisChartSeries;
        chart: ApexChart;
        xaxis: ApexXAxis;
        title: ApexTitleSubtitle;
        colors: string;
        dataLabels: ApexDataLabels;
    };
    constructor(
        private dashboardService: DashboardService,
        private authService: AuthService,
        private landaService: LandaService,
        private router: Router
    ) {
        // if (!this.authService.getToken()) {
        //     this.authService.logout();
        //     this.router.navigate(["/auth/login"]);
        //     landaService.alertError(
        //         "Mohon Maaf",
        //         "Anda harus login terlebih dahulu"
        //     );
        // }
    }

    ngOnInit(): void {
        for (let i = 1990; i <= 2099; i++) {
            this.listYears.push(i);
        }
        this.filter = {
            tahun: null,
        };
        this.filter.tahun = 2022;
        this.onSelectedYear();
        this.getData();
        // this.chartInit();
    }

    getData() {
        this.dashboardService.getLaporanDashboard([]).subscribe(
            (res: any) => {
                this.listData = res.data;
                // console.log(this.listData);
            },
            (err) => {
                this.landaService.alertError("Mohon Maaf", err.error.errors);
            }
        );
    }

    onSelectedYear() {
        const param = {
            filter: JSON.stringify(this.filter),
        };
        this.dashboardService.getLaporanDashboard(param).subscribe(
            (res: any) => {
                this.listGrafData = res.data;
                // console.log(res.data);
                Object.values(this.listGrafData).forEach((val) => {
                    this.grafData = Object.values(val);
                });
                this.chartInit();
                // console.log(this.grafData);
            },
            (err) => {
                this.landaService.alertError("Mohon Maaf", err.error.errors);
            }
        );
    }
    chartInit() {
        this.chartOptions = {
            series: [
                {
                    name: "Data Bulan Ini",
                    data: this.grafData,
                    // data: [0, 0, 0, 0, 100, 0, 0, 0, 0],
                },
            ],
            chart: {
                height: 350,
                width: '100%',
                type: "bar",
            },
            title: {
                text: "Penjualan Tahun Ini",
            },
            xaxis: {
                categories: [
                    "Januari",
                    "Februari",
                    "Maret",
                    "April",
                    "Mei",
                    "Juni",
                    "Juli",
                    "Agustus",
                    "September",
                    "Oktober",
                    "November",
                    "Desember",
                ],
            },
            colors: '#2C8DA2',
            dataLabels: {
                enabled: false,
            },
        };
    }
}
