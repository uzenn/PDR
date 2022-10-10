import { Component, OnInit, ViewChild } from "@angular/core";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { LandaService } from "src/app/core/services/landa.service";
import { PromoService } from "../../../promo/services/promo-service.service";
import { DiskonService } from "../../services/diskon.service";

@Component({
    selector: "diskon-daftar",
    templateUrl: "./daftar-diskon.component.html",
    styleUrls: ["./daftar-diskon.component.scss"],
})
export class DaftarDiskonComponent implements OnInit {
    // Datatable
    @ViewChild(DataTableDirective) dtElement: DataTableDirective;
    dtInstance: Promise<DataTables.Api>;
    dtOptions: any;
    dtTrigger: Subject<any> = new Subject<any>();

    listDiskon: [] = [];
    listPromoDiskon: [] = [];
    formModel : {
        id_diskon: number,
        id_user: number,
        id_promo: number,
        status: number
    }
    // titleModal: string;
    // modelId: number;
    constructor(
        private promoService: PromoService,
        private diskonService: DiskonService,
        private landaService: LandaService
    ) {}

    ngOnInit(): void {
        this.getDtOptions();
        this.getPromoDiskon();
    }

    getDtOptions() {
        this.dtOptions = {
            pageLength: 5,
            pagingType: "full_numbers",
        };
        this.diskonService.getDiskon([]).subscribe(
            (res: any) => {
                this.listDiskon = res.data.list;
                // console.log(this.listDiskon);
            },
            (err: any) => {
                console.log(err);
            }
        );
    }

    // reloadDataTable(): void {
    //     this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    //         dtInstance.draw();
    //     });
    // }

    // getDiskon() {
    //     this.getDtOptions();
    //     // this.reloadDataTable();
    // }

    getPromoDiskon() {
        this.promoService.getPromoDiskon([]).subscribe(
            (res: any) => {
                this.listPromoDiskon = res.data.list;
                // console.log(this.listPromoDiskon);
            },
            (err: any) => {
                console.log(err);
            }
        );
    }

    onChecked(user, val) {
        if (val.id_diskon == 0) {
            this.formModel = {
                id_diskon: 0,
                id_user: user.id,
                id_promo: val.id_promo,
                status: 1
            }
            this.diskonService.createDiskon(this.formModel).subscribe(
                (res: any) => {
                    this.landaService.alertSuccess(
                        "Berhasil",
                        "Data berhasil disimpan"
                    );
                    this.getDtOptions();
                },
                (err: any) => {
                    this.landaService.alertError("Gagal", err.error.message);
                }
            );
        } else {
            this.formModel = {
                id_diskon: val.id_diskon,
                id_user: user.id,
                id_promo: val.id_promo,
                status: val.status == 1 ? 0 : 1
            }
            this.diskonService.updateDiskon(this.formModel).subscribe(
                (res: any) => {
                    this.landaService.alertSuccess(
                        "Berhasil",
                        "Data berhasil disimpan"
                    );
                    this.getDtOptions();
                },
                (err: any) => {
                    this.landaService.alertError("Gagal", err.error.message);
                }
            );
        }
    }

}
