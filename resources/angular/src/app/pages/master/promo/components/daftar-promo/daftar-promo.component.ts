import { Component, OnInit, ViewChild } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DataTableDirective } from "angular-datatables";
import { LandaService } from "src/app/core/services/landa.service";
import Swal from "sweetalert2";
import { PromoService } from '../../services/promo-service.service';

@Component({
    selector: "promo-daftar",
    templateUrl: "./daftar-promo.component.html",
    styleUrls: ["./daftar-promo.component.scss"],
})
export class DaftarPromoComponent implements OnInit {
    // Datatable
    @ViewChild(DataTableDirective) dtElement: DataTableDirective;
    dtInstance: Promise<DataTables.Api>;
    dtOptions: any;

    listPromo: [] = [];
    titleModal: string;
    modelId: number;

    constructor(
        private promoService: PromoService,
        private landaService: LandaService,
        private modalService: NgbModal
    ) {}

    ngOnInit(): void {
        this.getDtOptions();
    }

    getDtOptions() {
        this.dtOptions = {
            serverSide: true,
            pageLength: 5,
            processing: true,
            ordering: false,
            searching: false,
            pagingType: "full_numbers",
            ajax: (dataTablesParameters: any, callback) => {
                const page = parseInt(dataTablesParameters.start) / parseInt(dataTablesParameters.length) + 1;
                const params = {
                    filter: JSON.stringify({}),
                    offset: dataTablesParameters.start,
                    limit: dataTablesParameters.length,
                };
                console.log(page);
                
                this.promoService.getPromo({page}).subscribe((res: any) => {
                    this.listPromo = res.data.list;
                    
                    callback({
                        recordsTotal: res.data.meta.total,
                        recordsFiltered: res.data.meta.total,
                        data: [],
                    });
                    console.log(this.listPromo);
                }, (err: any) => {
                    console.log(err);
                });
            },
        };
    }

    reloadDataTable(): void {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.draw();
        });
    }

    getPromo() {
        this.getDtOptions();
        this.reloadDataTable();
    }

    createPromo(modal) {
        this.titleModal = 'Tambah Promo';
        this.modelId = 0;
        this.modalService.open(modal, { size: 'lg', backdrop: 'static' });
    }

    updatePromo(modal, promoModel) {
        this.titleModal = 'Edit Promo: ' + promoModel.nama;
        this.modelId = promoModel.id_promo;
        this.modalService.open(modal, { size: 'lg', backdrop: 'static' });
    }

    deletePromo(promoId) {
        Swal.fire({
            title: 'Apakah kamu yakin ?',
            text: 'Promo ini tidak dapat digunakan setelah kamu menghapus datanya',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#34c38f',
            cancelButtonColor: '#f46a6a',
            confirmButtonText: 'Ya, Hapus data ini !',
        }).then((result) => {
            if (result.value) {
                this.promoService.deletePromo(promoId).subscribe((res: any) => {
                    this.landaService.alertSuccess('Berhasil', res.message);
                    // $('#dataTable').DataTable().ajax.reload();
                    this.getPromo();
                }, err => {
                    console.log(err);
                });
            }
        });
    }
}
