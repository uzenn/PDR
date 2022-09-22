import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LandaService } from 'src/app/core/services/landa.service';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2';

import { UserService } from '../../services/user-service.service';

@Component({
    selector: 'user-daftar',
    templateUrl: './daftar-user.component.html',
    styleUrls: ['./daftar-user.component.scss']
})
export class DaftarUserComponent implements OnInit {

    // Datatable
    @ViewChild(DataTableDirective) dtElement: DataTableDirective;
    dtInstance: Promise<DataTables.Api>;
    dtOptions: any;

    listUsers: [] = [];
    titleModal: string;
    modelId: number;

    constructor(
        private userService: UserService,
        private landaService: LandaService,
        private modalService: NgbModal,
    ) { }

    ngOnInit(): void {
        this.listUsers = [];
        this.getUsers();
    }

    trackByIndex(index: number): any {
        return index;
    }
    
    // getUser() {
    //     this.userService.getUsers(this.p, []).subscribe((res: any) => {
    //         this.listUser = res.data.list;
    //         this.total = res.data.meta.total;
    //         this.p = res.data.meta.links.length;
    //     }, (err: any) => {
    //         console.log(err);
    //     });
    // }

    reloadDataTable(): void {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.draw();
        });
    }

    getUsers() {
        this.listUsers = [];
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
                
                this.userService.getUsers({page}).subscribe((res: any) => {
                    this.listUsers = res.data.list;
                    
                    callback({
                        recordsTotal: res.data.meta.total,
                        recordsFiltered: res.data.meta.total,
                        data: [],
                    });
                    console.log(this.listUsers);
                }, (err: any) => {
                    console.log(err);
                });
            },
        };
    }
    
    createUser(modal) {
        this.titleModal = 'Tambah User';
        this.modelId = 0;
        this.modalService.open(modal, { size: 'lg', backdrop: 'static' });
    }

    updateUser(modal, userModel) {
        this.titleModal = 'Edit User: ' + userModel.nama;
        this.modelId = userModel.id;
        this.modalService.open(modal, { size: 'lg', backdrop: 'static' });
    }

    deleteUser(userId) {
        Swal.fire({
            title: 'Apakah kamu yakin ?',
            text: 'User ini tidak dapat login setelah kamu menghapus datanya',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#34c38f',
            cancelButtonColor: '#f46a6a',
            confirmButtonText: 'Ya, Hapus data ini !',
        }).then((result) => {
            if (result.value) {
                this.userService.deleteUser(userId).subscribe((res: any) => {
                    this.landaService.alertSuccess('Berhasil', res.message);
                    // this.getUsers();
                    $('#dataTable').DataTable().ajax.reload();
                }, err => {
                    console.log(err);
                });
            }
        });
    }
}
