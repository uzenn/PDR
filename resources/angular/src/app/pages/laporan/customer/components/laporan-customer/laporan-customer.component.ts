import { formatDate } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { LandaService } from "src/app/core/services/landa.service";
import { CustomerService } from "src/app/pages/master/customers/services/customer.service";
import { LaporanService } from "../../../services/laporan.service";

@Component({
    selector: "app-laporan-customer",
    templateUrl: "./laporan-customer.component.html",
    styleUrls: ["./laporan-customer.component.scss"],
})
export class LaporanCustomerComponent implements OnInit {
    listCustomer: [];
    listDays: number[] = [];
    date: Date = new Date();
    days: number;
    month: string;
    year: string;
    listGrandTotal: [] = [];
    listPenjualanCustomer: [] = [];
    filter: { user: Array<string>; id_bulan: string; id_tahun: string };
    constructor(
        private laporanService: LaporanService,
        private customerService: CustomerService,
        private landaService: LandaService
    ) {}

    ngOnInit(): void {
        this.filter = {
            user: [],
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
      this.filter.user = [];
      if (event) {
        this.filter.user.push(event.id);
      } else {
        this.filter.user = [];
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
        this.laporanService.getLaporanCustomer(param).subscribe(
            (res: any) => {
                this.listGrandTotal = res.data[0];
                res.data.shift();
                this.listPenjualanCustomer = res.data;
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
