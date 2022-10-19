import { formatDate } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { LandaService } from "src/app/core/services/landa.service";
import { LaporanService } from "../../../services/laporan.service";

@Component({
    selector: "app-laporan-menu",
    templateUrl: "./laporan-menu.component.html",
    styleUrls: ["./laporan-menu.component.scss"],
})
export class LaporanMenuComponent implements OnInit {
    listDays: number[] = [];
    date: Date = new Date();
    days: number;
    month: string;
    year: string;
    listGrandTotal: [] = [];
    listPenjualanMenu: [] = [];
    filter: { kategori: string; id_bulan: string; id_tahun: string };
    constructor(
        private laporanService: LaporanService,
        private landaService: LandaService
    ) {}

    ngOnInit(): void {
        this.filter = {
            kategori: "all",
            id_bulan: null,
            id_tahun: null
        };
        // this.getData();
    }

    onSelectedMonth(event: any) {
        this.listDays = [];
        const date = new Date(event.target.value);
        date.setDate(date.getDate());
        this.filter.id_bulan = formatDate(date, "MM", "en");
        this.month = formatDate(date, "MMMM", "en");
        this.filter.id_tahun = formatDate(date, "yyyy", "en");
        this.year = formatDate(date, "yyyy", "en");
        this.days = new Date(Number(this.filter.id_tahun), Number(this.filter.id_bulan), 0).getDate();
        this.getData();
    }

    showByKategori(kategori) {
        if (this.filter.id_bulan != null && this.filter.id_tahun != null) {
            this.listDays = [];
            this.filter.kategori = kategori;
            this.getData();
        }
    }

    getData() {
        const param = {
            filter: JSON.stringify(this.filter),
        };
        this.laporanService.getLaporanMenu(param).subscribe(
            (res: any) => {
                this.listGrandTotal = res.data[0];
                res.data.shift();
                this.listPenjualanMenu = res.data;
                // console.log(this.listGrandTotal);
            },
            (err) => {
                this.landaService.alertError("Mohon Maaf", err.error.errors);
            }
        );
        for (let index = 0; index < this.days; index++) {
            this.listDays.push(index + 1);
        }
    }
}
