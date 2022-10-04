import { formatDate } from "@angular/common";
import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    SimpleChange,
} from "@angular/core";
import { LandaService } from "src/app/core/services/landa.service";
import { CustomerService } from "../../../customers/services/customer.service";
import { PromoService } from "../../../promo/services/promo-service.service";
import { VoucherService } from "../../services/voucher.service";

@Component({
    selector: "voucher-form",
    templateUrl: "./form-voucher.component.html",
    styleUrls: ["./form-voucher.component.scss"],
})
export class FormVoucherComponent implements OnInit {
    @Input() voucherId: number;
    @Output() afterSave = new EventEmitter<boolean>();
    mode: string;
    listCustomer: [];
    listVoucher: [];

    formModel: {
        id_voucher: number;
        voucher: {
            id_promo: number;
            nama: string;
            nominal: number;
            kadaluarsa: number;
            foto: string;
            fotoUrl: string;
        };
        user: {
            id: number;
            nama: string;
        };
        periode_mulai: string;
        periode_selesai: string;
        status: number;
        catatan: string;
        jumlah: number;
    };

    constructor(
        private voucherService: VoucherService,
        private promoService: PromoService,
        private customerService: CustomerService,
        private landaService: LandaService
    ) {}

    ngOnInit(): void {
        this.getCustomer();
        this.getVoucher();
    }

    ngOnChanges(changes: SimpleChange) {
        this.emptyForm();
    }

    save() {
        if (this.mode == "add") {
            console.log(this.formModel);
            this.voucherService.createVoucher(this.formModel).subscribe(
                (res: any) => {
                    this.landaService.alertSuccess("Berhasil", res.message);
                    this.afterSave.emit();
                },
                (err) => {
                    this.landaService.alertError(
                        "Mohon Maaf",
                        err.error.errors
                    );
                }
            );
        } else {
            console.log(this.formModel);

            this.voucherService.updateVoucher(this.formModel).subscribe(
                (res: any) => {
                    this.landaService.alertSuccess("Berhasil", res.message);
                    this.afterSave.emit();
                },
                (err) => {
                    this.landaService.alertError(
                        "Mohon Maaf",
                        err.error.errors
                    );
                }
            );
        }
        // $('#dataTable').DataTable().ajax.reload();
    }

    emptyForm() {
        this.mode = "add";
        this.formModel = {
            id_voucher: 0,
            voucher: {
                id_promo: 0,
                nama: "",
                nominal: 0,
                kadaluarsa: 0,
                foto: "",
                fotoUrl: "",
            },
            user: {
                id: 0,
                nama: "",
            },
            periode_mulai: "",
            periode_selesai: "",
            status: 0,
            catatan: "",
            jumlah: 1,
        };

        if (this.voucherId > 0) {
            this.mode = "edit";
            this.getVoucherById(this.voucherId);
        }
    }

    getVoucher() {
        this.promoService.getPromoVoucher([]).subscribe(
            (res: any) => {
                this.listVoucher = res.data.list;
            },
            (err) => {
                console.log(err);
            }
        );
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

    getVoucherById(voucherId) {
        this.voucherService.getVoucherById(voucherId).subscribe(
            (res: any) => {
                this.formModel = res.data;
            },
            (err) => {
                console.log(err);
            }
        );
    }

    onSelectedDate(event) {
        const date = new Date(event.target.value);
        date.setDate(date.getDate() + this.formModel.voucher.kadaluarsa);        
        this.formModel.periode_selesai = formatDate(date, "yyyy-MM-dd", "en");
    }
    onSelectedVoucher(event) {
        if (this.formModel.periode_mulai) {
            const date = new Date(this.formModel.periode_mulai);
            date.setDate(date.getDate() + event.kadaluarsa);        
            this.formModel.periode_selesai = formatDate(date, "yyyy-MM-dd", "en");
        }
    }
}
