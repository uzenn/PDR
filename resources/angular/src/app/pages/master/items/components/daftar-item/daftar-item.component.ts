import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

import { LandaService } from 'src/app/core/services/landa.service';
import { ItemService } from '../../services/item.service';
import { DataTableDirective } from 'angular-datatables';

@Component({
    selector: 'item-daftar',
    templateUrl: './daftar-item.component.html',
    styleUrls: ['./daftar-item.component.scss']
})
export class DaftarItemComponent implements OnInit {

    // Datatable
    @ViewChild(DataTableDirective) dtElement: DataTableDirective;
    dtInstance: Promise<DataTables.Api>;
    dtOptions: any;

    listItems: [] = [];
    titleCard: string;
    modelId: number;
    isOpenForm: boolean = false;

    constructor(
        private itemService: ItemService,
        private landaService: LandaService,
        private modalService: NgbModal
    ) { }

    ngOnInit(): void {
        this.getDtOptions();
    }

    trackByIndex(index: number): any {
        return index;
    }

    // getItem() {
    //     this.itemService.getItems([]).subscribe((res: any) => {
    //         this.listItems = res.data.list;
    //     }, (err: any) => {
    //         console.log(err);
    //     });
    // }

    getDtOptions() {
        this.listItems = [];
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
                
                this.itemService.getItems({page}).subscribe((res: any) => {
                    this.listItems = res.data.list;
                    
                    callback({
                        recordsTotal: res.data.meta.total,
                        recordsFiltered: res.data.meta.total,
                        data: [],
                    });
                    console.log(this.listItems);
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

    getItems() {
        this.getDtOptions();
        this.reloadDataTable();
    }

    showForm(show) {
        this.isOpenForm = show;
    }

    createItem() {
        this.titleCard = 'Tambah Item';
        this.modelId = 0;
        this.showForm(true);
    }

    updateItem(itemModel) {
        this.titleCard = 'Edit Item: ' + itemModel.nama;
        this.modelId = itemModel.id;
        this.showForm(true);
    }

    deleteItem(userId) {
        Swal.fire({
            title: 'Apakah kamu yakin ?',
            text: 'Item tidak dapat melakukan pesanan setelah kamu menghapus datanya',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#34c38f',
            cancelButtonColor: '#f46a6a',
            confirmButtonText: 'Ya, Hapus data ini !',
        }).then((result) => {
            if (result.value) {
                this.itemService.deleteItem(userId).subscribe((res: any) => {
                    this.landaService.alertSuccess('Berhasil', res.message);
                    this.getItems();
                    // $('#dataTable').DataTable().ajax.reload();
                }, err => {
                    console.log(err);
                });
            }
        });
    }

}
