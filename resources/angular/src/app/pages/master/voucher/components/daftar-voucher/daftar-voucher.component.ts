import { Component, OnInit, ViewChild } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DataTableDirective } from "angular-datatables";
import { LandaService } from "src/app/core/services/landa.service";
import Swal from "sweetalert2";
import { VoucherService } from "../../services/voucher.service";

@Component({
  selector: 'voucher-daftar',
  templateUrl: './daftar-voucher.component.html',
  styleUrls: ['./daftar-voucher.component.scss']
})

export class DaftarVoucherComponent implements OnInit {
    // Datatable
    @ViewChild(DataTableDirective) dtElement: DataTableDirective;
    dtInstance: Promise<DataTables.Api>;
    dtOptions: any;

    listVoucher: [] = [];
    titleModal: string;
    modelId: number;

    constructor(
        private voucherService: VoucherService,
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
                
                this.voucherService.getVoucher({page}).subscribe((res: any) => {
                    this.listVoucher = res.data.list;
                    
                    callback({
                        recordsTotal: res.data.meta.total,
                        recordsFiltered: res.data.meta.total,
                        data: [],
                    });
                    console.log(this.listVoucher);
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

    getVoucher() {
        this.getDtOptions();
        this.reloadDataTable();
    }

    createVoucher(modal) {
        this.titleModal = 'Tambah Voucher';
        this.modelId = 0;
        this.modalService.open(modal, { size: 'lg', backdrop: 'static' });
    }

    updateVoucher(modal, promoModel) {
        this.titleModal = 'Edit Voucher: ' + promoModel.voucher.nama;
        this.modelId = promoModel.id_voucher;
        this.modalService.open(modal, { size: 'lg', backdrop: 'static' });
    }

    deleteVoucher(promoId) {
        Swal.fire({
            title: 'Apakah kamu yakin ?',
            text: 'Voucher ini tidak dapat digunakan setelah kamu menghapus datanya',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#34c38f',
            cancelButtonColor: '#f46a6a',
            confirmButtonText: 'Ya, Hapus data ini !',
        }).then((result) => {
            if (result.value) {
                this.voucherService.deleteVoucher(promoId).subscribe((res: any) => {
                    this.landaService.alertSuccess('Berhasil', res.message);
                    // $('#dataTable').DataTable().ajax.reload();
                    this.getVoucher();
                }, err => {
                    console.log(err);
                });
            }
        });
    }
}
