import { Component, EventEmitter, Input, OnInit, Output, SimpleChange } from "@angular/core";
import { LandaService } from "src/app/core/services/landa.service";
import { PromoService } from "../../services/promo-service.service";

@Component({
    selector: "promo-form",
    templateUrl: "./form-promo.component.html",
    styleUrls: ["./form-promo.component.scss"],
})
export class FormPromoComponent implements OnInit {
    @Input() promoId: number;
    @Output() afterSave = new EventEmitter<boolean>();
    mode: string;

    formModel: {
        id_promo: number;
        nama: string;
        type: string;
        diskon: number;
        nominal: number;
        kadaluarsa: string;
        syarat_ketentuan: string;
        foto: string;
        fotoUrl: string;
    };
    
    constructor(
        private promoService: PromoService,
        private landaService: LandaService
    ) {}

    ngOnInit(): void {}
     
     ngOnChanges(changes: SimpleChange) {
         this.emptyForm();
     }

    save() {
        if(this.mode == 'add') {
            console.log(this.formModel);
            
            this.promoService.createPromo(this.formModel).subscribe((res : any) => {
                this.landaService.alertSuccess('Berhasil', res.message);
                this.afterSave.emit();
            }, err => {
                this.landaService.alertError('Mohon Maaf', err.error.errors);
            });
        } else {
            console.log(this.formModel);
            
            this.promoService.updatePromo(this.formModel).subscribe((res : any) => {
                this.landaService.alertSuccess('Berhasil', res.message);
                this.afterSave.emit();
            }, err => {
                this.landaService.alertError('Mohon Maaf', err.error.errors);
            });
        }
        // $('#dataTable').DataTable().ajax.reload();
    }
    
    emptyForm() {
        this.mode = "add";
        this.formModel = {
            id_promo: 0,
            nama: "",
            type: "",
            diskon: null,
            nominal: null,
            kadaluarsa: "",
            syarat_ketentuan: "",
            foto: "",
            fotoUrl: "",
        };

        if (this.promoId > 0) {
            this.mode = "edit";
            this.getPromo(this.promoId);
        }
    }

    getPromo(promoId) {
        this.promoService.getPromoById(promoId).subscribe((res: any) => {
            this.formModel = res.data;
        }, err => {
            console.log(err);
        });
    }

    onSelectedImage(event) {
        if (event.target.files && event.target.files[0]) {
            var reader = new FileReader();
            reader.readAsDataURL(event.target.files[0]);
            reader.onload = (event) => {
                this.formModel.foto = reader.result.toString();
                this.formModel.fotoUrl = event.target.result as string;
            }
        }
    }
}
