import { formatDate } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { LandaService } from "src/app/core/services/landa.service";
import { CustomerService } from "src/app/pages/master/customers/services/customer.service";
import { LaporanService } from "../../../services/laporan.service";

@Component({
  selector: 'app-laporan-penjualan',
  templateUrl: './laporan-penjualan.component.html',
  styleUrls: ['./laporan-penjualan.component.scss']
})

export class LaporanPenjualanComponent implements OnInit {
    listCustomer: [];
    listDays: number[] = [];
    date: Date = new Date();
    days: number;
    month: string;
    year: string;
    // listGrandTotal: [] = [];
    listLaporanPenjualan: [] = [];
    filter: { id_user: string; id_bulan: string; id_tahun: string };
    constructor(
        private laporanService: LaporanService,
        private customerService: CustomerService,
        private landaService: LandaService
    ) {}

    ngOnInit(): void {
        this.filter = {
            id_user: "",
            id_bulan: null,
            id_tahun: null,
        };
        this.getCustomer();
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
        this.days = new Date(
            Number(this.filter.id_tahun),
            Number(this.filter.id_bulan),
            0
        ).getDate();
        this.getData();
    }

    onSelectedCustomer(event: any) {
      this.listDays = [];
      this.filter.id_user = "";
      if (event) {
        this.filter.id_user = event.id;
      } else {
        this.filter.id_user = "";
      }
      if (this.filter.id_tahun) this.getData();
    }

    getCustomer() {
      this.customerService.getCustomersAll([]).subscribe(
          (res: any) => {
              this.listCustomer = res.data.list;
          },
          (err) => {
              console.log(err);
          }
      );
  }

    getData() {
        const param = {
            filter: JSON.stringify(this.filter),
        };
        this.laporanService.getLaporanPenjualan(param).subscribe(
            (res: any) => {
                // this.listGrandTotal = res.data[0];
                // res.data.shift();
                this.listLaporanPenjualan = res.data;
                // console.log(this.listLaporanPenjualan);
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
