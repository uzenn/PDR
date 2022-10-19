import { Injectable } from "@angular/core";
import { LandaService } from "src/app/core/services/landa.service";

@Injectable({
    providedIn: "root",
})
export class LaporanService {
    constructor(private landaService: LandaService) {}

    getLaporanMenu(arrParameter) {
        return this.landaService.DataGet("/v1/laporan-menu", arrParameter);
    }
    getLaporanCustomer(arrParameter) {
        return this.landaService.DataGet("/v1/laporan-customer", arrParameter);
    }
    getLaporanPenjualan(arrParameter) {
        return this.landaService.DataGet("/v1/rekap-penjualan", arrParameter);
    }
}
